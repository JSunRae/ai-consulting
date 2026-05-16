import { getStore } from "@netlify/blobs";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  randomUUID,
} from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { readRuntimeEnv } from "./voice-agent.mjs";


const ENTRY_VERSION = "v1";
const ENCRYPTED_PREFIX = `enc:${ENTRY_VERSION}`;
const RECORD_PREFIX = "records/";
const DEFAULT_RETENTION_DAYS = 30;
const DEFAULT_STORE_NAME = "voice-intake-summaries";
const DEFAULT_LOCAL_DIRECTORY = path.resolve(
  process.cwd(),
  "data",
  "voice-summary-store",
);


function readVoiceSummaryStorageDriver() {
  const configured = readRuntimeEnv("VOICE_SUMMARY_STORE_DRIVER").toLowerCase();
  if (configured) {
    return configured;
  }

  return readRuntimeEnv("CONTEXT") ? "blobs" : "file";
}


function readVoiceSummaryEncryptionKeyRaw() {
  return readRuntimeEnv("VOICE_SUMMARY_ENCRYPTION_KEY");
}


function getVoiceSummaryEncryptionKey() {
  const configured = readVoiceSummaryEncryptionKeyRaw();
  if (!configured) {
    throw new Error("VOICE_SUMMARY_ENCRYPTION_KEY must be configured.");
  }

  const base64Candidate = Buffer.from(configured, "base64url");
  if (base64Candidate.length === 32) {
    return base64Candidate;
  }

  const hexCandidate = /^[a-fA-F0-9]{64}$/.test(configured)
    ? Buffer.from(configured, "hex")
    : null;
  if (hexCandidate?.length === 32) {
    return hexCandidate;
  }

  throw new Error(
    "VOICE_SUMMARY_ENCRYPTION_KEY must decode to exactly 32 bytes. Use a base64url or 64-character hex key.",
  );
}


function getVoiceSummaryRetentionDays() {
  const configured = readRuntimeEnv("VOICE_SUMMARY_RETENTION_DAYS");
  if (!configured) {
    return DEFAULT_RETENTION_DAYS;
  }

  const parsed = Number.parseInt(configured, 10);
  if (!Number.isFinite(parsed)) {
    throw new Error("VOICE_SUMMARY_RETENTION_DAYS must be an integer.");
  }

  if (parsed <= 0) {
    return null;
  }

  return parsed;
}


function getVoiceSummaryStoreName() {
  return readRuntimeEnv("VOICE_SUMMARY_STORE_NAME") || DEFAULT_STORE_NAME;
}


function getLocalStoreRoot() {
  const configured = readRuntimeEnv("VOICE_SUMMARY_LOCAL_PATH");
  return configured
    ? path.resolve(process.cwd(), configured)
    : DEFAULT_LOCAL_DIRECTORY;
}


function buildRecordKey(summaryId) {
  return `${RECORD_PREFIX}${summaryId}.json`;
}


function buildSummaryId(callId) {
  if (!callId) {
    return randomUUID();
  }

  return createHash("sha256")
    .update(`${ENTRY_VERSION}:${callId}`)
    .digest("hex")
    .slice(0, 24);
}


function computeExpiresAt(receivedAt) {
  const retentionDays = getVoiceSummaryRetentionDays();
  if (!retentionDays) {
    return null;
  }

  return new Date(
    new Date(receivedAt).getTime() + retentionDays * 24 * 60 * 60 * 1000,
  ).toISOString();
}


function defaultForwardingState() {
  return {
    attemptedAt: null,
    forwarded: false,
    status: null,
    reason: "",
  };
}


function buildRecordMetadata(record) {
  return {
    version: ENTRY_VERSION,
    receivedAt: record.receivedAt,
    storedAt: record.storedAt,
    expiresAt: record.expiresAt || "",
  };
}


function encryptString(value) {
  const key = getVoiceSummaryEncryptionKey();
  if (value.startsWith(`${ENCRYPTED_PREFIX}:`)) {
    return value;
  }

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [
    ENCRYPTED_PREFIX,
    iv.toString("base64url"),
    ciphertext.toString("base64url"),
    tag.toString("base64url"),
  ].join(":");
}


function decryptString(value) {
  if (!value.startsWith(`${ENCRYPTED_PREFIX}:`)) {
    return value;
  }

  const key = getVoiceSummaryEncryptionKey();
  const [, , iv, ciphertext, tag] = value.split(":");
  if (!iv || !ciphertext || !tag) {
    throw new Error("Encrypted voice summary payload is malformed.");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64url")),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}


function serializeStoredEntry(record) {
  return {
    version: ENTRY_VERSION,
    metadata: buildRecordMetadata(record),
    payload: encryptString(JSON.stringify(record)),
  };
}


function parseStoredRecord(entry) {
  if (!entry?.payload) {
    return null;
  }

  const decrypted = decryptString(entry.payload);
  const parsed = JSON.parse(decrypted);
  return {
    ...parsed,
    expiresAt: parsed.expiresAt || null,
    forwarding: parsed.forwarding || defaultForwardingState(),
  };
}


function assertSupportedDriver(driver) {
  if (!["blobs", "file"].includes(driver)) {
    throw new Error(
      `VOICE_SUMMARY_STORE_DRIVER must be \`blobs\` or \`file\`. Received \`${driver}\`.`,
    );
  }
}


function createBlobsAdapter() {
  const store = getStore({
    name: getVoiceSummaryStoreName(),
    consistency: "strong",
  });

  return {
    async writeEntry(key, entry) {
      await store.setJSON(key, entry, { metadata: entry.metadata });
    },
    async readEntry(key) {
      return store.get(key, { type: "json" });
    },
    async readMetadata(key) {
      const metadata = await store.getMetadata(key);
      return metadata?.metadata || null;
    },
    async deleteEntry(key) {
      await store.delete(key);
    },
    async listKeys(prefix) {
      const { blobs } = await store.list({ prefix });
      return blobs.map((item) => item.key);
    },
  };
}


async function ensureDirectory(directoryPath) {
  await mkdir(directoryPath, { recursive: true });
}


async function listLocalKeys(rootPath, currentPath = "") {
  const absolutePath = path.join(rootPath, currentPath);
  let entries = [];

  try {
    entries = await readdir(absolutePath, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const results = [];
  for (const entry of entries) {
    const relativePath = currentPath
      ? path.posix.join(currentPath, entry.name)
      : entry.name;
    if (entry.isDirectory()) {
      results.push(...(await listLocalKeys(rootPath, relativePath)));
      continue;
    }

    results.push(relativePath);
  }

  return results;
}


function createFileAdapter() {
  const rootPath = getLocalStoreRoot();

  function resolveEntryPath(key) {
    return path.join(rootPath, ...key.split("/"));
  }

  return {
    async writeEntry(key, entry) {
      const filePath = resolveEntryPath(key);
      await ensureDirectory(path.dirname(filePath));
      await writeFile(
        filePath,
        `${JSON.stringify(entry, null, 2)}\n`,
        "utf8",
      );
    },
    async readEntry(key) {
      try {
        const raw = await readFile(resolveEntryPath(key), "utf8");
        return JSON.parse(raw);
      } catch (error) {
        if (error?.code === "ENOENT") {
          return null;
        }
        throw error;
      }
    },
    async readMetadata(key) {
      const entry = await this.readEntry(key);
      return entry?.metadata || null;
    },
    async deleteEntry(key) {
      await rm(resolveEntryPath(key), { force: true });
    },
    async listKeys(prefix) {
      await ensureDirectory(rootPath);
      const keys = await listLocalKeys(rootPath);
      return keys.filter((key) => key.startsWith(prefix));
    },
  };
}


function createStoreAdapter() {
  const driver = readVoiceSummaryStorageDriver();
  assertSupportedDriver(driver);
  return driver === "blobs" ? createBlobsAdapter() : createFileAdapter();
}


function isExpired(expiresAt, now = Date.now()) {
  if (!expiresAt) {
    return false;
  }

  return new Date(expiresAt).getTime() <= now;
}


export function hasConfiguredVoiceSummaryStorage() {
  if (!readVoiceSummaryEncryptionKeyRaw()) {
    return false;
  }

  try {
    getVoiceSummaryEncryptionKey();
    assertSupportedDriver(readVoiceSummaryStorageDriver());
    return true;
  } catch {
    return false;
  }
}


export function buildVoiceSummaryRecord(normalizedSummary) {
  const receivedAt = normalizedSummary.receivedAt || new Date().toISOString();
  return {
    id: buildSummaryId(normalizedSummary.callId || ""),
    receivedAt,
    storedAt: new Date().toISOString(),
    expiresAt: computeExpiresAt(receivedAt),
    callId: normalizedSummary.callId || "",
    transcript: normalizedSummary.transcript || "",
    taxonomyVersion: normalizedSummary.taxonomyVersion || "v1",
    summary: normalizedSummary.summary || {},
    forwarding: defaultForwardingState(),
  };
}


export function applyForwardingResult(record, forwardResult) {
  return {
    ...record,
    forwarding: {
      attemptedAt: new Date().toISOString(),
      forwarded: Boolean(forwardResult.forwarded),
      status: forwardResult.status || null,
      reason: forwardResult.reason || "",
    },
  };
}


export async function readVoiceSummaryRecord(summaryId) {
  const adapter = createStoreAdapter();
  const entry = await adapter.readEntry(buildRecordKey(summaryId));
  const record = parseStoredRecord(entry);
  if (!record) {
    return null;
  }

  if (isExpired(record.expiresAt)) {
    await adapter.deleteEntry(buildRecordKey(summaryId));
    return null;
  }

  return record;
}


export async function saveVoiceSummaryRecord(record) {
  const adapter = createStoreAdapter();
  await adapter.writeEntry(buildRecordKey(record.id), serializeStoredEntry(record));
  return record;
}


export async function deleteVoiceSummaryRecord(summaryId) {
  const adapter = createStoreAdapter();
  await adapter.deleteEntry(buildRecordKey(summaryId));
}


export async function purgeExpiredVoiceSummaryRecords() {
  const adapter = createStoreAdapter();
  const keys = await adapter.listKeys(RECORD_PREFIX);
  const now = Date.now();
  let deleted = 0;

  for (const key of keys) {
    const metadata = await adapter.readMetadata(key);
    if (!isExpired(metadata?.expiresAt || null, now)) {
      continue;
    }

    await adapter.deleteEntry(key);
    deleted += 1;
  }

  return { deleted };
}


export async function listVoiceSummaryRecords(options = {}) {
  const adapter = createStoreAdapter();
  const keys = await adapter.listKeys(RECORD_PREFIX);
  const limit = Number.isFinite(options.limit) && options.limit > 0
    ? Math.floor(options.limit)
    : 25;
  const records = [];

  for (const key of keys) {
    const entry = await adapter.readEntry(key);
    const record = parseStoredRecord(entry);
    if (!record) {
      continue;
    }

    if (isExpired(record.expiresAt)) {
      await adapter.deleteEntry(key);
      continue;
    }

    records.push(record);
  }

  records.sort((left, right) => {
    const leftTime = Date.parse(left.receivedAt || left.storedAt || "");
    const rightTime = Date.parse(right.receivedAt || right.storedAt || "");
    return rightTime - leftTime;
  });

  return records.slice(0, limit);
}

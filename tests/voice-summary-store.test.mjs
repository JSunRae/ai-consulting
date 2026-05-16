import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  applyForwardingResult,
  buildVoiceSummaryRecord,
  hasConfiguredVoiceSummaryStorage,
  listVoiceSummaryRecords,
  purgeExpiredVoiceSummaryRecords,
  readVoiceSummaryRecord,
  saveVoiceSummaryRecord,
} from "../netlify/functions/_shared/voice-summary-store.mjs";


const ENV_KEYS = [
  "CONTEXT",
  "VOICE_SUMMARY_ENCRYPTION_KEY",
  "VOICE_SUMMARY_LOCAL_PATH",
  "VOICE_SUMMARY_RETENTION_DAYS",
  "VOICE_SUMMARY_STORE_DRIVER",
  "VOICE_SUMMARY_STORE_NAME",
];
const DEFAULT_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";


function buildNormalizedSummary(overrides = {}) {
  return {
    callId: "call-123",
    transcript: "Sensitive transcript text",
    summary: {
      problem_statement: "Regional forecasting is inconsistent.",
      recommended_next_step: "Commercial Analytics Diagnostic Review",
    },
    ...overrides,
  };
}


function rememberEnv() {
  return Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
}


function restoreEnv(snapshot) {
  for (const key of ENV_KEYS) {
    if (snapshot[key] === undefined) {
      delete process.env[key];
      continue;
    }

    process.env[key] = snapshot[key];
  }
}


async function withTempStore(callback) {
  const snapshot = rememberEnv();
  const tempDirectory = await mkdtemp(
    path.join(os.tmpdir(), "voice-summary-store-"),
  );

  process.env.VOICE_SUMMARY_ENCRYPTION_KEY = DEFAULT_KEY;
  process.env.VOICE_SUMMARY_STORE_DRIVER = "file";
  process.env.VOICE_SUMMARY_LOCAL_PATH = tempDirectory;
  delete process.env.CONTEXT;
  delete process.env.VOICE_SUMMARY_STORE_NAME;
  delete process.env.VOICE_SUMMARY_RETENTION_DAYS;

  try {
    await callback(tempDirectory);
  } finally {
    restoreEnv(snapshot);
    await rm(tempDirectory, { recursive: true, force: true });
  }
}


test("voice summary storage reports missing configuration cleanly", async () => {
  const snapshot = rememberEnv();
  delete process.env.VOICE_SUMMARY_ENCRYPTION_KEY;
  process.env.VOICE_SUMMARY_STORE_DRIVER = "file";
  process.env.VOICE_SUMMARY_LOCAL_PATH = path.join(
    os.tmpdir(),
    "voice-summary-store-no-key",
  );

  try {
    assert.equal(hasConfiguredVoiceSummaryStorage(), false);
  } finally {
    restoreEnv(snapshot);
  }
});


test("voice summary records are encrypted at rest and readable through the store", async () => {
  await withTempStore(async (tempDirectory) => {
    const record = buildVoiceSummaryRecord(buildNormalizedSummary());
    await saveVoiceSummaryRecord(record);

    const storedPath = path.join(tempDirectory, "records", `${record.id}.json`);
    const raw = await readFile(storedPath, "utf8");
    assert.equal(raw.includes("Sensitive transcript text"), false);
    assert.equal(raw.includes("Regional forecasting is inconsistent."), false);

    const reloaded = await readVoiceSummaryRecord(record.id);
    assert.ok(reloaded);
    assert.equal(reloaded.transcript, "Sensitive transcript text");
    assert.equal(
      reloaded.summary.problem_statement,
      "Regional forecasting is inconsistent.",
    );
  });
});


test("list and purge skip expired voice summary records", async () => {
  await withTempStore(async () => {
    const freshRecord = buildVoiceSummaryRecord(buildNormalizedSummary());
    const expiredRecord = {
      ...buildVoiceSummaryRecord(
        buildNormalizedSummary({ callId: "expired-call" }),
      ),
      expiresAt: "2000-01-01T00:00:00.000Z",
    };

    await saveVoiceSummaryRecord(freshRecord);
    await saveVoiceSummaryRecord(expiredRecord);

    const result = await purgeExpiredVoiceSummaryRecords();
    assert.equal(result.deleted, 1);

    const afterPurge = await listVoiceSummaryRecords({ limit: 10 });
    assert.equal(afterPurge.length, 1);
    assert.equal(afterPurge[0].id, freshRecord.id);
  });
});


test("callId hashing is stable and forwarding state is captured", async () => {
  await withTempStore(async () => {
    const first = buildVoiceSummaryRecord(buildNormalizedSummary());
    const second = buildVoiceSummaryRecord(buildNormalizedSummary());

    assert.equal(first.id, second.id);

    const forwarded = applyForwardingResult(first, {
      forwarded: true,
      status: 202,
    });
    assert.equal(forwarded.forwarding.forwarded, true);
    assert.equal(forwarded.forwarding.status, 202);
    assert.ok(forwarded.forwarding.attemptedAt);
  });
});

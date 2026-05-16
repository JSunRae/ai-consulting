import assert from "node:assert/strict";
import { rm, mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import voiceSummaryHandler from "../netlify/functions/voice-summary.mjs";
import voiceSummariesHandler from "../netlify/functions/voice-summaries.mjs";
import {
  buildVoiceSummaryRecord,
  readVoiceSummaryRecord,
  saveVoiceSummaryRecord,
} from "../netlify/functions/_shared/voice-summary-store.mjs";


const ENV_KEYS = [
  "CONTEXT",
  "VOICE_OPERATOR_SECRET",
  "VOICE_SUMMARY_ENCRYPTION_KEY",
  "VOICE_SUMMARY_LOCAL_PATH",
  "VOICE_SUMMARY_STORE_DRIVER",
  "VOICE_SUMMARY_WEBHOOK_URL",
  "VOICE_WEBHOOK_SECRET",
];
const DEFAULT_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";


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


async function withTempVoiceEnv(callback) {
  const snapshot = rememberEnv();
  const originalFetch = global.fetch;
  const tempDirectory = await mkdtemp(
    path.join(os.tmpdir(), "voice-summary-endpoint-"),
  );

  process.env.VOICE_WEBHOOK_SECRET = "voice-secret";
  process.env.VOICE_OPERATOR_SECRET = "operator-secret";
  process.env.VOICE_SUMMARY_WEBHOOK_URL = "https://example.invalid/hook";
  process.env.VOICE_SUMMARY_ENCRYPTION_KEY = DEFAULT_KEY;
  process.env.VOICE_SUMMARY_STORE_DRIVER = "file";
  process.env.VOICE_SUMMARY_LOCAL_PATH = tempDirectory;
  delete process.env.CONTEXT;

  try {
    await callback(tempDirectory);
  } finally {
    global.fetch = originalFetch;
    restoreEnv(snapshot);
    await rm(tempDirectory, { recursive: true, force: true });
  }
}


function buildSummaryRequest(payload, headers = {}) {
  return new Request("http://localhost/api/voice/summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(payload),
  });
}


test("voice summary health check stays public and lightweight", async () => {
  const response = await voiceSummaryHandler(
    new Request("http://localhost/api/voice/summary", { method: "GET" }),
  );
  assert.equal(response.status, 200);

  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.endpoint, "/api/voice/summary");
});


test("voice summary POST fails closed when webhook auth is missing", async () => {
  const snapshot = rememberEnv();
  delete process.env.VOICE_WEBHOOK_SECRET;

  try {
    const response = await voiceSummaryHandler(
      buildSummaryRequest({
        problem_statement: "Broken planning process",
        recommended_next_step: "Diagnostic review",
      }),
    );
    assert.equal(response.status, 503);
  } finally {
    restoreEnv(snapshot);
  }
});


test("voice summary POST stores encrypted summaries and deduplicates successful forwards", async () => {
  await withTempVoiceEnv(async () => {
    let forwardCalls = 0;
    global.fetch = async () => {
      forwardCalls += 1;
      return new Response("accepted", { status: 202 });
    };

    const payload = {
      callId: "call-123",
      problem_statement: "Forecasting accuracy is poor across regions.",
      recommended_next_step: "Diagnostic review",
      transcript: "Sensitive transcript body",
    };

    const firstResponse = await voiceSummaryHandler(
      buildSummaryRequest(payload, {
        "x-voice-webhook-secret": "voice-secret",
      }),
    );
    assert.equal(firstResponse.status, 200);
    const firstBody = await firstResponse.json();

    assert.equal(firstBody.ok, true);
    assert.equal(firstBody.stored, true);
    assert.equal(firstBody.forwarded, true);
    assert.ok(firstBody.summaryId);
    assert.equal(forwardCalls, 1);

    const storedRecord = await readVoiceSummaryRecord(firstBody.summaryId);
    assert.ok(storedRecord);
    assert.equal(storedRecord.transcript, "Sensitive transcript body");
    assert.equal(storedRecord.forwarding.forwarded, true);

    const secondResponse = await voiceSummaryHandler(
      buildSummaryRequest(payload, {
        "x-voice-webhook-secret": "voice-secret",
      }),
    );
    assert.equal(secondResponse.status, 200);
    const secondBody = await secondResponse.json();

    assert.equal(secondBody.summaryId, firstBody.summaryId);
    assert.equal(secondBody.duplicate, true);
    assert.equal(forwardCalls, 1);
  });
});


test("operator summary endpoint lists, reads, deletes, and purges records", async () => {
  await withTempVoiceEnv(async () => {
    const activeRecord = buildVoiceSummaryRecord({
      callId: "operator-call",
      transcript: "Transcript for operator review",
      summary: {
        problem_statement: "Pipeline conversion is weak.",
        recommended_next_step: "Book Fit Call",
        caller_name: "Alex",
      },
    });
    const expiredRecord = {
      ...buildVoiceSummaryRecord({
        callId: "expired-operator-call",
        transcript: "Old transcript",
        summary: {
          problem_statement: "Old issue",
          recommended_next_step: "Archive",
        },
      }),
      expiresAt: "2000-01-01T00:00:00.000Z",
    };

    await saveVoiceSummaryRecord(activeRecord);
    await saveVoiceSummaryRecord(expiredRecord);

    const purgeResponse = await voiceSummariesHandler(
      new Request("http://localhost/api/voice/summaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-voice-operator-secret": "operator-secret",
        },
        body: JSON.stringify({ action: "purge" }),
      }),
    );
    assert.equal(purgeResponse.status, 200);
    const purgeBody = await purgeResponse.json();
    assert.equal(purgeBody.purged, 1);

    const listResponse = await voiceSummariesHandler(
      new Request("http://localhost/api/voice/summaries?limit=10", {
        method: "GET",
        headers: {
          "x-voice-operator-secret": "operator-secret",
        },
      }),
    );
    assert.equal(listResponse.status, 200);
    const listBody = await listResponse.json();
    assert.equal(listBody.count, 1);
    assert.equal(listBody.items[0].summaryId, activeRecord.id);
    assert.equal("transcript" in listBody.items[0], false);

    const detailResponse = await voiceSummariesHandler(
      new Request(
        `http://localhost/api/voice/summaries?id=${activeRecord.id}`,
        {
          method: "GET",
          headers: {
            "x-voice-operator-secret": "operator-secret",
          },
        },
      ),
    );
    assert.equal(detailResponse.status, 200);
    const detailBody = await detailResponse.json();
    assert.equal(detailBody.summary.transcript, "Transcript for operator review");

    const deleteResponse = await voiceSummariesHandler(
      new Request(
        `http://localhost/api/voice/summaries?id=${activeRecord.id}`,
        {
          method: "DELETE",
          headers: {
            "x-voice-operator-secret": "operator-secret",
          },
        },
      ),
    );
    assert.equal(deleteResponse.status, 200);

    const deletedRecord = await readVoiceSummaryRecord(activeRecord.id);
    assert.equal(deletedRecord, null);
  });
});

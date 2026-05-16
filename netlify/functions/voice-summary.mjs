import {
  authorizeRequest,
  forwardSummaryIfConfigured,
  hasConfiguredSecret,
  jsonResponse,
  loadVoicePlaybook,
  readSummaryWebhookUrl,
} from "./_shared/voice-agent.mjs";
import {
  applyForwardingResult,
  buildVoiceSummaryRecord,
  hasConfiguredVoiceSummaryStorage,
  purgeExpiredVoiceSummaryRecords,
  readVoiceSummaryRecord,
  saveVoiceSummaryRecord,
} from "./_shared/voice-summary-store.mjs";


function normalizeSummary(payload, playbook) {
  const fields = playbook.summary_template?.fields || [];
  const summary = {};
  const validIntentTags = new Set(
    (playbook.intent_taxonomy || []).map((item) => item.tag),
  );

  for (const field of fields) {
    if (field === "intent_tags") {
      const raw = Array.isArray(payload[field])
        ? payload[field]
        : typeof payload[field] === "string"
          ? payload[field].split(",")
          : [];
      summary[field] = raw
        .map((item) => `${item}`.trim())
        .filter((item) => validIntentTags.has(item));
      continue;
    }

    if (field === "contact_captured" || field === "frustration_flag") {
      summary[field] = Boolean(payload[field]);
      continue;
    }

    summary[field] = payload[field] || "";
  }

  return {
    receivedAt: new Date().toISOString(),
    callId: payload.callId || payload.sessionId || "",
    transcript: payload.transcript || "",
    taxonomyVersion: playbook.intent_taxonomy_version || "v1",
    summary,
  };
}


function hasRequiredSummaryFields(summary) {
  return Boolean(
    summary.problem_statement && summary.recommended_next_step,
  );
}


export default async (req) => {
  if (req.method === "GET") {
    return jsonResponse({
      ok: true,
      endpoint: "/api/voice/summary",
      message: "Voice summary endpoint is live.",
    });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  if (!hasConfiguredSecret()) {
    return jsonResponse(
      { error: "Voice summary intake is not configured." },
      { status: 503 },
    );
  }

  if (!authorizeRequest(req)) {
    return jsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  if (!readSummaryWebhookUrl()) {
    return jsonResponse(
      { error: "Voice summary forwarding is not configured." },
      { status: 503 },
    );
  }

  if (!hasConfiguredVoiceSummaryStorage()) {
    return jsonResponse(
      { error: "Voice summary storage is not configured." },
      { status: 503 },
    );
  }

  const payload = await req.json().catch(() => ({}));
  const playbook = await loadVoicePlaybook();
  const normalized = normalizeSummary(payload, playbook);

  if (!hasRequiredSummaryFields(normalized.summary)) {
    return jsonResponse(
      {
        error: "Missing required summary fields.",
        required: ["problem_statement", "recommended_next_step"],
      },
      { status: 400 },
    );
  }

  await purgeExpiredVoiceSummaryRecords();

  const draftRecord = buildVoiceSummaryRecord(normalized);
  const existingRecord = normalized.callId
    ? await readVoiceSummaryRecord(draftRecord.id)
    : null;
  if (existingRecord?.forwarding?.forwarded) {
    return jsonResponse({
      ok: true,
      forwarded: true,
      forwardStatus: existingRecord.forwarding.status || null,
      note: existingRecord.forwarding.reason || "",
      receivedAt: existingRecord.receivedAt,
      callId: existingRecord.callId || null,
      summaryId: existingRecord.id,
      stored: true,
      duplicate: true,
    });
  }

  const forwardResult = await forwardSummaryIfConfigured(normalized);
  const storedRecord = applyForwardingResult(draftRecord, forwardResult);
  await saveVoiceSummaryRecord(storedRecord);

  return jsonResponse({
    ok: true,
    forwarded: forwardResult.forwarded,
    forwardStatus: forwardResult.status || null,
    note: forwardResult.reason || "",
    receivedAt: storedRecord.receivedAt,
    callId: storedRecord.callId || null,
    summaryId: storedRecord.id,
    stored: true,
  });
};


export const config = {
  path: "/api/voice/summary",
  method: ["GET", "POST"],
};

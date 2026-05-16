import {
  authorizeOperatorRequest,
  hasConfiguredOperatorSecret,
  jsonResponse,
} from "./_shared/voice-agent.mjs";
import {
  deleteVoiceSummaryRecord,
  hasConfiguredVoiceSummaryStorage,
  listVoiceSummaryRecords,
  purgeExpiredVoiceSummaryRecords,
  readVoiceSummaryRecord,
} from "./_shared/voice-summary-store.mjs";


function summarizeRecord(record) {
  return {
    summaryId: record.id,
    receivedAt: record.receivedAt,
    storedAt: record.storedAt,
    expiresAt: record.expiresAt,
    callId: record.callId || null,
    taxonomyVersion: record.taxonomyVersion || "v1",
    callerName: record.summary?.caller_name || "",
    companyAndRole: record.summary?.company_and_role || "",
    primaryIntent: record.summary?.primary_intent || "",
    recommendedNextStep: record.summary?.recommended_next_step || "",
    contactCaptured: Boolean(record.summary?.contact_captured),
    frustrationFlag: Boolean(record.summary?.frustration_flag),
    forwarding: record.forwarding || null,
  };
}


function readSummaryId(url) {
  return (
    url.searchParams.get("id") ||
    url.searchParams.get("summaryId") ||
    ""
  ).trim();
}


function readLimit(url) {
  const raw = url.searchParams.get("limit");
  const parsed = Number.parseInt(raw || "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 25;
  }

  return Math.min(parsed, 100);
}


export default async (req) => {
  if (!hasConfiguredOperatorSecret()) {
    return jsonResponse(
      { error: "Voice operator access is not configured." },
      { status: 503 },
    );
  }

  if (!authorizeOperatorRequest(req)) {
    return jsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasConfiguredVoiceSummaryStorage()) {
    return jsonResponse(
      { error: "Voice summary storage is not configured." },
      { status: 503 },
    );
  }

  const url = new URL(req.url);

  if (req.method === "GET") {
    const summaryId = readSummaryId(url);
    if (summaryId) {
      const record = await readVoiceSummaryRecord(summaryId);
      if (!record) {
        return jsonResponse({ error: "Summary not found." }, { status: 404 });
      }

      return jsonResponse({
        ok: true,
        summary: {
          summaryId: record.id,
          receivedAt: record.receivedAt,
          storedAt: record.storedAt,
          expiresAt: record.expiresAt,
          callId: record.callId || null,
          transcript: record.transcript,
          taxonomyVersion: record.taxonomyVersion || "v1",
          summary: record.summary || {},
          forwarding: record.forwarding || null,
        },
      });
    }

    const records = await listVoiceSummaryRecords({ limit: readLimit(url) });
    return jsonResponse({
      ok: true,
      count: records.length,
      items: records.map(summarizeRecord),
    });
  }

  if (req.method === "DELETE") {
    const summaryId = readSummaryId(url);
    if (!summaryId) {
      return jsonResponse(
        { error: "Missing required `id` query parameter." },
        { status: 400 },
      );
    }

    const existing = await readVoiceSummaryRecord(summaryId);
    if (!existing) {
      return jsonResponse({ error: "Summary not found." }, { status: 404 });
    }

    await deleteVoiceSummaryRecord(summaryId);
    return jsonResponse({
      ok: true,
      deleted: true,
      summaryId,
    });
  }

  if (req.method === "POST") {
    const payload = await req.json().catch(() => ({}));
    if (payload?.action !== "purge") {
      return jsonResponse(
        { error: "Unsupported operator action.", supported: ["purge"] },
        { status: 400 },
      );
    }

    const result = await purgeExpiredVoiceSummaryRecords();
    return jsonResponse({
      ok: true,
      purged: result.deleted,
    });
  }

  return jsonResponse({ error: "Method not allowed" }, { status: 405 });
};


export const config = {
  path: "/api/voice/summaries",
  method: ["GET", "POST", "DELETE"],
};

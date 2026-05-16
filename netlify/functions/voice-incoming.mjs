import {
  authorizeRequest,
  buildRealtimeSession,
  hasConfiguredSecret,
  jsonResponse,
  loadVoicePlaybook,
} from "./_shared/voice-agent.mjs";


export default async (req) => {
  if (req.method === "GET") {
    return jsonResponse({
      ok: true,
      endpoint: "/api/voice/incoming",
      message: "Voice intake endpoint is live.",
    });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  if (!hasConfiguredSecret()) {
    return jsonResponse(
      { error: "Voice intake is not configured." },
      { status: 503 },
    );
  }

  if (!authorizeRequest(req)) {
    return jsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json().catch(() => ({}));
  const playbook = await loadVoicePlaybook();
  const session = buildRealtimeSession(playbook, {
    callerNumber: payload.callerNumber || payload.from || "",
    provider: payload.provider || payload.providerName || "generic-sip",
  });

  return jsonResponse({
    accepted: true,
    disclosure: "Caller is speaking to an AI intake assistant and Jason reviews follow-up personally.",
    nextAction: "Bridge the live call into an OpenAI Realtime/SIP session using the session payload below.",
    session,
    summaryFields: playbook.summary_template?.fields || [],
  });
};


export const config = {
  path: "/api/voice/incoming",
  method: ["GET", "POST"],
};

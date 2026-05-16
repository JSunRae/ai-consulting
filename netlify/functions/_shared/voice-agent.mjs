import { readFile } from "node:fs/promises";


const PLAYBOOK_URL = new URL("../../../assets/data/voice-intake-playbook.json", import.meta.url);


export function readRuntimeEnv(name) {
  const netlifyValue = globalThis.Netlify?.env?.get?.(name);
  if (typeof netlifyValue === "string" && netlifyValue.trim()) {
    return netlifyValue.trim();
  }

  const nodeValue = process.env[name];
  return typeof nodeValue === "string" ? nodeValue.trim() : "";
}


export async function loadVoicePlaybook() {
  const raw = await readFile(PLAYBOOK_URL, "utf-8");
  return JSON.parse(raw);
}


export function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status: init.status || 200,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });
}


export function readSecret() {
  return readRuntimeEnv("VOICE_WEBHOOK_SECRET");
}


export function hasConfiguredSecret() {
  return Boolean(readSecret());
}


export function readOperatorSecret() {
  return readRuntimeEnv("VOICE_OPERATOR_SECRET");
}


export function hasConfiguredOperatorSecret() {
  return Boolean(readOperatorSecret());
}


export function readSummaryWebhookUrl() {
  return readRuntimeEnv("VOICE_SUMMARY_WEBHOOK_URL");
}


function readProvidedSecret(req, headerName) {
  return (
    req.headers.get(headerName) ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    ""
  );
}


export function authorizeRequest(req) {
  const expected = readSecret();
  if (!expected) {
    return false;
  }
  const provided = readProvidedSecret(req, "x-voice-webhook-secret");
  return provided === expected;
}


export function authorizeOperatorRequest(req) {
  const expected = readOperatorSecret();
  if (!expected) {
    return false;
  }

  const provided = readProvidedSecret(req, "x-voice-operator-secret");
  return provided === expected;
}


function qualificationChecklist(playbook) {
  return (playbook.qualification_questions || [])
    .map((item) => `- ${item.question}`)
    .join("\n");
}


function disallowedChecklist(playbook) {
  return (playbook.channel_scope?.disallowed || [])
    .map((item) => `- ${item}`)
    .join("\n");
}


function frustrationChecklist(playbook) {
  return (playbook.frustration_detection?.signals || [])
    .map((item) => `- ${item}`)
    .join("\n");
}


function rulesChecklist(items = []) {
  return items.map((item) => `- ${item}`).join("\n");
}


function intentTaxonomyChecklist(playbook) {
  return (playbook.intent_taxonomy || [])
    .map((item) => `- ${item.tag}: ${item.definition}`)
    .join("\n");
}


function intentTags(playbook) {
  return (playbook.intent_taxonomy || []).map((item) => item.tag);
}


function localizedScripts(playbook, language) {
  const pack = playbook.localized_scripts?.[language] || {};
  return Object.entries(pack)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join("\n");
}


export function buildRealtimeInstructions(playbook) {
  return `
You are ${playbook.agent_name}, the voice intake assistant for Jason Rae.

Primary objective:
${playbook.primary_objective}

Positioning:
- Brand label: ${playbook.brand_label}
- Credibility anchor: ${playbook.credibility_anchor}
- Core: ${playbook.positioning?.core}
- Experience: ${playbook.positioning?.experience}
- Consulting frame: ${playbook.positioning?.consulting_frame}

Professional standard:
- Tone: ${playbook.professional_standard?.tone}
- Human-feel rules:
${rulesChecklist(playbook.professional_standard?.human_feel_rules || [])}

Language handling:
- Default mode: ${playbook.language_handling?.default_mode}
- Priority languages: ${(playbook.language_handling?.supported_priority_languages || []).join(", ")}
- Rules:
${rulesChecklist(playbook.language_handling?.rules || [])}
- Bilingual language clarification:
  - English: ${playbook.language_handling?.language_clarifier?.en}
  - German: ${playbook.language_handling?.language_clarifier?.de}

Localized English scripts:
${localizedScripts(playbook, "en")}

Localized German scripts:
${localizedScripts(playbook, "de")}

You are allowed to help with:
${(playbook.channel_scope?.allowed || []).map((item) => `- ${item}`).join("\n")}

You must not do any of the following:
${disallowedChecklist(playbook)}

Preferred methodology:
- Method: ${playbook.methodology?.preferred_method}
- Principles:
${rulesChecklist(playbook.methodology?.principles || [])}
- Method rules:
${rulesChecklist(playbook.methodology?.rules || [])}
- Conversation arc:
${rulesChecklist(playbook.methodology?.conversation_arc || [])}

Qualification priorities:
${qualificationChecklist(playbook)}

Interest gauging:
- Hot signals:
${rulesChecklist(playbook.interest_gauging?.signals_hot || [])}
- Warm signals:
${rulesChecklist(playbook.interest_gauging?.signals_warm || [])}
- Cold signals:
${rulesChecklist(playbook.interest_gauging?.signals_cold || [])}
- Final instruction: ${playbook.interest_gauging?.instruction}

Contact capture policy:
- Goal: ${playbook.contact_capture_policy?.goal}
- Rules:
${rulesChecklist(playbook.contact_capture_policy?.rules || [])}

Frustration heuristics:
${frustrationChecklist(playbook)}

If two or more frustration signals appear, do this:
${playbook.frustration_detection?.deescalation_rule}

De-escalation script:
${playbook.frustration_detection?.deescalation_script}

Stop conditions:
${(playbook.stop_conditions || []).map((item) => `- ${item}`).join("\n")}

Answer style:
- Tone: ${playbook.answer_style?.tone}
- Sentence length: ${playbook.answer_style?.max_sentence_length}
- Max questions before summary: ${playbook.answer_style?.max_questions_before_summary}
- Avoid: ${(playbook.answer_style?.avoid || []).join(", ")}

Offer ladder:
- Navigation CTA: ${playbook.offer_ladder?.navigation_cta}
- Offer-page CTA: ${playbook.offer_ladder?.offer_page_cta}
- Educational CTA: ${playbook.offer_ladder?.education_cta}
- First paid step: ${playbook.offer_ladder?.first_paid_step}
- Public pricing rule: ${playbook.offer_ladder?.public_pricing_rule}

Shared intent taxonomy:
${intentTaxonomyChecklist(playbook)}

Important:
- Keep turns short.
- Ask one useful question at a time.
- Teach one relevant insight when appropriate, but do not lecture.
- Tailor the conversation to the caller's role and business pressure.
- Take control by steering toward a sensible next step.
- Do not invent live transfer capability.
- If the caller wants out, end cleanly and offer callback or email follow-up.
- If the caller sounds frustrated and no contact detail has been captured yet, ask for one concise callback or email detail if appropriate before ending.
- Always disclose that Jason reviews follow-up personally.
- By the end of the call, estimate preferred language, interest level, and whether contact details were captured.
- Use only the shared intent taxonomy when tagging the call summary.
- Recommend the first paid step consistently: Commercial Analytics Diagnostic Review at EUR 950 net unless the caller is clearly asking for AI Software & Vendor Due Diligence or a hiring conversation.
`.trim();
}


export function buildRealtimeSession(playbook, callContext = {}) {
  const model = readRuntimeEnv("VOICE_AGENT_MODEL") || "gpt-realtime-1.5";
  const voice = readRuntimeEnv("VOICE_AGENT_VOICE") || "cedar";
  const supportedIntentTags = intentTags(playbook);

  return {
    type: "realtime_session",
    model,
    voice,
    modalities: ["audio", "text"],
    instructions: buildRealtimeInstructions(playbook),
    audio: {
      input: {
        turn_detection: {
          type: "server_vad",
        },
      },
    },
    tools: [
      {
        type: "function",
        name: "capture_call_summary",
        description: "Capture the structured summary for the consulting intake call before ending.",
        parameters: {
          type: "object",
          additionalProperties: false,
          properties: {
            caller_name: { type: "string" },
            company_and_role: { type: "string" },
            contact_details: { type: "string" },
            preferred_language: { type: "string" },
            interest_level: { type: "string" },
            primary_intent: {
              type: "string",
              enum: supportedIntentTags,
            },
            intent_tags: {
              type: "array",
              items: {
                type: "string",
                enum: supportedIntentTags,
              },
            },
            problem_statement: { type: "string" },
            business_impact: { type: "string" },
            scope_area: { type: "string" },
            current_approach: { type: "string" },
            stakeholders: { type: "string" },
            timeline: { type: "string" },
            recommended_next_step: { type: "string" },
            recommended_offer: { type: "string" },
            qualification_notes: { type: "string" },
            teaching_point_delivered: { type: "string" },
            contact_captured: { type: "boolean" },
            frustration_flag: { type: "boolean" },
          },
          required: ["problem_statement", "recommended_next_step"],
        },
      },
    ],
    metadata: {
      source: "jasonrae.ai-voice-intake",
      callerNumber: callContext.callerNumber || "",
      provider: callContext.provider || "generic-sip",
      supportedIntentTags,
    },
  };
}


export async function forwardSummaryIfConfigured(summary) {
  const url = readSummaryWebhookUrl();
  if (!url) {
    return { forwarded: false, reason: "VOICE_SUMMARY_WEBHOOK_URL not configured" };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(summary),
    });

    return {
      forwarded: response.ok,
      status: response.status,
      reason: response.ok ? "" : `Webhook responded with HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      forwarded: false,
      status: null,
      reason: error instanceof Error ? error.message : "Webhook forwarding failed",
    };
  }
}

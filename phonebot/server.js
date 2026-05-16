const crypto = require("node:crypto");
const express = require("express");
const { urlencoded } = require("body-parser");
const twilio = require("twilio");
const WebSocket = require("ws");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const ALLOW_INSECURE_LOCAL =
  process.env.PHONEBOT_ALLOW_INSECURE_LOCAL === "true";
const STREAM_TOKEN_TTL_MS = 5 * 60 * 1000;

const app = express();
app.use(urlencoded({ extended: false }));

const streamTokens = new Map();


function cleanupExpiredStreamTokens() {
  const now = Date.now();
  for (const [token, metadata] of streamTokens.entries()) {
    if (metadata.expiresAt <= now) {
      streamTokens.delete(token);
    }
  }
}


function issueStreamToken(callSid) {
  cleanupExpiredStreamTokens();
  const token = crypto.randomBytes(24).toString("hex");
  streamTokens.set(token, {
    callSid,
    expiresAt: Date.now() + STREAM_TOKEN_TTL_MS,
  });
  return token;
}


function consumeStreamToken(token) {
  cleanupExpiredStreamTokens();
  const metadata = streamTokens.get(token);
  if (!metadata) {
    return null;
  }
  streamTokens.delete(token);
  return metadata;
}


function buildAbsoluteRequestUrl(req) {
  return new URL(req.originalUrl, PUBLIC_URL).toString();
}


function isTwilioRequestValid(req) {
  if (ALLOW_INSECURE_LOCAL) {
    return true;
  }

  if (!TWILIO_AUTH_TOKEN) {
    return false;
  }

  const signature = req.header("x-twilio-signature");
  if (!signature) {
    return false;
  }

  return twilio.validateRequest(
    TWILIO_AUTH_TOKEN,
    signature,
    buildAbsoluteRequestUrl(req),
    req.body || {},
  );
}


function requireVerifiedTwilioRequest(req, res, next) {
  if (ALLOW_INSECURE_LOCAL) {
    return next();
  }

  if (!TWILIO_AUTH_TOKEN) {
    return res.status(503).json({
      error: "Twilio webhook validation is not configured.",
    });
  }

  if (!isTwilioRequestValid(req)) {
    return res.status(401).json({
      error: "Unauthorized Twilio request.",
    });
  }

  return next();
}


function buildStreamUrl(callSid) {
  const baseUrl = new URL(PUBLIC_URL);
  const wsUrl = new URL("/twilio", baseUrl);
  wsUrl.protocol = baseUrl.protocol === "https:" ? "wss:" : "ws:";
  wsUrl.searchParams.set("token", issueStreamToken(callSid));
  return wsUrl.toString();
}


app.post("/twilio-webhook", requireVerifiedTwilioRequest, (req, res) => {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    numDigits: 1,
    action: "/gather",
    method: "POST",
    timeout: 5,
  });
  gather.say(
    "Hello. This call may be recorded and may be handled by an automated assistant. Press 1 to continue, or hang up to cancel.",
  );

  res.type("text/xml");
  res.send(twiml.toString());
});


app.post("/gather", requireVerifiedTwilioRequest, (req, res) => {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();
  const digit = (req.body || {}).Digits;

  if (digit === "1") {
    const callSid = (req.body || {}).CallSid || crypto.randomUUID();
    twiml.say("Thank you. Connecting you to the assistant now.");
    twiml.start().stream({ url: buildStreamUrl(callSid) });
  } else {
    twiml.say("No input received. Goodbye.");
    twiml.hangup();
  }

  res.type("text/xml");
  res.send(twiml.toString());
});


app.get("/health", (req, res) =>
  res.json({
    ok: true,
    webhookValidation:
      ALLOW_INSECURE_LOCAL || Boolean(TWILIO_AUTH_TOKEN)
        ? "configured"
        : "missing",
    insecureLocalMode: ALLOW_INSECURE_LOCAL,
  }),
);


const server = app.listen(PORT, () =>
  console.log(`phonebot server listening on ${PORT}`),
);

const wss = new WebSocket.Server({ server, path: "/twilio" });

wss.on("connection", (ws, req) => {
  const requestUrl = new URL(req.url, "ws://localhost");
  const token = requestUrl.searchParams.get("token") || "";
  const streamSession = consumeStreamToken(token);

  if (!streamSession) {
    ws.close(1008, "Unauthorized stream");
    return;
  }

  console.log("Twilio media stream connected", {
    callSid: streamSession.callSid,
  });

  ws.on("message", async (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.event === "start") {
        console.log("Stream started", {
          callSid: streamSession.callSid,
          streamSid: data.streamSid || null,
        });
      }

      if (data.event === "media") {
        const payload = data.media && data.media.payload;
        if (payload) {
          console.log("Received media frame", {
            callSid: streamSession.callSid,
            bytes: payload.length,
          });
        }
      }

      if (data.event === "stop") {
        console.log("Stream stopped", {
          callSid: streamSession.callSid,
        });
      }
    } catch (err) {
      console.error("Failed to handle websocket message", err);
    }
  });

  ws.on("close", () =>
    console.log("Twilio media stream disconnected", {
      callSid: streamSession.callSid,
    }),
  );
});

module.exports = { app, server };

# phonebot prototype

This folder contains a small prototype server to connect an inbound phone number (Twilio) to an automated assistant stream.

What is included
- `server.js` — Express server that provides a Twilio webhook and a WebSocket endpoint for Twilio Media Streams. Twilio webhook requests are verified by default, and media-stream connections require a one-time token issued from the verified gather step. The WebSocket handler currently logs audio frames; replace with realtime forwarding to the OpenAI Realtime/Voice API.
- `openai-connector.js` — placeholder functions for ASR and assistant replies. Replace with real OpenAI API calls.
- `.env.example` — example environment configuration.
- `package.json` — runtime dependencies and `npm start` entry point for the prototype.

Quick start (prototype)

1. Install dependencies:

```bash
cd phonebot
npm install
```

2. Create an `.env` from `.env.example` and set `PUBLIC_URL` to your public hostname (or use ngrok).

3. Configure Twilio request validation:

- Recommended: set `TWILIO_AUTH_TOKEN` so webhook requests are verified.
- Local-only fallback: set `PHONEBOT_ALLOW_INSECURE_LOCAL=true` if you need to test without live Twilio signatures. Do not use this in production.

4. Run the server:

```bash
npm start
```

5. Configure a Twilio phone number's Voice webhook to point to:

```
POST {PUBLIC_URL}/twilio-webhook
```

When a caller presses 1, Twilio will start a Media Stream and connect to a one-time-tokenized WebSocket URL derived from `{PUBLIC_URL.replace(/^http/, 'ws')}/twilio`.

Prototype notes and next steps
- Integrate `phonebot/openai-connector.js` with the OpenAI Realtime/Voice API to forward audio frames and receive assistant TTS.
- Implement a small conversation state machine to ask qualification questions and detect frustration (sentiment, repeated "repeat" requests, low ASR confidence).
- Implement human escalation (press 0 to request callback) and immediate transfer options.
- Add secure logging, retention policy, and consent recording.

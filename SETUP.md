# Music Coach AI setup

## What works in the browser now

- Upload and play an audio file.
- Measure duration, peak level, average level, and a clipping estimate locally on the device.
- Preview the full coaching-report layout.
- Send the selected song to a secure analyzer endpoint when one is configured.

## What the secure analyzer adds

The server in `server/` sends MP3/WAV audio to OpenAI's `gpt-audio-1.5` model and returns:

- Flow / pocket score
- Cadence score
- Vocal delivery score
- Hook strength
- Lyrics feedback
- Replayability
- Song structure
- Mix / clarity
- Originality
- Explained hit-potential score
- Approximate timestamped coaching notes
- A ranked "fix these first" list

The hit-potential score is a creative/commercial-readiness heuristic, not a prediction that a song will become a hit.

## Server environment variables

Never put an API key in `index.html` or commit it to GitHub.

Set these only on the backend host:

```text
OPENAI_API_KEY=your_server_side_key
ALLOWED_ORIGIN=https://YOUR-GITHUB-USERNAME.github.io
PORT=3000
```

If the GitHub Pages site uses a project URL, the browser origin is still `https://YOUR-GITHUB-USERNAME.github.io`.

## Run the analyzer on a Node host

The backend requires Node 22 or newer.

```bash
cd server
npm install
npm start
```

The server exposes:

- `GET /health`
- `POST /analyze` using multipart form data with the `song` field

For the first AI version, use MP3 or WAV for full analysis. The browser can still locally inspect other audio formats your phone/browser can decode.

## Connect the webpage

Open **AI backend connection** on the webpage, paste the HTTPS URL ending in `/analyze`, and save it. Example:

```text
https://your-secure-backend.example.com/analyze
```

The webpage intentionally does not generate fake flow or hit scores when the backend is missing.

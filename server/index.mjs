import express from 'express';
import multer from 'multer';
import OpenAI from 'openai';

const app = express();
const port = Number(process.env.PORT || 3000);
const allowedOrigin = process.env.ALLOWED_ORIGIN || '';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /audio\/(mpeg|mp3|wav|x-wav)/i.test(file.mimetype) || /\.(mp3|wav)$/i.test(file.originalname);
    cb(ok ? null : new Error('For full AI analysis, upload an MP3 or WAV file.'), ok);
  }
});

app.use((req, res, next) => {
  if (allowedOrigin && req.headers.origin === allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, model: 'gpt-audio-1.5' });
});

function cleanJson(text) {
  const stripped = String(text || '').replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const first = stripped.indexOf('{');
  const last = stripped.lastIndexOf('}');
  if (first < 0 || last < first) throw new Error('The model did not return JSON.');
  return JSON.parse(stripped.slice(first, last + 1));
}

function clampScore(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0;
}

function normalizeReport(raw) {
  const scoreNames = [
    'Flow / Pocket', 'Cadence', 'Vocal Delivery', 'Hook Strength', 'Lyrics',
    'Replayability', 'Song Structure', 'Mix / Clarity', 'Originality'
  ];
  const scores = {};
  for (const name of scoreNames) {
    const item = raw?.scores?.[name] || {};
    scores[name] = {
      score: clampScore(item.score),
      reason: String(item.reason || 'No explanation provided.')
    };
  }
  return {
    scores,
    hitPotential: {
      score: clampScore(raw?.hitPotential?.score),
      reason: String(raw?.hitPotential?.reason || 'No explanation provided.')
    },
    timeline: Array.isArray(raw?.timeline) ? raw.timeline.slice(0, 12).map(x => ({
      time: String(x?.time || '—'),
      note: String(x?.note || '')
    })) : [],
    priorities: Array.isArray(raw?.priorities) ? raw.priorities.slice(0, 5).map(x => ({
      title: String(x?.title || 'Fix'),
      reason: String(x?.reason || '')
    })) : []
  };
}

app.post('/analyze', upload.single('song'), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'OPENAI_API_KEY is not configured.' });
    if (!req.file) return res.status(400).json({ error: 'No song file was provided.' });
    if (allowedOrigin && req.headers.origin && req.headers.origin !== allowedOrigin) {
      return res.status(403).json({ error: 'This origin is not allowed.' });
    }

    const ext = (req.file.originalname.split('.').pop() || '').toLowerCase();
    const format = ext === 'wav' ? 'wav' : 'mp3';
    const audioBase64 = req.file.buffer.toString('base64');
    const genre = String(req.body.genre || '').slice(0, 200);
    const goal = String(req.body.goal || 'overall').slice(0, 100);
    const lyrics = String(req.body.lyrics || '').slice(0, 18000);
    const localMetrics = String(req.body.localMetrics || '{}').slice(0, 3000);

    const instructions = `You are a demanding but constructive music coach. Analyze the actual audio performance, not just the lyrics. Focus on rhythm/flow, cadence changes, vocal delivery, hook memorability, writing, replayability, structure, mix clarity, and originality.\n\nDo not claim you can predict a hit. The hitPotential score is only a creative/commercial-readiness heuristic. Explain what raises and lowers it. Give practical, specific feedback, and use approximate timestamp ranges only when you can reasonably locate the moment in the audio.\n\nReturn ONLY valid JSON with exactly this shape:\n{\n  "scores": {\n    "Flow / Pocket": {"score": 0, "reason": ""},\n    "Cadence": {"score": 0, "reason": ""},\n    "Vocal Delivery": {"score": 0, "reason": ""},\n    "Hook Strength": {"score": 0, "reason": ""},\n    "Lyrics": {"score": 0, "reason": ""},\n    "Replayability": {"score": 0, "reason": ""},\n    "Song Structure": {"score": 0, "reason": ""},\n    "Mix / Clarity": {"score": 0, "reason": ""},\n    "Originality": {"score": 0, "reason": ""}\n  },\n  "hitPotential": {"score": 0, "reason": ""},\n  "timeline": [{"time": "0:00–0:00", "note": ""}],\n  "priorities": [{"title": "", "reason": ""}]\n}\n\nUse integer scores from 0-100. Give 4-10 useful timeline notes and 3-5 priorities. Never inflate scores just to be encouraging.`;

    const context = `Genre/style: ${genre || 'not specified'}\nFocus: ${goal}\nLocal audio measurements: ${localMetrics}\nLyrics supplied by user:\n${lyrics || '(none supplied)'}`;

    const completion = await client.chat.completions.create({
      model: 'gpt-audio-1.5',
      messages: [
        { role: 'developer', content: instructions },
        {
          role: 'user',
          content: [
            { type: 'text', text: context },
            { type: 'input_audio', input_audio: { data: audioBase64, format } }
          ]
        }
      ]
    });

    const report = normalizeReport(cleanJson(completion.choices?.[0]?.message?.content));
    res.json(report);
  } catch (err) {
    console.error(err);
    const message = err?.message || 'Analysis failed.';
    res.status(message.includes('File too large') ? 413 : 500).json({ error: message });
  }
});

app.use((err, _req, res, _next) => {
  const message = err?.message || 'Request failed.';
  res.status(message.includes('File too large') ? 413 : 400).json({ error: message });
});

app.listen(port, () => {
  console.log(`Music Coach AI analyzer listening on port ${port}`);
});

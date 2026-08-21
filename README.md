# Music Coach

A phone-friendly, **free local song analyzer** hosted on GitHub Pages.

## Cost

- GitHub Pages: free
- Local browser analysis: free
- No API key
- No backend host
- No per-song charge

## What the webpage does

The selected audio file is analyzed directly in the browser. It measures:

- Duration
- Peak level
- Rough RMS average level
- Clipping estimate
- Dynamic range estimate
- Crest factor
- Very quiet / silence estimate
- Relative energy across eight parts of the song
- Technical flags based on those measurements

The webpage does **not** invent subjective scores for flow, hooks, lyrics, delivery, or hit potential. Those require someone or an AI that can actually listen to the song.

## Detailed coaching workflow

After the local scan, tap **Copy coaching request**. Then attach the same song in ChatGPT and paste the prepared request. It asks for flow/pocket, cadence, vocal delivery, hook strength, writing, structure, replayability, mix clarity, originality, timestamped notes, a carefully explained hit-potential heuristic, and a ranked fix-first list.

No paid OpenAI API or Render setup is required for this version.

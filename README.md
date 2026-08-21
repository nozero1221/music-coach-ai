# Music Coach

A phone-friendly, **free local music coaching toolkit** hosted on GitHub Pages.

## Cost

- GitHub Pages: free
- Local browser tools: free
- No API key
- No backend host
- No per-song charge

## Tabs

### Song Scan

Analyzes a song locally in the browser for duration, peak level, rough RMS, clipping, dynamic range, crest factor, and relative energy. It prepares a ChatGPT coaching request for subjective feedback such as flow, delivery, hooks, structure, mix clarity, originality, and commercial-readiness.

### Lyrics & Delivery

Lets you paste lyrics and plan pronunciation, emphasis, phrasing, emotion, doubles, harmonies, ad-libs, reverb/delay, automation, and the emotional role of each song section. It prepares a ChatGPT request for original replacement lyric options.

### Beat → Song Builder

Upload an instrumental and analyze its energy locally. The page shows a 12-part energy map, highlights the highest-energy area, creates a rough timestamped song-structure starting point, and suggests contrasting verse/hook flow approaches.

Then tap **Copy full-song request**, attach the same beat in ChatGPT, and paste the request. It asks ChatGPT to listen to the actual beat and create:

- an original song concept/title
- timestamped structure
- full original lyrics
- line-by-line flow and pronunciation directions
- cadence switches
- alternate original hook ideas
- emotional arc
- lead/double/harmony/ad-lib production directions
- a recording roadmap

The local structure is only a starting guess; the listening-based coaching should correct it based on the actual musical transitions.

No paid OpenAI API or Render setup is required for this version.

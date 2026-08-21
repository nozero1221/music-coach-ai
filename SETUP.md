# Music Coach setup

The site is designed to run as a static GitHub Pages project. No backend or API key is required.

## Publish

GitHub Pages can publish the root of `main`.

Main files:

- `index.html` — three-tab shell
- `song-tools.html` — Song Scan + Lyrics & Delivery tools
- `beat-builder.html` — Beat → Song Builder

## Privacy / cost

Song and beat measurements happen with the browser Web Audio API on the user's device. The local pages do not upload the audio.

Creative listening tasks such as judging a performance, rewriting lyrics, or writing a full original song for a specific beat are handled by a prepared ChatGPT handoff. The user attaches the same audio in ChatGPT and pastes the generated request.

There is no OpenAI API key, paid backend host, or per-song API charge in this repository.

## Beat Builder workflow

1. Open **Beat → Song Builder**.
2. Choose an instrumental.
3. Add genre, mood, theme, optional known BPM, and goal.
4. Tap **Analyze beat locally**.
5. Review the 12-part energy view, rough structure, and flow blueprint.
6. Tap **Copy full-song request**.
7. In ChatGPT, attach the same beat and paste the request.

The rough local structure is heuristic. Listening to the actual beat should determine the final timestamps and arrangement.

# Equations with Fractions · Grade 8 (MOE)

Same architecture, UI/UX, viewport and audio pipeline as the Circumference module — new content.

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build -> dist/
```

## Voice / audio (ElevenLabs "Alice", eleven_multilingual_v2)
All narrated lines live in `src/audioMap.js` (paragraphs + questions only, never titles).

```bash
npm run audio          # generate any missing mp3 into public/assets/audio/
npm run audio:force    # regenerate everything
npm run audio:clean    # delete orphaned mp3s
```
The key is read from `.env.local` (`VITE_ELEVENLABS_API_KEY`). See `audio_generation_pipeline.md`.

**Playback order:** static mp3 -> live ElevenLabs request (only if a key/proxy is set) -> browser speech.
Run `npm run audio` once, then rebuild, and the app plays zero-latency static audio.

**Security:** anything prefixed `VITE_` is bundled into the browser build. Before deploying publicly,
delete the key from `.env.local` (static mp3s don't need it) or use a server proxy via `VITE_TTS_PROXY`.

## Editing narration
1. Change the text in `src/audioMap.js` (and the matching on-screen text).
2. `npm run audio` (add `--only=story_3` to redo one line) then `npm run audio:clean`.

## Structure
- `src/stages/` Intro · Wonder · Story · Simulate · Practice · Reflect
- `src/mathData.js` procedural question generator (10 worlds, 14 question types, verified answers)
- `src/fractions.js` exact fraction/linear-expression engine
- `src/components/` TopNav, BalanceScale (animated SVG), MathText (stacked fractions)
- `public/assets/images/slide1-8.png` story illustrations (replace with your own art at the same file names if you like)

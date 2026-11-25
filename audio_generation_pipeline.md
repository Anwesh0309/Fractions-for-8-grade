# Equations with Fractions — Audio & Narration Pipeline

Same hybrid pipeline as the Number Bonds / Circumference modules: ElevenLabs narration, pre-generated offline into static mp3 files, with a dynamic fallback.

## 1. Voice profile
- Provider: ElevenLabs · Voice: **Alice** (Clear, Engaging Educator) · Voice ID `Xb7hH8MSUJpSbSDYk0k2` · Model `eleven_multilingual_v2`
- Config lives in `src/voiceConfig.js` (shared by the browser engine and the generation script).

| Style | Stability | Similarity | Style | Speaker Boost |
|---|---|---|---|---|
| celebration | 0.12 | 0.45 | 0.75 | yes |
| encouragement | 0.16 | 0.50 | 0.65 | yes |
| question | 0.20 | 0.55 | 0.55 | yes |
| emphasis | 0.16 | 0.50 | 0.60 | yes |
| thinking | 0.24 | 0.60 | 0.35 | yes |
| statement / instruction | 0.20 | 0.55 | 0.50 | yes |

**Content policy:** audio is generated ONLY for paragraph text, questions and short feedback reactions. Titles, headings and labels are never narrated.

## 2. Components
- `src/audioMap.js` — every spoken line: `id -> { text, style, file }`, plus `audioMap` (exact text -> mp3 path).
- `scripts/generate_audio.js` — offline generation (`npm run audio`, `--force`, `--only=id1,id2`), 500 ms rate limit, key from `.env.local`.
- `scripts/clean_audio.js` — removes mp3s no longer referenced (`npm run audio:clean`).
- `src/audio.js` — playback engine: `narrate()`, `stopNarration()`, helpers `say/ask/cheer/emphasize/think/celebrate/instruct`, `speakFx()`; eager preloading of the next segment; queue symbol prevents overlap.

## 3. Playback order
1. Static mp3 from `audioMap` (zero latency)
2. Live ElevenLabs request (`VITE_ELEVENLABS_API_KEY`, or your own proxy via `VITE_TTS_PROXY`)
3. Browser speech synthesis

## 4. Workflow: add or change a line
1. Edit/add the entry in `src/audioMap.js` (exact text + style).
2. `npm run audio` (new/missing only) — or `npm run audio:force`.
3. `npm run audio:clean` to remove orphans.
4. Use it: `narrate(AUDIO_MAP.my_line, !muted)` and keep the on-screen text consistent with the spoken text.

/* =========================================================================
   VOICE CONFIG — shared by the browser audio engine AND the offline
   generation script (pure JS: no window / import.meta usage here).
   Voice: Alice (Clear, Engaging Educator)
   ========================================================================= */
export const VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2";
export const MODEL_ID = "eleven_multilingual_v2";

export const STYLE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true, rate: 1.06, pitch: 1.2 },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true, rate: 1.0,  pitch: 1.1 },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true, rate: 0.98, pitch: 1.08 },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true, rate: 0.95, pitch: 1.05 },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true, rate: 0.90, pitch: 0.95 },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true, rate: 1.0,  pitch: 1.0 },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true, rate: 1.0,  pitch: 1.0 }
};

/** body sent to the ElevenLabs text-to-speech endpoint */
export function buildTtsBody(text, style = 'statement') {
  const s = STYLE_SETTINGS[style] || STYLE_SETTINGS.statement;
  return {
    text,
    model_id: MODEL_ID,
    voice_settings: {
      stability: s.stability,
      similarity_boost: s.similarity_boost,
      style: s.style,
      use_speaker_boost: s.use_speaker_boost
    }
  };
}

/* =========================================================================
   AUDIO ENGINE (ElevenLabs "Alice" pipeline architecture)
   Voice: Alice (Clear, Engaging Educator) — Voice ID: Xb7hH8MSUJpSbSDYk0k2
   Model: eleven_multilingual_v2

   Playback order for every segment:
     1. static pre-generated mp3  (zero latency, works offline)
     2. dynamic ElevenLabs request (only if VITE_ELEVENLABS_API_KEY / proxy exists)
     3. browser speech synthesis   (last-resort fallback)
   ========================================================================= */
import { VOICE_ID, STYLE_SETTINGS, buildTtsBody } from './voiceConfig.js';
import { AUDIO_MAP, audioMap } from './audioMap.js';

export { VOICE_ID, STYLE_SETTINGS };

const ENV = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
const API_KEY = ENV.VITE_ELEVENLABS_API_KEY || '';
const PROXY_URL = ENV.VITE_TTS_PROXY || '';        // e.g. "/api/elevenlabs"

export let audioMuted = false;
let ttsVoice = null;
let currentAudioElement = null;
let cancelCurrent = null;       // resolves or cancels the in-flight playback promise when stopped
let currentQueue = 0;
const dynamicCache = new Map(); // text+style -> object URL

/* ------------------------- browser speech fallback ------------------------- */
function pickVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find(v => /female|alice|zira|samantha|victoria|google us english/i.test(v.name)) ||
    voices.find(v => v.lang && v.lang.startsWith('en')) ||
    voices[0]
  );
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => { ttsVoice = pickVoice(); };
  ttsVoice = pickVoice();
}

function fallbackSpeech(seg, expectedQueue) {
  return new Promise((resolve) => {
    if (audioMuted || currentQueue !== expectedQueue || typeof window === 'undefined' || !('speechSynthesis' in window) || !seg.text) {
      return resolve(false);
    }
    const cfg = STYLE_SETTINGS[seg.style] || STYLE_SETTINGS.statement;
    const utter = new SpeechSynthesisUtterance(seg.text);
    if (ttsVoice) utter.voice = ttsVoice;
    utter.rate = cfg.rate;
    utter.pitch = cfg.pitch;
    utter.volume = 1;
    let settled = false;
    const done = () => {
      if (!settled) {
        settled = true;
        cancelCurrent = null;
        resolve(true);
      }
    };
    utter.onend = done;
    utter.onerror = done;
    cancelCurrent = () => {
      try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
      done();
    };
    window.speechSynthesis.speak(utter);
  });
}

/* ------------------------- dynamic ElevenLabs request ------------------------- */
/** live request to ElevenLabs (or your proxy). Returns an object URL, or null if unavailable. */
async function requestDynamic(text, style = 'statement') {
  const cacheKey = `${style}::${text}`;
  if (dynamicCache.has(cacheKey)) return dynamicCache.get(cacheKey);
  if (!API_KEY && !PROXY_URL) return null;
  try {
    const url = PROXY_URL || `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
    const headers = { 'Content-Type': 'application/json', Accept: 'audio/mpeg' };
    if (!PROXY_URL) headers['xi-api-key'] = API_KEY;
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(buildTtsBody(text, style)) });
    if (!res.ok) return null;
    const blobUrl = URL.createObjectURL(await res.blob());
    dynamicCache.set(cacheKey, blobUrl);
    return blobUrl;
  } catch {
    return null;
  }
}

/** getAudioUrl(text, style): static map first, then on-the-fly request */
export async function getAudioUrl(text, style = 'statement') {
  if (audioMap[text]) return audioMap[text];
  return requestDynamic(text, style);
}

/* ------------------------------- playback ------------------------------- */
/** plays one URL; resolves true if it played to the end, false on failure or cancellation */
function playUrl(url, expectedQueue) {
  return new Promise((resolve) => {
    if (currentQueue !== expectedQueue || audioMuted) return resolve(false);
    try {
      const audio = new Audio(url);
      currentAudioElement = audio;
      let settled = false;
      const done = (ok) => {
        if (!settled) {
          settled = true;
          cancelCurrent = null;
          if (currentAudioElement === audio) {
            currentAudioElement = null;
          }
          resolve(ok);
        }
      };
      cancelCurrent = () => {
        try {
          audio.pause();
          audio.currentTime = 0;
          audio.removeAttribute('src');
          audio.load();
        } catch { /* ignore */ }
        done(false);
      };
      audio.onended = () => done(true);
      audio.onerror = () => done(false);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => done(false));
      }
    } catch {
      resolve(false);
    }
  });
}

export function setMuted(m) {
  audioMuted = m;
  if (m) stopNarration();
}

export async function speakSegment(seg, expectedQueue = currentQueue) {
  if (audioMuted || !seg || !seg.text || currentQueue !== expectedQueue) return false;

  // 1) static pre-generated file
  if (seg.file) {
    const ok = await playUrl(seg.file, expectedQueue);
    if (ok) return true;
  }
  if (audioMuted || currentQueue !== expectedQueue) return false;

  // 2) dynamic request (only when a key / proxy is configured)
  const dyn = await requestDynamic(seg.text, seg.style);
  if (currentQueue !== expectedQueue || audioMuted) return false;
  if (dyn) {
    const ok = await playUrl(dyn, expectedQueue);
    if (ok) return true;
  }
  if (audioMuted || currentQueue !== expectedQueue) return false;

  // 3) browser speech synthesis
  await fallbackSpeech(seg, expectedQueue);
  return true;
}

/** eagerly warm the next segment so there is no gap between sentences */
function preload(seg) {
  if (!seg) return;
  try {
    if (seg.file) {
      const a = new Audio();
      a.preload = 'auto';
      a.src = seg.file;
    }
  } catch { /* ignore */ }
}

export async function narrate(segments, autoplay = true) {
  if (!autoplay || audioMuted) return;
  stopNarration();
  const myQueue = currentQueue;
  const segList = Array.isArray(segments) ? segments : [segments];
  for (let i = 0; i < segList.length; i++) {
    if (myQueue !== currentQueue || audioMuted) return;
    preload(segList[i + 1]);
    await speakSegment(segList[i], myQueue);
    if (myQueue !== currentQueue || audioMuted) return;
  }
}

export function stopNarration() {
  currentQueue++;
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
      currentAudioElement.removeAttribute('src');
      currentAudioElement.load();
    } catch { /* ignore */ }
    currentAudioElement = null;
  }
  if (cancelCurrent) {
    const c = cancelCurrent;
    cancelCurrent = null;
    c();
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
  }
}

/* ---------------------------- segment helpers ---------------------------- */
export const say = text => ({ text, style: 'statement', file: audioMap[text] });
export const ask = text => ({ text, style: 'question', file: audioMap[text] });
export const cheer = text => ({ text, style: 'celebration', file: audioMap[text] });
export const emphasize = text => ({ text, style: 'emphasis', file: audioMap[text] });
export const think = text => ({ text, style: 'thinking', file: audioMap[text] });
export const celebrate = text => ({ text, style: 'celebration', file: audioMap[text] });
export const instruct = text => ({ text, style: 'encouragement', file: audioMap[text] });

/** play one of the short feedback lines, e.g. speakFx('fx_balanced') */
export function speakFx(key, muted = false) {
  const seg = AUDIO_MAP[key];
  if (seg) narrate(seg, !muted);
}

/** pick a random line from a set of feedback keys */
export function speakRandomFx(keys, muted = false) {
  speakFx(keys[Math.floor(Math.random() * keys.length)], muted);
}

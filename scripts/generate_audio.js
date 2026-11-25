/* =========================================================================
   OFFLINE AUDIO GENERATION  —  node scripts/generate_audio.js
   Reads every line in src/audioMap.js, calls the ElevenLabs text-to-speech
   API with the per-style voice settings and saves the mp3 into
   public/assets/audio/.

   Usage:
     node scripts/generate_audio.js            # only generate missing files
     node scripts/generate_audio.js --force    # regenerate everything
     node scripts/generate_audio.js --only=story_3,sim_1

   Needs  VITE_ELEVENLABS_API_KEY  in .env.local (or the environment).
   Rate limited to one request every 400 ms with auto-retry on 429.
   ========================================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadEnvLocal() {
  const file = path.join(ROOT, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnvLocal();

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY || 'sk_aa0569d46b843c5864ead704e35f676d223fe7e14a5c763f';
if (!API_KEY) {
  console.error('Missing VITE_ELEVENLABS_API_KEY. Add it to .env.local first.');
  process.exit(1);
}

const { AUDIO_MAP } = await import(pathToFileURL(path.join(ROOT, 'src/audioMap.js')).href);
const { VOICE_ID, buildTtsBody } = await import(pathToFileURL(path.join(ROOT, 'src/voiceConfig.js')).href);

const force = process.argv.includes('--force');
const onlyArg = process.argv.find(a => a.startsWith('--only='));
const only = onlyArg ? onlyArg.replace('--only=', '').split(',').map(s => s.trim()) : null;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const entries = Object.entries(AUDIO_MAP).filter(([id]) => !only || only.includes(id));
console.log(`Starting generation for ${entries.length} audio entries using voice ${VOICE_ID}...`);

let made = 0, skipped = 0, failed = 0;

for (let idx = 0; idx < entries.length; idx++) {
  const [id, seg] = entries[idx];
  const out = path.join(ROOT, 'public', seg.file.replace(/^\//, ''));
  if (!force && fs.existsSync(out) && fs.statSync(out).size > 1000) {
    skipped++;
    continue;
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  process.stdout.write(`[${idx + 1}/${entries.length}] Generating ${id} (${seg.style}) ... `);

  let success = false;
  let attempts = 0;

  while (!success && attempts < 5) {
    attempts++;
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
          'xi-api-key': API_KEY
        },
        body: JSON.stringify(buildTtsBody(seg.text, seg.style))
      });

      if (res.status === 429) {
        process.stdout.write(`[429, retry in 2s] `);
        await sleep(2000);
        continue;
      }

      if (!res.ok) {
        const errText = (await res.text()).slice(0, 160);
        throw new Error(`HTTP ${res.status} ${errText}`);
      }

      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(out, buf);
      console.log(`ok (${buf.length} bytes)`);
      made++;
      success = true;
    } catch (e) {
      if (attempts >= 5) {
        console.log('FAILED —', e.message);
        failed++;
      } else {
        process.stdout.write(`[err: ${e.message}, retry in 1s] `);
        await sleep(1000);
      }
    }
  }

  await sleep(400);
}

console.log(`\nDone. generated: ${made}, skipped (already exist): ${skipped}, failed: ${failed}`);
if (failed) process.exit(2);

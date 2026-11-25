/* Deletes any .mp3 in public/assets/audio/ that is no longer referenced by src/audioMap.js */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { AUDIO_MAP } = await import(pathToFileURL(path.join(ROOT, 'src/audioMap.js')).href);
const baseDir = path.join(ROOT, 'public/assets/audio');
if (!fs.existsSync(baseDir)) { console.log('No audio folder yet.'); process.exit(0); }

const valid = new Set(Object.values(AUDIO_MAP).map(s => path.normalize(s.file.replace(/^\/assets\/audio\//, ''))));
let removed = 0;

function cleanDir(dir, rel = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const entryRel = path.join(rel, entry.name);
    if (entry.isDirectory()) {
      cleanDir(full, entryRel);
    } else if (entry.name.endsWith('.mp3')) {
      if (!valid.has(path.normalize(entryRel))) {
        fs.unlinkSync(full);
        console.log('removed', entryRel);
        removed++;
      }
    }
  }
}

cleanDir(baseDir);
console.log(`Clean. Removed ${removed} orphaned file(s).`);

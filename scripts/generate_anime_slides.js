import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.resolve(__dirname, '../public/assets/images');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Common SVG definitions: gradients, filters, anime glows
const SVG_DEFS = `
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgLab" x1="0" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stop-color="#0b031d"/>
      <stop offset="45%" stop-color="#1e0842"/>
      <stop offset="85%" stop-color="#340e69"/>
      <stop offset="100%" stop-color="#13022c"/>
    </linearGradient>
    <radialGradient id="cyberGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ec4899" stop-opacity="0.3"/>
      <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#0b031d" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#eab308" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#ca8a04" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#a5f3fc" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#06b6d4" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#0891b2" stop-opacity="0"/>
    </radialGradient>

    <!-- Metal & Material Gradients -->
    <linearGradient id="goldMetal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="25%" stop-color="#fde047"/>
      <stop offset="60%" stop-color="#d97706"/>
      <stop offset="85%" stop-color="#b45309"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
    <linearGradient id="neonCyan" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
    <linearGradient id="neonPurple" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="50%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>

    <!-- Anime Skin & Hair -->
    <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff1ee"/>
      <stop offset="60%" stop-color="#fed7aa"/>
      <stop offset="100%" stop-color="#fdba74"/>
    </linearGradient>
    <linearGradient id="miaHair" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#9333ea"/>
      <stop offset="35%" stop-color="#6b21a8"/>
      <stop offset="80%" stop-color="#3b0764"/>
      <stop offset="100%" stop-color="#240342"/>
    </linearGradient>
    <linearGradient id="miaHairHighlight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e9d5ff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#c084fc" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="leoHair" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="45%" stop-color="#451a03"/>
      <stop offset="100%" stop-color="#260e02"/>
    </linearGradient>
    <linearGradient id="labCoat" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="70%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>

    <!-- Glowing Filters -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <filter id="shadowBox" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>
`;

// Helper: Common Anime Background Canvas
function animeBackground(title, subtitle) {
  return `
    <!-- Cosmic Cyber Lab Background -->
    <rect width="1024" height="1024" fill="url(#bgLab)"/>
    <circle cx="512" cy="400" r="480" fill="url(#cyberGlow)"/>

    <!-- Perspective Grid Floor -->
    <g opacity="0.3">
      <line x1="0" y1="780" x2="1024" y2="780" stroke="#a855f7" stroke-width="2"/>
      <line x1="0" y1="830" x2="1024" y2="830" stroke="#a855f7" stroke-width="2"/>
      <line x1="0" y1="890" x2="1024" y2="890" stroke="#a855f7" stroke-width="2"/>
      <line x1="0" y1="960" x2="1024" y2="960" stroke="#a855f7" stroke-width="3"/>
      <line x1="512" y1="740" x2="100" y2="1024" stroke="#c084fc" stroke-width="1.5"/>
      <line x1="512" y1="740" x2="300" y2="1024" stroke="#c084fc" stroke-width="1.5"/>
      <line x1="512" y1="740" x2="512" y2="1024" stroke="#c084fc" stroke-width="2"/>
      <line x1="512" y1="740" x2="724" y2="1024" stroke="#c084fc" stroke-width="1.5"/>
      <line x1="512" y1="740" x2="924" y2="1024" stroke="#c084fc" stroke-width="1.5"/>
    </g>

    <!-- Holographic Hex / Bokeh Particles -->
    <g opacity="0.45">
      <circle cx="160" cy="220" r="6" fill="#38bdf8"/>
      <circle cx="860" cy="180" r="9" fill="#f43f5e"/>
      <circle cx="240" cy="480" r="5" fill="#facc15"/>
      <circle cx="780" cy="520" r="7" fill="#38bdf8"/>
      <circle cx="120" cy="680" r="4" fill="#a855f7"/>
      <circle cx="920" cy="710" r="5" fill="#facc15"/>
      <circle cx="480" cy="150" r="4" fill="#ffffff"/>
      <circle cx="640" cy="240" r="8" fill="#38bdf8" opacity="0.6"/>
      <circle cx="340" cy="300" r="14" fill="#ec4899" opacity="0.3"/>
    </g>

    <!-- Holographic Floating HUD Ring -->
    <g transform="translate(512, 450)" opacity="0.25">
      <circle cx="0" cy="0" r="320" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="12, 10"/>
      <circle cx="0" cy="0" r="360" fill="none" stroke="#e879f9" stroke-width="1" stroke-dasharray="4, 14"/>
      <circle cx="0" cy="0" r="280" fill="none" stroke="#facc15" stroke-width="1" stroke-dasharray="20, 30"/>
    </g>

    <!-- Header Banner -->
    <g transform="translate(512, 70)">
      <rect x="-340" y="-35" width="680" height="70" rx="35" fill="#0f0524" fill-opacity="0.9" stroke="url(#goldMetal)" stroke-width="2.5" filter="url(#shadowBox)"/>
      <text x="0" y="-2" font-family="'Nunito', 'Segoe UI', sans-serif" font-weight="900" font-size="28" fill="#fde047" text-anchor="middle" letter-spacing="1.5">${title}</text>
      <text x="0" y="24" font-family="'Nunito', 'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#a5f3fc" text-anchor="middle" letter-spacing="2">${subtitle.toUpperCase()}</text>
    </g>
  `;
}

// Helper: Render Anime Character "Mia" (science prodigy girl)
function renderMia(cx, cy, scale = 1, options = {}) {
  const armPose = options.armPose || 'presenting'; // 'presenting', 'holding', 'waving'
  return `
    <g transform="translate(${cx}, ${cy}) scale(${scale})">
      <!-- Hair Back (Long purple ponytail) -->
      <path d="M 40 -30 Q 110 -20 130 90 Q 140 170 90 220 Q 60 250 80 180 Q 95 100 45 40 Z" fill="url(#miaHair)"/>
      <circle cx="45" cy="-25" r="14" fill="url(#goldMetal)"/> <!-- Gold hair ribbon -->

      <!-- Lab Coat & Body -->
      <g filter="url(#shadowBox)">
        <!-- Torso & vest -->
        <path d="M -50 80 L 50 80 L 60 220 L -60 220 Z" fill="#0891b2"/> <!-- Teal inner vest -->
        <path d="M -50 80 L -70 240 L -15 240 L -10 110 Z" fill="url(#labCoat)"/> <!-- Lab coat left -->
        <path d="M 50 80 L 70 240 L 15 240 L 10 110 Z" fill="url(#labCoat)"/> <!-- Lab coat right -->
        <path d="M -60 220 L 60 220 L 70 320 L -70 320 Z" fill="#1e1b4b"/> <!-- Skirt -->
        <!-- Science Badges -->
        <circle cx="-30" cy="120" r="7" fill="#facc15"/>
        <rect x="-38" y="132" width="16" height="6" rx="2" fill="#38bdf8"/>
      </g>

      <!-- Arms -->
      ${armPose === 'presenting' ? `
        <!-- Left arm resting on hip -->
        <path d="M -50 85 Q -90 120 -80 160 Q -70 180 -55 170" fill="none" stroke="url(#labCoat)" stroke-width="22" stroke-linecap="round"/>
        <circle cx="-55" cy="170" r="11" fill="url(#skinGrad)"/>
        <!-- Right arm pointing forward/presenting -->
        <path d="M 50 85 Q 110 90 150 70 Q 180 50 195 40" fill="none" stroke="url(#labCoat)" stroke-width="22" stroke-linecap="round"/>
        <circle cx="198" cy="38" r="12" fill="url(#skinGrad)"/>
        <!-- Sparkle at fingertip -->
        <circle cx="212" cy="30" r="8" fill="#fef08a" filter="url(#glow)"/>
      ` : armPose === 'holding' ? `
        <!-- Both hands forward holding tool -->
        <path d="M -45 85 Q -70 130 -30 160" fill="none" stroke="url(#labCoat)" stroke-width="22" stroke-linecap="round"/>
        <path d="M 45 85 Q 70 130 30 160" fill="none" stroke="url(#labCoat)" stroke-width="22" stroke-linecap="round"/>
        <circle cx="-25" cy="162" r="12" fill="url(#skinGrad)"/>
        <circle cx="25" cy="162" r="12" fill="url(#skinGrad)"/>
      ` : `
        <!-- Waving pose -->
        <path d="M 50 85 Q 100 50 120 -20 Q 130 -50 120 -70" fill="none" stroke="url(#labCoat)" stroke-width="22" stroke-linecap="round"/>
        <circle cx="120" cy="-75" r="12" fill="url(#skinGrad)"/>
        <circle cx="125" cy="-90" r="10" fill="#facc15" filter="url(#glow)"/>
        <path d="M -50 85 Q -80 130 -70 170" fill="none" stroke="url(#labCoat)" stroke-width="22" stroke-linecap="round"/>
        <circle cx="-70" cy="175" r="11" fill="url(#skinGrad)"/>
      `}

      <!-- Neck -->
      <path d="M -16 55 L 16 55 L 12 85 L -12 85 Z" fill="url(#skinGrad)"/>

      <!-- Face (Anime Head Shape) -->
      <g id="miaFace">
        <path d="M -48 10 C -52 50 -25 78 0 78 C 25 78 52 50 48 10 C 45 -40 -45 -40 -48 10 Z" fill="url(#skinGrad)"/>
        <!-- Soft blush -->
        <ellipse cx="-30" cy="35" rx="14" ry="7" fill="#f43f5e" opacity="0.3" filter="url(#softGlow)"/>
        <ellipse cx="30" cy="35" rx="14" ry="7" fill="#f43f5e" opacity="0.3" filter="url(#softGlow)"/>

        <!-- Anime Eyes (Large, vibrant hazel-amber with highlights) -->
        <!-- Left Eye -->
        <g transform="translate(-25, 15)">
          <path d="M -16 -6 Q 0 -16 16 -6" stroke="#2e1065" stroke-width="4.5" stroke-linecap="round" fill="none"/> <!-- Upper Lash -->
          <ellipse cx="0" cy="2" rx="11" ry="14" fill="#78350f"/>
          <ellipse cx="0" cy="4" rx="9" ry="11" fill="#d97706"/>
          <ellipse cx="0" cy="6" rx="6" ry="7" fill="#fde047"/>
          <circle cx="0" cy="5" r="4" fill="#0f0524"/> <!-- Pupil -->
          <circle cx="-4" cy="-2" r="4.5" fill="#ffffff"/> <!-- Specular highlight 1 -->
          <circle cx="4" cy="7" r="2.5" fill="#ffffff"/> <!-- Specular highlight 2 -->
          <path d="M -8 15 Q 0 18 8 15" stroke="#2e1065" stroke-width="2" stroke-linecap="round" fill="none"/> <!-- Lower Lash -->
        </g>
        <!-- Right Eye -->
        <g transform="translate(25, 15)">
          <path d="M -16 -6 Q 0 -16 16 -6" stroke="#2e1065" stroke-width="4.5" stroke-linecap="round" fill="none"/>
          <ellipse cx="0" cy="2" rx="11" ry="14" fill="#78350f"/>
          <ellipse cx="0" cy="4" rx="9" ry="11" fill="#d97706"/>
          <ellipse cx="0" cy="6" rx="6" ry="7" fill="#fde047"/>
          <circle cx="0" cy="5" r="4" fill="#0f0524"/>
          <circle cx="-4" cy="-2" r="4.5" fill="#ffffff"/>
          <circle cx="4" cy="7" r="2.5" fill="#ffffff"/>
          <path d="M -8 15 Q 0 18 8 15" stroke="#2e1065" stroke-width="2" stroke-linecap="round" fill="none"/>
        </g>

        <!-- Eyebrows -->
        <path d="M -38 -2 Q -25 -10 -12 -5" stroke="#4c1d95" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M 12 -5 Q 25 -10 38 -2" stroke="#4c1d95" stroke-width="3" stroke-linecap="round" fill="none"/>

        <!-- Cute Anime Nose & Smiling Mouth -->
        <circle cx="0" cy="32" r="1.5" fill="#ea580c"/>
        <path d="M -12 46 Q 0 62 12 46 Q 6 52 0 52 Q -6 52 -12 46 Z" fill="#e11d48"/>
        <path d="M -7 48 Q 0 53 7 48" fill="#ffffff"/> <!-- Teeth shine -->
      </g>

      <!-- Anime Hair Front (Bangs & Framing Strands) -->
      <g>
        <path d="M -52 10 Q -40 -60 0 -60 Q 40 -60 52 10 Q 56 40 45 70 Q 40 40 38 10 Q 20 -30 0 -30 Q -20 -30 -38 10 Q -40 40 -45 70 Q -56 40 -52 10 Z" fill="url(#miaHair)"/>
        <!-- Forehead Bangs -->
        <path d="M -32 -25 Q -18 10 -12 25 Q -8 0 0 -25 Q 8 0 14 22 Q 22 10 32 -25 Z" fill="url(#miaHair)"/>
        <!-- Angel Ring Hair Highlight -->
        <ellipse cx="0" cy="-38" rx="42" ry="7" fill="url(#miaHairHighlight)"/>
      </g>
    </g>
  `;
}

// Helper: Render Anime Character "Leo" (tech hoodie & headphones)
function renderLeo(cx, cy, scale = 1, options = {}) {
  return `
    <g transform="translate(${cx}, ${cy}) scale(${scale})">
      <!-- Hair Back -->
      <path d="M -50 -30 C -60 40 -30 70 0 70 C 30 70 60 40 50 -30 Z" fill="url(#leoHair)"/>

      <!-- Tech Hoodie Body -->
      <g filter="url(#shadowBox)">
        <path d="M -55 85 L 55 85 L 65 240 L -65 240 Z" fill="#0f172a"/>
        <!-- Orange neon zipper & accents -->
        <line x1="0" y1="85" x2="0" y2="240" stroke="#f97316" stroke-width="4"/>
        <path d="M -40 95 L -20 180 L -35 180 Z" fill="#1e293b"/>
        <path d="M 40 95 L 20 180 L 35 180 Z" fill="#1e293b"/>
      </g>

      <!-- Headphones around neck -->
      <g transform="translate(0, 80)">
        <path d="M -48 -10 Q 0 20 48 -10" fill="none" stroke="#f97316" stroke-width="14" stroke-linecap="round"/>
        <rect x="-56" y="-25" width="20" height="34" rx="8" fill="#fdba74" stroke="#ea580c" stroke-width="2"/>
        <rect x="36" y="-25" width="20" height="34" rx="8" fill="#fdba74" stroke="#ea580c" stroke-width="2"/>
      </g>

      <!-- Head & Face -->
      <g>
        <path d="M -45 10 C -48 48 -22 75 0 75 C 22 75 48 48 45 10 C 42 -35 -42 -35 -45 10 Z" fill="url(#skinGrad)"/>
        <!-- Soft blush -->
        <ellipse cx="-26" cy="35" rx="12" ry="6" fill="#f43f5e" opacity="0.25"/>
        <ellipse cx="26" cy="35" rx="12" ry="6" fill="#f43f5e" opacity="0.25"/>

        <!-- Eyes (Confident, friendly anime blue eyes) -->
        <g transform="translate(-22, 18)">
          <path d="M -14 -4 Q 0 -14 14 -4" stroke="#0f172a" stroke-width="4" stroke-linecap="round" fill="none"/>
          <ellipse cx="0" cy="2" rx="9" ry="12" fill="#0369a1"/>
          <ellipse cx="0" cy="5" rx="6" ry="7" fill="#38bdf8"/>
          <circle cx="0" cy="4" r="3" fill="#082f49"/>
          <circle cx="-3" cy="-1" r="3.5" fill="#ffffff"/>
        </g>
        <g transform="translate(22, 18)">
          <path d="M -14 -4 Q 0 -14 14 -4" stroke="#0f172a" stroke-width="4" stroke-linecap="round" fill="none"/>
          <ellipse cx="0" cy="2" rx="9" ry="12" fill="#0369a1"/>
          <ellipse cx="0" cy="5" rx="6" ry="7" fill="#38bdf8"/>
          <circle cx="0" cy="4" r="3" fill="#082f49"/>
          <circle cx="-3" cy="-1" r="3.5" fill="#ffffff"/>
        </g>

        <!-- Eyebrows -->
        <path d="M -32 -2 Q -20 -9 -10 -4" stroke="#451a03" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M 10 -4 Q 20 -9 32 -2" stroke="#451a03" stroke-width="3" stroke-linecap="round" fill="none"/>

        <!-- Smile -->
        <path d="M -10 48 Q 0 60 10 48" stroke="#9a3412" stroke-width="3" stroke-linecap="round" fill="none"/>
      </g>

      <!-- Spiky anime hair front -->
      <g>
        <path d="M -50 -10 Q -30 -60 0 -55 Q 30 -60 50 -10 Q 30 15 20 -20 Q 0 -10 -15 -35 Q -30 -10 -50 -10 Z" fill="url(#leoHair)"/>
        <path d="M -20 -40 L -10 0 L 5 -35 L 18 5 L 35 -30" fill="none" stroke="url(#leoHair)" stroke-width="12" stroke-linejoin="round"/>
      </g>
    </g>
  `;
}

// -------------------------------------------------------------
// SLIDE GENERATOR DEFINITIONS
// -------------------------------------------------------------

function generateSlide1() {
  return `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    ${SVG_DEFS}
    ${animeBackground("Every Equation Is a Balance", "Concept 1 · Keep Both Sides Equal")}

    <!-- Central Glowing Balance Scale Platform -->
    <g transform="translate(540, 560)">
      <!-- Base & Pedestal -->
      <ellipse cx="0" cy="180" rx="220" ry="40" fill="#0f0524" stroke="url(#goldMetal)" stroke-width="4" filter="url(#shadowBox)"/>
      <path d="M -25 180 L -15 -40 L 15 -40 L 25 180 Z" fill="url(#goldMetal)"/>
      <circle cx="0" cy="-40" r="28" fill="url(#goldMetal)" filter="url(#glow)"/>
      <circle cx="0" cy="-40" r="14" fill="#ffffff"/>

      <!-- Cross Beam (Level & Balanced) -->
      <rect x="-260" y="-48" width="520" height="16" rx="8" fill="url(#goldMetal)" filter="url(#glow)"/>

      <!-- Left Scale Pan: The Mystery Box 'x' -->
      <g transform="translate(-200, -40)">
        <line x1="0" y1="0" x2="-60" y2="120" stroke="url(#goldMetal)" stroke-width="3"/>
        <line x1="0" y1="0" x2="60" y2="120" stroke="url(#goldMetal)" stroke-width="3"/>
        <!-- Pan Dish -->
        <path d="M -80 120 Q 0 160 80 120 Z" fill="url(#goldMetal)"/>
        
        <!-- Glowing Mystery Box x -->
        <g transform="translate(0, 45)" filter="url(#shadowBox)">
          <rect x="-45" y="-45" width="90" height="90" rx="16" fill="#1e1035" stroke="#facc15" stroke-width="3.5"/>
          <rect x="-38" y="-38" width="76" height="76" rx="12" fill="url(#neonPurple)" opacity="0.3"/>
          <text x="0" y="16" font-family="'Nunito', sans-serif" font-weight="900" font-size="56" fill="#fde047" text-anchor="middle" filter="url(#glow)">x</text>
          <!-- Particle Sparkles -->
          <circle cx="-30" cy="-30" r="4" fill="#fef08a" filter="url(#glow)"/>
          <circle cx="32" cy="32" r="5" fill="#38bdf8" filter="url(#glow)"/>
        </g>
        <text x="0" y="185" font-family="'Nunito', sans-serif" font-weight="900" font-size="20" fill="#fde047" text-anchor="middle">Mystery Weight (x)</text>
      </g>

      <!-- Right Scale Pan: 4 Weight Cubes (x = 4) -->
      <g transform="translate(200, -40)">
        <line x1="0" y1="0" x2="-60" y2="120" stroke="url(#goldMetal)" stroke-width="3"/>
        <line x1="0" y1="0" x2="60" y2="120" stroke="url(#goldMetal)" stroke-width="3"/>
        <!-- Pan Dish -->
        <path d="M -80 120 Q 0 160 80 120 Z" fill="url(#goldMetal)"/>
        
        <!-- 4 Balanced 1-kg Cubes -->
        <g transform="translate(0, 55)" filter="url(#shadowBox)">
          <!-- Bottom 2 cubes -->
          <rect x="-42" y="10" width="38" height="38" rx="6" fill="url(#goldMetal)" stroke="#78350f" stroke-width="2"/>
          <text x="-23" y="36" font-family="sans-serif" font-weight="900" font-size="20" fill="#451a03" text-anchor="middle">1</text>
          <rect x="4" y="10" width="38" height="38" rx="6" fill="url(#goldMetal)" stroke="#78350f" stroke-width="2"/>
          <text x="23" y="36" font-family="sans-serif" font-weight="900" font-size="20" fill="#451a03" text-anchor="middle">1</text>
          <!-- Top 2 cubes -->
          <rect x="-42" y="-32" width="38" height="38" rx="6" fill="url(#goldMetal)" stroke="#78350f" stroke-width="2"/>
          <text x="-23" y="-6" font-family="sans-serif" font-weight="900" font-size="20" fill="#451a03" text-anchor="middle">1</text>
          <rect x="4" y="-32" width="38" height="38" rx="6" fill="url(#goldMetal)" stroke="#78350f" stroke-width="2"/>
          <text x="23" y="-6" font-family="sans-serif" font-weight="900" font-size="20" fill="#451a03" text-anchor="middle">1</text>
        </g>
        <text x="0" y="185" font-family="'Nunito', sans-serif" font-weight="900" font-size="20" fill="#a5f3fc" text-anchor="middle">4 kg Known Weight</text>
      </g>

      <!-- Center Balance Indicator: Perfectly Equal = -->
      <g transform="translate(0, 20)">
        <circle cx="0" cy="0" r="32" fill="#0f0524" stroke="#22c55e" stroke-width="3" filter="url(#glow)"/>
        <text x="0" y="10" font-family="sans-serif" font-weight="900" font-size="34" fill="#4ade80" text-anchor="middle">=</text>
      </g>
    </g>

    <!-- Floating Equation Card -->
    <g transform="translate(540, 240)">
      <rect x="-180" y="-32" width="360" height="64" rx="32" fill="#0f0524" fill-opacity="0.9" stroke="#38bdf8" stroke-width="2.5" filter="url(#glow)"/>
      <text x="0" y="10" font-family="'Nunito', sans-serif" font-weight="900" font-size="32" fill="#ffffff" text-anchor="middle">
        <tspan fill="#facc15">x</tspan> = <tspan fill="#38bdf8">4</tspan>  ⚖️ <tspan fill="#4ade80">BALANCED</tspan>
      </text>
    </g>

    <!-- Anime Mia (Left Forefront) -->
    ${renderMia(200, 520, 1.25, { armPose: 'presenting' })}
  </svg>`;
}

function generateSlide2() {
  return `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    ${SVG_DEFS}
    ${animeBackground("Fractions Mean Division", "Concept 2 · Slices and Hidden Division")}

    <!-- Holographic Floating Math Pizza / Fraction Pie -->
    <g transform="translate(580, 480)">
      <!-- Outer HUD Ring -->
      <circle cx="0" cy="0" r="230" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="10, 12" opacity="0.5"/>
      <circle cx="0" cy="0" r="210" fill="#0c0420" fill-opacity="0.8" stroke="url(#goldMetal)" stroke-width="4" filter="url(#shadowBox)"/>

      <!-- 3 Fraction Sectors (x/3) -->
      <!-- Sector 1: Detached slice floating upward (x/3) -->
      <g transform="translate(0, -50)" filter="url(#glow)">
        <path d="M 0 0 L 140 -100 A 180 180 0 0 0 -140 -100 Z" fill="#38bdf8" fill-opacity="0.85" stroke="#ffffff" stroke-width="3"/>
        <!-- Pepperoni / Math Dots -->
        <circle cx="0" cy="-70" r="14" fill="#f43f5e"/>
        <text x="0" y="-65" font-family="sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">x</text>
        <circle cx="-50" cy="-85" r="10" fill="#f43f5e"/>
        <circle cx="50" cy="-85" r="10" fill="#f43f5e"/>
        <!-- Label Badge -->
        <rect x="-65" y="-145" width="130" height="42" rx="21" fill="#0284c7" stroke="#ffffff" stroke-width="2"/>
        <text x="0" y="-118" font-family="'Nunito', sans-serif" font-weight="900" font-size="22" fill="#ffffff" text-anchor="middle">x / 3</text>
      </g>

      <!-- Sector 2 & 3: The remaining 2 slices (2x/3) -->
      <g transform="translate(0, 15)">
        <path d="M 0 0 L 160 -40 A 180 180 0 1 1 -160 -40 Z" fill="#d97706" fill-opacity="0.85" stroke="url(#goldMetal)" stroke-width="3"/>
        <circle cx="-60" cy="60" r="14" fill="#ef4444"/>
        <circle cx="60" cy="60" r="14" fill="#ef4444"/>
        <circle cx="0" cy="110" r="14" fill="#ef4444"/>
        <!-- Label Badge -->
        <rect x="-75" y="45" width="150" height="46" rx="23" fill="#b45309" stroke="#fde047" stroke-width="2" filter="url(#shadowBox)"/>
        <text x="0" y="76" font-family="'Nunito', sans-serif" font-weight="900" font-size="24" fill="#fef08a" text-anchor="middle">2x / 3</text>
      </g>
    </g>

    <!-- Formula Transformation Banner: Fraction Bar is Division Sign -->
    <g transform="translate(580, 200)">
      <rect x="-240" y="-45" width="480" height="90" rx="45" fill="#0f0524" fill-opacity="0.95" stroke="#facc15" stroke-width="3" filter="url(#glow)"/>
      <text x="0" y="8" font-family="'Nunito', sans-serif" font-weight="900" font-size="30" fill="#ffffff" text-anchor="middle">
        <tspan fill="#38bdf8">x / 3</tspan>  <tspan fill="#facc15">≡</tspan>  <tspan fill="#f43f5e">x ÷ 3</tspan>
      </text>
      <text x="0" y="32" font-family="'Nunito', sans-serif" font-weight="700" font-size="16" fill="#a5f3fc" text-anchor="middle">
        FRACTION BAR IS A DIVISION SIGN!
      </text>
    </g>

    <!-- Anime Mia (Left Forefront) -->
    ${renderMia(200, 520, 1.25, { armPose: 'presenting' })}
  </svg>`;
}

function generateSlide3() {
  return `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    ${SVG_DEFS}
    ${animeBackground("Undo Division with Multiplication", "Concept 3 · Inverse Operations")}

    <!-- Dynamic Action Rays & Cosmic Bursts -->
    <g transform="translate(560, 480)" opacity="0.6">
      <path d="M 0 0 L -300 -200 L -250 -300 Z" fill="#38bdf8" opacity="0.2"/>
      <path d="M 0 0 L 300 -200 L 250 -300 Z" fill="#facc15" opacity="0.2"/>
      <path d="M 0 0 L 350 100 L 250 250 Z" fill="#ec4899" opacity="0.2"/>
    </g>

    <!-- Equation Transformation Showcase: x/4 = 5 -->
    <g transform="translate(580, 360)">
      <!-- Main Equation Container -->
      <rect x="-260" y="-80" width="520" height="160" rx="30" fill="#0d0422" fill-opacity="0.95" stroke="url(#goldMetal)" stroke-width="3.5" filter="url(#shadowBox)"/>

      <!-- Equation: (x / 4) * 4 = 5 * 4 -->
      <g transform="translate(-130, 0)">
        <!-- Fraction: x / 4 -->
        <text x="0" y="-15" font-family="'Nunito', sans-serif" font-weight="900" font-size="52" fill="#facc15" text-anchor="middle">x</text>
        <line x1="-35" y1="2" x2="35" y2="2" stroke="#ffffff" stroke-width="4"/>
        <text x="0" y="48" font-family="'Nunito', sans-serif" font-weight="900" font-size="52" fill="#ef4444" text-anchor="middle">4</text>
        <!-- Red Strike Cancel Line over 4 -->
        <line x1="-25" y1="15" x2="25" y2="55" stroke="#ef4444" stroke-width="6" stroke-linecap="round" filter="url(#glow)"/>
      </g>

      <!-- Multiplier × 4 -->
      <g transform="translate(-30, 0)">
        <text x="0" y="16" font-family="'Nunito', sans-serif" font-weight="900" font-size="52" fill="#38bdf8" text-anchor="middle">×</text>
        <text x="40" y="16" font-family="'Nunito', sans-serif" font-weight="900" font-size="52" fill="#ef4444" text-anchor="middle">4</text>
        <!-- Strike cancel line over x4 -->
        <line x1="20" y1="-15" x2="60" y2="25" stroke="#ef4444" stroke-width="6" stroke-linecap="round" filter="url(#glow)"/>
      </g>

      <text x="65" y="16" font-family="'Nunito', sans-serif" font-weight="900" font-size="52" fill="#ffffff" text-anchor="middle">=</text>

      <!-- Right Side: 5 × 4 -->
      <g transform="translate(150, 0)">
        <text x="-40" y="16" font-family="'Nunito', sans-serif" font-weight="900" font-size="52" fill="#a5f3fc" text-anchor="middle">5</text>
        <text x="0" y="16" font-family="'Nunito', sans-serif" font-weight="900" font-size="44" fill="#38bdf8" text-anchor="middle">×</text>
        <text x="40" y="16" font-family="'Nunito', sans-serif" font-weight="900" font-size="52" fill="#facc15" text-anchor="middle">4</text>
      </g>
    </g>

    <!-- Arrow Leading Down to Solution -->
    <g transform="translate(580, 520)">
      <path d="M 0 -20 L 0 50 M -18 32 L 0 52 L 18 32" fill="none" stroke="#22c55e" stroke-width="8" stroke-linecap="round" filter="url(#glow)"/>
    </g>

    <!-- Grand Solved Result Box: x = 20 -->
    <g transform="translate(580, 680)">
      <rect x="-200" y="-60" width="400" height="120" rx="30" fill="#052e16" fill-opacity="0.9" stroke="#4ade80" stroke-width="4" filter="url(#glow)"/>
      <text x="0" y="18" font-family="'Nunito', sans-serif" font-weight="900" font-size="58" fill="#fde047" text-anchor="middle">
        x = <tspan fill="#4ade80">20</tspan> 🎉
      </text>
      <text x="0" y="46" font-family="'Nunito', sans-serif" font-weight="700" font-size="18" fill="#bbf7d0" text-anchor="middle">
        4s Cancel Cleanly · x is Solved!
      </text>
    </g>

    <!-- Anime Mia Casting Spell with Magic Stylus -->
    ${renderMia(200, 520, 1.25, { armPose: 'presenting' })}
  </svg>`;
}

function generateSlide4() {
  return `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    ${SVG_DEFS}
    ${animeBackground("Reciprocals: Flip to Cancel", "Concept 4 · The Magic Multiplicative Inverse")}

    <!-- 3D Swirling Reciprocal Vortex -->
    <g transform="translate(580, 480)">
      <!-- Swirling Energy Rings -->
      <ellipse cx="0" cy="0" rx="260" ry="160" fill="none" stroke="#ec4899" stroke-width="3" stroke-dasharray="14, 14" opacity="0.4" transform="rotate(-25)"/>
      <ellipse cx="0" cy="0" rx="220" ry="130" fill="none" stroke="#38bdf8" stroke-width="3.5" stroke-dasharray="18, 12" opacity="0.6" transform="rotate(20)"/>

      <!-- Left Card: Original Fraction 3/5 -->
      <g transform="translate(-160, -40)" filter="url(#shadowBox)">
        <rect x="-70" y="-90" width="140" height="180" rx="20" fill="#1e1145" stroke="#f43f5e" stroke-width="4"/>
        <text x="0" y="-20" font-family="'Nunito', sans-serif" font-weight="900" font-size="56" fill="#facc15" text-anchor="middle">3</text>
        <line x1="-40" y1="2" x2="40" y2="2" stroke="#ffffff" stroke-width="5"/>
        <text x="0" y="58" font-family="'Nunito', sans-serif" font-weight="900" font-size="56" fill="#38bdf8" text-anchor="middle">5</text>
        <text x="0" y="125" font-family="'Nunito', sans-serif" font-weight="800" font-size="18" fill="#fda4af" text-anchor="middle">Fraction</text>
      </g>

      <!-- Center Flipping Icon / 3D Flip Arrow -->
      <g transform="translate(0, -40)">
        <circle cx="0" cy="0" r="42" fill="#0f0524" stroke="url(#goldMetal)" stroke-width="3" filter="url(#glow)"/>
        <text x="0" y="14" font-family="sans-serif" font-weight="900" font-size="36" fill="#facc15" text-anchor="middle">🔄</text>
        <text x="0" y="65" font-family="'Nunito', sans-serif" font-weight="900" font-size="18" fill="#fde047" text-anchor="middle">FLIP!</text>
      </g>

      <!-- Right Card: Flipped Reciprocal 5/3 -->
      <g transform="translate(160, -40)" filter="url(#shadowBox)">
        <rect x="-70" y="-90" width="140" height="180" rx="20" fill="#064e3b" stroke="#34d399" stroke-width="4" filter="url(#glow)"/>
        <text x="0" y="-20" font-family="'Nunito', sans-serif" font-weight="900" font-size="56" fill="#38bdf8" text-anchor="middle">5</text>
        <line x1="-40" y1="2" x2="40" y2="2" stroke="#ffffff" stroke-width="5"/>
        <text x="0" y="58" font-family="'Nunito', sans-serif" font-weight="900" font-size="56" fill="#facc15" text-anchor="middle">3</text>
        <text x="0" y="125" font-family="'Nunito', sans-serif" font-weight="800" font-size="18" fill="#6ee7b7" text-anchor="middle">Reciprocal</text>
      </g>

      <!-- Golden Law Equation Below: (3/5) * (5/3) = 1 -->
      <g transform="translate(0, 190)">
        <rect x="-240" y="-40" width="480" height="80" rx="24" fill="#0f0524" fill-opacity="0.95" stroke="url(#goldMetal)" stroke-width="3" filter="url(#glow)"/>
        <text x="0" y="12" font-family="'Nunito', sans-serif" font-weight="900" font-size="32" fill="#ffffff" text-anchor="middle">
          ({3|5}) × ({5|3}) = <tspan fill="#fde047" font-size="40">1</tspan>  ✨ <tspan fill="#4ade80">x is Free!</tspan>
        </text>
      </g>
    </g>

    <!-- Anime Mia Celebrating the Flip -->
    ${renderMia(200, 520, 1.25, { armPose: 'presenting' })}
  </svg>`;
}

function generateSlide5() {
  return `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    ${SVG_DEFS}
    ${animeBackground("Clear Fractions with the LCD", "Concept 5 · Lowest Common Denominator Magic")}

    <!-- Magical Alchemy Equation Chamber -->
    <g transform="translate(580, 480)">
      <!-- Wand Beam Zapping Denominators -->
      <path d="M -180 180 Q -50 0 0 -80" fill="none" stroke="#facc15" stroke-width="8" filter="url(#glow)"/>
      <circle cx="0" cy="-80" r="18" fill="#ffffff" filter="url(#softGlow)"/>

      <!-- Magic LCD Wand floating in hand -->
      <g transform="translate(-180, 180) rotate(-45)">
        <rect x="-8" y="-120" width="16" height="180" rx="8" fill="url(#goldMetal)"/>
        <!-- Star Tip -->
        <polygon points="0,-160 12,-130 42,-130 18,-110 28,-80 0,-100 -28,-80 -18,-110 -42,-130 -12,-130" fill="#fde047" filter="url(#glow)"/>
        <text x="0" y="-120" font-family="sans-serif" font-weight="900" font-size="16" fill="#78350f" text-anchor="middle">6</text>
      </g>

      <!-- Floating Glass Flasks with Fractions: x/2 + x/3 = 10 -->
      <g transform="translate(0, -90)">
        <!-- Equation Box -->
        <rect x="-240" y="-70" width="480" height="140" rx="28" fill="#0f0524" fill-opacity="0.95" stroke="#a855f7" stroke-width="3.5" filter="url(#shadowBox)"/>
        
        <!-- Flask 1: x / 2 -->
        <g transform="translate(-140, 0)">
          <text x="0" y="-10" font-family="'Nunito', sans-serif" font-weight="900" font-size="44" fill="#fde047" text-anchor="middle">x</text>
          <line x1="-25" y1="4" x2="25" y2="4" stroke="#ffffff" stroke-width="3"/>
          <text x="0" y="42" font-family="'Nunito', sans-serif" font-weight="900" font-size="44" fill="#38bdf8" text-anchor="middle">2</text>
        </g>
        <text x="-70" y="14" font-family="'Nunito', sans-serif" font-weight="900" font-size="44" fill="#ec4899" text-anchor="middle">+</text>

        <!-- Flask 2: x / 3 -->
        <g transform="translate(0, 0)">
          <text x="0" y="-10" font-family="'Nunito', sans-serif" font-weight="900" font-size="44" fill="#fde047" text-anchor="middle">x</text>
          <line x1="-25" y1="4" x2="25" y2="4" stroke="#ffffff" stroke-width="3"/>
          <text x="0" y="42" font-family="'Nunito', sans-serif" font-weight="900" font-size="44" fill="#38bdf8" text-anchor="middle">3</text>
        </g>
        <text x="70" y="14" font-family="'Nunito', sans-serif" font-weight="900" font-size="44" fill="#ec4899" text-anchor="middle">=</text>

        <text x="140" y="14" font-family="'Nunito', sans-serif" font-weight="900" font-size="44" fill="#a5f3fc" text-anchor="middle">10</text>
      </g>

      <!-- Multiplied by LCD = 6 Banner -->
      <g transform="translate(0, 60)">
        <rect x="-180" y="-28" width="360" height="56" rx="28" fill="#701a75" stroke="#f472b6" stroke-width="2.5" filter="url(#glow)"/>
        <text x="0" y="10" font-family="'Nunito', sans-serif" font-weight="900" font-size="24" fill="#fdf2f8" text-anchor="middle">
          ✨ Multiply by LCD = 6 ✨
        </text>
      </g>

      <!-- Transformed Equation (Fractions Cleared!) -->
      <g transform="translate(0, 160)">
        <rect x="-240" y="-45" width="480" height="90" rx="25" fill="#052e16" stroke="#4ade80" stroke-width="3.5" filter="url(#glow)"/>
        <text x="0" y="14" font-family="'Nunito', sans-serif" font-weight="900" font-size="38" fill="#fde047" text-anchor="middle">
          3x + 2x = 60  →  <tspan fill="#4ade80">x = 12</tspan>
        </text>
      </g>
    </g>

    <!-- Anime Mia (Holding wand forward) -->
    ${renderMia(200, 520, 1.25, { armPose: 'holding' })}
  </svg>`;
}

function generateSlide6() {
  return `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    ${SVG_DEFS}
    ${animeBackground("Two Steps: Peel the Layers", "Concept 6 · Reverse Order and Unwrapping")}

    <!-- Concentric Layered Gift Box Unwrapping Concept -->
    <g transform="translate(580, 500)">
      <!-- Outer Gift Aura (Layer 1: +3) -->
      <circle cx="0" cy="0" r="220" fill="none" stroke="#f43f5e" stroke-width="4" stroke-dasharray="14, 10" opacity="0.6"/>
      <!-- Peeling Tag 1: Subtract 3 first -->
      <g transform="translate(170, -140)" filter="url(#glow)">
        <rect x="-65" y="-25" width="130" height="50" rx="25" fill="#e11d48" stroke="#ffffff" stroke-width="2"/>
        <text x="0" y="9" font-family="'Nunito', sans-serif" font-weight="900" font-size="24" fill="#ffffff" text-anchor="middle">Step 1: −3</text>
      </g>

      <!-- Middle Gift Aura (Layer 2: /2) -->
      <circle cx="0" cy="0" r="160" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="10, 8" opacity="0.8"/>
      <!-- Peeling Tag 2: Multiply by 2 -->
      <g transform="translate(-170, 130)" filter="url(#glow)">
        <rect x="-65" y="-25" width="130" height="50" rx="25" fill="#0284c7" stroke="#ffffff" stroke-width="2"/>
        <text x="0" y="9" font-family="'Nunito', sans-serif" font-weight="900" font-size="24" fill="#ffffff" text-anchor="middle">Step 2: ×2</text>
      </g>

      <!-- Center Ornate Mystery Chest Displaying Final Answer -->
      <g transform="translate(0, 10)" filter="url(#shadowBox)">
        <!-- Chest Base -->
        <rect x="-100" y="-60" width="200" height="130" rx="24" fill="#1e1035" stroke="url(#goldMetal)" stroke-width="5"/>
        <path d="M -95 -60 Q 0 -110 95 -60 Z" fill="url(#goldMetal)" stroke="#78350f" stroke-width="3"/>
        <rect x="-24" y="-35" width="48" height="60" rx="10" fill="#facc15" stroke="#78350f" stroke-width="2"/>
        <circle cx="0" cy="-5" r="7" fill="#0f0524"/>

        <!-- Gold Starburst Eruption: x = 16 kg -->
        <text x="0" y="50" font-family="'Nunito', sans-serif" font-weight="900" font-size="34" fill="#fde047" text-anchor="middle" filter="url(#glow)">
          x = 16 kg!
        </text>
      </g>
    </g>

    <!-- Two-Step Path Banner -->
    <g transform="translate(580, 200)">
      <rect x="-250" y="-40" width="500" height="80" rx="24" fill="#0f0524" fill-opacity="0.95" stroke="#facc15" stroke-width="3" filter="url(#glow)"/>
      <text x="0" y="10" font-family="'Nunito', sans-serif" font-weight="900" font-size="26" fill="#ffffff" text-anchor="middle">
        {x|2} + 3 = 11  →  {x|2} = 8  →  <tspan fill="#4ade80">x = 16</tspan>
      </text>
    </g>

    <!-- Anime Mia Presenting the Unwrapped Solution -->
    ${renderMia(200, 520, 1.25, { armPose: 'presenting' })}
  </svg>`;
}

function generateSlide7() {
  return `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    ${SVG_DEFS}
    ${animeBackground("Fractions on Both Sides", "Concept 7 · Collect x Terms and Balance Both Sides")}

    <!-- The Both-Sides Bridge Concept -->
    <g transform="translate(580, 480)">
      <!-- Floating Energy Arch Bridge -->
      <path d="M -240 100 Q 0 -60 240 100" fill="none" stroke="#38bdf8" stroke-width="12" stroke-linecap="round" opacity="0.6" filter="url(#glow)"/>
      <line x1="-240" y1="100" x2="240" y2="100" stroke="url(#goldMetal)" stroke-width="6"/>

      <!-- Left Bridge Station: 2x + 24 -->
      <g transform="translate(-160, 40)" filter="url(#shadowBox)">
        <rect x="-85" y="-55" width="170" height="110" rx="20" fill="#1e1035" stroke="#f43f5e" stroke-width="3.5"/>
        <text x="0" y="5" font-family="'Nunito', sans-serif" font-weight="900" font-size="32" fill="#fda4af" text-anchor="middle">2x + 24</text>
        <text x="0" y="35" font-family="'Nunito', sans-serif" font-weight="700" font-size="16" fill="#facc15" text-anchor="middle">Left Side</text>
      </g>

      <!-- Connecting Moving Energy Orb (Gathering x) -->
      <g transform="translate(0, -10)" filter="url(#glow)">
        <circle cx="0" cy="0" r="34" fill="#0f0524" stroke="#facc15" stroke-width="3"/>
        <text x="0" y="10" font-family="sans-serif" font-weight="900" font-size="26" fill="#fde047" text-anchor="middle">⇄</text>
      </g>

      <!-- Right Bridge Station: 3x - 6 -->
      <g transform="translate(160, 40)" filter="url(#shadowBox)">
        <rect x="-85" y="-55" width="170" height="110" rx="20" fill="#1e1035" stroke="#38bdf8" stroke-width="3.5"/>
        <text x="0" y="5" font-family="'Nunito', sans-serif" font-weight="900" font-size="32" fill="#7dd3fc" text-anchor="middle">3x − 6</text>
        <text x="0" y="35" font-family="'Nunito', sans-serif" font-weight="700" font-size="16" fill="#facc15" text-anchor="middle">Right Side</text>
      </g>

      <!-- Bottom Verified Balance Banner: x = 30, both sides = 14 -->
      <g transform="translate(0, 180)">
        <rect x="-240" y="-40" width="480" height="80" rx="24" fill="#052e16" stroke="#22c55e" stroke-width="3.5" filter="url(#glow)"/>
        <text x="0" y="12" font-family="'Nunito', sans-serif" font-weight="900" font-size="32" fill="#ffffff" text-anchor="middle">
          ✓ <tspan fill="#facc15">x = 30</tspan>  (Both sides = 14)
        </text>
      </g>
    </g>

    <!-- Top LCD Clearing Step Banner -->
    <g transform="translate(580, 200)">
      <rect x="-240" y="-35" width="480" height="70" rx="35" fill="#0f0524" fill-opacity="0.95" stroke="url(#goldMetal)" stroke-width="2.5"/>
      <text x="0" y="9" font-family="'Nunito', sans-serif" font-weight="900" font-size="24" fill="#a5f3fc" text-anchor="middle">
        Clear with LCD 6  →  2x + 24 = 3x − 6
      </text>
    </g>

    <!-- Anime Mia Guiding the Balance -->
    ${renderMia(200, 520, 1.25, { armPose: 'presenting' })}
  </svg>`;
}

function generateSlide8() {
  return `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    ${SVG_DEFS}
    ${animeBackground("Step Into the Equation Lab!", "Interactive Exploration · Master All 10 Worlds")}

    <!-- Futuristic Lab Portal Gateway -->
    <g transform="translate(512, 450)">
      <!-- Giant Neon Hexagonal Archway -->
      <polygon points="0,-260 260,-130 260,160 0,280 -260,160 -260,-130" fill="#0d0422" fill-opacity="0.8" stroke="url(#neonPurple)" stroke-width="8" filter="url(#shadowBox)"/>
      <polygon points="0,-230 230,-115 230,140 0,250 -230,140 -230,-115" fill="none" stroke="url(#goldMetal)" stroke-width="3" stroke-dasharray="16, 12"/>

      <!-- Interior Glowing Simulation Pods -->
      <g transform="translate(0, 0)">
        <!-- Station 1: Balance Scale -->
        <g transform="translate(-110, -30)">
          <circle cx="0" cy="0" r="42" fill="#1e1035" stroke="#facc15" stroke-width="2.5"/>
          <text x="0" y="10" font-size="34" text-anchor="middle">⚖️</text>
          <text x="0" y="58" font-family="'Nunito', sans-serif" font-weight="800" font-size="14" fill="#fde047" text-anchor="middle">Balance</text>
        </g>
        <!-- Station 2: LCD Crusher -->
        <g transform="translate(0, -90)">
          <circle cx="0" cy="0" r="48" fill="#1e1035" stroke="#38bdf8" stroke-width="3" filter="url(#glow)"/>
          <text x="0" y="12" font-size="38" text-anchor="middle">💥</text>
          <text x="0" y="66" font-family="'Nunito', sans-serif" font-weight="900" font-size="16" fill="#a5f3fc" text-anchor="middle">LCD Crusher</text>
        </g>
        <!-- Station 3: Mistake Detector -->
        <g transform="translate(110, -30)">
          <circle cx="0" cy="0" r="42" fill="#1e1035" stroke="#ec4899" stroke-width="2.5"/>
          <text x="0" y="10" font-size="34" text-anchor="middle">🔍</text>
          <text x="0" y="58" font-family="'Nunito', sans-serif" font-weight="800" font-size="14" fill="#fda4af" text-anchor="middle">Detector</text>
        </g>
      </g>

      <!-- Grand "ENTER LAB" Gateway Button / Sign -->
      <g transform="translate(0, 160)" filter="url(#glow)">
        <rect x="-170" y="-35" width="340" height="70" rx="35" fill="url(#goldMetal)" stroke="#ffffff" stroke-width="3"/>
        <text x="0" y="10" font-family="'Nunito', sans-serif" font-weight="900" font-size="28" fill="#451a03" text-anchor="middle" letter-spacing="1.5">
          ENTER LAB 🧪
        </text>
      </g>
    </g>

    <!-- Anime Mia & Leo Duo Celebration in Foreground -->
    ${renderMia(250, 540, 1.15, { armPose: 'waving' })}
    ${renderLeo(780, 560, 1.15)}
  </svg>`;
}

// -------------------------------------------------------------
// RENDER & SAVE ALL 8 SLIDES
// -------------------------------------------------------------

const SLIDE_GENERATORS = [
  { id: 1, fn: generateSlide1, title: 'Slide 1: Balance Scale' },
  { id: 2, fn: generateSlide2, title: 'Slide 2: Fractions Mean Division' },
  { id: 3, fn: generateSlide3, title: 'Slide 3: Undo Division with Multiplication' },
  { id: 4, fn: generateSlide4, title: 'Slide 4: Reciprocals Flip to Cancel' },
  { id: 5, fn: generateSlide5, title: 'Slide 5: Clear with LCD' },
  { id: 6, fn: generateSlide6, title: 'Slide 6: Two Steps Peel Layers' },
  { id: 7, fn: generateSlide7, title: 'Slide 7: Both Sides Bridge' },
  { id: 8, fn: generateSlide8, title: 'Slide 8: Equation Lab Gateway' }
];

async function main() {
  console.log('🎨 Generating High-Quality Anime Style Story Slides for Grade 8 Fractions...');
  
  for (const s of SLIDE_GENERATORS) {
    const svgCode = s.fn();
    const svgPath = path.join(OUT_DIR, `slide${s.id}.svg`);
    const pngPath = path.join(OUT_DIR, `slide${s.id}.png`);

    // Write SVG
    fs.writeFileSync(svgPath, svgCode, 'utf8');

    // Render to High-Resolution 1024x1024 PNG
    const resvg = new Resvg(svgCode, {
      fitTo: { mode: 'width', value: 1024 }
    });
    const pngBuffer = resvg.render().asPng();
    fs.writeFileSync(pngPath, pngBuffer);

    const sizeKb = (fs.statSync(pngPath).size / 1024).toFixed(1);
    console.log(`✅ Generated ${s.title} -> slide${s.id}.png (${sizeKb} KB) & slide${s.id}.svg`);
  }

  console.log('🎉 All 8 anime story slides generated successfully!');
}

main().catch(err => {
  console.error('❌ Error generating anime slides:', err);
  process.exit(1);
});

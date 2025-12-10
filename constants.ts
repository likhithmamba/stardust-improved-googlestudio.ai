
import { NoteType, PlanetTheme, TemplateConfig } from './types';

// Sizes are significantly increased for better readability and interaction.
// All diameters have been scaled up to make notes more functional for content.
export const NOTE_STYLES: Record<NoteType, { size: { diameter: number }; colors: string; glow: string; hasRings?: boolean; hasTail?: boolean; }> = {
  // Cosmic Structures
  [NoteType.Galaxy]:     { size: { diameter: 1200 }, colors: 'bg-transparent border-2 border-indigo-400/30', glow: 'shadow-[0_0_120px_20px_rgba(129,140,248,0.3)]' },
  [NoteType.Nebula]:     { size: { diameter: 1600 }, colors: '', glow: '' },
  [NoteType.BlackHole]:  { size: { diameter: 300 }, colors: 'bg-black border-2 border-purple-900', glow: 'shadow-[0_0_60px_30px_rgba(147,51,234,0.4)]' },
  
  // Stars
  [NoteType.Sun]:        { size: { diameter: 800 }, colors: 'bg-gradient-radial from-yellow-200 via-orange-500 to-red-600 border-amber-200',       glow: 'shadow-[0_0_150px_40px_rgba(252,211,77,0.7)]' },
  [NoteType.RedGiant]:   { size: { diameter: 750 }, colors: 'bg-gradient-radial from-red-400 via-rose-700 to-red-900 border-red-300',                glow: 'shadow-[0_0_130px_35px_rgba(239,68,68,0.6)]' },
  [NoteType.WhiteDwarf]: { size: { diameter: 150 }, colors: 'bg-gradient-radial from-white via-sky-200 to-blue-400 border-white',                   glow: 'shadow-[0_0_80px_20px_rgba(255,255,255,1)]' },
  [NoteType.Pulsar]:     { size: { diameter: 120 }, colors: 'bg-gradient-radial from-white to-blue-300 border-sky-200',                           glow: 'shadow-[0_0_60px_15px_rgba(191,219,254,1)]' },

  // Gas Giants
  [NoteType.Jupiter]:    { size: { diameter: 700 }, colors: 'bg-gradient-radial from-orange-200 via-amber-500 to-stone-400 border-orange-400',       glow: 'shadow-[0_0_100px_25px_rgba(217,119,6,0.5)]' },
  [NoteType.Saturn]:     { size: { diameter: 600 }, colors: 'bg-gradient-radial from-yellow-100 via-amber-200 to-orange-300 border-amber-300',  glow: 'shadow-[0_0_80px_20px_rgba(245,158,11,0.5)]', hasRings: true },

  // Ice Giants
  [NoteType.Neptune]:    { size: { diameter: 480 }, colors: 'bg-gradient-radial from-blue-400 to-indigo-800 border-blue-200',                    glow: 'shadow-[0_0_70px_15px_rgba(99,102,241,0.5)]' },
  [NoteType.Uranus]:     { size: { diameter: 470 }, colors: 'bg-gradient-radial from-cyan-100 to-teal-500 border-cyan-100',                      glow: 'shadow-[0_0_65px_13px_rgba(20,184,166,0.5)]' },

  // Terrestrial Planets
  [NoteType.Earth]:      { size: { diameter: 400 }, colors: 'bg-gradient-radial from-sky-300 via-emerald-500 to-blue-700 border-sky-300',           glow: 'shadow-[0_0_60px_12px_rgba(56,189,248,0.6)]' },
  [NoteType.Venus]:      { size: { diameter: 390 }, colors: 'bg-gradient-radial from-yellow-50 via-orange-100 to-amber-300 border-yellow-200', glow: 'shadow-[0_0_55px_11px_rgba(234,179,8,0.5)]' },
  [NoteType.Mars]:       { size: { diameter: 340 }, colors: 'bg-gradient-radial from-orange-400 via-red-600 to-rose-900 border-red-300',           glow: 'shadow-[0_0_50px_10px_rgba(239,68,68,0.6)]' },
  [NoteType.Mercury]:    { size: { diameter: 300 }, colors: 'bg-gradient-radial from-slate-300 via-gray-500 to-slate-800 border-gray-300',       glow: 'shadow-[0_0_45px_9px_rgba(156,163,175,0.5)]' },
  [NoteType.Planet]:     { size: { diameter: 380 }, colors: 'bg-gradient-radial from-indigo-300 via-purple-500 to-indigo-900 border-indigo-300',     glow: 'shadow-[0_0_50px_10px_rgba(99,102,241,0.6)]' },

  // Dwarf Planets
  [NoteType.Pluto]:      { size: { diameter: 260 }, colors: 'bg-gradient-radial from-slate-100 via-sky-200 to-slate-400 border-sky-100',         glow: 'shadow-[0_0_30px_6px_rgba(164,206,238,0.5)]' },
  [NoteType.Ceres]:      { size: { diameter: 230 }, colors: 'bg-gradient-radial from-stone-400 via-stone-600 to-stone-800 border-stone-300',        glow: 'shadow-[0_0_25px_5px_rgba(120,113,108,0.5)]' },
  
  // Other
  [NoteType.Moon]:       { size: { diameter: 220 }, colors: 'bg-gradient-radial from-slate-200 to-slate-500 border-slate-200',                    glow: 'shadow-[0_0_35px_7px_rgba(100,116,139,0.5)]' },
  [NoteType.Asteroid]:   { size: { diameter: 180 }, colors: 'bg-gradient-radial from-stone-500 via-stone-700 to-stone-900 border-stone-400',        glow: 'shadow-[0_0_15px_3px_rgba(120,113,108,0.5)]' },
  [NoteType.Comet]:      { size: { diameter: 180 }, colors: 'bg-gradient-radial from-cyan-200 to-blue-400 border-cyan-100',                        glow: 'shadow-[0_0_35px_7px_rgba(34,211,238,0.5)]', hasTail: true },
};

export const PLANET_THEME_STYLES: Record<PlanetTheme, { colors: string; glow: string }> = {
    default: { colors: '', glow: '' },
    calm: {
        colors: 'bg-gradient-radial from-sky-100 via-blue-100 to-slate-200 border-slate-200',
        glow: 'shadow-[0_0_40px_10px_rgba(186,230,253,0.5)]'
    },
    energetic: {
        colors: 'bg-gradient-radial from-yellow-300 via-orange-400 to-red-500 border-yellow-200',
        glow: 'shadow-[0_0_50px_15px_rgba(253,224,71,0.6)]'
    },
    noir: {
        colors: 'bg-gradient-radial from-gray-700 via-gray-900 to-black border-gray-600',
        glow: 'shadow-[0_0_30px_5px_rgba(255,255,255,0.1)]'
    },
    pastel: {
        colors: 'bg-gradient-radial from-pink-200 via-purple-200 to-indigo-200 border-pink-100',
        glow: 'shadow-[0_0_40px_10px_rgba(244,114,182,0.4)]'
    }
};

export const CELESTIAL_DESCRIPTIONS: Record<NoteType, string> = {
  // Cosmic Structures
  [NoteType.Galaxy]: "A vast system of stars, stellar remnants, interstellar gas, dust, and dark matter bound together by gravity.",
  [NoteType.Nebula]: "A diffuse cloud of interstellar dust and gas. Drag other celestial bodies into a nebula to form a gravitationally-bound cluster.",
  [NoteType.BlackHole]: "A region of spacetime where gravity is so strong that nothing can escape. It absorbs nearby celestial bodies.",

  // Stars
  [NoteType.Sun]: "The star at the center of our solar system, providing light and heat.",
  [NoteType.RedGiant]: "A luminous giant star of low or intermediate mass in a late phase of stellar evolution.",
  [NoteType.WhiteDwarf]: "The hot, dense remnant of a star's core after it has exhausted its nuclear fuel.",
  [NoteType.Pulsar]: "A highly magnetized rotating neutron star that emits beams of electromagnetic radiation.",
  
  // Gas Giants
  [NoteType.Jupiter]: "The largest planet in our solar system, a gas giant more than twice as massive as all other planets combined.",
  [NoteType.Saturn]: "Famous for its stunning ring system, Saturn is a gas giant with a pale yellow hue.",

  // Ice Giants
  [NoteType.Neptune]: "The most distant major planet from the Sun, a dark, cold, and windy ice giant.",
  [NoteType.Uranus]: "An ice giant with a unique tilt, causing it to orbit the Sun on its side.",
  
  // Terrestrial Planets
  [NoteType.Earth]: "Our home planet, the only place known in the universe where life has originated.",
  [NoteType.Venus]: "Earth's 'sister planet' due to their similar size, but with a thick, toxic atmosphere.",
  [NoteType.Mars]: "The 'Red Planet,' known for its dusty, cold, desert world with a very thin atmosphere.",
  [NoteType.Mercury]: "The smallest planet in our solar system and nearest to the Sun.",
  [NoteType.Planet]: "A generic terrestrial world, ready to support life or hold your next big idea.",

  // Dwarf Planets
  [NoteType.Pluto]: "An icy dwarf planet in the Kuiper Belt, a ring of bodies beyond the orbit of Neptune.",
  [NoteType.Ceres]: "The largest object in the asteroid belt between Mars and Jupiter, and the only dwarf planet located in the inner solar system.",

  // Other
  [NoteType.Moon]: "A natural satellite orbiting a planet. Earth's Moon stabilizes our planet's wobble.",
  [NoteType.Asteroid]: "A small, rocky object orbiting the Sun. Most are found in the asteroid belt.",
  [NoteType.Comet]: "A cosmic snowball of frozen gases, rock, and dust that orbits the Sun, often leaving a trail of debris.",
};

export const QUICK_TEMPLATES: TemplateConfig[] = [
    {
        name: 'Strategic Roadmap',
        type: NoteType.Galaxy,
        theme: 'noir',
        icon: 'map',
        content: `
            <div style="font-family:'Inter', sans-serif; display:flex; flex-direction:column; height:100%; justify-content:center;">
                <h1 style="text-align:center; font-weight:300; letter-spacing:4px; margin-bottom:40px; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:10px;">QUARTERLY ROADMAP</h1>
                <div style="display:flex; justify-content:space-around; align-items:flex-start; gap:20px;">
                    <div style="flex:1; background:rgba(255,255,255,0.03); border-top: 4px solid #93c5fd; padding:20px; border-radius:10px;">
                        <h3 style="color:#93c5fd; font-size:1.5rem; margin-bottom:15px;">Q1: FOUNDATION</h3>
                        <ul style="list-style:none; padding:0; font-size:1.1rem; opacity:0.8;">
                            <li style="margin-bottom:10px; display:flex; align-items:center;">⬢ Core Architecture</li>
                            <li style="margin-bottom:10px; display:flex; align-items:center;">⬢ Design System</li>
                            <li style="margin-bottom:10px; display:flex; align-items:center;">⬢ MVP Scope</li>
                        </ul>
                    </div>
                    <div style="flex:1; background:rgba(255,255,255,0.03); border-top: 4px solid #c084fc; padding:20px; border-radius:10px;">
                        <h3 style="color:#c084fc; font-size:1.5rem; margin-bottom:15px;">Q2: EXPANSION</h3>
                        <ul style="list-style:none; padding:0; font-size:1.1rem; opacity:0.8;">
                            <li style="margin-bottom:10px;">⬢ User Auth</li>
                            <li style="margin-bottom:10px;">⬢ API Integration</li>
                            <li style="margin-bottom:10px;">⬢ Beta Launch</li>
                        </ul>
                    </div>
                    <div style="flex:1; background:rgba(255,255,255,0.03); border-top: 4px solid #f472b6; padding:20px; border-radius:10px;">
                        <h3 style="color:#f472b6; font-size:1.5rem; margin-bottom:15px;">Q3: SCALE</h3>
                        <ul style="list-style:none; padding:0; font-size:1.1rem; opacity:0.8;">
                            <li style="margin-bottom:10px;">⬢ Performance Tuning</li>
                            <li style="margin-bottom:10px;">⬢ Mobile App</li>
                            <li style="margin-bottom:10px;">⬢ Monetization</li>
                        </ul>
                    </div>
                    <div style="flex:1; background:rgba(255,255,255,0.03); border-top: 4px solid #fb923c; padding:20px; border-radius:10px;">
                        <h3 style="color:#fb923c; font-size:1.5rem; margin-bottom:15px;">Q4: DOMINANCE</h3>
                        <ul style="list-style:none; padding:0; font-size:1.1rem; opacity:0.8;">
                            <li style="margin-bottom:10px;">⬢ Global Rollout</li>
                            <li style="margin-bottom:10px;">⬢ Enterprise Features</li>
                            <li style="margin-bottom:10px;">⬢ AI Agents</li>
                        </ul>
                    </div>
                </div>
            </div>
        `,
        tags: ['roadmap', 'strategy', 'planning']
    },
    {
        name: 'Lean Canvas',
        type: NoteType.Nebula,
        theme: 'default',
        icon: 'layers',
        content: `
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; grid-template-rows: 2fr 1fr; gap:10px; height:100%; font-family:sans-serif; padding:40px;">
                <div style="grid-row:span 2; border:1px solid rgba(255,255,255,0.2); padding:15px; border-radius:8px;">
                    <strong style="color:#f87171; display:block; margin-bottom:10px; font-size:1.2rem;">PROBLEM</strong>
                    <p style="font-size:0.9rem; opacity:0.7;">Top 3 problems...</p>
                </div>
                <div style="border:1px solid rgba(255,255,255,0.2); padding:15px; border-radius:8px;">
                    <strong style="color:#fb923c; display:block; margin-bottom:10px; font-size:1.2rem;">SOLUTION</strong>
                    <p style="font-size:0.9rem; opacity:0.7;">Top 3 features...</p>
                </div>
                <div style="grid-row:span 2; border:1px solid rgba(255,255,255,0.2); padding:15px; border-radius:8px; background:rgba(255,255,255,0.05);">
                    <strong style="color:#facc15; display:block; margin-bottom:10px; font-size:1.2rem;">VALUE PROP</strong>
                    <p style="font-size:0.9rem; opacity:0.7;">Single, clear, compelling message...</p>
                </div>
                <div style="border:1px solid rgba(255,255,255,0.2); padding:15px; border-radius:8px;">
                    <strong style="color:#a3e635; display:block; margin-bottom:10px; font-size:1.2rem;">UNFAIR ADVANTAGE</strong>
                    <p style="font-size:0.9rem; opacity:0.7;">Can't be easily copied...</p>
                </div>
                <div style="grid-row:span 2; border:1px solid rgba(255,255,255,0.2); padding:15px; border-radius:8px;">
                    <strong style="color:#60a5fa; display:block; margin-bottom:10px; font-size:1.2rem;">CUSTOMER SEGMENTS</strong>
                    <p style="font-size:0.9rem; opacity:0.7;">Target customers...</p>
                </div>
                <div style="border:1px solid rgba(255,255,255,0.2); padding:15px; border-radius:8px;">
                    <strong style="color:#fb923c; display:block; margin-bottom:10px; font-size:1.2rem;">KEY METRICS</strong>
                    <p style="font-size:0.9rem; opacity:0.7;">Key activities to measure...</p>
                </div>
                <div style="border:1px solid rgba(255,255,255,0.2); padding:15px; border-radius:8px;">
                    <strong style="color:#a3e635; display:block; margin-bottom:10px; font-size:1.2rem;">CHANNELS</strong>
                    <p style="font-size:0.9rem; opacity:0.7;">Path to customers...</p>
                </div>
                <div style="grid-column: span 2; border:1px solid rgba(255,255,255,0.2); padding:15px; border-radius:8px;">
                    <strong style="color:#e879f9; display:block; margin-bottom:10px; font-size:1.2rem;">COST STRUCTURE</strong>
                </div>
                 <div style="grid-column: span 3; border:1px solid rgba(255,255,255,0.2); padding:15px; border-radius:8px;">
                    <strong style="color:#2dd4bf; display:block; margin-bottom:10px; font-size:1.2rem;">REVENUE STREAMS</strong>
                </div>
            </div>
        `,
        tags: ['business', 'model', 'startup']
    },
    {
        name: 'Sprint Retro',
        type: NoteType.Saturn,
        theme: 'energetic',
        icon: 'refresh-cw',
        content: `
            <h2 style="text-align:center; font-weight:bold; letter-spacing:2px; margin-bottom:20px;">SPRINT RETROSPECTIVE</h2>
            <div style="display:flex; gap:20px; height:70%;">
                <div style="flex:1; background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.3); border-radius:12px; padding:15px;">
                    <h3 style="color:#4ade80; text-align:center; border-bottom:1px solid rgba(34,197,94,0.3); padding-bottom:10px; margin-bottom:10px;">START</h3>
                    <ul style="padding-left:20px; font-size:0.9rem;"><li>New initiative...</li></ul>
                </div>
                <div style="flex:1; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:12px; padding:15px;">
                    <h3 style="color:#f87171; text-align:center; border-bottom:1px solid rgba(239,68,68,0.3); padding-bottom:10px; margin-bottom:10px;">STOP</h3>
                     <ul style="padding-left:20px; font-size:0.9rem;"><li>Inefficient process...</li></ul>
                </div>
                <div style="flex:1; background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.3); border-radius:12px; padding:15px;">
                    <h3 style="color:#60a5fa; text-align:center; border-bottom:1px solid rgba(59,130,246,0.3); padding-bottom:10px; margin-bottom:10px;">CONTINUE</h3>
                     <ul style="padding-left:20px; font-size:0.9rem;"><li>Good habit...</li></ul>
                </div>
            </div>
        `,
        tags: ['agile', 'scrum', 'retro']
    },
    {
        name: 'User Persona',
        type: NoteType.Venus,
        theme: 'pastel',
        icon: 'user-circle',
        content: `
            <div style="display:flex; gap:20px; align-items:center; height:100%;">
                <div style="width:120px; height:120px; border-radius:50%; background:linear-gradient(135deg, #fbcfe8, #f472b6); display:flex; align-items:center; justify-content:center; font-size:3rem; font-weight:bold; color:#831843; box-shadow:0 0 20px rgba(244,114,182,0.4);">
                    UP
                </div>
                <div style="flex:1;">
                    <h2 style="margin:0; font-size:2rem; color:#fbcfe8;">ALEX THE ARCHITECT</h2>
                    <p style="opacity:0.7; font-style:italic;">"I want tools that don't get in my way."</p>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-top:20px;">
                        <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px;">
                            <strong style="color:#f472b6; font-size:0.8rem;">GOALS</strong>
                            <ul style="padding-left:15px; margin:5px 0 0 0; font-size:0.8rem;">
                                <li>Efficiency</li>
                                <li>Visualization</li>
                            </ul>
                        </div>
                        <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px;">
                            <strong style="color:#f472b6; font-size:0.8rem;">FRUSTRATIONS</strong>
                             <ul style="padding-left:15px; margin:5px 0 0 0; font-size:0.8rem;">
                                <li>Clutter</li>
                                <li>Slow load times</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `,
        tags: ['design', 'ux', 'persona']
    },
    {
        name: 'Architecture View',
        type: NoteType.Uranus,
        theme: 'calm',
        icon: 'server',
        content: `
            <div style="text-align:center;">
                <h2 style="color:#67e8f9; margin-bottom:20px;">SYSTEM ARCHITECTURE</h2>
                <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
                    <div style="border:2px solid #a5f3fc; padding:10px 30px; border-radius:8px; background:rgba(165,243,252,0.1);">Client (React)</div>
                    <div style="font-size:1.5rem; color:#a5f3fc;">↓</div>
                    <div style="display:flex; gap:20px;">
                        <div style="border:2px solid #c4b5fd; padding:10px 20px; border-radius:8px; background:rgba(196,181,253,0.1);">API Gateway</div>
                        <div style="border:2px solid #fca5a5; padding:10px 20px; border-radius:8px; background:rgba(252,165,165,0.1);">Auth Service</div>
                    </div>
                    <div style="font-size:1.5rem; color:#c4b5fd;">↓</div>
                    <div style="border:2px solid #6ee7b7; padding:15px 40px; border-radius:50px; background:rgba(110,231,183,0.1);">Database Cluster</div>
                </div>
            </div>
        `,
        tags: ['tech', 'diagram', 'system']
    },
    {
        name: 'SWOT Analysis',
        type: NoteType.Jupiter,
        theme: 'energetic',
        icon: 'grid',
        content: `
            <h2 style="text-align:center; margin-bottom:15px; font-weight:800; letter-spacing:2px;">SWOT MATRIX</h2>
            <div style="display:grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 15px; height:80%;">
                <div style="border:1px solid rgba(134, 239, 172, 0.4); padding:15px; border-radius:12px; background:linear-gradient(135deg, rgba(134,239,172,0.1), transparent);">
                    <strong style="color:#86efac; display:block; margin-bottom:5px; font-size:1.1rem;">STRENGTHS</strong>
                    <ul style="font-size:0.9em; padding-left:15px; margin:0; opacity:0.8;"><li>What do you do well?</li><li>Unique resources?</li></ul>
                </div>
                <div style="border:1px solid rgba(251, 146, 60, 0.4); padding:15px; border-radius:12px; background:linear-gradient(135deg, rgba(251,146,60,0.1), transparent);">
                    <strong style="color:#fb923c; display:block; margin-bottom:5px; font-size:1.1rem;">WEAKNESSES</strong>
                     <ul style="font-size:0.9em; padding-left:15px; margin:0; opacity:0.8;"><li>What to improve?</li><li>Resource limitations?</li></ul>
                </div>
                <div style="border:1px solid rgba(147, 197, 253, 0.4); padding:15px; border-radius:12px; background:linear-gradient(135deg, rgba(147,197,253,0.1), transparent);">
                    <strong style="color:#93c5fd; display:block; margin-bottom:5px; font-size:1.1rem;">OPPORTUNITIES</strong>
                     <ul style="font-size:0.9em; padding-left:15px; margin:0; opacity:0.8;"><li>Market trends?</li><li>New technology?</li></ul>
                </div>
                <div style="border:1px solid rgba(248, 113, 113, 0.4); padding:15px; border-radius:12px; background:linear-gradient(135deg, rgba(248,113,113,0.1), transparent);">
                    <strong style="color:#f87171; display:block; margin-bottom:5px; font-size:1.1rem;">THREATS</strong>
                     <ul style="font-size:0.9em; padding-left:15px; margin:0; opacity:0.8;"><li>Competitors?</li><li>Economic shifts?</li></ul>
                </div>
            </div>
        `,
        tags: ['strategy', 'business', 'analysis']
    },
    {
        name: 'Priority Matrix',
        type: NoteType.Pulsar,
        theme: 'noir',
        icon: 'alert-circle',
        content: `
            <h3 style="text-align:center; margin-bottom:10px;">EISENHOWER MATRIX</h3>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                <div style="background:rgba(239,68,68,0.25); padding:12px; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="font-size:0.6em; color:#fca5a5; font-weight:bold; letter-spacing:1px;">URGENT + IMPORTANT</div>
                    <p style="font-size:1.1em; font-weight:bold; margin:5px 0 0 0;">DO</p>
                </div>
                <div style="background:rgba(59,130,246,0.25); padding:12px; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="font-size:0.6em; color:#93c5fd; font-weight:bold; letter-spacing:1px;">NOT URGENT + IMPORTANT</div>
                    <p style="font-size:1.1em; font-weight:bold; margin:5px 0 0 0;">PLAN</p>
                </div>
                <div style="background:rgba(234,179,8,0.25); padding:12px; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="font-size:0.6em; color:#fde047; font-weight:bold; letter-spacing:1px;">URGENT + NOT IMPORTANT</div>
                    <p style="font-size:1.1em; font-weight:bold; margin:5px 0 0 0;">DELEGATE</p>
                </div>
                <div style="background:rgba(75,85,99,0.4); padding:12px; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="font-size:0.6em; color:#d1d5db; font-weight:bold; letter-spacing:1px;">NOT URGENT + NOT IMPORTANT</div>
                    <p style="font-size:1.1em; font-weight:bold; margin:5px 0 0 0;">ELIMINATE</p>
                </div>
            </div>
        `,
        tags: ['productivity', 'priority', 'matrix']
    },
    {
        name: 'OKR Tracker',
        type: NoteType.Neptune,
        theme: 'pastel',
        icon: 'target',
        content: `
            <h2 style="border-bottom:2px solid rgba(255,255,255,0.1); padding-bottom:5px; text-align:center; font-weight:300;">OKR DASHBOARD</h2>
            <div style="margin-top:20px;">
                <h3 style="color:#f9a8d4; font-size:1.2rem;">OBJECTIVE</h3>
                <p style="font-style:italic; opacity:0.9; font-size:1.1rem;">"Launch Stardust V3 to Global Market"</p>
            </div>
            <div style="margin-top:25px;">
                <h4 style="color:#c4b5fd; font-size:1rem; margin-bottom:10px;">KEY RESULTS</h4>
                <ul style="list-style:none; padding:0;">
                    <li style="margin-bottom:15px;">
                        <div style="display:flex; justify-content:space-between; font-size:0.9em; margin-bottom:4px;">
                            <span>10k Active Users</span>
                            <span style="color:#c4b5fd;">75%</span>
                        </div>
                        <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden;">
                            <div style="width:75%; height:100%; background:linear-gradient(90deg, #c4b5fd, #a78bfa);"></div>
                        </div>
                    </li>
                    <li style="margin-bottom:15px;">
                        <div style="display:flex; justify-content:space-between; font-size:0.9em; margin-bottom:4px;">
                            <span>< 100ms Latency</span>
                            <span style="color:#c4b5fd;">40%</span>
                        </div>
                        <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden;">
                            <div style="width:40%; height:100%; background:linear-gradient(90deg, #c4b5fd, #a78bfa);"></div>
                        </div>
                    </li>
                </ul>
            </div>
        `,
        tags: ['goals', 'management', 'okr']
    },
];

export const BLACK_HOLE_PROPERTIES = {
    SIZE: 200, 
    PULL_DISTANCE: 320, 
    ABSORB_DISTANCE: 100,
};

export const ZOOM_LEVELS = {
  MIN: 0.1,
  MAX: 3.0,
  STEP: 0.1,
};

export const AI_LIMITS = {
    DAILY_REQUESTS: 1500,
    REQUESTS_PER_MINUTE: 15,
};

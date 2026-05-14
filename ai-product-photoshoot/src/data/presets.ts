export type PresetCategory =
  | "Studio"
  | "Lifestyle"
  | "Nature"
  | "Luxury"
  | "Seasonal"
  | "Tech";

export interface ScenePreset {
  id: string;
  name: string;
  category: PresetCategory;
  swatch: string; // tailwind gradient classes for the card preview
  prompt: string;
}

export const SCENE_PRESETS: ScenePreset[] = [
  // Studio
  {
    id: "studio-white",
    name: "Clean White",
    category: "Studio",
    swatch: "from-slate-50 to-slate-200",
    prompt:
      "on a seamless pure white studio backdrop with soft diffused lighting from above, faint contact shadow beneath the product, crisp e-commerce hero shot",
  },
  {
    id: "studio-black",
    name: "Glossy Black",
    category: "Studio",
    swatch: "from-zinc-900 to-zinc-700",
    prompt:
      "on a glossy black acrylic surface with a dark gradient background, a single rim light from the back-right, mirror-like reflection beneath the product",
  },
  {
    id: "studio-pastel",
    name: "Pastel Pop",
    category: "Studio",
    swatch: "from-pink-200 via-purple-200 to-cyan-200",
    prompt:
      "on a pastel pink and lavender gradient backdrop with one geometric prop (cube or sphere) in soft mint, bright cheerful even lighting, modern direct-to-consumer ad style",
  },
  {
    id: "studio-spotlight",
    name: "Drama Spotlight",
    category: "Studio",
    swatch: "from-gray-900 via-amber-900/40 to-gray-900",
    prompt:
      "in a dark studio with a single dramatic spotlight from above creating a tight pool of warm light around the product, deep shadows, cinematic high-contrast look",
  },

  // Lifestyle
  {
    id: "life-marble",
    name: "Marble Counter",
    category: "Lifestyle",
    swatch: "from-stone-100 to-stone-300",
    prompt:
      "resting on a polished white Carrara marble countertop with soft morning sunlight from a window on the left, subtle warm highlights, a hint of greenery blurred in the background",
  },
  {
    id: "life-wood",
    name: "Warm Wood Desk",
    category: "Lifestyle",
    swatch: "from-amber-800 to-yellow-700",
    prompt:
      "on a warm walnut wooden desk next to an open notebook and a steaming ceramic mug, soft afternoon window light, cozy work-from-home aesthetic, shallow depth of field",
  },
  {
    id: "life-bath",
    name: "Spa Vanity",
    category: "Lifestyle",
    swatch: "from-emerald-100 to-teal-200",
    prompt:
      "on a stone bathroom vanity with eucalyptus sprigs, a folded white linen towel and gentle water droplets nearby, bright diffused daylight, fresh spa atmosphere",
  },
  {
    id: "life-cafe",
    name: "Cafe Table",
    category: "Lifestyle",
    swatch: "from-orange-200 to-amber-300",
    prompt:
      "on a small round cafe table with a flat white coffee and croissant slightly out of focus behind it, warm afternoon light, lively but blurred urban background",
  },

  // Nature
  {
    id: "nat-beach",
    name: "Beach Sand",
    category: "Nature",
    swatch: "from-amber-100 to-sky-300",
    prompt:
      "half-resting on fine golden beach sand with a few smooth pebbles and a wisp of foam, soft sunset golden-hour lighting, ocean blurred in the background",
  },
  {
    id: "nat-forest",
    name: "Forest Floor",
    category: "Nature",
    swatch: "from-emerald-700 to-green-900",
    prompt:
      "on a mossy forest floor with ferns and dappled sunlight filtering through the canopy, earthy organic mood, light mist in the background",
  },
  {
    id: "nat-stone",
    name: "Rocky Cliff",
    category: "Nature",
    swatch: "from-slate-400 to-slate-700",
    prompt:
      "on a dark wet rocky surface with dramatic overcast lighting, light sea spray, moody adventurous outdoor look",
  },
  {
    id: "nat-flowers",
    name: "Garden Blooms",
    category: "Nature",
    swatch: "from-pink-300 via-rose-200 to-emerald-200",
    prompt:
      "surrounded by fresh garden blooms (peonies, ranunculus, eucalyptus) on a soft linen surface, gentle natural daylight, romantic editorial flat-lay vibe",
  },

  // Luxury
  {
    id: "lux-velvet",
    name: "Velvet Drape",
    category: "Luxury",
    swatch: "from-rose-900 to-rose-700",
    prompt:
      "on a deep burgundy velvet surface with a softly draped silk ribbon, single warm key light, rich high-end product editorial",
  },
  {
    id: "lux-gold",
    name: "Champagne Gold",
    category: "Luxury",
    swatch: "from-yellow-200 via-amber-300 to-yellow-500",
    prompt:
      "on a brushed champagne-gold surface with subtle bokeh of warm gold lights behind, low-angle hero composition, luxurious advertising look",
  },
  {
    id: "lux-marble-roses",
    name: "Marble + Roses",
    category: "Luxury",
    swatch: "from-rose-200 to-stone-200",
    prompt:
      "on white marble with a few dark red rose petals scattered around, soft natural side lighting, perfume-ad luxury mood",
  },
  {
    id: "lux-glass",
    name: "Crystal Pedestal",
    category: "Luxury",
    swatch: "from-slate-200 via-cyan-100 to-slate-300",
    prompt:
      "elevated on a clear crystal acrylic pedestal against a soft grey gradient backdrop, a single soft key light, glossy reflective floor",
  },

  // Seasonal
  {
    id: "season-xmas",
    name: "Christmas Cozy",
    category: "Seasonal",
    swatch: "from-red-700 via-emerald-700 to-amber-300",
    prompt:
      "next to pine branches, red berries, a softly glowing string of warm fairy lights and a knitted blanket, snug holiday atmosphere, shallow depth of field",
  },
  {
    id: "season-autumn",
    name: "Autumn Leaves",
    category: "Seasonal",
    swatch: "from-orange-300 via-amber-500 to-red-700",
    prompt:
      "on a wooden surface dusted with fallen orange and red maple leaves, warm low-angle golden afternoon light, cozy autumn editorial",
  },
  {
    id: "season-spring",
    name: "Spring Blossoms",
    category: "Seasonal",
    swatch: "from-pink-200 via-rose-300 to-green-200",
    prompt:
      "surrounded by cherry blossom branches with soft pink petals on a pale beige surface, bright airy daylight, fresh spring mood",
  },
  {
    id: "season-snow",
    name: "Fresh Snow",
    category: "Seasonal",
    swatch: "from-sky-100 via-white to-slate-200",
    prompt:
      "resting on a smooth bed of fresh powdery snow with a few snowflakes mid-air, soft cool overcast light, crisp winter editorial",
  },

  // Tech
  {
    id: "tech-neon",
    name: "Neon Cyberpunk",
    category: "Tech",
    swatch: "from-fuchsia-600 via-purple-700 to-cyan-500",
    prompt:
      "on a wet reflective black surface with magenta and cyan neon glow, light fog, futuristic cyberpunk product hero shot",
  },
  {
    id: "tech-holo",
    name: "Holographic",
    category: "Tech",
    swatch: "from-pink-300 via-cyan-300 to-purple-400",
    prompt:
      "on an iridescent holographic surface with prismatic reflections, soft even lighting, modern y2k tech-ad aesthetic",
  },
  {
    id: "tech-glass",
    name: "Glass Cubes",
    category: "Tech",
    swatch: "from-cyan-200 via-blue-300 to-indigo-300",
    prompt:
      "elevated among floating frosted glass cubes against a clean blue gradient, soft studio lighting, sleek minimalist tech ad",
  },
  {
    id: "tech-circuit",
    name: "Circuit Board",
    category: "Tech",
    swatch: "from-emerald-900 via-emerald-700 to-lime-400",
    prompt:
      "above a glowing green circuit-board surface with subtle bokeh of tiny LEDs, low-angle dramatic shot, high-tech mood",
  },
];

export const PRESET_CATEGORIES: PresetCategory[] = [
  "Studio",
  "Lifestyle",
  "Nature",
  "Luxury",
  "Seasonal",
  "Tech",
];

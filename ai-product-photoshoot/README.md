<div align="center">
<img width="1200" height="475" alt="AI Product Photoshoot" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Product Photoshoot

A free, in-browser AI product-photography tool powered by **open-source image
models** (FLUX, SDXL, Stable Diffusion 3.5, Playground v2.5). Pick a scene
preset, write a prompt, pick an aspect ratio for your channel — Instagram,
Etsy, Amazon, TikTok — and get a studio-quality product shot back in seconds.

**No signup. No API key. No monthly fee. Nothing leaves your browser.**

## Why this exists

Paid AI product-photography tools (Photoroom, Pebblely, Mokker, Booth.ai,
Flair.ai, Pixelcut, Claid) cost $10–$200 / month and gate basic features
behind tiers. The underlying image models — FLUX, SDXL, SD 3.5 — are
open-source and free to use via Pollinations.ai and the Hugging Face
inference API. This app is a clean front-end that gives you the same output
quality with **zero unit cost**.

## How it compares

| Feature | This app | Photoroom | Pebblely | Mokker | Booth.ai | Pixelcut |
|---|---|---|---|---|---|---|
| Price | **Free, forever** | Free tier + $9.99+/mo | $19+/mo | $29+/mo | $99+/mo | Free tier + $7.99+/mo |
| Signup required | **No** | Yes | Yes | Yes | Yes | Yes |
| Pick the underlying model | **Yes — 10 models** | No | No | No | No | No |
| Use your own (free) HF token | **Yes** | n/a | n/a | n/a | n/a | n/a |
| Scene presets | **24, 6 categories** | Hundreds | Curated styles | Industry-tuned | Brand-tuned | Limited |
| Variations per generation | **1 / 2 / 4** | 1 | 8 | 4 | 4 | 1 |
| Aspect ratios (named per platform) | **Yes** | Yes | Limited | Yes | Yes | Yes |
| Before / after compare slider | **Yes** | No | No | No | No | No |
| Open source code | **Yes** | No | No | No | No | No |
| Runs entirely client-side | **Yes** | No | No | No | No | No |

### Honest tradeoffs

- **Product preservation**: Photoroom, Booth and Mokker use proprietary
  image-editing or 3D pipelines that keep your product pixel-perfect.
  This app uses **text-to-image** open-source models, so the AI generates a
  new scene from your prompt — your uploaded photo is a visual reference and
  powers the before/after slider, but is not pixel-locked into the output.
  Describe your product clearly in the prompt for best results.
- **No background removal step yet**. Most paid tools cut out your product
  first. That's on the roadmap (via the rembg model on Hugging Face).
- **Polish**: paid tools have years of refinement and brand kits. We trade
  that for being free, open, and private.

## Providers & models

### Pollinations.ai — zero config, no API key
- **FLUX.1** — open-source FLUX, best general quality
- **FLUX Realism** — FLUX tuned for photorealism
- **FLUX 3D** — 3D-rendered aesthetic
- **FLUX Anime** — anime / illustration
- **SDXL Turbo** — fast Stable Diffusion XL Turbo

The default provider — works the moment you open the app.

### Hugging Face Inference API — free with HF token
- **FLUX.1 Schnell** (`black-forest-labs/FLUX.1-schnell`)
- **FLUX.1 Dev** (`black-forest-labs/FLUX.1-dev`)
- **SDXL 1.0** (`stabilityai/stable-diffusion-xl-base-1.0`)
- **SD 3.5 Large Turbo** (`stabilityai/stable-diffusion-3.5-large-turbo`)
- **Playground v2.5** (`playgroundai/playground-v2.5-1024px-aesthetic`)

Free read token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens),
paste it into **Settings**.

## Features

- 2 providers · 10 open-source models, one-click switching
- 24 scene presets across Studio, Lifestyle, Nature, Luxury, Seasonal, Tech
- Lighting + Mood selectors composed into the prompt
- Negative prompt (HF) and seed control
- Platform-named aspect ratios: Square (Instagram / Amazon),
  Portrait (Pinterest / Etsy), Tall, Landscape (X / Twitter),
  Story (Instagram / TikTok)
- Generate 1, 2 or 4 variations in parallel with different seeds
- Before / After compare slider
- Local history (last 24) — click to reload prompt + model + ratio
- `Cmd/Ctrl + Enter` to generate from anywhere
- Toast notifications, polished focus states, keyboard accessibility
- SEO-ready landing page (Open Graph, Twitter Card, JSON-LD Schema.org)
- Client-side image downscaling before upload
- Zero backend, zero analytics — your data and tokens stay in `localStorage`

## Run locally

Requires Node 18+.

```bash
npm install
npm run dev
```

Open the URL Vite prints. Pollinations works immediately; for Hugging Face
models add your token in **Settings** (top right).

## Build for production

```bash
npm run build
npm run preview
```

Production bundle is ~245 KB (~77 KB gzipped). The hosted site needs no
backend — drop `dist/` onto any static host (Vercel, Netlify, Cloudflare
Pages, GitHub Pages).

## Live site (GitHub Pages)

Every push to `main` auto-deploys via `.github/workflows/deploy.yml` and
is served at:

> https://varunvashisht1.github.io/AI-Photoshoot-/

To enable Pages once: in the repo on github.com, open **Settings → Pages**
and set **Source** to **"GitHub Actions"**. The next push to `main` will
publish the site.

## Tech stack

React 19 · Vite · TypeScript · Tailwind CSS · Pollinations.ai · Hugging Face
Inference API.

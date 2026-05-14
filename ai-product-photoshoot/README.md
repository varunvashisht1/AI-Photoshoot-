<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Product Photoshoot

A browser-only tool that generates styled product photography using **free,
open-source models** — no proprietary API required. Pick a model, write a
scene description (or grab a preset), choose an aspect ratio, and download
the result.

## Providers & models

The app ships with two free providers and ~10 models:

### Pollinations.ai — no signup, no API key
- **FLUX.1** — open-source FLUX, best general quality
- **FLUX Realism** — FLUX tuned for photorealism
- **FLUX 3D** — 3D-rendered aesthetic
- **FLUX Anime** — anime / illustration style
- **SDXL Turbo** — fast Stable Diffusion XL Turbo

This is the default provider — the app works the moment you open it, with no
account or token.

### Hugging Face Inference API — free with HF token
- **FLUX.1 Schnell** (`black-forest-labs/FLUX.1-schnell`)
- **FLUX.1 Dev** (`black-forest-labs/FLUX.1-dev`)
- **SDXL 1.0** (`stabilityai/stable-diffusion-xl-base-1.0`)
- **SD 3.5 Large Turbo** (`stabilityai/stable-diffusion-3.5-large-turbo`)
- **Playground v2.5** (`playgroundai/playground-v2.5-1024px-aesthetic`)

Get a free read token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
and paste it into Settings.

> **Note on workflow.** These are text-to-image models, so the generated
> image is built from your prompt — your uploaded product photo serves as a
> visual reference and powers the before/after compare slider, but it does
> not literally lock the product into the output the way a paid image-editing
> model would.

## Features

- **Two providers · 10 models** — switch with one click
- **24 scene presets** across Studio, Lifestyle, Nature, Luxury, Seasonal, Tech
- **Lighting + Mood** selectors composed into the final prompt
- **Aspect ratio** (1:1, 4:5, 3:4, 16:9, 9:16) and **negative prompt** (HF)
- **Generate up to 4 variations** in parallel with different seeds
- **Before / After compare slider**
- **Local history** of the last 24 generations
- **Client-side downscaling** of uploads
- **No backend** — your tokens and history stay in `localStorage`

## Run locally

Requirements: Node 18+.

```bash
npm install
npm run dev
```

Open the URL Vite prints. Pollinations works immediately; for Hugging Face
models, paste your token in **Settings** (top right).

## Build for production

```bash
npm run build
npm run preview
```

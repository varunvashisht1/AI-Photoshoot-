<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Product Photoshoot

A browser-only tool that turns a plain product photo into a polished, styled
product shot using Google's Gemini image model. Pick a scene preset (studio,
lifestyle, luxury, seasonal, tech…), tweak the prompt, choose aspect ratio and
number of variations, and download the result.

## Features

- **Drop-in product photo** → get a styled scene back from Gemini.
- **24 scene presets** across Studio, Lifestyle, Nature, Luxury, Seasonal and Tech.
- **Lighting + Mood** modifiers that compose into the prompt.
- **Aspect ratio** (1:1, 4:5, 3:4, 16:9, 9:16) and **negative prompt**.
- **Generate up to 4 variations** at once.
- **Before/After compare slider** to see how the AI changed the scene.
- **Local history** of the last 24 generations (thumbnails in localStorage).
- **In-app API key entry** — your key never leaves the browser.
- **Client-side image downscaling** so big uploads don't blow up payloads.

## Run locally

Requirements: Node 18+.

```bash
npm install
npm run dev
```

Then open the printed URL. The first time you load the app it will prompt you
for a Gemini API key. Get one for free at
[aistudio.google.com/apikey](https://aistudio.google.com/apikey). The key is
stored in your browser's `localStorage` only — never transmitted anywhere
except directly to Google when generating images.

## Build for production

```bash
npm run build
npm run preview
```

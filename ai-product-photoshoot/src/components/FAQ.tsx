import React, { useState } from "react";

interface QA {
  q: string;
  a: React.ReactNode;
}

const FAQS: QA[] = [
  {
    q: "Is AI Product Photoshoot really free?",
    a: (
      <>
        Yes. <strong>SDXL Turbo via Pollinations.ai</strong> works without any
        account or key. FLUX models on Pollinations need a free token from{" "}
        <a
          href="https://auth.pollinations.ai/"
          target="_blank"
          rel="noreferrer"
          className="text-brand-300 underline hover:text-brand-200"
        >
          auth.pollinations.ai
        </a>
        . The Hugging Face provider is also free with a free read token.
      </>
    ),
  },
  {
    q: "Which AI models can I use?",
    a: (
      <>
        FLUX.1, FLUX Realism, FLUX 3D, FLUX Anime and SDXL Turbo via
        Pollinations, plus FLUX.1 Schnell, FLUX.1 Dev, SDXL 1.0, Stable
        Diffusion 3.5 Large Turbo and Playground v2.5 via Hugging Face. Swap
        between them with one click — no extra setup.
      </>
    ),
  },
  {
    q: "Do I need to install anything?",
    a: (
      <>
        No. The app runs entirely in your browser. No download, no extension,
        no server-side account.
      </>
    ),
  },
  {
    q: "Will it preserve my exact product?",
    a: (
      <>
        These are <strong>text-to-image</strong> open-source models, so they
        generate a fresh scene from your prompt. Your uploaded product photo is
        a visual reference and powers the before/after compare slider, but the
        AI doesn't pixel-lock the product the way paid image-editing models do.
        Describe your product clearly in the prompt for the best match.
      </>
    ),
  },
  {
    q: "Where is my data stored?",
    a: (
      <>
        Everything stays in your browser. Tokens, generated images and history
        live in <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-slate-200">localStorage</code>{" "}
        on your device. The only network calls go directly to the image
        provider you chose.
      </>
    ),
  },
  {
    q: "What can I use the images for?",
    a: (
      <>
        Pollinations and the Hugging Face models listed here are released under
        permissive open-source licenses that allow commercial use, but check
        each model's license card on Hugging Face for specifics before using
        outputs in paid campaigns.
      </>
    ),
  },
  {
    q: "What aspect ratios does it support?",
    a: (
      <>
        Square (1:1) for Instagram and marketplaces, Portrait (4:5) and (3:4)
        for Pinterest and Etsy, Story (9:16) for Instagram/TikTok, and
        Landscape (16:9) for hero banners and X / Twitter.
      </>
    ),
  },
];

export const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="container mx-auto px-4 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id="faq-heading"
          className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-400">
          About the models, your data, and what you can do with the images.
        </p>

        <div className="mt-8 divide-y divide-white/5 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-sm">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
                >
                  <span className="text-sm font-semibold text-slate-100 sm:text-base">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-transform ${
                      isOpen ? "rotate-45 text-cyan-300" : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-3.5 w-3.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-slate-300 animate-fade-in">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React from "react";
import { SparklesIcon } from "./icons";

const Pill: React.FC<{ children: React.ReactNode; dot?: string }> = ({ children, dot }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
    {dot && <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />}
    {children}
  </span>
);

export const Hero: React.FC = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-white/5"
    >
      <div className="absolute inset-0 grid-bg" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-accent-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-[-6rem] h-[24rem] w-[24rem] rounded-full bg-brand-400/20 blur-3xl"
      />

      <div className="container relative mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center animate-fade-in">
          <Pill dot="bg-emerald-400 animate-pulse-soft">
            Free · open-source · no signup
          </Pill>

          <h1
            id="hero-heading"
            className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Studio-quality{" "}
            <span className="text-gradient">product photos</span>{" "}
            in seconds.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Generate professional product photography for your store, listing or
            social using free open-source AI models — FLUX, SDXL, Stable
            Diffusion 3.5 — right in your browser. No signup, no API key, no
            monthly fee.
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="#app"
              className="btn-primary px-6 py-3 text-base shadow-glow"
            >
              <SparklesIcon className="h-5 w-5" />
              Start creating — free
            </a>
            <a
              href="#faq"
              className="btn-ghost px-5 py-3 text-base"
            >
              How it works
            </a>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <Pill>10 open-source models</Pill>
            <Pill>24 scene presets</Pill>
            <Pill>Up to 4 variations</Pill>
            <Pill>Before / after compare</Pill>
            <Pill>Runs in your browser</Pill>
          </div>
        </div>
      </div>
    </section>
  );
};

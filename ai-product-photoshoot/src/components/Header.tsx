import React from "react";
import { CogIcon } from "./icons";

interface HeaderProps {
  onOpenSettings: () => void;
  providerName: string;
  modelName: string;
}

const Logo: React.FC = () => (
  <svg viewBox="0 0 64 64" fill="none" className="h-9 w-9" aria-hidden>
    <defs>
      <linearGradient id="hdr-g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="58" height="58" rx="12" fill="#0b1220" stroke="url(#hdr-g)" strokeWidth="2" />
    <path
      d="M16 23a5 5 0 0 1 5-5h4l3-4h8l3 4h4a5 5 0 0 1 5 5v17a5 5 0 0 1-5 5H21a5 5 0 0 1-5-5V23Z"
      fill="url(#hdr-g)"
      fillOpacity="0.16"
      stroke="url(#hdr-g)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <circle cx="32" cy="33" r="8" stroke="url(#hdr-g)" strokeWidth="2.5" />
    <circle cx="32" cy="33" r="3" fill="url(#hdr-g)" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  providerName,
  modelName,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/70 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <a href="#top" className="flex min-w-0 items-center gap-3">
          <Logo />
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-white sm:text-lg">
              AI Product Photoshoot
            </h1>
            <p className="hidden truncate text-xs text-slate-400 sm:block">
              <span className="text-slate-500">via</span>{" "}
              <span className="text-brand-300">{providerName}</span>
              <span className="px-1.5 text-slate-600">·</span>
              <span className="text-slate-300">{modelName}</span>
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          <a href="#app" className="rounded-md px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
            App
          </a>
          <a href="#faq" className="rounded-md px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
            FAQ
          </a>
          <a
            href="https://github.com/varunvashisht1/AI-Photoshoot-"
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
          >
            GitHub
          </a>
        </nav>

        <button
          onClick={onOpenSettings}
          className="btn-ghost shrink-0"
          aria-label="Open settings"
        >
          <CogIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>
    </header>
  );
};

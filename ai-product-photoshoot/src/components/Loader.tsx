import React, { useEffect, useState } from "react";
import { SparklesIcon } from "./icons";

const MESSAGES = [
  "Warming up the model…",
  "Mixing pixels and light…",
  "Finding the perfect angle…",
  "Setting the studio scene…",
  "Adding the finishing touches…",
];

export const Loader: React.FC = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl animate-pulse-soft" />
        <div className="absolute inset-2 rounded-full border-2 border-white/10" />
        <div className="absolute inset-2 rounded-full border-2 border-t-cyan-400 border-r-purple-400 animate-spin" />
        <div className="absolute inset-0 grid place-items-center">
          <SparklesIcon className="h-7 w-7 text-cyan-300" />
        </div>
      </div>
      <p className="mt-5 text-base font-semibold text-slate-100">Generating your scene</p>
      <p className="mt-1 max-w-xs text-sm text-slate-400 transition-opacity">
        {MESSAGES[idx]}
      </p>
      <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-white/5">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-shimmer bg-[length:200%_100%]" />
      </div>
    </div>
  );
};

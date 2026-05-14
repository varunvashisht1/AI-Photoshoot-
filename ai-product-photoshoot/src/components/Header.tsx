import React from "react";
import { CameraIcon, CogIcon } from "./icons";

interface HeaderProps {
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, hasApiKey }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur border-b border-gray-700/50 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CameraIcon className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                AI Product Photoshoot
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">
                Studio-quality product shots from any photo
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm text-gray-200 transition-colors"
          >
            <CogIcon className="w-4 h-4" />
            <span className="hidden sm:inline">API Key</span>
            <span
              className={`w-2 h-2 rounded-full ${hasApiKey ? "bg-emerald-400" : "bg-amber-400"}`}
              aria-label={hasApiKey ? "Key set" : "Key missing"}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

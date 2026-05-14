import React from "react";
import { CameraIcon, CogIcon } from "./icons";

interface HeaderProps {
  onOpenSettings: () => void;
  providerName: string;
  modelName: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  providerName,
  modelName,
}) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur border-b border-gray-700/50 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <CameraIcon className="w-8 h-8 text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight truncate">
                AI Product Photoshoot
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 truncate">
                <span className="text-gray-500">via</span>{" "}
                <span className="text-cyan-300">{providerName}</span>{" "}
                <span className="text-gray-600">·</span>{" "}
                <span className="text-gray-300">{modelName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm text-gray-200 transition-colors shrink-0"
          >
            <CogIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};

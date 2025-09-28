import React from 'react';
import { CameraIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-700/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <CameraIcon className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">AI Product Photoshoot</h1>
            <p className="text-sm text-gray-400">Create stunning product visuals with generative AI</p>
          </div>
        </div>
      </div>
    </header>
  );
};


import React from 'react';
import { DownloadIcon, ImageIcon } from './icons';

interface GeneratedImageProps {
  imageUrl: string | null;
}

export const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageUrl }) => {
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'ai-product-photoshoot.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!imageUrl) {
    return (
      <div className="text-center text-gray-500 flex flex-col items-center">
        <ImageIcon className="w-16 h-16 mb-4" />
        <h3 className="text-lg font-semibold text-gray-400">Your generated image will appear here</h3>
        <p className="text-sm">Upload a product and describe a scene to get started.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h2 className="text-lg font-semibold text-gray-300">3. Your AI Photoshoot</h2>
      <div className="relative group w-full max-w-md aspect-square bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <img src={imageUrl} alt="Generated product scene" className="w-full h-full object-contain" />
      </div>
      <button
        onClick={handleDownload}
        className="mt-2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/30"
      >
        <DownloadIcon className="w-5 h-5" />
        Download
      </button>
    </div>
  );
};

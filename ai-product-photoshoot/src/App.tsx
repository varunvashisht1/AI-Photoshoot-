import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { GeneratedImage } from './components/GeneratedImage';
import { Loader } from './components/Loader';
import { generateProductScene } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setUploadedImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setGeneratedImageUrl(null);
    setError(null);
  }, []);

  const handleGenerateClick = useCallback(async () => {
    if (!uploadedImage || !prompt.trim()) {
      setError('Please upload an image and provide a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const base64ImageData = await fileToBase64(uploadedImage);
      const { type: mimeType } = uploadedImage;
      
      const newImageBase64 = await generateProductScene(base64ImageData, mimeType, prompt);
      const newImageUrl = `data:image/png;base64,${newImageBase64}`;
      setGeneratedImageUrl(newImageUrl);

    } catch (err) {
      console.error(err);
      setError('Failed to generate image. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage, prompt]);

  const handleExamplePrompt = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto flex flex-col gap-8">
          
          {/* Input section */}
          <div className="flex flex-col gap-6">
            <ImageUploader onImageUpload={handleImageUpload} imagePreviewUrl={imagePreviewUrl} />
            <PromptInput 
              prompt={prompt}
              setPrompt={setPrompt}
              onSubmit={handleGenerateClick}
              isLoading={isLoading}
              onExampleClick={handleExamplePrompt}
            />
          </div>

          {/* Divider */}
          <hr className="border-gray-700" />

          {/* Output section */}
          <div className="bg-gray-800/50 rounded-lg p-6 shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
            {isLoading ? (
              <Loader />
            ) : error ? (
              <div className="text-center text-red-400">
                <p className="font-semibold">An Error Occurred</p>
                <p>{error}</p>
              </div>
            ) : (
              <GeneratedImage imageUrl={generatedImageUrl} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './icons';

const messages = [
    "Warming up the AI's creative engine...",
    "Mixing digital paints and pixels...",
    "Finding the perfect lighting...",
    "Setting up the virtual studio...",
    "The AI is working its magic...",
    "Almost there, adding the finishing touches..."
];

export const Loader: React.FC = () => {
    const [message, setMessage] = useState(messages[0]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = messages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 flex items-center justify-center">
                   <SparklesIcon className="w-8 h-8 text-cyan-400 animate-pulse"/>
                </div>
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-300">Generating Your Scene</p>
            <p className="mt-1 text-sm text-gray-400 transition-opacity duration-500">{message}</p>
        </div>
    );
};


import React from 'react';
import { Suggestions as SuggestionsType } from '../types';

interface SuggestionsProps {
    suggestions: SuggestionsType | null;
    isLoading: boolean;
    error: string | null;
    onApply: (type: 'title' | 'description', value: string) => void;
}

const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        <div className="h-8 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4 mt-6"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
    </div>
);

const SuggestionCard: React.FC<{ title: string, content: string, onApply: () => void }> = ({ title, content, onApply }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(content);
    };

    return (
        <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-md font-semibold text-indigo-400 mb-2">{title}</h4>
            <p className="text-gray-300 text-sm mb-3">{content}</p>
            <div className="flex space-x-2">
                <button
                    onClick={onApply}
                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-full transition-colors duration-200"
                >
                    Apply
                </button>
                <button
                    onClick={copyToClipboard}
                    className="text-xs bg-gray-600 hover:bg-gray-500 text-gray-200 font-bold py-1 px-3 rounded-full transition-colors duration-200"
                >
                    Copy
                </button>
            </div>
        </div>
    );
};

const Suggestions: React.FC<SuggestionsProps> = ({ suggestions, isLoading, error, onApply }) => {
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>;
    }

    if (!suggestions) {
        return (
            <div className="text-center text-gray-500 py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                <p className="mt-2 text-sm">Your AI suggestions will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-100 mb-2">AI Analysis</h3>
                <p className="text-gray-400 text-sm italic">"{suggestions.analysis}"</p>
            </div>
            <div className="space-y-4">
                <SuggestionCard
                    title="Optimized Title"
                    content={suggestions.optimizedTitle}
                    onApply={() => onApply('title', suggestions.optimizedTitle)}
                />
                <SuggestionCard
                    title="Optimized Description"
                    content={suggestions.optimizedDescription}
                    onApply={() => onApply('description', suggestions.optimizedDescription)}
                />
            </div>
        </div>
    );
};

export default Suggestions;

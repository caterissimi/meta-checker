
import React, { useState, useCallback } from 'react';
import InputWithCounter from './components/InputWithCounter';
import SerpPreview from './components/SerpPreview';
import Suggestions from './components/Suggestions';
import { getMetaSuggestions } from './services/geminiService';
import { META_TITLE_MIN_LENGTH, META_TITLE_MAX_LENGTH, META_DESCRIPTION_MIN_LENGTH, META_DESCRIPTION_MAX_LENGTH } from './constants';
import type { Suggestions as SuggestionsType } from './types';

const App: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [suggestions, setSuggestions] = useState<SuggestionsType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleOptimize = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSuggestions(null);
        try {
            const result = await getMetaSuggestions(title, description);
            setSuggestions(result);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [title, description]);
    
    const handleApplySuggestion = (type: 'title' | 'description', value: string) => {
        if (type === 'title') {
            setTitle(value);
        } else {
            setDescription(value);
        }
    };

    return (
        <div className="min-h-screen text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                        Meta Tag SEO Optimizer
                    </h1>
                    <p className="mt-2 text-lg text-gray-400">
                        Craft the perfect meta title & description with real-time feedback and AI power.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column: Inputs & Preview */}
                    <div className="space-y-8">
                        <div className="p-6 bg-gray-800/50 rounded-xl shadow-lg space-y-6 border border-gray-700">
                            <InputWithCounter
                                id="meta-title"
                                label="Meta Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                minLength={META_TITLE_MIN_LENGTH}
                                maxLength={META_TITLE_MAX_LENGTH}
                            />
                            <InputWithCounter
                                id="meta-description"
                                label="Meta Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                minLength={META_DESCRIPTION_MIN_LENGTH}
                                maxLength={META_DESCRIPTION_MAX_LENGTH}
                                isTextarea
                            />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-200 mb-3">SERP Preview</h2>
                            <SerpPreview title={title} description={description} />
                        </div>
                    </div>

                    {/* Right Column: AI Suggestions */}
                    <div className="p-6 bg-gray-800/50 rounded-xl shadow-lg border border-gray-700 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-200">AI Suggestions</h2>
                            <button
                                onClick={handleOptimize}
                                disabled={isLoading || (!title && !description)}
                                className="px-5 py-2.5 font-medium bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-800 rounded-lg text-sm text-white transition-all duration-200 ease-in-out disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Optimizing...
                                    </>
                                ) : (
                                  'Optimize with AI'
                                )}
                            </button>
                        </div>
                        <div className="flex-grow">
                             <Suggestions
                                suggestions={suggestions}
                                isLoading={isLoading}
                                error={error}
                                onApply={handleApplySuggestion}
                            />
                        </div>
                    </div>
                </main>

                <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>Built with React, Tailwind CSS, and the Google Gemini API.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;

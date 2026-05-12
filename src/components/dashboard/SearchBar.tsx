'use client';

import { Search, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const AI_SUGGESTIONS = [
  "otsin midagi loovat 3. klassile...",
  "programm teemal keskaegne Tallinn...",
  "teatrietendus lasteaialastele...",
  "muuseumitund ajaloo rikastamiseks...",
  "interaktiivne loodusprogramm..."
];

export function SearchBar() {
  const [isAiMode, setIsAiMode] = useState(true);
  const [placeholder, setPlaceholder] = useState("");
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    if (!isAiMode) {
      setPlaceholder("Otsi...");
      return;
    }

    const currentString = AI_SUGGESTIONS[suggestionIndex];
    let typingSpeed = isDeleting ? 30 : 70;

    const timeout = setTimeout(() => {
      if (!isDeleting && placeholder === currentString) {
        // Pause at the end of typing
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && placeholder === "") {
        setIsDeleting(false);
        setSuggestionIndex((prev) => (prev + 1) % AI_SUGGESTIONS.length);
      } else {
        setPlaceholder(
          isDeleting
            ? currentString.substring(0, placeholder.length - 1)
            : currentString.substring(0, placeholder.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, suggestionIndex, isAiMode]);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="relative flex items-center w-full h-14 rounded-full focus-within:shadow-lg bg-white overflow-hidden border border-gray-300">
        <div className="grid place-items-center h-full w-12 text-gray-400">
          <Search className="h-5 w-5" />
        </div>

        <input
          className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
          type="text"
          id="search"
          placeholder={isAiMode ? `Kirjelda vabas vormis, nt '${placeholder}'` : placeholder}
        />
        
        <div className="pr-2 flex items-center">
          <button 
            onClick={() => setIsAiMode(!isAiMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isAiMode 
                ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI otsing
          </button>
        </div>
      </div>
    </div>
  );
}

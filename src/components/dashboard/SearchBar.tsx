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

interface SearchBarProps {
  value?: string;
  onChange?: (val: string) => void;
  isAiMode?: boolean;
  setIsAiMode?: (mode: boolean) => void;
}

export function SearchBar({
  value = '',
  onChange,
  isAiMode: externalIsAiMode,
  setIsAiMode: externalSetIsAiMode
}: SearchBarProps = {}) {
  const [localIsAiMode, localSetIsAiMode] = useState(true);
  
  const activeIsAiMode = externalIsAiMode !== undefined ? externalIsAiMode : localIsAiMode;
  const activeSetIsAiMode = externalSetIsAiMode !== undefined ? externalSetIsAiMode : localSetIsAiMode;
  
  const [placeholder, setPlaceholder] = useState("");
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    if (!activeIsAiMode) {
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
  }, [placeholder, isDeleting, suggestionIndex, activeIsAiMode]);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="relative flex items-center w-full h-14 rounded-full focus-within:shadow-md bg-white overflow-hidden border border-gray-250 focus-within:border-blue-400 transition-all">
        <div className="grid place-items-center h-full w-12 text-gray-400">
          <Search className="h-5 w-5 text-gray-450" />
        </div>

        <input
          className="peer h-full w-full outline-none text-sm text-gray-750 pr-2 font-medium"
          type="text"
          id="search"
          placeholder={activeIsAiMode ? `Kirjelda vabas vormis, nt '${placeholder}'` : placeholder}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
        
        <div className="pr-2 flex items-center">
          <button 
            onClick={() => activeSetIsAiMode(!activeIsAiMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-95 select-none ${
              activeIsAiMode 
                ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-750 border border-purple-250 hover:from-purple-200 hover:to-blue-200 shadow-xs' 
                : 'bg-gray-150 text-gray-650 hover:bg-gray-250 hover:text-gray-900 border border-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-650 shrink-0" />
            AI otsing
          </button>
        </div>
      </div>
    </div>
  );
}


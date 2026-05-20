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
        
        <div className="pr-4 flex items-center gap-2.5 shrink-0">
          <span className={`whitespace-nowrap text-xs font-extrabold uppercase tracking-widest select-none transition-colors duration-300 ${activeIsAiMode ? 'text-purple-600' : 'text-gray-400'}`}>
            AI otsing
          </span>
          <button 
            type="button"
            role="switch"
            aria-checked={activeIsAiMode}
            onClick={() => activeSetIsAiMode(!activeIsAiMode)}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none active:scale-95 ${
              activeIsAiMode ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-inner' : 'bg-gray-200'
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out ${
                activeIsAiMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            >
              {activeIsAiMode && <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}


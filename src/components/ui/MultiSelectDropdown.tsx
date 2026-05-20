'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface MultiSelectDropdownProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder = 'Vali...',
  className = ''
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-normal text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-left shadow-sm min-h-[44px]"
      >
        <span className="truncate pr-4 flex-1">
          {selected.length > 0 ? selected.join(', ') : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg py-2 max-h-60 overflow-y-auto animate-fade-in">
          {options.map((option) => {
            const isChecked = selected.includes(option);
            return (
              <label 
                key={option} 
                className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer group transition-colors"
              >
                <div className="relative flex items-center justify-center w-4 h-4 border border-gray-300 rounded mr-3 shrink-0 group-hover:border-blue-500 transition-colors">
                  <input
                    type="checkbox"
                    className="absolute opacity-0 cursor-pointer w-full h-full"
                    checked={isChecked}
                    onChange={() => toggleOption(option)}
                  />
                  {isChecked && (
                    <div className="absolute inset-0 bg-blue-600 rounded flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <span className={`text-sm ${isChecked ? 'text-gray-900 font-medium' : 'text-gray-700 font-normal group-hover:text-gray-900'}`}>
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

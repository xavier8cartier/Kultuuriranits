'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SingleSelectDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SingleSelectDropdown({
  options,
  value,
  onChange,
  placeholder = 'Vali...',
  className = ''
}: SingleSelectDropdownProps) {
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

  const selectOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-normal text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-left shadow-sm min-h-[44px]"
      >
        <span className="truncate pr-4 flex-1">
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg py-2 max-h-60 overflow-y-auto animate-fade-in">
          {options.map((option) => {
            const isSelected = value === option;
            return (
              <div 
                key={option}
                onClick={() => selectOption(option)}
                className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer group transition-colors"
              >
                <span className={`text-sm flex-1 ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700 font-normal group-hover:text-gray-900'}`}>
                  {option}
                </span>
                {isSelected && (
                  <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

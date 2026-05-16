'use client';

import { useRef } from 'react';
import { 
  Landmark, 
  Palette, 
  Theater, 
  Clapperboard, 
  Music, 
  Library, 
  History, 
  Atom, 
  Leaf, 
  Wrench,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const categories = [
  { name: 'Muuseumid', icon: Landmark, color: 'bg-orange-100 text-orange-600', query: 'muuseumid' },
  { name: 'Galeriid', icon: Palette, color: 'bg-pink-100 text-pink-600', query: 'galeriid' },
  { name: 'Teatrid', icon: Theater, color: 'bg-purple-100 text-purple-600', query: 'teatrid' },
  { name: 'Kino', icon: Clapperboard, color: 'bg-blue-100 text-blue-600', query: 'kino' },
  { name: 'Kontserdid', icon: Music, color: 'bg-indigo-100 text-indigo-600', query: 'kontserdid' },
  { name: 'Raamatukogud', icon: Library, color: 'bg-green-100 text-green-600', query: 'raamatukogud' },
  { name: 'Ajalugu', icon: History, color: 'bg-amber-100 text-amber-600', query: 'ajalugu' },
  { name: 'Teaduskeskused', icon: Atom, color: 'bg-cyan-100 text-cyan-600', query: 'teaduskeskused' },
  { name: 'Loodus', icon: Leaf, color: 'bg-emerald-100 text-emerald-600', query: 'loodus' },
  { name: 'Töötoad', icon: Wrench, color: 'bg-slate-100 text-slate-600', query: 'tootoad' },
];

export function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Avasta kategooriaid</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1 scroll-smooth"
      >
        {categories.map((category, index) => (
          <Link
            key={index}
            href={`/otsi?category=${category.query}`}
            className="flex-shrink-0 group"
          >
            <div className="flex flex-col items-center gap-3 w-32 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all transform hover:-translate-y-1">
              <div className={`p-4 rounded-xl ${category.color} group-hover:scale-110 transition-transform`}>
                <category.icon className="w-8 h-8" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition-colors">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Program } from '@/lib/types';
import { MapPin, Clock, Users, Globe, ChevronRight, GraduationCap, Building2, Calendar, Heart } from 'lucide-react';

interface ProgramCardProps {
  program: Program;
}

export function ProgramCard({ program }: ProgramCardProps) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
    };
    
    // Initial favorite check
    const savedFavorites = localStorage.getItem('kr_favorites');
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setIsFavorite(parsed.includes(program.id));
      } catch (e) {}
    }

    checkAuth();
    window.addEventListener('kr-auth-change', checkAuth);
    return () => window.removeEventListener('kr-auth-change', checkAuth);
  }, [program.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let currentFavorites: string[] = [];
    const saved = localStorage.getItem('kr_favorites');
    if (saved) {
      try {
        currentFavorites = JSON.parse(saved);
      } catch (e) {}
    }
    
    let newFavorites;
    if (isFavorite) {
      newFavorites = currentFavorites.filter(id => id !== program.id);
    } else {
      newFavorites = [...currentFavorites, program.id];
    }
    
    localStorage.setItem('kr_favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    
    // Dispatch event so favorites page can update
    window.dispatchEvent(new Event('kr-favorites-updated'));
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-150 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row relative">
      {/* Visual Image container */}
      <div className="md:w-1/3 lg:w-1/4 relative h-52 md:h-auto overflow-hidden shrink-0">
        <img 
          src={program.image} 
          alt={program.title} 
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600/90 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm border border-blue-500/20">
            Populaarne
          </span>
        </div>
        {userRole === 'teacher' && (
          <button 
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-sm transition-all duration-200 cursor-pointer border border-gray-100 hover:border-red-100"
            aria-label="Lisa lemmikutesse"
          >
            <Heart className={`w-5 h-5 transition-colors duration-200 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`} />
          </button>
        )}
      </div>

      {/* Content Side */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
            <div>
              <div className="flex items-center text-xs font-semibold text-gray-400 gap-1.5 uppercase tracking-wider mb-1">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span>{program.organizer}</span>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                {program.title}
              </h3>
            </div>
            
            <div className="shrink-0 pt-0.5">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-extrabold px-3 py-1 rounded-lg">
                {program.price}
                <span className="text-[10px] text-blue-500 font-semibold">/ õpilane</span>
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 font-medium leading-relaxed mb-5 mt-2 font-normal">
            {program.shortDescription}
          </p>
          
          {/* Custom Info Badges Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg p-2 hover:bg-gray-100/50 transition-colors">
              <div className="p-1 bg-white rounded border border-gray-100 text-blue-600 shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-gray-700 truncate">{program.location}</span>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg p-2 hover:bg-gray-100/50 transition-colors">
              <div className="p-1 bg-white rounded border border-gray-100 text-blue-600 shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-gray-700 truncate">{program.duration}</span>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg p-2 hover:bg-gray-100/50 transition-colors">
              <div className="p-1 bg-white rounded border border-gray-100 text-blue-600 shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-gray-700 truncate">{program.participantCount}</span>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg p-2 hover:bg-gray-100/50 transition-colors">
              <div className="p-1 bg-white rounded border border-gray-100 text-blue-600 shrink-0">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-gray-700 truncate">{program.languages?.join(', ') || 'Eesti'}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap justify-between items-center border-t border-gray-50 pt-4 mt-auto gap-4">
          <div className="flex flex-wrap gap-1.5">
            {program.categories.slice(0, 2).map((cat, idx) => (
              <span key={idx} className="bg-gray-55 border border-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded">
                {cat}
              </span>
            ))}
            {program.targetGroups.slice(0, 1).map((grp, idx) => (
              <span key={idx} className="bg-blue-50/50 border border-blue-100 text-blue-650 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                {grp}
              </span>
            ))}
          </div>

          <div>
            <Link 
              href={`/programm/${program.id}`}
              className="inline-flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs transform active:scale-95 group/btn"
            >
              <span>{userRole === 'teacher' ? 'Vaata ja broneeri' : 'Vaata detaile'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-white/90 transition-transform duration-250 group-hover/btn:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


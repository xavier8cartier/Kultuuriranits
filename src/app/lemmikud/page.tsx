'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProgramCard } from '@/components/dashboard/ProgramCard';
import { programs as staticPrograms } from '@/lib/mockData';
import { Program } from '@/lib/types';
import { Heart, School, ShieldAlert } from 'lucide-react';

export default function FavoritesPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [favoritePrograms, setFavoritePrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check Auth Role
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    const loadFavorites = () => {
      const savedFavorites = localStorage.getItem('kr_favorites');
      let favoriteIds: string[] = [];
      if (savedFavorites) {
        try {
          favoriteIds = JSON.parse(savedFavorites);
        } catch (e) {}
      }

      const savedProgs = localStorage.getItem('kr_programs');
      let loadedProgs: Program[] = [];
      if (savedProgs) {
        try {
          loadedProgs = JSON.parse(savedProgs);
        } catch (e) {}
      }
      
      if (loadedProgs.length === 0) {
        loadedProgs = staticPrograms;
      } else {
        staticPrograms.forEach(sp => {
          if (!loadedProgs.some(p => p.id === sp.id)) {
            loadedProgs.push(sp);
          }
        });
      }

      const favs = loadedProgs.filter(p => favoriteIds.includes(p.id));
      setFavoritePrograms(favs);
      setIsLoading(false);
    };

    loadFavorites();

    const handleAuthChange = () => {
      setUserRole(localStorage.getItem('userRole'));
    };

    window.addEventListener('kr-auth-change', handleAuthChange);
    window.addEventListener('kr-favorites-updated', loadFavorites);

    return () => {
      window.removeEventListener('kr-auth-change', handleAuthChange);
      window.removeEventListener('kr-favorites-updated', loadFavorites);
    };
  }, []);

  const handleQuickLoginTeacher = () => {
    const teacherUser = { role: 'teacher', name: 'Mari Maasikas (Õpetaja)' };
    localStorage.setItem('kr_user', JSON.stringify(teacherUser));
    localStorage.setItem('userRole', 'teacher');
    setUserRole('teacher');
    window.dispatchEvent(new Event('kr-auth-change'));
  };

  // Access Control Restricted View
  if (userRole !== 'teacher') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-gray-150 p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-orange-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-60"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 border border-orange-100 shadow-sm">
              <ShieldAlert className="w-10 h-10" />
            </div>
            
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">Juurdepääs piiratud</h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed font-normal">
              See vaade on mõeldud ainult õpetajatele. Logi sisse õpetaja kontoga, et näha oma lemmikprogramme.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleQuickLoginTeacher}
                className="bg-blue-600 text-white px-8 py-3.5 rounded-full text-base font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform active:scale-95 cursor-pointer"
              >
                <School className="w-5 h-5" />
                Logi sisse õpetajana
              </button>
              
              <Link
                href="/"
                className="bg-gray-100 text-gray-700 border border-gray-200 px-8 py-3.5 rounded-full text-base font-bold hover:bg-gray-200 transition-all transform active:scale-95 text-center flex items-center justify-center"
              >
                Tagasi pealehele
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b border-gray-150 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-50 text-red-500 rounded-2xl border border-red-100 shadow-sm">
            <Heart className="w-6 h-6 fill-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Mu lemmikud</h1>
            <p className="text-sm text-gray-500 mt-1 font-semibold">
              Sinu salvestatud kultuuriprogrammid ({favoritePrograms.length})
            </p>
          </div>
        </div>
        <Link 
          href="/otsi" 
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-5 py-2.5 rounded-xl border border-blue-200 transition-colors cursor-pointer text-sm self-start md:self-auto"
        >
          Otsi uusi programme
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : favoritePrograms.length > 0 ? (
        <div className="space-y-5">
          {favoritePrograms.map(program => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-150 p-12 text-center shadow-sm my-8 animate-fade-in">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-100">
            <Heart className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Sul pole veel lemmikprogramme</h3>
          <p className="text-base font-medium text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
            Sirvi kultuuriprogramme ja vajuta südamekest, et salvestada need siia nimekirja. Nii leiad need hiljem kiiresti üles.
          </p>
          <Link 
            href="/otsi" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-3.5 rounded-xl transition-all cursor-pointer shadow-md transform active:scale-95 inline-flex items-center gap-2"
          >
            Sirvi programme
          </Link>
        </div>
      )}
    </div>
  );
}

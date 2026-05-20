'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, MapPin, Clock, Users, Globe, FileText, Accessibility, Mail, Phone, Heart } from 'lucide-react';
import { programs as staticPrograms } from '@/lib/mockData';
import { ProgramDetailLayout } from '@/components/program/ProgramDetailLayout';
import { FeedbackSection } from '@/components/program/FeedbackSection';
import { Program } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProgramDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setUserRole(localStorage.getItem('userRole'));
    };
    checkAuth();
    window.addEventListener('kr-auth-change', checkAuth);
    
    // Check favorites
    const checkFavorites = () => {
      const savedFavorites = localStorage.getItem('kr_favorites');
      if (savedFavorites) {
        try {
          const parsed = JSON.parse(savedFavorites);
          setIsFavorite(parsed.includes(id));
        } catch (e) {}
      }
    };
    checkFavorites();
    window.addEventListener('kr-favorites-updated', checkFavorites);

    return () => {
      window.removeEventListener('kr-auth-change', checkAuth);
      window.removeEventListener('kr-favorites-updated', checkFavorites);
    };
  }, [id]);

  useEffect(() => {
    // 1. Get from localStorage
    const savedProgs = localStorage.getItem('kr_programs');
    let allPrograms: Program[] = [];
    if (savedProgs) {
      try {
        allPrograms = JSON.parse(savedProgs);
        let updated = false;
        allPrograms = allPrograms.map((p: Program) => {
          if (p.id === 'erm-esemet' && p.image !== 'https://www.erm.ee/wp-content/uploads/2016/04/kohtumised1-1280x400.jpg') {
            updated = true;
            return { ...p, image: 'https://www.erm.ee/wp-content/uploads/2016/04/kohtumised1-1280x400.jpg' };
          }
          return p;
        });
        if (updated) {
          localStorage.setItem('kr_programs', JSON.stringify(allPrograms));
        }
      } catch (e) {
        console.error('Failed to parse kr_programs from localStorage', e);
      }
    }

    // Fallback if not initialized
    if (allPrograms.length === 0) {
      allPrograms = staticPrograms;
    } else {
      // Merge with static programs to guarantee all defaults exist
      staticPrograms.forEach(sp => {
        if (!allPrograms.some(p => p.id === sp.id)) {
          allPrograms.push(sp);
        }
      });
    }

    const found = allPrograms.find(p => p.id === id);
    setProgram(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="bg-gray-150 h-[350px] rounded-2xl mb-8"></div>
        <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-100">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Haridusprogrammi ei leitud</h2>
        <p className="text-sm font-medium text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
          Seda programmi ei eksisteeri enam või see on eemaldatud.
        </p>
        <Link 
          href="/otsi" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-xl transition-all cursor-pointer active:scale-95 shadow-md shadow-blue-500/10 text-sm"
        >
          Tagasi otsingusse
        </Link>
      </div>
    );
  }

  const priceValue = parseInt(program.price.replace(/[^0-9]/g, '')) || 0;

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
      newFavorites = currentFavorites.filter(favId => favId !== id);
    } else {
      newFavorites = [...currentFavorites, id];
    }
    
    localStorage.setItem('kr_favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event('kr-favorites-updated'));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link 
        href="/otsi" 
        className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 mb-8 group transition-colors duration-200"
      >
        <ChevronLeft className="w-5 h-5 mr-1.5 transition-transform duration-200 group-hover:-translate-x-1 text-gray-400 group-hover:text-gray-900" />
        Tagasi otsingusse
      </Link>

      <ProgramDetailLayout programId={program.id} priceValue={priceValue}>
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="h-64 sm:h-[350px] relative overflow-hidden group/image">
              <img 
                src={program.image} 
                alt={program.title} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/image:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent"></div>
              {userRole === 'teacher' && (
                <button 
                  onClick={toggleFavorite}
                  className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-red-100"
                  aria-label="Lisa lemmikutesse"
                >
                  <Heart className={`w-6 h-6 transition-colors duration-200 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`} />
                </button>
              )}
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center text-xs font-bold text-gray-400 gap-1.5 uppercase tracking-wider mb-2">
                <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md">
                  {program.organizer}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 mb-6 leading-tight">
                {program.title}
              </h1>
              
              {/* Elegant Info Badges Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl p-3 hover:bg-gray-100/50 transition-colors duration-200">
                  <div className="p-1.5 bg-white rounded-lg border border-gray-150 text-blue-600 shrink-0 shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Asukoht</span>
                    <span className="text-xs font-extrabold text-gray-700 leading-tight truncate">{program.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl p-3 hover:bg-gray-100/50 transition-colors duration-200">
                  <div className="p-1.5 bg-white rounded-lg border border-gray-150 text-blue-600 shrink-0 shadow-xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Kestus</span>
                    <span className="text-xs font-extrabold text-gray-700 leading-tight truncate">{program.duration}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl p-3 hover:bg-gray-100/50 transition-colors duration-200">
                  <div className="p-1.5 bg-white rounded-lg border border-gray-150 text-blue-600 shrink-0 shadow-xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Grupi suurus</span>
                    <span className="text-xs font-extrabold text-gray-700 leading-tight truncate">{program.participantCount}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl p-3 hover:bg-gray-100/50 transition-colors duration-200">
                  <div className="p-1.5 bg-white rounded-lg border border-gray-150 text-blue-600 shrink-0 shadow-xs">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Keeled</span>
                    <span className="text-xs font-extrabold text-gray-700 leading-tight truncate">{program.languages?.join(', ') || 'Eesti'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Programmi kirjeldus</h2>
                <p className="text-sm font-medium text-gray-600 leading-relaxed font-normal whitespace-pre-line">
                  {program.fullDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Info Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Curriculum Connections */}
            <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-base font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-600">
                  <FileText className="w-4 h-4" />
                </div>
                Õppekavaseos
              </h3>
              <div className="flex flex-wrap gap-2">
                {program.curriculumConnections?.map(conn => (
                  <span key={conn} className="bg-blue-50/50 hover:bg-blue-100 border border-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors duration-200">
                    {conn}
                  </span>
                ))}
              </div>
            </div>

            {/* Accessibility */}
            <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-base font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-purple-50 border border-purple-100 rounded-lg text-purple-600">
                  <Accessibility className="w-4 h-4" />
                </div>
                Ligipääsetavus
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-sm font-bold text-gray-700">
                  <span className={`w-2.5 h-2.5 rounded-full mr-2.5 shrink-0 ${program.accessibility.wheelchair ? 'bg-green-500' : 'bg-red-400'}`}></span>
                  Ratastooliga ligipääs: <strong className="ml-1 text-gray-900 font-extrabold">{program.accessibility.wheelchair ? 'Jah' : 'Ei / Raskendatud'}</strong>
                </li>
                <li className="flex items-center text-sm font-bold text-gray-700">
                  <span className={`w-2.5 h-2.5 rounded-full mr-2.5 shrink-0 ${program.accessibility.hev ? 'bg-green-500' : 'bg-red-400'}`}></span>
                  HEV õppijatele sobiv: <strong className="ml-1 text-gray-900 font-extrabold">{program.accessibility.hev ? 'Jah' : 'Ei'}</strong>
                </li>
                {program.accessibility.signLanguage && (
                  <li className="flex items-center text-sm font-bold text-gray-700">
                    <span className="w-2.5 h-2.5 rounded-full mr-2.5 bg-green-500 shrink-0"></span>
                    Viipekeel saadaval: <strong className="ml-1 text-gray-900 font-extrabold">Jah</strong>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Materials */}
          {program.materials && program.materials.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-base font-extrabold text-gray-900 mb-4">Õppematerjalid (seotud selle programmiga)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {program.materials.map((mat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100/50 hover:border-gray-200 transition-all duration-200 group/mat">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-gray-150 shadow-xs group-hover/mat:border-gray-300 transition-colors">
                        <FileText className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-xs font-extrabold text-gray-800 truncate max-w-[180px]">{mat.name}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg transition-all duration-200 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kontakt */}
          {(program.contactEmail || program.contactPhone) && (
            <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-base font-extrabold text-gray-900 mb-4">Kontakt</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {program.contactEmail && (
                  <div className="flex items-center p-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100/50 hover:border-gray-200 transition-all duration-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-white rounded-lg border border-gray-150 shadow-xs shrink-0 text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">E-post</span>
                        <a href={`mailto:${program.contactEmail}`} className="text-xs font-extrabold text-blue-600 hover:text-blue-800 hover:underline break-all leading-tight">
                          {program.contactEmail}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                
                {program.contactPhone && (
                  <div className="flex items-center p-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100/50 hover:border-gray-200 transition-all duration-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-white rounded-lg border border-gray-150 shadow-xs shrink-0 text-gray-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Telefon</span>
                        <a href={`tel:${program.contactPhone}`} className="text-xs font-extrabold text-blue-600 hover:text-blue-800 hover:underline leading-tight">
                          {program.contactPhone}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tagasiside sektsioon */}
          <FeedbackSection reviews={program.reviews} />
        </div>
      </ProgramDetailLayout>
    </div>
  );
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { ProgramCard } from '@/components/dashboard/ProgramCard';
import { programs as staticPrograms, mockFilters } from '@/lib/mockData';
import { Program } from '@/lib/types';
import { Sparkles, SlidersHorizontal, Trash2, HelpCircle, CheckCircle, Info } from 'lucide-react';

export default function SearchPage() {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('Kõik piirkonnad');
  const [selectedAccess, setSelectedAccess] = useState<string[]>([]);
  
  // Programs database loaded from localStorage
  const [programsList, setProgramsList] = useState<Program[]>([]);

  useEffect(() => {
    // Load from localStorage
    const savedProgs = localStorage.getItem('kr_programs');
    let loaded: Program[] = [];
    if (savedProgs) {
      try {
        loaded = JSON.parse(savedProgs);
      } catch (e) {
        console.error('Failed to parse kr_programs from localStorage', e);
      }
    }

    // Merge static mock programs so they are always present unless explicitly deleted
    if (loaded.length === 0) {
      loaded = staticPrograms;
    } else {
      staticPrograms.forEach(sp => {
        if (!loaded.some(p => p.id === sp.id)) {
          loaded.push(sp);
        }
      });
    }

    setProgramsList(loaded);
  }, []);

  // Map accessibility filter strings to program properties
  const mapAccessibilityKey = (accString: string): keyof Program['accessibility'] | null => {
    if (accString === 'Ratastooliga ligipääs') return 'wheelchair';
    if (accString === 'HEV õppijatele sobiv') return 'hev';
    if (accString === 'Viipekeel') return 'signLanguage';
    if (accString === 'Helisalvestus') return 'audioDescription';
    return null;
  };

  // Grade level toggle helper
  const handleGradeToggle = (grade: string) => {
    setSelectedGrades(prev => 
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
  };

  // Accessibility toggle helper
  const handleAccessToggle = (acc: string) => {
    setSelectedAccess(prev => 
      prev.includes(acc) ? prev.filter(a => a !== acc) : [...prev, acc]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGrades([]);
    setSelectedRegion('Kõik piirkonnad');
    setSelectedAccess([]);
  };

  // Smart AI-assisted and Standard filtering logic
  const filteredPrograms = useMemo(() => {
    return programsList.filter(program => {
      // 1. Text Search matching (Smart in AI mode, standard in normal mode)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        
        if (isAiMode) {
          // Broad keyword matching (AI semantic filter simulation)
          const keywords = query.split(/\s+/).filter(w => w.length > 2);
          
          // Check for outdoor/indoor request
          const wantsOutdoor = keywords.some(k => ['õue', 'õues', 'loodus', 'pargi', 'mets'].some(w => k.includes(w)));
          if (wantsOutdoor && ('outdoor' in program) && !(program as any).outdoor) {
            // Keep it but slightly penalize, or filter out if very specific. Let's keep it broad.
          }

          // Check if any keyword matches
          const matchFields = [
            program.title,
            program.organizer,
            program.shortDescription,
            program.fullDescription,
            program.location,
            ...(program.categories || []),
            ...(program.curriculumConnections || []),
            ...(program.targetGroups || [])
          ].map(f => String(f).toLowerCase());

          const matchesAnyKeyword = keywords.every(kw => 
            matchFields.some(field => field.includes(kw))
          );

          if (!matchesAnyKeyword) return false;
        } else {
          // Strict standard search matching
          const matchText = [
            program.title,
            program.organizer,
            program.shortDescription,
            program.fullDescription,
            program.location,
            ...(program.categories || []),
            ...(program.curriculumConnections || [])
          ].join(' ').toLowerCase();

          if (!matchText.includes(query)) return false;
        }
      }

      // 2. Grade levels filter
      if (selectedGrades.length > 0) {
        const hasOverlap = program.targetGroups.some(g => selectedGrades.includes(g));
        if (!hasOverlap) return false;
      }

      // 3. Region filter
      if (selectedRegion !== 'Kõik piirkonnad') {
        const reg = selectedRegion.toLowerCase();
        const loc = program.location.toLowerCase();
        // Fallback checks for program.county if defined
        const county = (program as any).county ? (program as any).county.toLowerCase() : '';
        
        if (!loc.includes(reg) && !county.includes(reg)) {
          // Additional checks for specific regions
          if (reg === 'tallinn' && loc.includes('harjumaa')) {
            // Let Tallinna programs match Harjumaa filter loosely if needed, but let's keep it specific
          } else {
            return false;
          }
        }
      }

      // 4. Accessibility filter
      if (selectedAccess.length > 0) {
        for (const acc of selectedAccess) {
          const key = mapAccessibilityKey(acc);
          if (key && !program.accessibility[key]) {
            return false;
          }
        }
      }

      return true;
    });
  }, [programsList, searchQuery, isAiMode, selectedGrades, selectedRegion, selectedAccess]);

  // Dynamic AI feedback summary generator (WOW factor)
  const aiFeedback = useMemo(() => {
    if (!isAiMode || searchQuery.trim() === '') return null;

    const count = filteredPrograms.length;
    if (count === 0) {
      return {
        message: `Mõistan sinu otsingut "${searchQuery}", kuid hetkel ei leidunud ühtegi täielikult kattuvat kultuuriprogrammi. Proovi kirjeldada oma soovi teiste sõnadega või lülita tavarežiimile.`,
        recommended: null
      };
    }

    const first = filteredPrograms[0];
    const recText = first 
      ? `Eriti soovitan programmi "${first.title}" (${first.organizer}), mis vastab hästi sinu kirjeldusele ning asub piirkonnas ${first.location}.`
      : '';

    return {
      message: `Tehisintellekt analüüsis sinu päringut ja filtreeris välja ${count} sobivaimat haridusprogrammi. ${recText}`,
      recommended: first
    };
  }, [filteredPrograms, isAiMode, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header section with rich gradient typography */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Leia klassile <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">sobivaim</span> kultuuriprogramm
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500 font-medium">
          Nutikas otsing leiab sobivaid programme kiiremini. Arveldamine toimub automaatselt kooli kultuuriranitsa eelarvest.
        </p>
      </div>

      {/* Styled controlled SearchBar */}
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
        isAiMode={isAiMode}
        setIsAiMode={setIsAiMode}
      />

      {/* AI Smart Suggestion Banner */}
      {aiFeedback && (
        <div className="max-w-3xl mx-auto mb-8 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 rounded-2xl p-5 shadow-sm relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles className="w-24 h-24 text-purple-600" />
          </div>
          <div className="flex gap-4 items-start relative z-10">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-purple-950 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                AI Analüüsi tulemus
              </h4>
              <p className="text-sm font-semibold text-purple-900 leading-relaxed">
                {aiFeedback.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        
        {/* Advanced Filter Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm sticky top-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
              <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                Filtrid
              </h3>
              {(selectedGrades.length > 0 || selectedRegion !== 'Kõik piirkonnad' || selectedAccess.length > 0 || searchQuery !== '') && (
                <button 
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors cursor-pointer select-none"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Puhasta
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Grades checkbox list */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Kooliaste</h4>
                <div className="space-y-2">
                  {mockFilters.grades.map(grade => {
                    const isChecked = selectedGrades.includes(grade);
                    return (
                      <label key={grade} className="flex items-center group cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => handleGradeToggle(grade)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30 transition-all cursor-pointer"
                        />
                        <span className={`ml-2.5 text-sm font-semibold transition-colors ${isChecked ? 'text-blue-700 font-extrabold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                          {grade}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Regions Dropdown */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Piirkond</h4>
                <div className="relative">
                  <select 
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none"
                  >
                    <option value="Kõik piirkonnad">Kõik piirkonnad</option>
                    {mockFilters.regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Accessibility checkboxes */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Ligipääsetavus</h4>
                <div className="space-y-2">
                  {mockFilters.accessibility.map(acc => {
                    const isChecked = selectedAccess.includes(acc);
                    return (
                      <label key={acc} className="flex items-center group cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => handleAccessToggle(acc)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30 transition-all cursor-pointer"
                        />
                        <span className={`ml-2.5 text-sm font-semibold transition-colors ${isChecked ? 'text-blue-700 font-extrabold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                          {acc}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Quick Info card in sidebar */}
            <div className="mt-8 bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-[11px] font-semibold text-blue-800 leading-relaxed">
                Kõik siin leiduvad programmid kuuluvad Haridus- ja Teadusministeeriumi ametlikku "Kultuuriranits" nimekirja.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Search Results */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
            <div>
              <h2 className="text-2xl font-black text-gray-900">
                {isAiMode && searchQuery.trim() !== '' ? 'AI soovitatud programmid' : 'Kõik programmid'}
              </h2>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
                Näitan {filteredPrograms.length} tulemust {programsList.length !== filteredPrograms.length && `(filtreeritud ${programsList.length} seast)`}
              </p>
            </div>
          </div>
          
          {/* Programs Grid */}
          <div className="space-y-5">
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map(program => (
                <ProgramCard key={program.id} program={program} />
              ))
            ) : (
              // Stunning interactive empty state
              <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center max-w-xl mx-auto shadow-sm my-8">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-100">
                  <HelpCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mitte ühtegi sobivat haridusprogrammi ei leitud</h3>
                <p className="text-sm font-medium text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">
                  Proovi eemaldada mõned filtrid, muuta otsingufraasi või lülitada välja AI otsingurežiim.
                </p>
                <button 
                  onClick={handleResetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-xl transition-all cursor-pointer active:scale-95 shadow-md shadow-blue-500/10 text-sm"
                >
                  Nulli kõik filtrid ja otsing
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

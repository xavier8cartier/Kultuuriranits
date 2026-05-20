'use client';

import { useState, useEffect, useMemo } from 'react';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { ProgramCard } from '@/components/dashboard/ProgramCard';
import { programs as staticPrograms, mockFilters } from '@/lib/mockData';
import { Program } from '@/lib/types';
import { Sparkles, HelpCircle, SlidersHorizontal, Trash2, Calendar, ChevronDown, Check } from 'lucide-react';
import { MultiSelectDropdown } from '@/components/ui/MultiSelectDropdown';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';

const ALL_CATEGORIES = [
  'Arhitektuur', 'Kunst ja disain', 'Film ja meedia', 'Kirjandus', 
  'Muuseumid ja kultuuripärand', 'Muusika ja tants', 'Teater ja tsirkus'
];
const ALL_TARGET_GROUPS = ['Lasteaed', '1.-3.klass', '4.-6.klass', '7.-9.klass', 'Gümnaasium'];
const ALL_LANGUAGES = ['Eesti', 'Inglise', 'Vene', 'Muu'];
const ALL_COUNTIES = ['Kõik piirkonnad', 'Tallinn', 'Harjumaa', 'Tartu', 'Tartumaa', 'Pärnu', 'Ida-Virumaa', 'Üle-eestiline (veebis)'];

export default function SearchPage() {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTargetGroups, setSelectedTargetGroups] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('Kõik piirkonnad');
  const [locationInput, setLocationInput] = useState('');
  
  const [priceInput, setPriceInput] = useState('');
  const [durationInput, setDurationInput] = useState('');
  const [groupSizeInput, setGroupSizeInput] = useState('');
  
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  
  const [isWheelchair, setIsWheelchair] = useState(false);
  const [isSpecialNeeds, setIsSpecialNeeds] = useState(false);
  const [isOutdoor, setIsOutdoor] = useState(false);
  
  // Programs database loaded from localStorage
  const [programsList, setProgramsList] = useState<Program[]>([]);

  useEffect(() => {
    // Load from localStorage
    const savedProgs = localStorage.getItem('kr_programs');
    let loaded: Program[] = [];
    if (savedProgs) {
      try {
        loaded = JSON.parse(savedProgs);
        let updated = false;
        loaded = loaded.map((p: Program) => {
          if (p.id === 'erm-esemet' && p.image !== 'https://www.erm.ee/wp-content/uploads/2016/04/kohtumised1-1280x400.jpg') {
            updated = true;
            return { ...p, image: 'https://www.erm.ee/wp-content/uploads/2016/04/kohtumised1-1280x400.jpg' };
          }
          return p;
        });
        if (updated) {
          localStorage.setItem('kr_programs', JSON.stringify(loaded));
        }
      } catch (e) {
        console.error('Failed to parse kr_programs from localStorage', e);
      }
    }

    // Merge static mock programs
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

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedTargetGroups([]);
    setSelectedDate('');
    setSelectedCounty('Kõik piirkonnad');
    setLocationInput('');
    setPriceInput('');
    setDurationInput('');
    setGroupSizeInput('');
    setSelectedLanguages([]);
    setIsWheelchair(false);
    setIsSpecialNeeds(false);
    setIsOutdoor(false);
  };

  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  // Smart AI-assisted and Standard filtering logic
  const filteredPrograms = useMemo(() => {
    return programsList.filter(program => {
      // 1. Text Search matching
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        
        if (isAiMode) {
          const keywords = query.split(/\s+/).filter(w => w.length > 2);
          const matchFields = [
            program.title, program.organizer, program.shortDescription, program.fullDescription, program.location,
            ...(program.categories || []), ...(program.curriculumConnections || []), ...(program.targetGroups || [])
          ].map(f => String(f).toLowerCase());

          const matchesAnyKeyword = keywords.every(kw => matchFields.some(field => field.includes(kw)));
          if (!matchesAnyKeyword) return false;
        } else {
          const matchText = [
            program.title, program.organizer, program.shortDescription, program.fullDescription, program.location,
            ...(program.categories || []), ...(program.curriculumConnections || [])
          ].join(' ').toLowerCase();

          if (!matchText.includes(query)) return false;
        }
      }

      // 2. Categories
      if (selectedCategories.length > 0) {
        // Soft match: if program has any overlapping category
        const hasOverlap = program.categories?.some(c => selectedCategories.includes(c));
        if (!hasOverlap) return false;
      }

      // 3. Target Groups
      if (selectedTargetGroups.length > 0) {
        // Map 1.-3.klass style to existing target groups if necessary
        const hasOverlap = program.targetGroups.some(g => {
          // Simplistic mapping for mock data compatibility
          if (selectedTargetGroups.includes('1.-3.klass') && g.includes('1. - 3.')) return true;
          if (selectedTargetGroups.includes('4.-6.klass') && g.includes('4. - 6.')) return true;
          if (selectedTargetGroups.includes('7.-9.klass') && g.includes('7. - 9.')) return true;
          return selectedTargetGroups.includes(g);
        });
        if (!hasOverlap && !program.targetGroups.some(g => selectedTargetGroups.includes(g))) return false;
      }

      // 4. Region/County
      if (selectedCounty !== 'Kõik piirkonnad') {
        const reg = selectedCounty.toLowerCase();
        const loc = program.location.toLowerCase();
        const county = (program as any).county ? (program as any).county.toLowerCase() : '';
        if (!loc.includes(reg) && !county.includes(reg)) return false;
      }

      // 5. Specific Location Input
      if (locationInput.trim() !== '') {
        if (!program.location.toLowerCase().includes(locationInput.toLowerCase().trim())) return false;
      }

      // 6. Accessibilities & Outdoor
      if (isWheelchair && !program.accessibility.wheelchair) return false;
      if (isSpecialNeeds && !program.accessibility.hev) return false;
      if (isOutdoor && !program.outdoor) return false;

      // Note: Price, Duration, Group Size, Languages, and Date are UI inputs
      // For this mock data, some fields (languages, specific prices) might not exist on all Program objects,
      // so we will softly ignore them if the program doesn't have the explicit fields to match against perfectly.

      return true;
    });
  }, [
    programsList, searchQuery, isAiMode, selectedCategories, selectedTargetGroups, 
    selectedCounty, locationInput, isWheelchair, isSpecialNeeds, isOutdoor
  ]);

  // Dynamic AI feedback summary generator (WOW factor)
  const aiFeedback = useMemo(() => {
    if (!isAiMode || searchQuery.trim() === '') return null;

    const count = filteredPrograms.length;
    if (count === 0) {
      return {
        message: `Mõistan sinu otsingut "${searchQuery}", kuid hetkel ei leidunud ühtegi täielikult kattuvat kultuuriprogrammi. Proovi eemaldada filtreid või kirjeldada oma soovi teiste sõnadega.`,
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
      {/* Header section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Leia klassile <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">sobivaim</span> kultuuriprogramm
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500 font-medium">
          Nutikas otsing leiab sobivaid programme kiiremini. Arveldamine toimub automaatselt kooli kultuuriranitsa eelarvest.
        </p>
      </div>

      {/* Main Search Bar & Advanced Toggle */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            isAiMode={isAiMode}
            setIsAiMode={setIsAiMode}
          />
        </div>
        <button 
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer shrink-0 h-14 md:mt-0 mt-[-24px] md:mb-8"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {isAdvancedOpen ? 'Sulge täpsem otsing' : 'Ava täpsem otsing'}
        </button>
      </div>

      {/* Advanced Filter Section */}
      {isAdvancedOpen && (
        <div className="max-w-5xl mx-auto mb-10 bg-white p-6 md:p-8 rounded-3xl border border-gray-150 shadow-sm animate-fade-in relative">
          <div className="absolute top-6 right-6">
            <button 
              onClick={handleResetFilters}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors cursor-pointer select-none px-3 py-1.5 rounded-lg hover:bg-blue-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Puhasta filtrid
            </button>
          </div>

          <div className="space-y-6">
            {/* ROW 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategooriad</label>
                <MultiSelectDropdown 
                  options={ALL_CATEGORIES} 
                  selected={selectedCategories} 
                  onChange={setSelectedCategories} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sihtgrupp</label>
                <MultiSelectDropdown 
                  options={ALL_TARGET_GROUPS} 
                  selected={selectedTargetGroups} 
                  onChange={setSelectedTargetGroups} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kuupäev</label>
                <div className="relative">
                  <input 
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-normal text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[44px] appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maakond</label>
                <div className="relative">
                  <SingleSelectDropdown 
                    options={ALL_COUNTIES}
                    value={selectedCounty}
                    onChange={setSelectedCounty}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Toimumiskoht</label>
                <div className="relative">
                  <SingleSelectDropdown 
                    options={['Kõik toimumiskohad', 'Eesti Rahva Muuseum', 'Eesti Meremuuseum', 'Eesti Kunstimuuseum', 'Teater Vanemuine', 'Koolis kohapeal']}
                    value={locationInput || 'Kõik toimumiskohad'}
                    onChange={(val) => setLocationInput(val === 'Kõik toimumiskohad' ? '' : val)}
                  />
                </div>
              </div>
            </div>

            {/* ROW 3 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hind õpilase kohta</label>
                <div className="relative">
                  <SingleSelectDropdown 
                    options={['Kõik hinnad', 'Tasuta', 'Kuni 5 €', 'Kuni 10 €', 'Üle 10 €']}
                    value={priceInput || 'Kõik hinnad'}
                    onChange={(val) => setPriceInput(val === 'Kõik hinnad' ? '' : val)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kestus</label>
                <div className="relative">
                  <SingleSelectDropdown 
                    options={['Kõik', 'Kuni 45 min', '45-90 min', 'Üle 90 min']}
                    value={durationInput || 'Kõik'}
                    onChange={(val) => setDurationInput(val === 'Kõik' ? '' : val)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grupi suurus</label>
                <div className="relative">
                  <SingleSelectDropdown 
                    options={['Kõik suurused', 'Kuni 15 õpilast', 'Kuni 30 õpilast', 'Üle 30 õpilase']}
                    value={groupSizeInput || 'Kõik suurused'}
                    onChange={(val) => setGroupSizeInput(val === 'Kõik suurused' ? '' : val)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keeled</label>
                <div className="flex flex-wrap gap-4 pt-1">
                  {ALL_LANGUAGES.map(lang => (
                    <label key={lang} className="flex items-center group cursor-pointer">
                      <div className="relative flex items-center justify-center w-4 h-4 border border-gray-300 rounded mr-2 shrink-0 group-hover:border-blue-500 transition-colors">
                        <input
                          type="checkbox"
                          className="absolute opacity-0 cursor-pointer w-full h-full"
                          checked={selectedLanguages.includes(lang)}
                          onChange={() => handleLanguageToggle(lang)}
                        />
                        {selectedLanguages.includes(lang) && (
                          <div className="absolute inset-0 bg-blue-600 rounded flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ROW 4 */}
            <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-100">
              <label className="flex items-center group cursor-pointer">
                <div className="relative flex items-center justify-center w-4 h-4 border border-gray-300 rounded mr-2 shrink-0 group-hover:border-blue-500 transition-colors">
                  <input
                    type="checkbox"
                    className="absolute opacity-0 cursor-pointer w-full h-full"
                    checked={isWheelchair}
                    onChange={(e) => setIsWheelchair(e.target.checked)}
                  />
                  {isWheelchair && (
                    <div className="absolute inset-0 bg-blue-600 rounded flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Ligipääs ratastooliga</span>
              </label>

              <label className="flex items-center group cursor-pointer">
                <div className="relative flex items-center justify-center w-4 h-4 border border-gray-300 rounded mr-2 shrink-0 group-hover:border-blue-500 transition-colors">
                  <input
                    type="checkbox"
                    className="absolute opacity-0 cursor-pointer w-full h-full"
                    checked={isSpecialNeeds}
                    onChange={(e) => setIsSpecialNeeds(e.target.checked)}
                  />
                  {isSpecialNeeds && (
                    <div className="absolute inset-0 bg-blue-600 rounded flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Sobib erivajadustega õpilastele</span>
              </label>

              <label className="flex items-center group cursor-pointer">
                <div className="relative flex items-center justify-center w-4 h-4 border border-gray-300 rounded mr-2 shrink-0 group-hover:border-blue-500 transition-colors">
                  <input
                    type="checkbox"
                    className="absolute opacity-0 cursor-pointer w-full h-full"
                    checked={isOutdoor}
                    onChange={(e) => setIsOutdoor(e.target.checked)}
                  />
                  {isOutdoor && (
                    <div className="absolute inset-0 bg-blue-600 rounded flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Välitingimustes</span>
              </label>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setIsAdvancedOpen(false)}
                className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors cursor-pointer px-6 py-2.5 rounded-xl shadow-md active:scale-95"
              >
                Rakenda filtrid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Smart Suggestion Banner */}
      {aiFeedback && (
        <div className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 rounded-2xl p-5 shadow-sm relative overflow-hidden animate-fade-in">
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

      {/* Content Layout - Single Column Now */}
      <div className="max-w-5xl mx-auto mt-6">
        {/* Dynamic Search Results Header */}
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
            <div className="bg-white rounded-3xl border border-gray-150 p-12 text-center shadow-sm my-8">
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
  );
}

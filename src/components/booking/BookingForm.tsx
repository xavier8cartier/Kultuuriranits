'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  Info, 
  Calendar, 
  Clock, 
  Users, 
  GraduationCap, 
  Building2, 
  MapPin,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Program, Booking } from '@/lib/types';
import { programs as mockPrograms } from '@/lib/mockData';

interface BookingFormProps {
  programId: string;
  pricePerStudent: number;
}

export function BookingForm({ programId, pricePerStudent }: BookingFormProps) {
  const [program, setProgram] = useState<Program | null>(null);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [studentsCount, setStudentsCount] = useState<number | ''>('');
  const [className, setClassName] = useState<string>('8A');
  const [schoolName, setSchoolName] = useState<string>('Tallinna Reaalkool');
  const [cityName, setCityName] = useState<string>('Tallinn');
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndData = () => {
      // 1. Authenticate user
      const savedUser = localStorage.getItem('kr_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setUserRole(user.role);
          if (user.school) setSchoolName(user.school);
          if (user.city) setCityName(user.city);
        } catch (e) {
          console.error('Failed to parse user', e);
        }
      } else {
        setUserRole(null);
      }

      // 2. Fetch program from localStorage or fallback to mockData
      const savedProgs = localStorage.getItem('kr_programs');
      let foundProg: Program | undefined;
      
      if (savedProgs) {
        try {
          const parsed = JSON.parse(savedProgs) as Program[];
          foundProg = parsed.find(p => p.id === programId);
        } catch (e) {
          console.error('Failed to parse saved programs', e);
        }
      }

      if (!foundProg) {
        foundProg = mockPrograms.find(p => p.id === programId);
      }

      if (foundProg) {
        // Hotfix: Migrate past dates to future dates
        if (foundProg.availableTimes && foundProg.availableTimes.some((t: string) => t.includes('2026-05-15'))) {
          foundProg.availableTimes = foundProg.availableTimes.map((t: string) => t.replace('2026-05-15', '2026-05-25'));
        }

        setProgram(foundProg);
        // Pre-select first date if available
        if (foundProg.availableTimes && foundProg.availableTimes.length > 0) {
          const uniqueDates = Array.from(
            new Set(foundProg.availableTimes.map((t: string) => t.split(' ')[0]))
          ).sort();
          if (uniqueDates.length > 0) {
            setDate(uniqueDates[0]);
          }
        }
      }

      setIsLoading(false);
    };

    checkAuthAndData();
    window.addEventListener('kr-auth-change', checkAuthAndData);
    return () => window.removeEventListener('kr-auth-change', checkAuthAndData);
  }, [programId]);

  const formatDateEstonian = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!program) return;

    const isPlatform = program.bookingMethod === 'platform';
    
    if (isPlatform && (!date || !time)) {
      setErrorMessage('Palun vali kuupäev ja kellaaeg!');
      return;
    }

    if (!studentsCount) {
      setErrorMessage('Palun sisesta õpilaste arv!');
      return;
    }

    // Validate group sizes
    const minSize = program.minGroupSize || 10;
    const maxSize = program.maxGroupSize || 30;

    if (studentsCount < minSize) {
      setErrorMessage(`Grupi minimaalne suurus sellel programmil on ${minSize} õpilast!`);
      return;
    }

    if (studentsCount > maxSize) {
      setErrorMessage(`Grupi maksimaalne suurus sellel programmil on ${maxSize} õpilast!`);
      return;
    }

    // Save Booking to localStorage
    try {
      const newBooking: any = {
        id: 'b_' + Date.now(),
        programId: program.id,
        programTitle: program.title,
        date: date,
        time: time,
        studentsCount: Number(studentsCount),
        className: className || '8A',
        schoolName: schoolName || 'Tallinna Reaalkool',
        cityName: cityName || 'Tallinn',
        duration: program.duration || '90 min',
        status: 'ootel'
      };

      const savedBookings = localStorage.getItem('kr_bookings');
      let bookingsList = [];
      if (savedBookings) {
        try {
          bookingsList = JSON.parse(savedBookings);
        } catch (e) {
          console.error(e);
        }
      }

      // Prepend and save
      bookingsList.unshift(newBooking);
      localStorage.setItem('kr_bookings', JSON.stringify(bookingsList));
      
      // Dispatch event to notify others
      window.dispatchEvent(new Event('kr-bookings-updated'));

      setIsSubmitted(true);
    } catch (e) {
      setErrorMessage('Broneeringu salvestamisel tekkis viga. Palun proovi uuesti.');
      console.error(e);
    }
  };

  const totalPrice = typeof studentsCount === 'number' ? studentsCount * pricePerStudent : 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded-xl"></div>
        <div className="h-20 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  // Only teachers see the booking form.
  if (userRole !== 'teacher') {
    return null;
  }

  if (!program) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-semibold flex items-center gap-2">
        <Info className="w-5 h-5" />
        Seda kultuuriprogrammi ei leitud.
      </div>
    );
  }

  const isPlatform = program.bookingMethod === 'platform';

  // Extract available dates and times
  const availableTimesList = program.availableTimes || [];
  const availableDates = Array.from(
    new Set(availableTimesList.map((t: string) => t.split(' ')[0]))
  ).sort();

  const timesForSelectedDate = availableTimesList
    .filter((t: string) => t.startsWith(date))
    .map((t: string) => t.split(' ')[1] || t)
    .sort();

  if (isSubmitted) {
    return (
      <div className="bg-green-50 rounded-2xl p-6 md:p-8 border border-green-200 text-center animate-in fade-in zoom-in-95 duration-300 shadow-sm">
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-2xl bg-green-100 text-green-600 mb-5 shadow-xs">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-extrabold text-green-950 mb-3">Broneeringu päring edastatud!</h3>
        
        <div className="bg-white rounded-xl border border-green-100 p-4 mb-5 text-sm font-semibold text-gray-700 space-y-2 text-left max-w-md mx-auto shadow-2xs">
          <div className="flex justify-between border-b border-gray-50 pb-1.5">
            <span className="text-gray-400">Programm:</span>
            <span className="text-gray-900 font-extrabold">{program.title}</span>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-1.5">
            <span className="text-gray-400">Kuupäev ja aeg:</span>
            <span className="text-gray-900 font-extrabold">{formatDateEstonian(date)} kell {time}</span>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-1.5">
            <span className="text-gray-400">Osalejad:</span>
            <span className="text-gray-900 font-extrabold">{studentsCount} õpilast ({className})</span>
          </div>
          <div className="flex justify-between pt-0.5">
            <span className="text-gray-400">Eelarve (Kultuuriranits):</span>
            <span className="text-green-600 font-extrabold text-base">{totalPrice} €</span>
          </div>
        </div>

        <p className="text-xs text-green-700 font-semibold leading-relaxed mb-6 max-w-md mx-auto">
          Kultuuriasutus vaatab päringu üle. Kinnituse korral broneeritakse kuupäev ning summa arveldatakse automaatselt kooli Kultuuriranitsa jäägist.
        </p>

        <button 
          onClick={() => {
            setIsSubmitted(false);
            setStudentsCount('');
            setTime('');
          }}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
        >
          Teosta uus broneering
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-md space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-xl font-extrabold text-gray-900">Broneerimine</h3>
        <p className="text-xs text-gray-500 font-semibold mt-1">
          {isPlatform 
            ? 'Valige allolevatest vabadest aegadest teile sobivaim.' 
            : 'Seda programmi broneeritakse asutusega otse ühendust võttes.'}
        </p>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-bold leading-normal flex items-start gap-2.5 shadow-2xs animate-shake">
          <Info className="w-4.5 h-4.5 shrink-0 text-red-500 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isPlatform ? (
        /* PLATFORM BOOKING SYSTEM */
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* STEP 1: Date Dropdown Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block">
              1. Vali kuupäev:
            </label>
            {availableDates.length > 0 ? (
              <select
                required
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTime(''); // Reset time on date change
                }}
                className="block w-full px-4 py-3.5 bg-gray-50 hover:bg-gray-100/50 border border-gray-250 hover:border-gray-300 rounded-xl text-base font-extrabold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all cursor-pointer h-[54px] shadow-2xs"
              >
                <option value="" disabled className="font-bold text-gray-400">-- Vali kuupäev --</option>
                {availableDates.map((d) => (
                  <option key={d} value={d} className="font-bold text-gray-800">
                    {formatDateEstonian(d)}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-500 italic border border-gray-150 font-semibold">
                Hetkel vabu kuupäevi platvormil pole.
              </div>
            )}
          </div>

          {/* STEP 2: Time Grid Picker */}
          {date && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block">
                2. Vali kellaaeg:
              </label>
              {timesForSelectedDate.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {timesForSelectedDate.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTime(t)}
                      className={`py-3 px-4 border rounded-xl text-sm font-extrabold transition-all cursor-pointer text-center shadow-2xs ${
                        time === t
                          ? 'bg-green-600 text-white border-green-600 shadow-sm'
                          : 'bg-white hover:bg-green-50/50 text-gray-700 border-gray-250 hover:border-green-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-bold text-red-500 italic">Sellel kuupäeval pole vabu aegu.</p>
              )}
            </div>
          )}

          {/* STEP 3: Student Details & Constraints */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">3. Grupi andmed:</span>

            {/* School & Class details (Pre-filled, editable) */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Kool:</label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 shadow-2xs focus:outline-none h-[48px]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Klass:</label>
                <input
                  type="text"
                  required
                  placeholder="nt 8A"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 shadow-2xs focus:outline-none h-[48px]"
                />
              </div>
            </div>

            {/* Students Count Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block">
                Õpilaste arv:
              </label>
              <input
                type="number"
                required
                min={program.minGroupSize || 10}
                max={program.maxGroupSize || 30}
                value={studentsCount}
                onChange={(e) => setStudentsCount(parseInt(e.target.value) || '')}
                placeholder={`min ${program.minGroupSize || 10} kuni max ${program.maxGroupSize || 30}`}
                className="block w-full px-4 py-3.5 bg-white border border-gray-250 rounded-xl text-base font-semibold text-gray-850 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all h-[54px] shadow-2xs"
              />
              <span className="text-[10px] text-gray-400 font-bold block">
                Grupi suurus peab olema vahemikus {program.minGroupSize || 10} kuni {program.maxGroupSize || 30} õpilast.
              </span>
            </div>
          </div>

          {/* Pricing & Checkout Submit */}
          <div className="pt-4 border-t border-gray-100 mt-6 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Kogusumma:</span>
              <span className="text-2xl font-black text-gray-900 leading-none mt-1">{totalPrice} €</span>
              <span className="text-[9px] text-gray-400 font-bold mt-1">({pricePerStudent}€ / õpilane)</span>
            </div>
            
            <button
              type="submit"
              disabled={!date || !time || !studentsCount}
              className="bg-green-600 hover:bg-green-700 border border-green-600 text-white py-3.5 px-8 rounded-xl text-base font-extrabold transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer disabled:bg-gray-250 disabled:border-gray-250 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2 h-[54px]"
            >
              Saada päring
              <ChevronRight className="w-5 h-5 shrink-0" />
            </button>
          </div>
        </form>
      ) : (
        /* CONTACT BOOKING METHOD SCREEN (Premium) */
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-150 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl shrink-0 shadow-2xs">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 leading-snug">Muu broneerimiskanal</h4>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">Seda programmi ei broneerita otse platvormil. Võtke ühendust asutusega.</p>
              </div>
            </div>

            <p className="text-xs text-gray-700 font-medium leading-relaxed">
              Palun edastage oma soov asutuse haridusjuhile alltoodud kontaktandmete kaudu. Märkige kindlasti soovitud kuupäevad, kooli nimi ja klassi suurus!
            </p>
          </div>

          <div className="space-y-3">
            {program.contactEmail && (
              <a 
                href={`mailto:${program.contactEmail}?subject=Kultuuriranits: Broneeringu soov - ${program.title}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-150 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-2xs group"
              >
                <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0 border border-gray-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kirjuta e-kiri:</span>
                  <span className="text-sm font-extrabold text-blue-600 break-all">{program.contactEmail}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </a>
            )}

            {program.contactPhone && (
              <a 
                href={`tel:${program.contactPhone}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-150 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-2xs group"
              >
                <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-green-50 group-hover:text-green-600 transition-colors shrink-0 border border-gray-100">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Helista telefonil:</span>
                  <span className="text-sm font-extrabold text-gray-800">{program.contactPhone}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
              </a>
            )}
          </div>

          {program.additionalInfo && (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-xs font-semibold text-gray-600 flex gap-2">
              <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-gray-700 block mb-1">Märkused:</span>
                "{program.additionalInfo}"
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

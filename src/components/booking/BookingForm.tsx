'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Lock, User } from 'lucide-react';

interface BookingFormProps {
  programId: string;
  pricePerStudent: number;
}

export function BookingForm({ programId, pricePerStudent }: BookingFormProps) {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [studentsCount, setStudentsCount] = useState<number | ''>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('kr_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setUserRole(user.role);
        } catch (e) {
          console.error('Failed to parse user', e);
        }
      } else {
        setUserRole(null);
      }
      setIsLoading(false);
    };

    checkAuth();
    window.addEventListener('kr-auth-change', checkAuth);
    return () => window.removeEventListener('kr-auth-change', checkAuth);
  }, []);

  const availableTimes = ['10:00', '11:30', '13:00'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time && studentsCount) {
      // In a real app, this would make an API call
      setIsSubmitted(true);
    }
  };

  const totalPrice = typeof studentsCount === 'number' ? studentsCount * pricePerStudent : 0;

  if (isLoading) {
    return <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-pulse h-64"></div>;
  }

  // Only teachers see the booking form. Guests and Museums see nothing here.
  if (userRole !== 'teacher') {
    return null;
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-green-900 mb-2">Broneeringu päring edastatud!</h3>
        <p className="text-sm text-green-700 mb-4">
          Aeg: <strong>{date.split('-').reverse().join('.')} kell {time}</strong><br/>
          Õpilasi: <strong>{studentsCount}</strong>
        </p>
        <p className="text-sm text-green-700 mb-6">
          Kultuuriasutus vaatab päringu üle. Kinnituse korral arveldatakse summa <strong>{totalPrice}€</strong> automaatselt kooli Kultuuriranitsa eelarvest.
        </p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="inline-flex justify-center px-6 py-2.5 text-sm font-bold text-white bg-green-600 border border-transparent rounded-full shadow-md hover:bg-green-700 transition-all"
        >
          Teosta uus broneering
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-in fade-in duration-500">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Broneerimine</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Vali kuupäev:
          </label>
          <input 
            type="date" 
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 border transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Vali kellaaeg:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                className={`py-2.5 px-3 border rounded-xl text-sm font-bold transition-all ${
                  time === t 
                    ? 'bg-green-50 border-green-500 text-green-700 shadow-sm ring-1 ring-green-500' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Mitmele õpilasele soovid broneerida?
          </label>
          <input 
            type="number" 
            required
            min="1"
            max="100"
            value={studentsCount}
            onChange={(e) => setStudentsCount(parseInt(e.target.value) || '')}
            placeholder="Sisesta arv (nt 20)"
            className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 border transition-colors"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 mt-6 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-gray-500 font-medium">Kogusumma:</span>
            <div className="text-2xl font-black text-gray-900">{totalPrice} €</div>
          </div>
          <button
            type="submit"
            disabled={!date || !time || !studentsCount}
            className="inline-flex justify-center py-3 px-8 border border-transparent shadow-lg text-sm font-bold rounded-full text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed transition-all transform active:scale-95"
          >
            Saada päring
          </button>
        </div>
      </form>
    </div>
  );
}

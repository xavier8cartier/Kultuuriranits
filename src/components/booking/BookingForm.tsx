'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface BookingFormProps {
  programId: string;
  pricePerStudent: number;
}

export function BookingForm({ programId, pricePerStudent }: BookingFormProps) {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [studentsCount, setStudentsCount] = useState<number | ''>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const availableTimes = ['10:00', '11:30', '13:00'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time && studentsCount) {
      // In a real app, this would make an API call
      setIsSubmitted(true);
    }
  };

  const totalPrice = typeof studentsCount === 'number' ? studentsCount * pricePerStudent : 0;

  if (isSubmitted) {
    return (
      <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-green-900 mb-2">Broneeringu päring edastatud!</h3>
        <p className="text-sm text-green-700 mb-4">
          Aeg: <strong>{date.split('-').reverse().join('.')} kell {time}</strong><br/>
          Õpilasi: <strong>{studentsCount}</strong>
        </p>
        <p className="text-sm text-green-700 mb-6">
          Kultuuriasutus vaatab päringu üle. Kinnituse korral arveldatakse summa <strong>{totalPrice}€</strong> automaatselt kooli Kultuuriranitsa eelarvest.
        </p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Vaata minu broneeringuid
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Broneerimine</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vali kuupäev:
          </label>
          <input 
            type="date" 
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vali kellaaeg:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                className={`py-2 px-3 border rounded-md text-sm font-medium ${
                  time === t 
                    ? 'bg-green-50 border-green-500 text-green-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>

        <div className="pt-4 border-t border-gray-200 mt-6 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-gray-500">Kogusumma:</span>
            <span className="ml-2 text-xl font-bold text-gray-900">{totalPrice} €</span>
          </div>
          <button
            type="submit"
            disabled={!date || !time || !studentsCount}
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Saada päring
          </button>
        </div>
      </form>
    </div>
  );
}

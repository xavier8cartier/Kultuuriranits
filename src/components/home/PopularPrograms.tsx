'use client';

import { useState, useEffect } from 'react';
import { programs } from '@/lib/mockData';
import { Users, GraduationCap, Banknote, MapPin } from 'lucide-react';
import Link from 'next/link';

export function PopularPrograms() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
    };

    checkAuth();
    window.addEventListener('kr-auth-change', checkAuth);
    return () => window.removeEventListener('kr-auth-change', checkAuth);
  }, []);

  // Show first 3 programs as popular
  const popularPrograms = programs.slice(0, 3);

  return (
    <div className="py-8 mb-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Populaarsed programmid</h2>
          <p className="text-gray-600">Enim broneeritud ja kõrgelt hinnatud programmid</p>
        </div>
        <Link href="/otsi" className="text-green-600 font-semibold hover:underline">
          Vaata kõiki &rarr;
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {popularPrograms.map((program) => (
          <div key={program.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={program.image} 
                alt={program.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                  Populaarne
                </span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{program.title}</h3>
                <div className="flex items-center text-gray-500 text-sm gap-1 mb-1">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="font-medium">{program.organizer}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-auto">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                  </div>
                  <span>{Array.isArray(program.targetGroups) ? program.targetGroups[0] : program.targetGroups}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="truncate">{program.participantCount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Banknote className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="font-bold text-gray-900">{program.price}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50">
                <Link 
                  href={`/programm/${program.id}`}
                  className="block w-full text-center py-3 rounded-xl bg-gray-50 text-gray-900 font-semibold hover:bg-green-600 hover:text-white transition-colors"
                >
                  {userRole === 'teacher' ? 'Vaata detaile ja broneeri' : 'Vaata detaile'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { BookingForm } from '@/components/booking/BookingForm';

interface ProgramLayoutProps {
  programId: string;
  priceValue: number;
  children: React.ReactNode;
}

export function ProgramDetailLayout({ programId, priceValue, children }: ProgramLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('kr_user');
    setIsLoggedIn(!!savedUser);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
        <div className="lg:col-span-2 bg-gray-100 h-[600px] rounded-2xl"></div>
        <div className="lg:col-span-1 bg-gray-100 h-[400px] rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-8 ${isLoggedIn ? 'lg:grid-cols-3' : 'max-w-3xl mx-auto'}`}>
      <div className={isLoggedIn ? 'lg:col-span-2' : ''}>
        {children}
      </div>
      
      {isLoggedIn && (
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BookingForm programId={programId} pricePerStudent={priceValue} />
          </div>
        </div>
      )}
    </div>
  );
}

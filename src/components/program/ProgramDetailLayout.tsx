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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('kr_user');
    setIsLoggedIn(!!savedUser);
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserRole(user.role);
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const showBookingForm = isLoggedIn && userRole === 'teacher';

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6 max-w-4xl mx-auto w-full">
        <div className="bg-gray-100 h-[300px] rounded-2xl"></div>
        <div className="h-8 bg-gray-100 rounded w-3/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded w-full"></div>
          <div className="h-4 bg-gray-100 rounded w-5/6"></div>
          <div className="h-4 bg-gray-100 rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={showBookingForm ? 'grid grid-cols-1 lg:grid-cols-3 gap-8 w-full' : 'max-w-4xl mx-auto w-full'}>
      <div className={showBookingForm ? 'lg:col-span-2' : 'w-full'}>
        {children}
      </div>
      
      {showBookingForm && (
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BookingForm programId={programId} pricePerStudent={priceValue} />
          </div>
        </div>
      )}
    </div>
  );
}


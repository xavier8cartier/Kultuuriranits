'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Booking, Program } from '@/lib/types';
import { 
  CalendarRange, 
  MapPin, 
  Clock, 
  Users, 
  School,
  ShieldAlert,
  ChevronRight,
  MessageSquare,
  Star,
  CheckCircle,
  X
} from 'lucide-react';
import { defaultBookings } from '@/lib/mockData';

export default function MinuBroneeringudPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'koik' | 'tulevased' | 'moodunud'>('koik');
  
  // Feedback modal state
  const [feedbackBooking, setFeedbackBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  
  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    const savedBookings = localStorage.getItem('kr_bookings');
    if (savedBookings) {
      try {
        // Teacher sees all their bookings. In this prototype, we'll assume all are theirs.
        setBookingsList(JSON.parse(savedBookings));
      } catch (e) {
        setBookingsList(defaultBookings);
      }
    } else {
      setBookingsList(defaultBookings);
    }

    const handleAuthChange = () => {
      setUserRole(localStorage.getItem('userRole'));
    };
    window.addEventListener('kr-auth-change', handleAuthChange);
    return () => window.removeEventListener('kr-auth-change', handleAuthChange);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQuickLoginTeacher = () => {
    const teacherUser = { role: 'teacher', name: 'Mari Maasikas (Õpetaja)' };
    localStorage.setItem('kr_user', JSON.stringify(teacherUser));
    localStorage.setItem('userRole', 'teacher');
    setUserRole('teacher');
    window.dispatchEvent(new Event('kr-auth-change'));
  };

  const submitFeedback = () => {
    if (!feedbackBooking) return;
    if (rating === 0) {
      showToast('Palun vali hinnang (tärnid).');
      return;
    }
    
    // Update kr_programs
    const savedProgs = localStorage.getItem('kr_programs');
    if (savedProgs) {
      try {
        const programs: Program[] = JSON.parse(savedProgs);
        const updatedPrograms = programs.map(p => {
          if (p.id === feedbackBooking.programId) {
            const newReview = {
              id: 'rev_' + Date.now(),
              authorName: 'Mari Maasikas',
              authorSchool: feedbackBooking.schoolName,
              rating,
              comment,
              date: new Date().toLocaleDateString('et-EE')
            };
            return {
              ...p,
              reviews: p.reviews ? [newReview, ...p.reviews] : [newReview]
            };
          }
          return p;
        });
        localStorage.setItem('kr_programs', JSON.stringify(updatedPrograms));
      } catch (e) {}
    }
    
    // Add a flag to booking so we know it has feedback
    const updatedBookings = bookingsList.map(b => {
      if (b.id === feedbackBooking.id) {
        return { ...b, hasFeedback: true } as Booking;
      }
      return b;
    });
    setBookingsList(updatedBookings);
    localStorage.setItem('kr_bookings', JSON.stringify(updatedBookings));

    setFeedbackBooking(null);
    setRating(0);
    setComment('');
    showToast('Tagasiside edukalt salvestatud. Aitäh!');
  };

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
              See vaade on mõeldud ainult õpetajatele. Logi sisse õpetaja kontoga, et hallata oma broneeringuid.
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

  // Define today for mock filtering (let's say 20.05.2026 is today)
  const todayStr = '2026-05-20';

  const filteredBookings = bookingsList.filter(b => {
    if (activeTab === 'tulevased') return b.date >= todayStr;
    if (activeTab === 'moodunud') return b.date < todayStr;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl animate-slide-in border border-gray-800">
          <div className="p-1 rounded-full bg-green-500 text-white">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Minu broneeringud</h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Sinu klasside kultuuriprogrammide broneeringud
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-gray-100 p-1.5 rounded-full w-fit">
        <button
          onClick={() => setActiveTab('koik')}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'koik' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Kõik
        </button>
        <button
          onClick={() => setActiveTab('tulevased')}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'tulevased' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Tulevased
        </button>
        <button
          onClick={() => setActiveTab('moodunud')}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'moodunud' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Möödunud
        </button>
      </div>

      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => {
            const isPast = booking.date < todayStr;
            const hasFeedback = (booking as any).hasFeedback;
            
            return (
              <div key={booking.id} className="bg-white rounded-2xl border border-gray-150 p-6 flex flex-col md:flex-row gap-6 items-center shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{booking.programTitle}</h3>
                    {booking.status === 'kinnitatud' && (
                      <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-green-200">
                        Kinnitatud
                      </span>
                    )}
                    {booking.status === 'ootel' && (
                      <span className="bg-yellow-50 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-yellow-200">
                        Ootel
                      </span>
                    )}
                    {booking.status === 'tagasilukatud' && (
                      <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-red-200">
                        Tagasi lükatud
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <CalendarRange className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-700">{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-700">{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-700">{booking.studentsCount} õpilast</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-700">{booking.cityName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                  <Link 
                    href={`/programm/${booking.programId}`}
                    className="flex items-center justify-center gap-1.5 px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm transition-colors border border-gray-200"
                  >
                    Vaata programmi
                  </Link>
                  {isPast && booking.status === 'kinnitatud' && !hasFeedback && (
                    <button 
                      onClick={() => setFeedbackBooking(booking)}
                      className="flex items-center justify-center gap-1.5 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-colors shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Jäta tagasiside
                    </button>
                  )}
                  {hasFeedback && (
                    <span className="flex items-center justify-center gap-1.5 px-6 py-2.5 bg-green-50 text-green-700 rounded-xl font-bold text-sm border border-green-200">
                      <CheckCircle className="w-4 h-4" />
                      Tagasiside antud
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-150">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sul pole broneeringuid</h3>
            <p className="text-sm text-gray-500 mb-6">Otsi sobivaid programme ja tee esimene broneering.</p>
            <Link 
              href="/otsi"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors"
            >
              Sirvi programme
            </Link>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setFeedbackBooking(null)}
          ></div>
          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-150 w-full max-w-lg overflow-hidden animate-slide-in">
            <div className="bg-gray-50 px-6 py-5 border-b border-gray-150 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Jäta tagasiside</h2>
                <p className="text-xs text-gray-500 font-medium mt-1">{feedbackBooking.programTitle}</p>
              </div>
              <button
                onClick={() => setFeedbackBooking(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Kuidas hindad programmi?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star className={`w-8 h-8 ${rating >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Sinu kommentaar</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Mis meeldis? Mida saaks paremini?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none text-sm text-gray-700"
                ></textarea>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-150 flex justify-end gap-3">
              <button
                onClick={() => setFeedbackBooking(null)}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                Tühista
              </button>
              <button
                onClick={submitFeedback}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors"
              >
                Salvesta tagasiside
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

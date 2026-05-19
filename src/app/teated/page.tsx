'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar as CalendarIcon, 
  X, 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  MessageSquare, 
  PlusCircle, 
  Building2, 
  ShieldAlert,
  Info,
  CheckCircle,
  Eye
} from 'lucide-react';
import { Notification } from '@/lib/types';
import { defaultNotifications } from '@/lib/mockData';

export default function TeatedPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [notificationsList, setNotificationsList] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  
  // Pagination mock states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info'>('success');

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    // Check Auth Role
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    // Initialize notifications from localStorage
    const savedNotifications = localStorage.getItem('kr_notifications');
    if (savedNotifications) {
      try {
        setNotificationsList(JSON.parse(savedNotifications));
      } catch (e) {
        console.error('Failed to parse notifications', e);
        localStorage.setItem('kr_notifications', JSON.stringify(defaultNotifications));
        setNotificationsList(defaultNotifications);
      }
    } else {
      localStorage.setItem('kr_notifications', JSON.stringify(defaultNotifications));
      setNotificationsList(defaultNotifications);
    }

    // Auth change listener
    const handleAuthChange = () => {
      const currentRole = localStorage.getItem('userRole');
      setUserRole(currentRole);
    };

    window.addEventListener('kr-auth-change', handleAuthChange);
    return () => window.removeEventListener('kr-auth-change', handleAuthChange);
  }, []);

  const handleQuickLoginMuseum = () => {
    const museumUser = { role: 'museum', name: 'Eesti Rahva Muuseum' };
    localStorage.setItem('kr_user', JSON.stringify(museumUser));
    localStorage.setItem('userRole', 'museum');
    setUserRole('museum');
    
    // Dispatch event so Navbar re-renders
    window.dispatchEvent(new Event('kr-auth-change'));
    showToast('Sisse logitud Eesti Rahva Muuseumina!', 'success');
  };

  // Mark notification as read
  const handleViewNotification = (notif: Notification) => {
    setSelectedNotification(notif);
    
    if (!notif.isRead) {
      const updatedList = notificationsList.map(n => {
        if (n.id === notif.id) {
          return { ...n, isRead: true };
        }
        return n;
      });
      
      setNotificationsList(updatedList);
      localStorage.setItem('kr_notifications', JSON.stringify(updatedList));
      
      // Dispatch event to update navbar badge
      window.dispatchEvent(new Event('kr-notifications-updated'));
    }
  };

  // Reset notifications to default for easy testing
  const handleResetNotifications = () => {
    localStorage.setItem('kr_notifications', JSON.stringify(defaultNotifications));
    setNotificationsList(defaultNotifications);
    window.dispatchEvent(new Event('kr-notifications-updated'));
    showToast('Teated lähtestatud algseisu!', 'info');
  };

  // Filter logic
  const filteredNotifications = notificationsList.filter(n => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Format YYYY-MM-DD to DD.MM.YYYY to match date filter if specified
    let matchesDate = true;
    if (dateFilter) {
      const [year, month, day] = dateFilter.split('-');
      const formattedFilterDate = `${day}.${month}.${year}`;
      matchesDate = n.date === formattedFilterDate;
    }
    
    return matchesSearch && matchesDate;
  });

  // Calculate unread count
  const unreadCount = notificationsList.filter(n => !n.isRead).length;

  // Access Control Restricted View
  if (userRole !== 'museum') {
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
              See vaade on mõeldud ainult registreeritud kultuuriasutustele. Logi sisse kultuuriasutuse kontoga, et näha oma teateid.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleQuickLoginMuseum}
                className="bg-blue-600 text-white px-8 py-3.5 rounded-full text-base font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform active:scale-95 cursor-pointer"
              >
                <Building2 className="w-5 h-5" />
                Logi sisse kultuuriasutusena
              </button>
              
              <a
                href="/"
                className="bg-gray-100 text-gray-700 border border-gray-200 px-8 py-3.5 rounded-full text-base font-bold hover:bg-gray-200 transition-all transform active:scale-95 text-center flex items-center justify-center"
              >
                Tagasi pealehele
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render main teated dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl animate-slide-in border border-gray-800">
          {toastType === 'success' ? (
            <div className="p-1 rounded-full bg-green-500 text-white">
              <CheckCircle className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1 rounded-full bg-blue-500 text-white">
              <Info className="w-4 h-4" />
            </div>
          )}
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Teated</h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block animate-pulse"></span>
            Lugemata teateid: <span className="font-extrabold text-blue-700">{unreadCount}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleResetNotifications}
            className="text-xs text-gray-500 hover:text-blue-600 bg-white border border-gray-200 hover:border-blue-300 px-4 py-2 rounded-full font-medium transition-all shadow-xs shrink-0 cursor-pointer"
          >
            Lähtesta teated
          </button>
        </div>
      </div>

      {/* Filters section */}
      <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-md mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Otsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-3 shrink-0">
          <label className="text-sm font-bold text-gray-700">Kuupäev:</label>
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-4 pr-10 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-gray-700 bg-white transition-all cursor-pointer min-w-[160px]"
            />
            {dateFilter ? (
              <button 
                onClick={() => setDateFilter('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            ) : (
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            )}
          </div>
        </div>
      </div>

      {/* Notifications Table / List */}
      <div className="bg-white rounded-3xl border border-gray-150 shadow-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4.5 text-xs font-extrabold uppercase tracking-wider text-gray-500 w-7/12">Teade</th>
                <th className="px-6 py-4.5 text-xs font-extrabold uppercase tracking-wider text-gray-500 w-2/12">Saatja</th>
                <th className="px-6 py-4.5 text-xs font-extrabold uppercase tracking-wider text-gray-500 w-1.5/12">Kuupäev</th>
                <th className="px-6 py-4.5 text-xs font-extrabold uppercase tracking-wider text-gray-500 w-1.5/12 text-center">Toimingud</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif) => {
                  // Icon picker based on type
                  const getIcon = () => {
                    switch (notif.type) {
                      case 'cancel':
                        return <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />;
                      case 'feedback':
                        return <MessageSquare className="w-5 h-5 text-amber-500 shrink-0" />;
                      case 'booking':
                        return <PlusCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
                      default:
                        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
                    }
                  };

                  return (
                    <tr 
                      key={notif.id}
                      className="hover:bg-gray-50/50 transition-colors group relative text-gray-600"
                    >
                      {/* Title column */}
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-50 border border-gray-150 rounded-xl mt-0.5 shadow-xs">
                            {getIcon()}
                          </div>
                          <div>
                            <span className={`block leading-snug ${
                              !notif.isRead ? 'text-gray-900 font-extrabold' : 'text-gray-700 font-medium'
                            }`}>
                              {notif.title}
                            </span>
                            <span className="text-xs text-gray-400 font-normal mt-1 block">
                              {notif.time ? `${notif.time} • ` : ''}{notif.content.substring(0, 75)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Sender column */}
                      <td className="px-6 py-5">
                        <span className={`text-sm ${
                          !notif.isRead ? 'text-gray-900 font-extrabold' : 'text-gray-600 font-medium'
                        }`}>
                          {notif.sender}
                        </span>
                      </td>

                      {/* Date column */}
                      <td className="px-6 py-5 text-sm whitespace-nowrap">
                        <span className={`text-sm ${
                          !notif.isRead ? 'text-gray-900 font-extrabold' : 'text-gray-500 font-medium'
                        }`}>
                          {notif.date}
                        </span>
                      </td>

                      {/* Action column */}
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => handleViewNotification(notif)}
                          className="bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-200 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs hover:shadow-md transform active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Vaata</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 text-gray-400 mb-4">
                        <Bell className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">Teateid ei leitud</h3>
                      <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                        Ükski teade ei vasta sisestatud filtrile või otsingusõnale. Proovi filtreid tühjendada.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination component matching the prototype */}
      <div className="flex items-center justify-center gap-2 mt-4 font-semibold text-sm">
        <button 
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-800 disabled:opacity-40 disabled:hover:bg-white disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Eelmine</span>
        </button>

        <button 
          onClick={() => setCurrentPage(1)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
            currentPage === 1 
              ? 'bg-gray-900 text-white' 
              : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
          }`}
        >
          1
        </button>

        <button 
          onClick={() => setCurrentPage(2)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
            currentPage === 2 
              ? 'bg-gray-900 text-white' 
              : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
          }`}
        >
          2
        </button>

        <button 
          onClick={() => setCurrentPage(3)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
            currentPage === 3 
              ? 'bg-gray-900 text-white' 
              : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
          }`}
        >
          3
        </button>

        <span className="px-1.5 text-gray-400">...</span>

        <button 
          onClick={() => setCurrentPage(67)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors hidden sm:flex ${
            currentPage === 67 
              ? 'bg-gray-900 text-white' 
              : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
          }`}
        >
          67
        </button>

        <button 
          onClick={() => setCurrentPage(68)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
            currentPage === 68 
              ? 'bg-gray-900 text-white' 
              : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
          }`}
        >
          68
        </button>

        <button 
          onClick={() => currentPage < 68 && setCurrentPage(currentPage + 1)}
          disabled={currentPage === 68}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-800 disabled:opacity-40 disabled:hover:bg-white disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <span>Järgmine</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Glassmorphic detailed popup modal overlay */}
      {selectedNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedNotification(null)}
          ></div>
          
          {/* Modal box */}
          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-150 w-full max-w-2xl overflow-hidden transform transition-all duration-300 scale-100 opacity-100 animate-slide-in">
            {/* Top Close x */}
            <button
              onClick={() => setSelectedNotification(null)}
              className="absolute top-5 right-5 p-2 bg-gray-50 hover:bg-gray-100 border border-gray-150 hover:border-gray-200 rounded-full transition-all text-gray-500 hover:text-gray-800 cursor-pointer shadow-xs"
              aria-label="Sule aken"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-6 border-b border-gray-150 flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-2xl text-blue-700 border border-blue-200">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400">
                  {selectedNotification.type === 'cancel' ? 'Tühistamine' : selectedNotification.type === 'feedback' ? 'Tagasiside' : 'Uus broneering'}
                </span>
                <h2 className="text-lg font-bold text-gray-900 mt-0.5 leading-snug">Teate üksikasjad</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-gray-700 text-sm">
              {/* Pealkiri */}
              <div>
                <h4 className="font-extrabold text-gray-400 text-xs uppercase tracking-wider mb-1.5">Pealkiri:</h4>
                <p className="font-extrabold text-gray-900 text-base leading-snug">{selectedNotification.title}</p>
              </div>

              {/* Sisu */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-extrabold text-gray-400 text-xs uppercase tracking-wider mb-1.5">Sisu:</h4>
                <p className="leading-relaxed whitespace-pre-line text-gray-800 font-medium">
                  {selectedNotification.content}
                </p>
              </div>

              {/* Detail fields in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-xs font-semibold">
                {selectedNotification.bookingDate && (
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block mb-1">Kuupäev ja kellaaeg:</span>
                    <span className="text-gray-900 text-sm font-bold block">{selectedNotification.bookingDate}</span>
                  </div>
                )}
                
                {selectedNotification.broneerija && (
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block mb-1">Broneerija:</span>
                    <span className="text-gray-900 text-sm font-bold block">{selectedNotification.broneerija}</span>
                  </div>
                )}

                {selectedNotification.studentsCount !== undefined && (
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block mb-1">Osalejate arv:</span>
                    <span className="text-gray-900 text-sm font-bold block">{selectedNotification.studentsCount} õpilast</span>
                  </div>
                )}

                {selectedNotification.location && (
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider block mb-1">Asukoht:</span>
                    <span className="text-gray-900 text-sm font-bold block">{selectedNotification.location}</span>
                  </div>
                )}
              </div>

              {/* Action Note */}
              <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-semibold">
                  {selectedNotification.type === 'feedback' 
                    ? 'Tagasiside täpsemaid detaile saate vaadata asukohast Töölaud -> Programmid -> Vaata tagasisidet.'
                    : 'Broneeringu täpsemad andmed leiate asukohast Töölaud -> Broneeringud.'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedNotification(null)}
                className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                Sule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

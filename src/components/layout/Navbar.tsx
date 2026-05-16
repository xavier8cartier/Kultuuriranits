'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { User, Bell, LogOut, ChevronDown, X, Shield, School, Landmark } from 'lucide-react';
import { usePathname } from 'next/navigation';

type UserRole = 'guest' | 'teacher' | 'museum' | 'admin';

interface UserInfo {
  role: UserRole;
  name: string;
}

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('kr_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }

    // Click outside handler for profile dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = (role: UserRole) => {
    let name = '';
    switch (role) {
      case 'teacher': name = 'Mari Maasikas (Õpetaja)'; break;
      case 'museum': name = 'Eesti Rahva Muuseum'; break;
    }
    
    const newUser = { role, name };
    setUser(newUser);
    localStorage.setItem('kr_user', JSON.stringify(newUser));
    localStorage.setItem('userRole', role);
    setIsLoginModalOpen(false);
    
    // Notify other components
    window.dispatchEvent(new Event('kr-auth-change'));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kr_user');
    localStorage.removeItem('userRole');
    setIsProfileOpen(false);
    
    // Notify other components
    window.dispatchEvent(new Event('kr-auth-change'));
  };

  const getNavLinks = () => {
    const common = [{ name: 'Avaleht', href: '/' }];
    
    if (!user) {
      return [
        ...common,
        { name: 'Kultuuriprogrammid', href: '/otsi' },
      ];
    }

    switch (user.role) {
      case 'teacher':
        return [
          ...common,
          { name: 'Kultuuriprogrammid', href: '/otsi' },
          { name: 'Minu broneeringud', href: '#' },
          { name: 'Lemmikud', href: '#' },
        ];
      case 'museum':
        return [
          ...common,
          { name: 'Minu programmid', href: '#' },
          { name: 'Broneeringute haldus', href: '#' },
        ];
      case 'admin':
        return [
          ...common,
          { name: 'Kõik programmid', href: '#' },
          { name: 'Kasutajad', href: '#' },
        ];
      default:
        return common;
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side: Logo and primary nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0 flex items-center font-bold text-xl tracking-tight text-gray-900 group">
              <div className="w-8 h-8 bg-green-600 rounded-lg mr-2 flex items-center justify-center text-xs text-white shadow-sm group-hover:bg-green-700 transition-colors">KR</div>
              Kultuuriraanits
            </Link>
            <div className="hidden md:flex space-x-1 text-sm font-medium">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-2 rounded-full transition-all duration-200 ${
                      isActive 
                        ? 'bg-green-50 text-green-700 font-semibold' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                <div className="h-6 w-px bg-gray-200 mx-1"></div>
                
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 group-hover:bg-green-200 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 transform origin-top-right transition-all duration-200 opacity-100 scale-100">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Roll</p>
                        <p className="text-sm font-semibold text-green-700 capitalize">
                          {user.role === 'teacher' ? 'Õpetaja' : user.role === 'museum' ? 'Muuseum' : 'Admin'}
                        </p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logi välja
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform active:scale-95"
              >
                <User className="w-4 h-4" />
                Logi sisse
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setIsLoginModalOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
            <div className="bg-green-600 p-8 text-white relative">
              <button 
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-2">Tere tulemast!</h2>
              <p className="text-green-100 opacity-90">Vali oma roll, et jätkata Kultuuriranitsa kasutamist.</p>
            </div>
            
            <div className="p-6 space-y-3">
              <button 
                onClick={() => handleLogin('teacher')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 transition-all group text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Õpetaja</h3>
                  <p className="text-sm text-gray-500">Broneeri programme oma klassile</p>
                </div>
              </button>

              <button 
                onClick={() => handleLogin('museum')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 transition-all group text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Kultuuriasutus</h3>
                  <p className="text-sm text-gray-500">Halda oma muuseumi programme</p>
                </div>
              </button>
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center">
              <p className="text-xs text-gray-400">See on demo-sisselogimine. Parooli ei ole vaja.</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

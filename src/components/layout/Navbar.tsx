'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { User, Bell, LogOut, ChevronDown, X, Shield, School, Landmark, PersonStanding, ExternalLink } from 'lucide-react';
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
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [contrastTheme, setContrastTheme] = useState<'default' | 'high-contrast'>('default');
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

  // Load accessibility contrast theme on mount
  useEffect(() => {
    const savedContrast = localStorage.getItem('kr_contrast_theme');
    if (savedContrast === 'high-contrast') {
      setContrastTheme('high-contrast');
      document.documentElement.classList.add('high-contrast');
    } else {
      setContrastTheme('default');
      document.documentElement.classList.remove('high-contrast');
    }
  }, []);

  const handleContrastChange = (theme: 'default' | 'high-contrast') => {
    setContrastTheme(theme);
    localStorage.setItem('kr_contrast_theme', theme);
    if (theme === 'high-contrast') {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

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
      <div className="w-full px-4 sm:px-6 lg:px-8 relative">
        {/* Juurdepääsetavus Button: Absolute-positioned on the far left of the viewport */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
          <button 
            onClick={() => setIsAccessOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-gray-700 hover:text-blue-700 hover:bg-blue-50 border border-gray-200 transition-all cursor-pointer shrink-0 shadow-xs"
            aria-label="Juurdepääsetavuse seaded"
          >
            <PersonStanding className="w-5 h-5 text-blue-600 shrink-0" />
            <span>Juurdepääsetavus</span>
          </button>
        </div>

        {/* Centered main container: Aligns perfectly with standard page layout max-w-7xl mx-auto */}
        <div className="max-w-7xl mx-auto flex justify-between h-16 items-center">
          {/* Left side: Logo and primary nav */}
          <div className="flex items-center gap-8">
            {/* Show button in normal flow only on mobile/tablet to avoid overlapping */}
            <div className="lg:hidden">
              <button 
                onClick={() => setIsAccessOpen(true)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-full text-sm font-semibold text-gray-700 hover:text-blue-700 hover:bg-blue-50 border border-gray-200 transition-all cursor-pointer shrink-0"
                aria-label="Juurdepääsetavuse seaded"
              >
                <PersonStanding className="w-5 h-5 text-blue-600 shrink-0" />
              </button>
            </div>

            <Link href="/" className="flex-shrink-0 flex items-center font-bold text-xl tracking-tight text-gray-900 group">
              <img src="/images/logo2.png" alt="Kultuuriraanits" className="w-10 h-10 object-contain mr-2" />
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
                        ? 'bg-blue-50 text-blue-700 font-semibold' 
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
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-200 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 transform origin-top-right transition-all duration-200 opacity-100 scale-100">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Roll</p>
                        <p className="text-sm font-semibold text-blue-700 capitalize">
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
                className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform active:scale-95"
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
            <div className="bg-blue-600 p-8 text-white relative">
              <button 
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-2">Tere tulemast!</h2>
              <p className="text-blue-100 opacity-90">Vali oma roll, et jätkata Kultuuriranitsa kasutamist.</p>
            </div>
            
            <div className="p-6 space-y-3">
              <button 
                onClick={() => handleLogin('teacher')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
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
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
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

      {/* Accessibility Drawer Panel */}
      {isAccessOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsAccessOpen(false)}
          ></div>
          
          {/* Drawer content */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-gray-100 animate-slide-in overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2.5">
                <PersonStanding className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Juurdepääsetavus</h2>
              </div>
              <button 
                onClick={() => setIsAccessOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-900 cursor-pointer"
                aria-label="Sule paneel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 space-y-6">
              {/* Introduction Card */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <p className="text-sm text-blue-950 leading-relaxed mb-4">
                  Lehe loomisel on peetud silmas, et siin avaldatav info oleks kättesaadav ja kasutatav võimalikult paljudele inimestele.
                </p>
                <Link 
                  href="/juurdepaasetavus" 
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 underline"
                  onClick={() => setIsAccessOpen(false)}
                >
                  Rohkem infot juurdepääsetavuse kohta on leitav siit (avaneb uues vahekaardis)
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Contrast Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Kontrast</h3>
                <div className="space-y-3">
                  {/* Default Contrast */}
                  <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${contrastTheme === 'default' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="contrast-theme" 
                        value="default"
                        checked={contrastTheme === 'default'}
                        onChange={() => handleContrastChange('default')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div>
                        <span className="block font-semibold text-gray-900 text-sm">Vaikimisi seaded</span>
                        <span className="block text-xs text-gray-500">Tavaline kujundus ja värvid</span>
                      </div>
                    </div>
                    <div className="w-10 h-6 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] text-gray-600 font-bold shrink-0">Aa</div>
                  </label>

                  {/* Black & Yellow Contrast */}
                  <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${contrastTheme === 'high-contrast' ? 'border-yellow-400 bg-gray-900 text-yellow-400' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="contrast-theme" 
                        value="high-contrast"
                        checked={contrastTheme === 'high-contrast'}
                        onChange={() => handleContrastChange('high-contrast')}
                        className="w-4 h-4 text-yellow-400 focus:ring-yellow-400 border-gray-300"
                      />
                      <div>
                        <span className={`block font-semibold text-sm ${contrastTheme === 'high-contrast' ? 'text-yellow-400' : 'text-gray-900'}`}>Must ja kollane tekst</span>
                        <span className={`block text-xs ${contrastTheme === 'high-contrast' ? 'text-yellow-300/80' : 'text-gray-500'}`}>Kõrgkontrastne vaade vaegnägijatele</span>
                      </div>
                    </div>
                    <div className="w-10 h-6 rounded bg-black border border-yellow-400 flex items-center justify-center text-[10px] text-yellow-400 font-bold shrink-0">Aa</div>
                  </label>
                </div>
              </div>

              {/* Text Size Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Teksti suurus</h3>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs text-gray-600 leading-relaxed space-y-2">
                  <p>
                    Kõikides populaarsetes veebilehitsejates on võimalik lehte suurendada ja vähendada, kui hoida all 
                    <kbd className="px-1.5 py-0.5 mx-0.5 text-[10px] font-semibold text-gray-800 bg-white border border-gray-200 rounded shadow-xs">Ctrl</kbd> klahvi 
                    (OS X operatsioonisüsteemis <kbd className="px-1.5 py-0.5 mx-0.5 text-[10px] font-semibold text-gray-800 bg-white border border-gray-200 rounded shadow-xs">Cmd</kbd>) 
                    ja samal ajal vajutada kas <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-gray-800 bg-white border border-gray-200 rounded shadow-xs">+</kbd> või 
                    <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-gray-800 bg-white border border-gray-200 rounded shadow-xs">-</kbd> klahvi.
                  </p>
                  <p>
                    Teine mugav võimalus on kasutada hiurt: hoides all <kbd className="px-1.5 py-0.5 mx-0.5 text-[10px] font-semibold text-gray-800 bg-white border border-gray-200 rounded shadow-xs">Ctrl</kbd> klahvi ja samal ajal liigutades hiire kerimisrulli.
                  </p>
                  <p>
                    Tagasi normaalsuurusesse saab, kui vajutada samaaegselt <kbd className="px-1.5 py-0.5 mx-0.5 text-[10px] font-semibold text-gray-800 bg-white border border-gray-200 rounded shadow-xs">Ctrl</kbd> ja <kbd className="px-1.5 py-0.5 mx-0.5 text-[10px] font-semibold text-gray-800 bg-white border border-gray-200 rounded shadow-xs">0</kbd> klahvile.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center text-center">
              <p className="text-[10px] text-gray-400">
                Vastab EN 301 549 juurdepääsetavuse suunistele
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

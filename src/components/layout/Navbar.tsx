import Link from 'next/link';
import { User, Bell } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side: Logo and primary nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0 flex items-center font-bold text-xl tracking-tight text-gray-900">
              {/* Placeholder for Logo */}
              <div className="w-8 h-8 bg-gray-200 rounded-md mr-2 flex items-center justify-center text-xs text-gray-500">Logo</div>
              Kultuuriraanits
            </Link>
            <div className="hidden md:flex space-x-6 text-sm font-medium">
              <Link href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md">
                Juurdepääsetavus
              </Link>
              <Link href="/" className="text-green-600 border-b-2 border-green-600 px-3 py-2">
                Kultuuriprogrammid
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md">
                Minu broneeringud
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md">
                Lemmikud
              </Link>
            </div>
          </div>

          {/* Right side: Notifications and Profile */}
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-sm font-medium">
              <Bell className="w-5 h-5" />
              Teavitused
            </button>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                <User className="w-5 h-5" />
              </div>
              Mari Maasikas
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

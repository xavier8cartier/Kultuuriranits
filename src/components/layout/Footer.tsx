import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, Clock, ShieldCheck, Cookie, Info } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Newsletter */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center font-bold text-xl tracking-tight text-gray-900 group">
              <img src="/images/logo1.png" alt="Kultuuriraanits" className="w-10 h-10 object-contain mr-2" />
              Kultuuriraanits
            </Link>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Püsi kursis!</h4>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Telli Kultuuriministeeriumi ajaveebi Kuva uudiseid.
              </p>
              <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Telli uudiskiri
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Kasulikku</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Cookie className="w-4 h-4 text-blue-600" />
                <a href="#" className="hover:text-blue-600 transition-colors">Küpsised</a>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <a href="#" className="hover:text-blue-600 transition-colors">Isikuandmete töötlemine</a>
              </li>
              <li className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <a href="#" className="hover:text-blue-600 transition-colors">Ligipääsetavuse teatis</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Kultuuriministeerium</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>Suur-Karja 23, 15076 Tallinn</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>+372 628 2222</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <a href="mailto:min@kul.ee" className="hover:text-blue-600">min@kul.ee</a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Lahtiolekuajad</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Ministeerium on avatud</p>
                  <p>E–R kell 8.30–17.00</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <a href="https://www.kul.ee" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">www.kul.ee</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Kultuuriraanits. Kõik õigused kaitstud.</p>
          <div className="flex items-center gap-6">
            <span>Haridus- ja Teadusministeerium</span>
            <span>Kultuuriministeerium</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

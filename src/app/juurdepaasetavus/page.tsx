import Link from 'next/link';
import { Keyboard, ZoomIn, Eye, ArrowLeft, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Juurdepääsetavus | Kultuuriranits',
  description: 'Kultuuriranitsa veebilehe juurdepääsetavuse teave ja juhised.',
};

export default function AccessibilityPage() {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Tagasi avalehele
          </Link>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Juurdepääsetavus
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Kultuuriranitsa koduleht on ehitatud ja koostatud nii, et see vastaks EN 301 549 V.3.2.1 juurdepääsetavuse suunistele. 
            See tähendab, et on kasutatud teatud tehnilisi vahendeid ja sisu koostamise põhimõtteid, mis aitavad kodulehe sisu tarbida 
            nägemis-, kuulmis-, füüsiliste, kõne-, tunnetuslike, keele-, õppimis- ja neuroloogiliste puudustega kasutajatel.
          </p>


        </div>

        {/* General OS Tip */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-blue-900 mb-1">
              Süsteemi tasemel seadistused
            </h2>
            <p className="text-sm text-blue-800 leading-relaxed">
              Info juurdepääsetavust on võimalik parandada ka oma arvutit brauseri- ja operatsioonisüsteemi tasemel seadistades. 
              Põhjalikum samateemaline juhend on kättesaadav <a href="https://www.w3.org/WAI/users/browsing/" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-blue-950 inline-flex items-center gap-0.5">siin (inglise keeles) <ExternalLink className="w-3 h-3 inline" /></a>.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          
          {/* Keyboard Navigation */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                <Keyboard className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Klaviatuuriga navigeerimine</h2>
            </div>
            <div className="prose text-gray-600 max-w-none leading-relaxed space-y-4">
              <p>
                Sellel kodulehel on võimalik navigeerida ainult klaviatuuri abil. Navigatsioon toimub <strong>Tab</strong> klahvi abil. 
                Iga vajutusega liigub fookus järgmisele elemendile. Hetkel aktiivset elementi märgib värvimuutus ja kastike selle ümber. 
                Fookuses oleva lingi aktiveerimiseks tuleb vajutada klaviatuuril klahvi <strong>Enter</strong>.
              </p>
              <p>
                Esimene link <strong>“Liigu edasi põhisisu juurde”</strong>, mis sellisel viisil navigeerides aktiivseks muutub, 
                on tavakasutaja eest varjatud ning mõeldud spetsiaalselt klaviatuuriga navigeerijatele. 
                “Liigu edasi põhisisu juurde” jätab vahele päise ja vasaku paani ning hüppab lehe põhisisu juurde.
              </p>
              <p>
                Navigeerides nupule <strong>“Juurdepääsetavus”</strong>, avaneb aken, kus saab raadionupu <strong>“Must ja kollane tekst”</strong> 
                abil vahetada lehe kujunduse kõrgkontrastseks – tekst muutub kollaseks ja taust mustaks.
              </p>
            </div>
          </section>

          {/* Zoom Section */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                <ZoomIn className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Sisu suurendamine</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Veebilehitsejad</h3>
                <p className="text-gray-600 leading-relaxed">
                  Sisu suurendamiseks soovitame esmalt kasutada veebilehitsejale sisseehitatud funktsionaalsust.
                  Kõikides populaarsetes veebilehitsejates on võimalik lehte suurendada ja vähendada, kui hoida all 
                  <kbd className="px-2 py-1 mx-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">Ctrl</kbd> klahvi 
                  (OS X operatsioonisüsteemis <kbd className="px-2 py-1 mx-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">Cmd</kbd> klahvi) 
                  ja samal ajal vajutada kas <kbd className="px-2 py-1 mx-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">+</kbd> või 
                  <kbd className="px-2 py-1 mx-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">-</kbd> klahvi. 
                  Teine mugav võimalus on kasutada hiirt: hoides all <kbd className="px-2 py-1 mx-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">Ctrl</kbd> klahvi 
                  ja samal ajal liigutades hiire kerimisrulli. Tagasi normaalsuurusesse saab, kui vajutada samaaegselt 
                  <kbd className="px-2 py-1 mx-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">Ctrl</kbd> ja 
                  <kbd className="px-2 py-1 mx-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">0</kbd> klahvile.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Eraldiseisvad programmid</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Kõik enamlevinud operatsioonisüsteemid sisaldavad seadeid ekraanil esitatava sisu suurendamiseks.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 pl-2">
                  <li>
                    <strong>Windows 10:</strong> Vajuta all vasakul Windowsi logoga nupule ja samal ajal klaviatuuril plussmärgiga (<kbd className="px-1.5 py-0.5 text-xs bg-gray-100 border rounded">+</kbd>) nupule nii mitu korda, kui soovid suurendada. Vähendamiseks vajuta Windowsi logo nuppu ja miinusmärgiga (<kbd className="px-1.5 py-0.5 text-xs bg-gray-100 border rounded">-</kbd>) nuppu.
                  </li>
                  <li>
                    <strong>Apple arvutid:</strong> Navigeeri järgnevalt: <em>Apple menüü &gt; System Preferences &gt; Accessibility (või Universal Access) &gt; Zoom</em>.
                  </li>
                </ul>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Veebilehitseja laiendused</h3>
                <p className="text-gray-600 leading-relaxed">
                  Veebilehitsejate jaoks on olemas suurendamist võimaldavad laiendused, mis täiendavad veebilehitseja olemasolevat funktsionaalsust. 
                  Näiteks Firefoxi jaoks <strong>“Zoom Page”</strong>, mis lubab suurendada nii kogu lehte kui ka ainult teksti; Chrome'i jaoks <strong>AutoZoom</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* Screen Reader Section */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Ekraanilugeja kasutamine</h2>
            </div>
            
            <div className="prose text-gray-600 max-w-none leading-relaxed space-y-4">
              <p>
                Ekraanilugeja on programm, mis üritab arvutiekraanil kujutatavat interpreteerida ja teistes vormides edasi anda - 
                näiteks helidena, audiokommentaarina. Eelkõige on see abivahend vaegnägijate jaoks.
              </p>
              <p>
                Sellel kodulehel esitatud sisu on loodud vastavalt ekraanilugejatele arusaadavatele standarditele ja nii, 
                et igat tüüpi visuaalset sisu on teises vormis võimalik taasesitada. Näiteks on piltidel küljes tekstilised kirjeldused, 
                video all on toodud kirjeldus videopildis juhtuva kohta, struktuursete elementide paigutus ja järjekord arvestab 
                ekraanilugeja liikumist ekraanil ja võimaldab infot tarbida loogilises järjekorras.
              </p>
              
              <div className="mt-6">
                <h3 className="text-base font-bold text-gray-800 mb-3">Valik populaarseid ekraanilugejaid:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <li className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex justify-between items-center">
                    <span><strong>JAWS</strong> (Windows)</span>
                    <a href="http://www.freedomscientific.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-0.5 underline">
                      Külasta <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </li>
                  <li className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex justify-between items-center">
                    <span><strong>VoiceOver</strong> (OS X, sisseehitatud)</span>
                    <span className="text-gray-400 text-xs italic">Tasuta</span>
                  </li>
                  <li className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex justify-between items-center">
                    <span><strong>NVDA</strong> (Windows)</span>
                    <a href="http://www.nvaccess.org/download/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-0.5 underline">
                      Laadi alla <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </li>
                  <li className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex justify-between items-center">
                    <span><strong>SystemAccess</strong> (Windows)</span>
                    <a href="http://www.serotek.com/systemaccess" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-0.5 underline">
                      Külasta <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

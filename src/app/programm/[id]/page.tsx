import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, MapPin, Clock, Users, Globe, FileText, Accessibility } from 'lucide-react';
import { programs } from '@/lib/mockData';
import { BookingForm } from '@/components/booking/BookingForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { id } = await params;
  const program = programs.find(p => p.id === id);

  if (!program) {
    notFound();
  }

  const priceValue = parseInt(program.price.replace(/[^0-9]/g, '')) || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link 
        href="/" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
        Tagasi otsingusse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Left) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="h-64 sm:h-80 relative">
              <img 
                src={program.image} 
                alt={program.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{program.title}</h1>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span>{program.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span>{program.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-green-600" />
                  <span>{program.participantCount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="w-4 h-4 text-green-600" />
                  <span>{program.languages.join(', ')}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Programmi kirjeldus</h2>
                <p className="text-gray-700 leading-relaxed">
                  {program.fullDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Info Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Curriculum Connections */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Õppekavaseos
              </h3>
              <div className="flex flex-wrap gap-2">
                {program.curriculumConnections.map(conn => (
                  <span key={conn} className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {conn}
                  </span>
                ))}
              </div>
            </div>

            {/* Accessibility */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-purple-600" />
                Ligipääsetavus
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <span className={`w-2 h-2 rounded-full mr-2 ${program.accessibility.wheelchair ? 'bg-green-500' : 'bg-red-400'}`}></span>
                  Ratastooliga ligipääs: {program.accessibility.wheelchair ? 'Jah' : 'Ei / Raskendatud'}
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className={`w-2 h-2 rounded-full mr-2 ${program.accessibility.hev ? 'bg-green-500' : 'bg-red-400'}`}></span>
                  HEV õppijatele sobiv: {program.accessibility.hev ? 'Jah' : 'Ei'}
                </li>
                {program.accessibility.signLanguage && (
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 rounded-full mr-2 bg-green-500"></span>
                    Viipekeel saadaval
                  </li>
                )}
              </ul>
            </div>

          </div>

          {/* Materials */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Õppematerjalid (seotud selle programmiga)</h3>
            <div className="space-y-3">
              {program.materials.map((mat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <FileText className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{mat.name}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar (Right) - Booking Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BookingForm programId={program.id} pricePerStudent={priceValue} />
          </div>
        </div>

      </div>
    </div>
  );
}

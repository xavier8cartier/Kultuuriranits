import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, MapPin, Clock, Users, Globe, FileText, Accessibility, Mail, Phone } from 'lucide-react';
import { programs } from '@/lib/mockData';
import { BookingForm } from '@/components/booking/BookingForm';
import { ProgramDetailLayout } from '@/components/program/ProgramDetailLayout';
import { FeedbackSection } from '@/components/program/FeedbackSection';

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link 
        href="/" 
        className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 mb-8 group transition-colors duration-200"
      >
        <ChevronLeft className="w-5 h-5 mr-1.5 transition-transform duration-200 group-hover:-translate-x-1 text-gray-400 group-hover:text-gray-900" />
        Tagasi otsingusse
      </Link>

      <ProgramDetailLayout programId={program.id} priceValue={priceValue}>
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="h-64 sm:h-[350px] relative overflow-hidden group/image">
              <img 
                src={program.image} 
                alt={program.title} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/image:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent"></div>
            </div>
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mb-5 leading-tight">{program.title}</h1>
              
              {/* Elegant Info Badges Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-lg p-2.5 hover:bg-gray-100/50 transition-colors duration-200">
                  <div className="p-1.5 bg-green-50 rounded shrink-0">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Asukoht</span>
                    <span className="text-sm font-bold text-gray-800 leading-snug">{program.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-lg p-2.5 hover:bg-gray-100/50 transition-colors duration-200">
                  <div className="p-1.5 bg-green-50 rounded shrink-0">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kestus</span>
                    <span className="text-sm font-bold text-gray-800 leading-snug">{program.duration}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-lg p-2.5 hover:bg-gray-100/50 transition-colors duration-200">
                  <div className="p-1.5 bg-green-50 rounded shrink-0">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Grupi suurus</span>
                    <span className="text-sm font-bold text-gray-800 leading-snug">{program.participantCount}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-lg p-2.5 hover:bg-gray-100/50 transition-colors duration-200">
                  <div className="p-1.5 bg-blue-50 rounded shrink-0">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Keeled</span>
                    <span className="text-sm font-bold text-gray-800 leading-snug">{program.languages?.join(', ') || 'Eesti'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Programmi kirjeldus</h2>
                <p className="text-base text-gray-600 leading-relaxed font-normal">
                  {program.fullDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Info Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Curriculum Connections */}
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-150 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded text-blue-600">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                Õppekavaseos
              </h3>
              <div className="flex flex-wrap gap-2">
                {program.curriculumConnections?.map(conn => (
                  <span key={conn} className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-200">
                    {conn}
                  </span>
                ))}
              </div>
            </div>

            {/* Accessibility */}
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-150 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-purple-50 rounded text-purple-600">
                  <Accessibility className="w-4.5 h-4.5" />
                </div>
                Ligipääsetavus
              </h3>
              <ul className="space-y-2.5">
                <li className="flex items-center text-sm font-medium text-gray-700">
                  <span className={`w-2.5 h-2.5 rounded-full mr-2.5 shrink-0 ${program.accessibility.wheelchair ? 'bg-green-500' : 'bg-red-400'}`}></span>
                  Ratastooliga ligipääs: <strong className="ml-1 text-gray-900">{program.accessibility.wheelchair ? 'Jah' : 'Ei / Raskendatud'}</strong>
                </li>
                <li className="flex items-center text-sm font-medium text-gray-700">
                  <span className={`w-2.5 h-2.5 rounded-full mr-2.5 shrink-0 ${program.accessibility.hev ? 'bg-green-500' : 'bg-red-400'}`}></span>
                  HEV õppijatele sobiv: <strong className="ml-1 text-gray-900">{program.accessibility.hev ? 'Jah' : 'Ei'}</strong>
                </li>
                {program.accessibility.signLanguage && (
                  <li className="flex items-center text-sm font-medium text-gray-700">
                    <span className="w-2.5 h-2.5 rounded-full mr-2.5 bg-green-500 shrink-0"></span>
                    Viipekeel saadaval: <strong className="ml-1 text-gray-900">Jah</strong>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Materials */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-150 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Õppematerjalid (seotud selle programmiga)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {program.materials?.map((mat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100/50 hover:border-gray-200 transition-all duration-200 group/mat">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded border border-gray-150 shadow-sm group-hover/mat:border-gray-300 transition-colors">
                      <FileText className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-800">{mat.name}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded transition-all duration-200 cursor-pointer">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Kontakt */}
          {(program.contactEmail || program.contactPhone) && (
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-150 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Kontakt</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {program.contactEmail && (
                  <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100/50 hover:border-gray-200 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded border border-gray-150 shadow-sm shrink-0">
                        <Mail className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">E-post</span>
                        <a href={`mailto:${program.contactEmail}`} className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline break-all leading-tight mt-0.5">
                          {program.contactEmail}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                
                {program.contactPhone && (
                  <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100/50 hover:border-gray-200 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded border border-gray-150 shadow-sm shrink-0">
                        <Phone className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Telefon</span>
                        <a href={`tel:${program.contactPhone}`} className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline leading-tight mt-0.5">
                          {program.contactPhone}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tagasiside sektsioon (nähtav vaid logitud koolidele/muuseumitele) */}
          <FeedbackSection reviews={program.reviews} />
        </div>
      </ProgramDetailLayout>
    </div>
  );
}

import Link from 'next/link';
import { Program } from '@/lib/types';

interface ProgramCardProps {
  program: Program;
}

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row">
      <div className="md:w-1/3 lg:w-1/4 relative h-48 md:h-auto">
        <img 
          src={program.image} 
          alt={program.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 md:hidden">
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Broneerimiseks avatud
            </span>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900">{program.title}</h3>
            <span className="hidden md:inline-flex bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Broneerimiseks avatud
            </span>
          </div>
          
          <div className="grid grid-cols-[120px_1fr] gap-2 text-sm mb-4">
            <span className="text-gray-500 font-medium">Lühikirjeldus:</span>
            <p className="text-gray-700">{program.shortDescription}</p>
            
            <span className="text-gray-500 font-medium">Üldpädevused:</span>
            <div className="flex flex-wrap gap-1">
              {program.categories.map((cat, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                  {cat}
                </span>
              ))}
            </div>

            <span className="text-gray-500 font-medium">Sihtgrupp:</span>
            <div className="flex flex-wrap gap-1">
              {program.targetGroups.map((group, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                  {group}
                </span>
              ))}
            </div>
            
            <span className="text-gray-500 font-medium">Toimumiskoht:</span>
            <span className="text-gray-700">{program.location}</span>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Link 
            href={`/programm/${program.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
          >
            Vaata detaile ja broneeri &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

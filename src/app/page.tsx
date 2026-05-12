import { SearchBar } from '@/components/dashboard/SearchBar';
import { ProgramCard } from '@/components/dashboard/ProgramCard';
import { programs, mockFilters } from '@/lib/mockData';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Leia klassile kultuuriprogramm
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Nutikas otsing leiab sobivaid programme kiiremini ja arveldus toimub automaatselt kooli eelarvest.
        </p>
      </div>

      <SearchBar />

      {/* Filters & Content Area */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Filter Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Filtrid</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Kooliaste</h4>
                <div className="space-y-2">
                  {mockFilters.grades.map(grade => (
                    <label key={grade} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                      <span className="ml-2 text-sm text-gray-600">{grade}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Piirkond</h4>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                  <option>Kõik piirkonnad</option>
                  {mockFilters.regions.map(region => (
                    <option key={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Ligipääsetavus</h4>
                <div className="space-y-2">
                  {mockFilters.accessibility.map(acc => (
                    <label key={acc} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                      <span className="ml-2 text-sm text-gray-600">{acc}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <button className="mt-6 w-full bg-gray-100 text-gray-800 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Tühista filtrid
            </button>
          </div>
        </div>

        {/* Program List */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Populaarsed programmid</h2>
            <span className="text-sm text-gray-500">Näitan {programs.length} tulemust</span>
          </div>
          
          <div className="space-y-4">
            {programs.map(program => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

import { Program, FilterOptions } from './types';

export const programs: Program[] = [
  {
    id: 'padise-mesindus',
    title: 'Rännak keskaega Padise kloostris. Mesindus',
    organizer: 'Padise klooster',
    location: 'Padise, Harjumaa',
    image: 'https://keskkonnaharidus.ee/sites/default/files/2023-11/Screenshot%202023-11-07%20122532.jpg',
    shortDescription: 'Haridusprogramm annab õpilasele unikaalses keskkonnas ülevaate kloostri elu-olust, selle rollist keskaegses ühiskonnas ning suhtest loodusega.',
    fullDescription: 'Haridusprogramm “Rännak keskaega Padise kloostris. Mesindus” annab õpilasele unikaalses keskkonnas ülevaate kloostri elu-olust, selle rollist keskaegses ühiskonnas ning suhtest loodusega. Programm koosneb kahest osast - juhendatud giidituurist kloostri varemetes ning praktilisest töötoast külastuskeskuses. Giidituuri käigus saavad õpilased teada, milline oli kloostri roll keskaegses ühiskonnas, kuidas elasid mungad ja milline oli kloostri suhe ümbritseva loodusega. Praktiline töötuba on inspireeritud kloostrite traditsioonilisest mesindusest ning hõlmab nii faktide omandamist kui käelist tegevust. Grupitööna valmib kas mesilasvahast kastetud küünal või vahariie.',
    price: '7€',
    targetGroups: ['7. - 9. klass'],
    duration: '120 min',
    categories: ['Ajalugu', 'Loodus'],
    participantCount: '10 - 25 õpilast',
    languages: ['Eesti'],
    curriculumConnections: ['Ajalugu', 'Bioloogia', 'Tehnoloogia'],
    accessibility: {
      wheelchair: true,
      hev: true,
      signLanguage: false,
      audioDescription: false,
    },
    materials: [
      { name: 'Programmi kirjeldus (PDF)', url: '#' },
      { name: 'Tööleht õpilasele', url: '#' }
    ],
    contactEmail: 'info@padiseklooster.ee',
    contactPhone: '+372 5811 8119',
    reviews: [
      {
        id: 'r1',
        authorName: 'Tiina Tamm',
        authorSchool: 'Keila Kool',
        rating: 5,
        comment: 'Suurepärane programm! Lapsed olid vaimustuses praktilisest küünla valmistamise töötoast. Giid rääkis väga kaasahaaravalt ja oskas hoida ka kõige rahutumate õpilaste tähelepanu.',
        date: '12.04.2026'
      },
      {
        id: 'r2',
        authorName: 'Andres Kask',
        authorSchool: 'Tallinna Reaalkool',
        rating: 4,
        comment: 'Väga põhjalik ajalooline ülevaade. Töölehed olid hästi ette valmistatud. Ainus miinus oli see, et kloostri varemetes oli veidi külm, seega soovitame soojalt riidesse panna.',
        date: '05.05.2026'
      },
      {
        id: 'r3',
        authorName: 'Katrin Koppel',
        authorSchool: 'Saue Gümnaasium',
        rating: 5,
        comment: 'Väga õnnestunud lõiming bioloogia ja ajaloo vahel. Õpilased said ise proovida vahasid ja küünla valmistamist. Kindlasti tuleme ka järgmisel aastal!',
        date: '18.04.2026'
      },
      {
        id: 'r4',
        authorName: 'Jaanus Nõmm',
        authorSchool: 'Tabasalu Gümnaasium',
        rating: 5,
        comment: 'Kogu protsess broneerimisest kuni kohapealse tegevuseni oli sujuv. Eelarve arveldamine toimus automaatselt, mis tegi paberimajanduse olematuks. Giid oli oma ala ekspert!',
        date: '22.04.2026'
      }
    ]
  },
  {
    id: '1',
    title: 'Ajarännak minevikku',
    shortDescription: 'Õpilased avastavad mineviku elu ja tavasid läbi mänguliste ülesannete, arutelude ja praktiliste tegevuste.',
    fullDescription: 'Programmi käigus rändavad õpilased ajas tagasi ning tutvuvad sellega, kuidas inimesed varem elasid, töötasid ja oma igapäevaelu korraldasid. Läbi juhendatud tegevuste ja arutelude õpitakse märkama erinevusi mineviku ja tänapäeva vahel ning mõistma, kuidas ajaloolised sündmused on mõjutanud tänast maailma.',
    organizer: 'Eesti Rahva Muuseum',
    location: 'Eesti Rahva Muuseum',
    languages: ['Eesti', 'Inglise'],
    targetGroups: ['1. - 3. klass', '4. - 6. klass'],
    participantCount: '10 - 30 õpilast',
    duration: '90 min',
    price: '10€',
    categories: ['Kirjandus', 'Muuseumid ja kultuuripärand'],
    curriculumConnections: ['Ajalugu', 'Ühiskonnaõpetus', 'Kultuuriteadlikkus'],
    accessibility: {
      wheelchair: true,
      hev: true,
      signLanguage: false,
      audioDescription: false,
    },
    materials: [
      { name: 'Tööleht_muuseum.pdf', url: '#' },
      { name: 'Õpetaja_juhend.docx', url: '#' }
    ],
    image: 'https://www.kero.ee/wp-content/uploads/2017/02/DJI_0042-2.jpg',
    contactEmail: 'haridus@erm.ee',
    contactPhone: '+372 736 3050',
    reviews: [
      {
        id: 'r3',
        authorName: 'Kadri Sepp',
        authorSchool: 'Tartu Karlova Kool',
        rating: 5,
        comment: 'Ajarännak oli suurepärane! ERMi rikkalikud ekspositsioonid ja suurepärased giidid pakkusid unustamatu kogemuse. Tulime tagasi väga positiivsete emotsioonidega.',
        date: '28.04.2026'
      },
      {
        id: 'r4',
        authorName: 'Mihkel Lember',
        authorSchool: 'Pärnu Ühisgümnaasium',
        rating: 5,
        comment: 'Väga kaasahaaravad tegevused ja rühmatööd. Programm sidus imehästi ajaloo- ja ühiskonnaõpetuse teemasid. Soovitame kindlasti!',
        date: '14.05.2026'
      }
    ]
  },
  {
    id: '2',
    title: 'Keskaegse linna saladused',
    shortDescription: 'Põnev seiklusmäng vanalinnas, kus lahendatakse mõistatusi ja õpitakse tundma keskaegset arhitektuuri.',
    fullDescription: 'Interaktiivne ekskursioon, mille käigus õpilased jagatakse meeskondadesse. Iga meeskond saab kaardi ja vihjed, mille abil tuleb üles leida erinevad ajaloolised punktid. Programmi eesmärk on arendada meeskonnatööd, loogilist mõtlemist ja teadmisi kohalikust ajaloost.',
    organizer: 'Tallinna Linnamuuseum',
    location: 'Tallinna Vanalinn',
    languages: ['Eesti', 'Vene'],
    targetGroups: ['4. - 6. klass', '7. - 9. klass'],
    participantCount: '15 - 25 õpilast',
    duration: '120 min',
    price: '8€',
    categories: ['Ajalugu', 'Arhitektuur', 'Kultuuripärand'],
    curriculumConnections: ['Ajalugu', 'Geograafia'],
    accessibility: {
      wheelchair: false, // Vanalinn on raskesti ligipääsetav
      hev: true,
      signLanguage: true,
      audioDescription: false,
    },
    materials: [
      { name: 'Orienteerumiskaart.pdf', url: '#' }
    ],
    image: 'https://linnamuuseum.ee/wp-content/uploads/2022/06/katk2.png',
    contactEmail: 'haridus@linnamuuseum.ee',
    contactPhone: '+372 615 5184',
    reviews: [
      {
        id: 'r5',
        authorName: 'Helen Mägi',
        authorSchool: 'Jüri Gümnaasium',
        rating: 4,
        comment: 'Seiklusmäng vanalinnas oli põnev ja pani meeskonnatöö proovile. Kuna liikusime palju väljas, siis sobib pigem kuivema ilmaga külastuseks.',
        date: '10.05.2026'
      }
    ]
  },
  {
    id: '3',
    title: 'Teatritrikk Kunkumoor',
    shortDescription: 'Kaasahaarav nukuetendus, kus lapsed saavad ka ise osaleda ja näitlejatega suhelda.',
    fullDescription: 'Visuaalselt rikkalik ja hariv teatrietendus, mis põhineb tuntud muinasjutul. Etenduse järel toimub töötuba, kus lapsed saavad ise proovida nukkude animeerimist ja mõelda välja oma lugusid.',
    organizer: 'Eesti Noorsooteater',
    location: 'Eesti Noorsooteater, Lai 1',
    languages: ['Eesti'],
    targetGroups: ['Lasteaed', '1. - 3. klass'],
    participantCount: 'Kuni 50 last',
    duration: '45 min etendus + 30 min töötuba',
    price: '12€',
    categories: ['Teater', 'Kirjandus'],
    curriculumConnections: ['Emakeel', 'Kunst', 'Muusika'],
    accessibility: {
      wheelchair: true,
      hev: true,
      signLanguage: false,
      audioDescription: true,
    },
    materials: [
      { name: 'Kunkumoori_laul.mp3', url: '#' },
      { name: 'Varjuteatri_tegemise_juhend.pdf', url: '#' }
    ],
    image: 'https://www.sudalinnateater.ee/storage/images/_thumbs/pub_th2/baba-mora.png',
    contactEmail: 'kassa@eestinoorsooteater.ee',
    contactPhone: '+372 667 9300',
    reviews: [
      {
        id: 'r6',
        authorName: 'Piret Kukk',
        authorSchool: 'Tallinna Kesklinna Lasteaed',
        rating: 5,
        comment: 'Lastele väga meeldis nukuetendus! Nad elasid kogu hingega kaasa. Töötuba pärast etendust oli äärmiselt õpetlik ja arendas loovust.',
        date: '02.05.2026'
      }
    ]
  }
];

export const mockFilters: FilterOptions = {
  grades: ['Lasteaed', '1. - 3. klass', '4. - 6. klass', '7. - 9. klass', 'Gümnaasium'],
  subjects: ['Ajalugu', 'Kirjandus', 'Kunst', 'Muusika', 'Loodusõpetus', 'Matemaatika'],
  regions: ['Tallinn', 'Harjumaa', 'Tartu', 'Tartumaa', 'Pärnu', 'Ida-Virumaa', 'Üle-eestiline (veebis)'],
  accessibility: ['Ratastooliga ligipääs', 'HEV õppijatele sobiv', 'Viipekeel', 'Helisalvestus']
};

import { Program, FilterOptions } from './types';

export const programs: Program[] = [
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
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop'
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
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4e9c?q=80&w=2070&auto=format&fit=crop'
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
    image: 'https://images.unsplash.com/photo-1507676184212-d0330a156f95?q=80&w=2070&auto=format&fit=crop'
  }
];

export const mockFilters: FilterOptions = {
  grades: ['Lasteaed', '1. - 3. klass', '4. - 6. klass', '7. - 9. klass', 'Gümnaasium'],
  subjects: ['Ajalugu', 'Kirjandus', 'Kunst', 'Muusika', 'Loodusõpetus', 'Matemaatika'],
  regions: ['Tallinn', 'Harjumaa', 'Tartu', 'Tartumaa', 'Pärnu', 'Ida-Virumaa', 'Üle-eestiline (veebis)'],
  accessibility: ['Ratastooliga ligipääs', 'HEV õppijatele sobiv', 'Viipekeel', 'Helisalvestus']
};

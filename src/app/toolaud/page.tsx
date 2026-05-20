'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CalendarRange, 
  PlusCircle, 
  Search, 
  Calendar as CalendarIcon, 
  Filter, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Trash, 
  Edit, 
  AlertCircle, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Users, 
  FileText,
  School,
  Building2,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft,
  Download,
  Mail,
  Phone,
  HelpCircle
} from 'lucide-react';

interface Accessibility {
  wheelchair: boolean;
  hev: boolean;
  signLanguage: boolean;
  audioDescription: boolean;
}

interface Program {
  id: string;
  title: string;
  organizer: string;
  location: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  price: string;
  targetGroups: string[];
  duration: string;
  categories: string[];
  participantCount: string;
  languages: string[];
  curriculumConnections: string[];
  accessibility: Accessibility;
  materials: { name: string; url: string }[];
  contactEmail: string;
  contactPhone: string;
  published: boolean;
  // New fields from lofi feedback
  minGroupSize: number;
  maxGroupSize: number;
  county: string;
  address: string;
  outdoor: boolean;
  additionalInfo: string;
  bookingMethod: 'platform' | 'contact';
  availableTimes: string[];
}

interface Booking {
  id: string;
  programId: string;
  programTitle: string;
  date: string;
  time: string;
  studentsCount: number;
  className: string;
  schoolName: string;
  cityName: string;
  duration: string;
  status: 'ootel' | 'kinnitatud' | 'tagasilukatud';
  rejectionReason?: string;
}

const ESTONIAN_COUNTIES = [
  'Harjumaa', 'Tartumaa', 'Pärnumaa', 'Viljandimaa', 'Lääne-Virumaa', 
  'Ida-Virumaa', 'Saaremaa', 'Hiiumaa', 'Raplamaa', 'Järvamaa', 
  'Jõgevamaa', 'Põlvamaa', 'Valgamaa', 'Võrumaa', 'Läänemaa'
];

const CATEGORIES_PRESETS = [
  'Muuseumid ja kultuuripärand', 'Ajalugu', 'Kunst', 'Muusika', 
  'Kirjandus', 'Teater', 'Tehnoloogia', 'Loodus'
];

const CURRICULUM_PRESETS = [
  'Ajalugu', 'Ühiskonnaõpetus', 'Kultuuriteadlikkus', 'Kunst', 
  'Muusika', 'Tehnoloogia', 'Bioloogia', 'Loodusõpetus', 'Emakeel'
];

const DEFAULT_PROGRAMS: Program[] = [
  {
    id: 'erm-avastamine',
    title: 'Eesti kultuuri avastamine',
    organizer: 'Eesti Rahva Muuseum',
    location: 'Tartu, Tartumaa',
    image: 'https://images.unsplash.com/photo-1601987177651-8edfe6c20009?q=80&w=800&auto=format&fit=crop',
    shortDescription: 'Praktiline ja haarav haridusprogramm tutvustab õpilastele Eesti rahvakultuuri põnevamaid tahke läbi aktiivtegevuste.',
    fullDescription: 'Haridusprogramm pakub süvendatud sissevaadet Eesti ainelisse ja vaimsesse kultuuripärandisse. Õpilased uurivad ajaloolisi tarbeesemeid, arutlevad kommete üle ja saavad osa põnevatest praktilistest ülesannetest näitusesaalis.',
    price: '10€',
    targetGroups: ['7. - 9. klass', 'Gümnaasium'],
    duration: '90 min',
    categories: ['Muuseumid ja kultuuripärand', 'Ajalugu'],
    participantCount: '15 - 30 õpilast',
    languages: ['Eesti'],
    curriculumConnections: ['Ajalugu', 'Kultuuriteadlikkus'],
    accessibility: { wheelchair: true, hev: true, signLanguage: false, audioDescription: false },
    materials: [{ name: 'Õpetaja abimaterjal.pdf', url: '#' }, { name: 'Tööleht.pdf', url: '#' }],
    contactEmail: 'haridus@erm.ee',
    contactPhone: '+372 736 3050',
    published: true,
    minGroupSize: 15,
    maxGroupSize: 30,
    county: 'Tartumaa',
    address: 'Muuseumi tee 2, 60532 Tartu, Tartumaa',
    outdoor: false,
    additionalInfo: 'Soovitame kaasa võtta mugavad riided ja kirjutusvahendi. Osa tegevusi võib toimuda õues, seega palume arvestada ilmastikutingimustega.',
    bookingMethod: 'platform',
    availableTimes: ['2026-05-25 10:00', '2026-05-25 12:00', '2026-05-25 14:00']
  },
  {
    id: 'erm-esemet',
    title: 'Ajalugu läbi esemete',
    organizer: 'Eesti Rahva Muuseum',
    location: 'Tartu, Tartumaa',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    shortDescription: 'Lõbus muuseumitund, kus arheoloogilised leivad ja etnograafilised asjad jutustavad põnevaid lugusid muinasajast tänapäevani.',
    fullDescription: 'Selles haridusprogrammis muutuvad muuseumi eksponaadid elavateks jutuvestjateks. Õpilased saavad ise esemeid uurida, mõistatada nende otstarvet ja panna kokku ajaloo puslet.',
    price: '8€',
    targetGroups: ['1. - 3. klass', '4. - 6. klass'],
    duration: '60 min',
    categories: ['Ajalugu', 'Muuseumid ja kultuuripärand'],
    participantCount: '10 - 25 õpilast',
    languages: ['Eesti'],
    curriculumConnections: ['Ajalugu', 'Kultuuriteadlikkus'],
    accessibility: { wheelchair: true, hev: true, signLanguage: true, audioDescription: false },
    materials: [{ name: 'Esemete leht.pdf', url: '#' }],
    contactEmail: 'haridus@erm.ee',
    contactPhone: '+372 736 3050',
    published: true,
    minGroupSize: 10,
    maxGroupSize: 25,
    county: 'Tartumaa',
    address: 'Muuseumi tee 2, 60532 Tartu, Tartumaa',
    outdoor: false,
    additionalInfo: 'Kõik vajalikud vahendid on kohapeal olemas. Programm sobib ka erivajadustega gruppidele.',
    bookingMethod: 'platform',
    availableTimes: ['2026-05-22 09:30', '2026-05-22 11:30', '2026-05-22 13:30']
  },
  {
    id: 'erm-loovus',
    title: 'Loov avastusretk',
    organizer: 'Eesti Rahva Muuseum',
    location: 'Tartu, Tartumaa',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop',
    shortDescription: 'Avastame kunsti, disaini ja loovust muuseumis, millele järgneb käeline tegevus loovkojas.',
    fullDescription: 'Loov avastusretk viib lapsed rännakule läbi disaini- ja kunstiajaloo, inspireerides neid leidma oma loovust. Töötoas valmib igal osalejal oma loovtöö.',
    price: '12€',
    targetGroups: ['1. - 3. klass', '4. - 6. klass', '7. - 9. klass'],
    duration: '120 min',
    categories: ['Kunst', 'Muuseumid ja kultuuripärand'],
    participantCount: '10 - 20 õpilast',
    languages: ['Eesti', 'Inglise'],
    curriculumConnections: ['Kunst', 'Tehnoloogia'],
    accessibility: { wheelchair: true, hev: true, signLanguage: false, audioDescription: true },
    materials: [{ name: 'Loovtöö juhend.pdf', url: '#' }],
    contactEmail: 'haridus@erm.ee',
    contactPhone: '+372 736 3050',
    published: true,
    minGroupSize: 10,
    maxGroupSize: 20,
    county: 'Tartumaa',
    address: 'Muuseumi tee 2, 60532 Tartu, Tartumaa',
    outdoor: false,
    additionalInfo: 'Töötoas kasutatakse värve, soovitame riietuda vabalt.',
    bookingMethod: 'platform',
    availableTimes: ['2026-05-22 10:00', '2026-05-22 13:00', '2026-05-22 15:00']
  },
  {
    id: '1',
    title: 'Ajarännak minevikku',
    organizer: 'Eesti Rahva Muuseum',
    location: 'Tartu, Tartumaa',
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800&auto=format&fit=crop',
    shortDescription: 'Õpilased avastavad mineviku elu ja tavasid läbi mänguliste ülesannete, arutelude ja praktiliste tegevuste.',
    fullDescription: 'Programmi käigus rändavad õpilased ajas tagasi ning tutvuvad sellega, kuidas inimesed varem elasid, töötasid ja oma igapäevaelu korraldasid. Läbi juhendatud tegevuste ja arutelude õpitakse märkama erinevusi mineviku ja tänapäeva vahel ning mõistma, kuidas ajaloolised sündmused on mõjutanud tänast maailma.',
    price: '10€',
    targetGroups: ['1. - 3. klass', '4. - 6. klass'],
    duration: '90 min',
    categories: ['Ajalugu', 'Muuseumid ja kultuuripärand'],
    participantCount: '10 - 30 õpilast',
    languages: ['Eesti', 'Inglise'],
    curriculumConnections: ['Ajalugu', 'Ühiskonnaõpetus', 'Kultuuriteadlikkus'],
    accessibility: { wheelchair: true, hev: true, signLanguage: false, audioDescription: false },
    materials: [{ name: 'Tööleht_muuseum.pdf', url: '#' }, { name: 'Õpetaja_juhend.docx', url: '#' }],
    contactEmail: 'haridus@erm.ee',
    contactPhone: '+372 736 3050',
    published: true,
    minGroupSize: 15,
    maxGroupSize: 30,
    county: 'Tartumaa',
    address: 'Muuseumi tee 2, 60532 Tartu, Tartumaa',
    outdoor: false,
    additionalInfo: 'Soovitame kaasa võtta mugavad riided ja kirjutusvahend. Osa tegevusi võib toimuda õues, seega palume arvestada ilmastikutingimustega.',
    bookingMethod: 'platform',
    availableTimes: ['2026-05-25 09:00', '2026-05-25 11:00', '2026-05-25 13:00', '2026-05-25 15:00']
  }
];

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    programId: 'erm-avastamine',
    programTitle: 'Eesti kultuuri avastamine',
    date: '2026-05-12',
    time: '12:00',
    studentsCount: 26,
    className: '8A',
    schoolName: 'Tallinna Ühisgümnaasium',
    cityName: 'Tallinn',
    duration: '90 min',
    status: 'ootel'
  },
  {
    id: 'b2',
    programId: 'erm-avastamine',
    programTitle: 'Eesti kultuuri avastamine',
    date: '2026-05-13',
    time: '13:30',
    studentsCount: 34,
    className: '7B',
    schoolName: 'Tartu Kivilinna Kool',
    cityName: 'Tartu',
    duration: '90 min',
    status: 'ootel'
  },
  {
    id: 'b3',
    programId: 'erm-avastamine',
    programTitle: 'Eesti kultuuri avastamine',
    date: '2026-05-15',
    time: '10:30',
    studentsCount: 20,
    className: '9C',
    schoolName: 'Pärnu Ülejõe Kool',
    cityName: 'Pärnu',
    duration: '90 min',
    status: 'ootel'
  },
  {
    id: 'b4',
    programId: 'erm-esemet',
    programTitle: 'Ajalugu läbi esemete',
    date: '2026-05-15',
    time: '13:00',
    studentsCount: 20,
    className: '5A',
    schoolName: 'Tallinna Reaalkool',
    cityName: 'Tallinn',
    duration: '60 min',
    status: 'ootel'
  },
  {
    id: 'b5',
    programId: 'erm-loovus',
    programTitle: 'Loov avastusretk',
    date: '2026-05-20',
    time: '11:00',
    studentsCount: 20,
    className: '6',
    schoolName: 'Paide Gümnaasium',
    cityName: 'Paide',
    duration: '120 min',
    status: 'ootel'
  },
  {
    id: 'b6',
    programId: 'erm-loovus',
    programTitle: 'Loov avastusretk',
    date: '2026-05-21',
    time: '12:00',
    studentsCount: 20,
    className: '8B',
    schoolName: 'Viljandi Kesklinna Kool',
    cityName: 'Viljandi',
    duration: '120 min',
    status: 'ootel'
  },
  {
    id: 'b7',
    programId: 'erm-esemet',
    programTitle: 'Ajalugu läbi esemete',
    date: '2026-05-29',
    time: '13:15',
    studentsCount: 20,
    className: '9A',
    schoolName: 'Gustav Adolfi Gümnaasium',
    cityName: 'Tallinn',
    duration: '60 min',
    status: 'ootel'
  }
];

export default function ToolaudPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'programmid' | 'broneeringud' | 'lisa'>('programmid');
  const [programsList, setProgramsList] = useState<Program[]>([]);
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);

  // Filtering & Search states (Programs)
  const [progSearch, setProgSearch] = useState('');
  const [progOnlyPublished, setProgOnlyPublished] = useState(false);

  // Filtering & Search states (Bookings)
  const [bookSearch, setBookSearch] = useState('');
  const [bookDate, setBookDate] = useState('');
  const [bookProgId, setBookProgId] = useState('');
  const [bookStatus, setBookStatus] = useState('');
  const [bookOccurrence, setBookOccurrence] = useState(''); // 'koik' | 'tulevased' | 'moodunud'

  // Step state for the Add/Edit form
  const [formStep, setFormStep] = useState<'form' | 'preview'>('form');

  // Form states (Add/Edit program)
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formLocation, setFormLocation] = useState('Eesti Rahva Muuseum');
  const [formDuration, setFormDuration] = useState('90 min');
  const [formPrice, setFormPrice] = useState('10€');
  const [formMinGroupSize, setFormMinGroupSize] = useState<number>(15);
  const [formMaxGroupSize, setFormMaxGroupSize] = useState<number>(30);
  const [formCounty, setFormCounty] = useState('Tartumaa');
  const [formAddress, setFormAddress] = useState('Muuseumi tee 2, 60532 Tartu, Tartumaa');
  const [formOutdoor, setFormOutdoor] = useState(false);
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800&auto=format&fit=crop');
  const [formEmail, setFormEmail] = useState('haridus@erm.ee');
  const [formPhone, setFormPhone] = useState('+372 736 3050');
  const [formTargetGroups, setFormTargetGroups] = useState<string[]>(['1. - 3. klass', '4. - 6. klass']);
  const [formCategories, setFormCategories] = useState<string[]>(['Muuseumid ja kultuuripärand', 'Ajalugu']);
  const [formConnections, setFormConnections] = useState<string[]>(['Ajalugu', 'Kultuuriteadlikkus']);
  const [formLanguages, setFormLanguages] = useState<string[]>(['Eesti']);
  const [formAccessibility, setFormAccessibility] = useState<Accessibility>({
    wheelchair: true,
    hev: true,
    signLanguage: false,
    audioDescription: false
  });
  const [formAdditionalInfo, setFormAdditionalInfo] = useState('Soovitame kaasa võtta mugavad riided ja kirjutusvahend.');
  const [formBookingMethod, setFormBookingMethod] = useState<'platform' | 'contact'>('platform');
  const [formAvailableTimes, setFormAvailableTimes] = useState<string[]>(['2026-05-25 10:00', '2026-05-25 12:00', '2026-05-25 14:00']);
  const [formMaterials, setFormMaterials] = useState<{ name: string; url: string }[]>([
    { name: 'Tööleht_muuseum.pdf', url: '#' },
    { name: 'Õpetaja_juhend.docx', url: '#' }
  ]);
  const [formPublished, setFormPublished] = useState<boolean>(true);

  // Dynamic Add State helpers
  const [newTimeInput, setNewTimeInput] = useState('10:00');
  const [newDateInput, setNewDateInput] = useState('2026-05-25');
  const [newMaterialName, setNewMaterialName] = useState('');
  const [newMaterialUrl, setNewMaterialUrl] = useState('#');

  // Modal / Interaction states
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [rejectionsBooking, setRejectionsBooking] = useState<Booking | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');

  // Preview Selected Date and Time strings
  const [selectedPreviewDateStr, setSelectedPreviewDateStr] = useState<string>('');
  const [selectedPreviewTimeStr, setSelectedPreviewTimeStr] = useState<string>('');

  const availableDates = Array.from(new Set(formAvailableTimes.map(t => t.split(' ')[0]))).sort();
  const activePreviewDate = selectedPreviewDateStr && availableDates.includes(selectedPreviewDateStr)
    ? selectedPreviewDateStr
    : (availableDates[0] || '');

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    // Check Auth
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    // Initialize databases in localStorage if not present
    const savedProgs = localStorage.getItem('kr_programs');
    if (savedProgs) {
      try {
        let parsed = JSON.parse(savedProgs);
        let updated = false;
        parsed = parsed.map((p: any) => {
          let pUpdated = false;
          let newP = { ...p };
          if (newP.id === 'erm-esemet' && newP.image !== 'https://www.erm.ee/wp-content/uploads/2016/04/kohtumised1-1280x400.jpg') {
            newP.image = 'https://www.erm.ee/wp-content/uploads/2016/04/kohtumised1-1280x400.jpg';
            pUpdated = true;
          }
          if (newP.availableTimes && newP.availableTimes.some((t: string) => t.includes('2026-05-15'))) {
            newP.availableTimes = newP.availableTimes.map((t: string) => t.replace('2026-05-15', '2026-05-25'));
            pUpdated = true;
          }
          if (pUpdated) updated = true;
          return newP;
        });
        if (updated) {
          localStorage.setItem('kr_programs', JSON.stringify(parsed));
        }
        setProgramsList(parsed);
      } catch (e) {
        console.error('Failed to parse kr_programs', e);
        setProgramsList(DEFAULT_PROGRAMS);
      }
    } else {
      localStorage.setItem('kr_programs', JSON.stringify(DEFAULT_PROGRAMS));
      setProgramsList(DEFAULT_PROGRAMS);
    }

    const savedBookings = localStorage.getItem('kr_bookings');
    if (savedBookings) {
      setBookingsList(JSON.parse(savedBookings));
    } else {
      localStorage.setItem('kr_bookings', JSON.stringify(DEFAULT_BOOKINGS));
      setBookingsList(DEFAULT_BOOKINGS);
    }

    // Listener for role switches in Navbar
    const handleAuthChange = () => {
      const currentRole = localStorage.getItem('userRole');
      setUserRole(currentRole);
    };

    window.addEventListener('kr-auth-change', handleAuthChange);
    return () => window.removeEventListener('kr-auth-change', handleAuthChange);
  }, []);

  // Update databases helper
  const updateLocalPrograms = (newProgs: Program[]) => {
    setProgramsList(newProgs);
    localStorage.setItem('kr_programs', JSON.stringify(newProgs));
  };

  const updateLocalBookings = (newBookings: Booking[]) => {
    setBookingsList(newBookings);
    localStorage.setItem('kr_bookings', JSON.stringify(newBookings));
  };

  // Log in as museum immediately from restricted screen (Premium workflow)
  const handleQuickLoginMuseum = () => {
    const museumUser = { role: 'museum', name: 'Eesti Rahva Muuseum' };
    localStorage.setItem('kr_user', JSON.stringify(museumUser));
    localStorage.setItem('userRole', 'museum');
    setUserRole('museum');
    
    // Dispatch event so Navbar re-renders
    window.dispatchEvent(new Event('kr-auth-change'));
    showToast('Sisse logitud Eesti Rahva Muuseumina!', 'success');
  };

  // Program operations
  const handleTogglePublish = (id: string) => {
    const updated = programsList.map(p => {
      if (p.id === id) {
        const nextState = !p.published;
        showToast(nextState ? `Programm "${p.title}" on nüüd avalikustatud!` : `Programm "${p.title}" on muudetud mitteavalikuks.`, 'info');
        return { ...p, published: nextState };
      }
      return p;
    });
    updateLocalPrograms(updated);
  };

  const handleDeleteProgram = (id: string, title: string) => {
    if (window.confirm(`Kas oled kindel, et soovid programmi "${title}" kustutada?`)) {
      const updated = programsList.filter(p => p.id !== id);
      updateLocalPrograms(updated);
      showToast(`Programm "${title}" on edukalt kustutatud.`, 'success');
    }
  };

  const handleEditProgramClick = (program: Program) => {
    setEditingProgramId(program.id);
    setFormTitle(program.title);
    setFormShortDesc(program.shortDescription);
    setFormFullDesc(program.fullDescription);
    setFormLocation(program.location);
    setFormDuration(program.duration);
    setFormPrice(program.price);
    setFormMinGroupSize(program.minGroupSize || 15);
    setFormMaxGroupSize(program.maxGroupSize || 30);
    setFormCounty(program.county || 'Tartumaa');
    setFormAddress(program.address || 'Muuseumi tee 2, Tartu');
    setFormOutdoor(program.outdoor || false);
    setFormImage(program.image);
    setFormEmail(program.contactEmail);
    setFormPhone(program.contactPhone);
    setFormTargetGroups(program.targetGroups);
    setFormCategories(program.categories);
    setFormConnections(program.curriculumConnections || []);
    setFormAccessibility(program.accessibility);
    setFormLanguages(program.languages || ['Eesti']);
    setFormAdditionalInfo(program.additionalInfo || '');
    setFormBookingMethod(program.bookingMethod || 'platform');
    setFormAvailableTimes(program.availableTimes || ['10:00', '12:00', '14:00']);
    setFormMaterials(program.materials || []);
    setFormPublished(program.published !== undefined ? program.published : true);
    
    setFormStep('form');
    setActiveTab('lisa');
  };

  const handleCreateNewClick = () => {
    setEditingProgramId(null);
    setFormTitle('');
    setFormShortDesc('');
    setFormFullDesc('');
    setFormLocation('Eesti Rahva Muuseum');
    setFormDuration('90 min');
    setFormPrice('10€');
    setFormMinGroupSize(15);
    setFormMaxGroupSize(30);
    setFormCounty('Tartumaa');
    setFormAddress('Muuseumi tee 2, 60532 Tartu, Tartumaa');
    setFormOutdoor(false);
    setFormImage('https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800&auto=format&fit=crop');
    setFormEmail('haridus@erm.ee');
    setFormPhone('+372 736 3050');
    setFormTargetGroups(['1. - 3. klass', '4. - 6. klass']);
    setFormCategories(['Muuseumid ja kultuuripärand', 'Ajalugu']);
    setFormConnections(['Ajalugu', 'Kultuuriteadlikkus']);
    setFormLanguages(['Eesti']);
    setFormAccessibility({
      wheelchair: true,
      hev: true,
      signLanguage: false,
      audioDescription: false
    });
    setFormAdditionalInfo('Soovitame kaasa võtta mugavad riided ja kirjutusvahend.');
    setFormBookingMethod('platform');
    setFormAvailableTimes(['2026-05-25 10:00', '2026-05-25 12:00', '2026-05-25 14:00']);
    setFormMaterials([
      { name: 'Tööleht_muuseum.pdf', url: '#' },
      { name: 'Õpetaja_juhend.docx', url: '#' }
    ]);
    setFormPublished(true);

    setFormStep('form');
    setActiveTab('lisa');
  };

  // Switch to step 2 preview with field verification
  const handleGoToPreview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle || !formShortDesc || !formFullDesc || !formLocation || !formPrice || !formAddress) {
      showToast('Palun täida kõik kohustuslikud väljad!', 'error');
      return;
    }

    if (formMinGroupSize <= 0 || formMaxGroupSize <= 0) {
      showToast('Grupi suurus peab olema nullist suurem!', 'error');
      return;
    }

    if (formMinGroupSize > formMaxGroupSize) {
      showToast('Minimaalne grupi suurus ei tohi olla suurem kui maksimaalne!', 'error');
      return;
    }

    setFormStep('preview');
    showToast('Andmed kontrollitud! Vaata eelvaade üle.', 'info');
  };

  // Perform actual save
  const handleSaveProgramFinal = () => {
    const participantStr = `${formMinGroupSize} - ${formMaxGroupSize} õpilast`;

    if (editingProgramId) {
      // Editing
      const updated = programsList.map(p => {
        if (p.id === editingProgramId) {
          return {
            ...p,
            title: formTitle,
            shortDescription: formShortDesc,
            fullDescription: formFullDesc,
            location: formLocation,
            duration: formDuration,
            price: formPrice,
            participantCount: participantStr,
            image: formImage,
            contactEmail: formEmail,
            contactPhone: formPhone,
            targetGroups: formTargetGroups,
            categories: formCategories.length > 0 ? formCategories : ['Muuseumid ja kultuuripärand'],
            curriculumConnections: formConnections,
            accessibility: formAccessibility,
            languages: formLanguages,
            minGroupSize: formMinGroupSize,
            maxGroupSize: formMaxGroupSize,
            county: formCounty,
            address: formAddress,
            outdoor: formOutdoor,
            additionalInfo: formAdditionalInfo,
            bookingMethod: formBookingMethod,
            availableTimes: formAvailableTimes,
            materials: formMaterials,
            published: formPublished
          };
        }
        return p;
      });
      updateLocalPrograms(updated);
      showToast(`Programm "${formTitle}" on edukalt uuendatud!`, 'success');
    } else {
      // Creating new
      const newProg: Program = {
        id: 'prog_' + Date.now(),
        title: formTitle,
        organizer: 'Eesti Rahva Muuseum',
        location: formLocation,
        image: formImage || 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800&auto=format&fit=crop',
        shortDescription: formShortDesc,
        fullDescription: formFullDesc,
        price: formPrice,
        targetGroups: formTargetGroups,
        duration: formDuration,
        categories: formCategories.length > 0 ? formCategories : ['Muuseumid ja kultuuripärand'],
        participantCount: participantStr,
        languages: formLanguages,
        curriculumConnections: formConnections,
        accessibility: formAccessibility,
        materials: formMaterials,
        contactEmail: formEmail,
        contactPhone: formPhone,
        published: formPublished,
        minGroupSize: formMinGroupSize,
        maxGroupSize: formMaxGroupSize,
        county: formCounty,
        address: formAddress,
        outdoor: formOutdoor,
        additionalInfo: formAdditionalInfo,
        bookingMethod: formBookingMethod,
        availableTimes: formAvailableTimes
      };
      updateLocalPrograms([newProg, ...programsList]);
      showToast(`Uus haridusprogramm "${formTitle}" on avaldatud!`, 'success');
    }

    setEditingProgramId(null);
    setActiveTab('programmid');
    setFormStep('form');
  };

  // Add Dynamic List helper handlers
  const handleAddAvailableTime = () => {
    if (!newDateInput || !newTimeInput) {
      showToast('Palun vali nii kuupäev kui ka kellaaeg!', 'error');
      return;
    }
    const newSlot = `${newDateInput} ${newTimeInput}`;
    if (formAvailableTimes.includes(newSlot)) {
      showToast('See kuupäev ja kellaaeg on juba lisatud!', 'error');
      return;
    }
    setFormAvailableTimes([...formAvailableTimes, newSlot].sort());
    // Keep date input intact for easy entry of multiple times, reset time
    setNewTimeInput('');
  };

  const handleRemoveAvailableTime = (time: string) => {
    setFormAvailableTimes(formAvailableTimes.filter(t => t !== time));
  };

  const handleAddMaterial = () => {
    if (!newMaterialName) return;
    setFormMaterials([...formMaterials, { name: newMaterialName, url: newMaterialUrl }]);
    setNewMaterialName('');
    setNewMaterialUrl('#');
  };

  const handleRemoveMaterial = (index: number) => {
    setFormMaterials(formMaterials.filter((_, idx) => idx !== index));
  };

  // Booking operations
  const handleConfirmBooking = (id: string) => {
    const updated = bookingsList.map(b => {
      if (b.id === id) {
        return { ...b, status: 'kinnitatud' as const };
      }
      return b;
    });
    updateLocalBookings(updated);
    showToast('Broneering on edukalt kinnitatud!', 'success');
  };

  const handleOpenRejectionPopup = (booking: Booking) => {
    setRejectionsBooking(booking);
    setRejectionReason('');
  };

  const handleSaveRejection = () => {
    if (!rejectionsBooking) return;
    if (rejectionReason.trim().length < 5) {
      showToast('Palun lisa pikem põhjendus (minimaalselt 5 tähemärki)!', 'error');
      return;
    }

    const updated = bookingsList.map(b => {
      if (b.id === rejectionsBooking.id) {
        return { 
          ...b, 
          status: 'tagasilukatud' as const,
          rejectionReason: rejectionReason.trim()
        };
      }
      return b;
    });

    updateLocalBookings(updated);
    setRejectionsBooking(null);
    showToast('Broneering on tagasi lükatud ja teavitus õpetajale saadetud.', 'info');
  };

  // Access Control restricted UI
  if (userRole !== 'museum') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-gray-150 p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-orange-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-60"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 border border-orange-100 shadow-sm">
              <ShieldAlert className="w-10 h-10" />
            </div>
            
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">Juurdepääs piiratud</h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed font-normal">
              See vaade on mõeldud ainult registreeritud kultuuriasutustele. Logi sisse kultuuriasutuse kontoga, et hallata oma programme ja broneeringuid.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleQuickLoginMuseum}
                className="bg-blue-600 text-white px-8 py-3.5 rounded-full text-base font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform active:scale-95 cursor-pointer"
              >
                <Building2 className="w-5 h-5" />
                Logi sisse kultuuriasutusena
              </button>
              
              <a
                href="/"
                className="bg-gray-100 text-gray-700 border border-gray-200 px-8 py-3.5 rounded-full text-base font-bold hover:bg-gray-200 transition-all transform active:scale-95 text-center"
              >
                Tagasi pealehele
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter lists based on state
  const filteredPrograms = programsList.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(progSearch.toLowerCase()) || 
                          p.shortDescription.toLowerCase().includes(progSearch.toLowerCase());
    const matchesPublish = progOnlyPublished ? p.published : true;
    return matchesSearch && matchesPublish;
  });

  const filteredBookings = bookingsList.filter(b => {
    const matchesSearch = b.programTitle.toLowerCase().includes(bookSearch.toLowerCase()) ||
                          b.schoolName.toLowerCase().includes(bookSearch.toLowerCase()) ||
                          b.cityName.toLowerCase().includes(bookSearch.toLowerCase());
    
    let matchesDate = true;
    if (bookDate) {
      matchesDate = b.date === bookDate;
    }

    const matchesProg = bookProgId ? b.programId === bookProgId : true;

    let matchesStatus = true;
    if (bookStatus) {
      if (bookStatus === 'ootel') matchesStatus = b.status === 'ootel';
      if (bookStatus === 'kinnitatud') matchesStatus = b.status === 'kinnitatud';
      if (bookStatus === 'tagasilukatud') matchesStatus = b.status === 'tagasilukatud';
    }

    let matchesOccurrence = true;
    if (bookOccurrence) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const bDate = new Date(b.date);
      if (bookOccurrence === 'tulevased') {
        matchesOccurrence = bDate >= today;
      } else if (bookOccurrence === 'moodunud') {
        matchesOccurrence = bDate < today;
      }
    }

    return matchesSearch && matchesDate && matchesProg && matchesStatus && matchesOccurrence;
  });

  // Unique program options for dropdown
  const uniqueProgramOptions = Array.from(new Set(bookingsList.map(b => b.programId)))
    .map(id => {
      const b = bookingsList.find(item => item.programId === id);
      return { id, title: b?.programTitle || '' };
    });

  const formatDateEstonian = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[999] bg-white text-gray-900 border border-gray-100 rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-slide-in max-w-sm">
          <div className={`p-2 rounded-xl shrink-0 ${
            toastType === 'success' ? 'bg-green-50 text-green-600' :
            toastType === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
          }`}>
            {toastType === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
             toastType === 'error' ? <AlertCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">{toastMessage}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors ml-auto cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">Kultuuriasutuse töölaud</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-1">Eesti Rahva Muuseum</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-100">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Muuseumi administraator
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('programmid')}
            className={`flex items-center gap-2 pb-4 font-bold text-sm transition-all border-b-2 cursor-pointer ${
              activeTab === 'programmid' 
                ? 'border-blue-600 text-blue-600 font-extrabold' 
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <BookOpen className="w-4.5 h-4.5" />
            Programmid
            <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">
              {programsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('broneeringud')}
            className={`flex items-center gap-2 pb-4 font-bold text-sm transition-all border-b-2 cursor-pointer ${
              activeTab === 'broneeringud' 
                ? 'border-blue-600 text-blue-600 font-extrabold' 
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <CalendarRange className="w-4.5 h-4.5" />
            Broneeringud
            <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">
              {bookingsList.filter(b => b.status === 'ootel').length > 0 ? (
                <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {bookingsList.filter(b => b.status === 'ootel').length} uut
                </span>
              ) : bookingsList.length}
            </span>
          </button>

          <button
            onClick={handleCreateNewClick}
            className={`flex items-center gap-2 pb-4 font-bold text-sm transition-all border-b-2 cursor-pointer ${
              activeTab === 'lisa' 
                ? 'border-blue-600 text-blue-600 font-extrabold' 
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <PlusCircle className="w-4.5 h-4.5" />
            {editingProgramId ? 'Muuda programmi' : 'Lisa programm'}
          </button>
        </div>
      </div>

      {/* TAB CONTENTS */}
      {activeTab === 'programmid' && (
        <div className="space-y-6">
          {/* Programs Filtering Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex-1 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="relative max-w-md w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Otsi..."
                  value={progSearch}
                  onChange={(e) => setProgSearch(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-700 shadow-xs"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={progOnlyPublished}
                  onChange={(e) => setProgOnlyPublished(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm font-bold text-gray-700">Avalikustatud</span>
              </label>
            </div>

            <button
              onClick={handleCreateNewClick}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 transform active:scale-98 cursor-pointer"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              Lisa uus programm
            </button>
          </div>

          {/* Programs List */}
          {filteredPrograms.length > 0 ? (
            <div className="space-y-4">
              {filteredPrograms.map((prog) => (
                <div 
                  key={prog.id} 
                  className="bg-white rounded-2xl border border-gray-150 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row relative group"
                >
                  <div className="md:w-1/3 lg:w-1/4 relative h-48 md:h-auto min-h-[180px] shrink-0 overflow-hidden">
                    <img 
                      src={prog.image} 
                      alt={prog.title} 
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        prog.published 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 text-white'
                      }`}>
                        {prog.published ? 'Avalikustatud' : 'Mitteavalik'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{prog.title}</h3>
                        <span className="text-sm font-extrabold text-blue-600 shrink-0 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                          {prog.price}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 font-medium mb-6">
                        <div className="grid grid-cols-[120px_1fr] gap-2 items-start">
                          <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mt-0.5">Lühikirjeldus:</span>
                          <span className="text-gray-700 leading-normal text-sm font-normal">{prog.shortDescription}</span>
                        </div>

                        <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
                          <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Teemad:</span>
                          <div className="flex flex-wrap gap-1">
                            {prog.categories.map((cat, idx) => (
                              <span key={idx} className="bg-gray-50 border border-gray-150 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-md">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
                          <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Sihtgrupp:</span>
                          <div className="flex flex-wrap gap-1">
                            {prog.targetGroups.map((tg, idx) => (
                              <span key={idx} className="bg-blue-50/50 border border-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-md">
                                {tg}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
                          <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Toimumiskoht:</span>
                          <span className="text-gray-700 leading-tight text-sm font-normal">{prog.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-between items-center border-t border-gray-100 pt-4 mt-auto gap-4">
                      <div className="flex gap-4 text-xs font-bold text-gray-400">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gray-400" /> {prog.duration}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-gray-400" /> {prog.participantCount}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProgramClick(prog)}
                          className="flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer shadow-xs active:scale-98"
                        >
                          <Edit className="w-3.5 h-3.5 text-gray-500" />
                          Muuda
                        </button>

                        <button
                          onClick={() => handleTogglePublish(prog.id)}
                          className="flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer shadow-xs active:scale-98"
                        >
                          {prog.published ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                              Muuda mitteavalikuks
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-gray-500" />
                              Muuda avalikuks
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteProgram(prog.id, prog.title)}
                          className="flex items-center gap-1.5 bg-white border border-red-200 text-red-600 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer shadow-xs active:scale-98"
                        >
                          <Trash className="w-3.5 h-3.5 text-red-500" />
                          Kustuta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-gray-150 rounded-2xl p-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-base text-gray-500 font-semibold mb-2">Ühtegi haridusprogrammi ei leitud</p>
              <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6">Proovi muuta otsingufiltreid või lisa uus programm.</p>
              <button 
                onClick={handleCreateNewClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Lisa programm
              </button>
            </div>
          )}

          {/* Styled Mock Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-8">
            <button className="flex items-center gap-1 text-sm font-semibold text-gray-400 cursor-not-allowed select-none">
              <ChevronLeft className="w-4 h-4" />
              Eelmine
            </button>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center cursor-pointer shadow-sm">1</button>
              <button className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center cursor-pointer">2</button>
              <button className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center cursor-pointer">3</button>
              <span className="text-gray-400 text-xs font-semibold px-1">...</span>
              <button className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center cursor-pointer">67</button>
              <button className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center cursor-pointer">68</button>
            </div>
            <button className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
              Järgmine
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'broneeringud' && (
        <div className="space-y-6">
          {/* Bookings Filters Grid */}
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-150 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Filtreeri broneeringuid</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Otsi..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  className="block w-full pl-9.5 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-700 shadow-xs"
                />
              </div>

              <div className="relative">
                <input
                  type="date"
                  value={bookDate}
                  onChange={(e) => setBookDate(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-700 shadow-xs cursor-pointer min-h-[38px]"
                />
              </div>

              <select
                value={bookProgId}
                onChange={(e) => setBookProgId(e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-700 shadow-xs cursor-pointer"
              >
                <option value="">Kultuuriprogrammi nimi</option>
                {uniqueProgramOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.title}</option>
                ))}
              </select>

              <select
                value={bookStatus}
                onChange={(e) => setBookStatus(e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-700 shadow-xs cursor-pointer"
              >
                <option value="">Staatus</option>
                <option value="ootel">Kinnitamata</option>
                <option value="kinnitatud">Kinnitatud</option>
                <option value="tagasilukatud">Tagasi lükatud</option>
              </select>

              <select
                value={bookOccurrence}
                onChange={(e) => setBookOccurrence(e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-700 shadow-xs cursor-pointer"
              >
                <option value="">Toimumine: Kõik</option>
                <option value="tulevased">Toimumine: Tulevased</option>
                <option value="moodunud">Toimumine: Möödunud</option>
              </select>
            </div>
            
            {/* Clear filters row */}
            {(bookSearch || bookDate || bookProgId || bookStatus || bookOccurrence) && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setBookSearch('');
                    setBookDate('');
                    setBookProgId('');
                    setBookStatus('');
                    setBookOccurrence('');
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Tühjenda filtrid
                </button>
              </div>
            )}
          </div>

          {/* Bookings Table container */}
          {filteredBookings.length > 0 ? (
            <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 text-xs font-extrabold uppercase tracking-wider text-gray-500">
                      <th className="px-5 py-4 font-extrabold">Kultuuriprogramm</th>
                      <th className="px-5 py-4 font-extrabold">Kuupäev</th>
                      <th className="px-5 py-4 font-extrabold">Kellaaeg</th>
                      <th className="px-5 py-4 font-extrabold text-center">Osalejad</th>
                      <th className="px-5 py-4 font-extrabold">Kool</th>
                      <th className="px-5 py-4 font-extrabold">Staatus</th>
                      <th className="px-5 py-4 font-extrabold text-right">Tegevused</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm font-semibold text-gray-700">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4 font-bold text-gray-900">{b.programTitle}</td>
                        <td className="px-5 py-4 text-gray-600 font-semibold">{formatDateEstonian(b.date)}</td>
                        <td className="px-5 py-4 text-gray-600 font-semibold">{b.time}</td>
                        <td className="px-5 py-4 text-center text-gray-900 font-bold">{b.studentsCount}</td>
                        <td className="px-5 py-4 leading-normal font-normal">
                          <span className="block font-bold text-gray-800 leading-tight">{b.schoolName}</span>
                          <span className="text-xs font-semibold text-gray-400 mt-0.5 block">{b.cityName}</span>
                        </td>
                        <td className="px-5 py-4">
                          {b.status === 'ootel' && (
                            <span className="inline-flex items-center bg-yellow-50 text-yellow-700 border border-yellow-250 text-xs font-bold px-2.5 py-0.5 rounded-full">
                              Kinnitamata
                            </span>
                          )}
                          {b.status === 'kinnitatud' && (
                            <span className="inline-flex items-center bg-green-50 text-green-700 border border-green-250 text-xs font-bold px-2.5 py-0.5 rounded-full">
                              Kinnitatud
                            </span>
                          )}
                          {b.status === 'tagasilukatud' && (
                            <span className="inline-flex items-center bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                              Tagasi lükatud
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setViewBooking(b)}
                              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                            >
                              Vaata
                            </button>

                            {b.status === 'ootel' ? (
                              <>
                                <button
                                  onClick={() => handleConfirmBooking(b.id)}
                                  className="bg-green-600 text-white hover:bg-green-750 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                                >
                                  Kinnita
                                </button>
                                <button
                                  onClick={() => handleOpenRejectionPopup(b)}
                                  className="bg-red-500 text-white hover:bg-red-600 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                                >
                                  Lükka tagasi
                                </button>
                              </>
                            ) : (
                              <span className="text-xs font-bold text-gray-400 italic px-2">
                                {b.status === 'kinnitatud' ? 'Kinnitatud' : 'Tagasi lükatud'}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-gray-150 rounded-2xl p-8">
              <CalendarRange className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-base text-gray-500 font-semibold mb-2">Ühtegi broneeringut ei leitud</p>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">Valitud filtritega ei kattu ükski broneering. Proovi muuta filtrite väärtusi.</p>
            </div>
          )}

          {/* Styled Mock Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-8">
            <button className="flex items-center gap-1 text-sm font-semibold text-gray-400 cursor-not-allowed select-none">
              <ChevronLeft className="w-4 h-4" />
              Eelmine
            </button>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center cursor-pointer shadow-sm">1</button>
              <button className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center cursor-pointer">2</button>
              <button className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center cursor-pointer">3</button>
              <span className="text-gray-400 text-xs font-semibold px-1">...</span>
              <button className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center cursor-pointer">67</button>
              <button className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center cursor-pointer">68</button>
            </div>
            <button className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
              Järgmine
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'lisa' && (
        <div className="space-y-6">
          
          {/* STEP HEADER INDICATOR */}
          <div className="bg-white border border-gray-150 rounded-2xl px-6 py-5 flex items-center justify-between shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {editingProgramId ? `Muuda haridusprogrammi: ${formTitle || 'Nimetus'}` : 'Lisa uus haridusprogramm'}
              </h2>
              <p className="text-sm text-gray-500 font-semibold mt-0.5">
                {formStep === 'form' ? 'Samm 1: Sisesta programmi andmed' : 'Samm 2: Kontrolli eelvaadet enne avaldamist'}
              </p>
            </div>

            {/* Stepper Progress Badges */}
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                formStep === 'form' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                1. Andmed
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                formStep === 'preview' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-gray-100 text-gray-500 border border-gray-200'
              }`}>
                2. Eelvaade
              </span>
            </div>
          </div>

          {/* STEP 1: FORM LAYOUT */}
          {formStep === 'form' && (
            <form onSubmit={handleGoToPreview} className="space-y-8 mt-6">
              {/* Modern Frameless Larger Single-Column Sequential Layout */}
              <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Section 1: Programmi põhiinfo */}
                <div className="space-y-6">
                  <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    Programmi põhiinfo
                  </h3>
                  
                  {/* Program Title */}
                  <div className="space-y-2">
                    <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">Kultuuriprogrammi nimetus *</label>
                    <input
                      type="text"
                      required
                      placeholder="nt. Ajarännak minevikku"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-850 shadow-xs"
                    />
                  </div>

                  {/* Short Description */}
                  <div className="space-y-2">
                    <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">Kultuuriprogrammi lühikirjeldus (1-2 lauset) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Maksimaalselt 150 tähemärki"
                      value={formShortDesc}
                      onChange={(e) => setFormShortDesc(e.target.value)}
                      className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-855 shadow-xs"
                    />
                  </div>

                  {/* Full Description */}
                  <div className="space-y-2">
                    <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">Kultuuriprogrammi kirjeldus *</label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Kirjelda siin programmi sisu, tegevusi, tulemusi jne..."
                      value={formFullDesc}
                      onChange={(e) => setFormFullDesc(e.target.value)}
                      className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-855 shadow-xs"
                    ></textarea>
                  </div>

                  {/* Keeled (Language checkboxes) */}
                  <div className="space-y-2.5">
                    <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">Keeled *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-150">
                      {['Eesti', 'Inglise', 'Vene', 'Muu'].map((lang) => (
                        <label key={lang} className="flex items-center gap-3 cursor-pointer text-base font-bold text-gray-700 select-none">
                          <input
                            type="checkbox"
                            checked={formLanguages.includes(lang)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormLanguages([...formLanguages, lang]);
                              } else {
                                setFormLanguages(formLanguages.filter(l => l !== lang));
                              }
                            }}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                          />
                          {lang}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 my-8 pt-8"></div>

                {/* Section 2: Teemad ja sihtgrupp */}
                <div className="space-y-6">
                  <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    Teemad ja sihtgrupp
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Categories (Kategooriad) Dropdown Select with tag pills */}
                    <div className="space-y-2">
                      <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">Kategooriad *</label>
                      <select
                        value=""
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && !formCategories.includes(val)) {
                            setFormCategories([...formCategories, val]);
                          }
                          e.target.value = "";
                        }}
                        className="block w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer h-[54px] appearance-none"
                      >
                        <option value="">Lisa teema / kategooria...</option>
                        {CATEGORIES_PRESETS.map(cat => (
                          <option key={cat} value={cat} disabled={formCategories.includes(cat)}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      
                      <div className="flex flex-wrap gap-2 mt-3 bg-gray-50 p-3 rounded-xl border border-gray-150 min-h-[52px] items-center">
                        {formCategories.map(cat => (
                          <span key={cat} className="inline-flex items-center gap-2 bg-white border border-gray-200 text-blue-700 text-sm font-bold px-3 py-1 rounded-lg shadow-xs">
                            {cat}
                            <button 
                              type="button" 
                              onClick={() => setFormCategories(formCategories.filter(c => c !== cat))}
                              className="text-blue-500 hover:text-blue-700 font-extrabold cursor-pointer text-sm ml-1"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                        {formCategories.length === 0 && (
                          <span className="text-sm text-gray-455 italic">Ühtegi kategooriat pole valitud</span>
                        )}
                      </div>
                    </div>

                    {/* Target Groups Dropdown Select with tag pills */}
                    <div className="space-y-2">
                      <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">Sihtgrupp *</label>
                      <select
                        value=""
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && !formTargetGroups.includes(val)) {
                            setFormTargetGroups([...formTargetGroups, val]);
                          }
                          e.target.value = "";
                        }}
                        className="block w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer h-[54px] appearance-none"
                      >
                        <option value="">Lisa sihtgrupp...</option>
                        {['Lasteaed', '1. - 3. klass', '4. - 6. klass', '7. - 9. klass', 'Gümnaasium'].map(grp => (
                          <option key={grp} value={grp} disabled={formTargetGroups.includes(grp)}>
                            {grp}
                          </option>
                        ))}
                      </select>
                      
                      <div className="flex flex-wrap gap-2 mt-3 bg-gray-50 p-3 rounded-xl border border-gray-150 min-h-[52px] items-center">
                        {formTargetGroups.map(grp => (
                          <span key={grp} className="inline-flex items-center gap-2 bg-white border border-gray-200 text-blue-700 text-sm font-bold px-3 py-1 rounded-lg shadow-xs">
                            {grp}
                            <button 
                              type="button" 
                              onClick={() => setFormTargetGroups(formTargetGroups.filter(g => g !== grp))}
                              className="text-blue-500 hover:text-blue-700 font-extrabold cursor-pointer text-sm ml-1"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                        {formTargetGroups.length === 0 && (
                          <span className="text-sm text-gray-455 italic">Ühtegi sihtgruppi pole valitud</span>
                        )}
                      </div>
                    </div>

                    {/* Õppekavaseosed Dropdown Select with tag pills */}
                    <div className="space-y-2">
                      <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">Õppekavaseosed</label>
                      <select
                        value=""
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && !formConnections.includes(val)) {
                            setFormConnections([...formConnections, val]);
                          }
                          e.target.value = "";
                        }}
                        className="block w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer h-[54px] appearance-none"
                      >
                        <option value="">Lisa õppekavaseos...</option>
                        {CURRICULUM_PRESETS.map(conn => (
                          <option key={conn} value={conn} disabled={formConnections.includes(conn)}>
                            {conn}
                          </option>
                        ))}
                      </select>
                      
                      <div className="flex flex-wrap gap-2 mt-3 bg-gray-50 p-3 rounded-xl border border-gray-150 min-h-[52px] items-center">
                        {formConnections.map(conn => (
                          <span key={conn} className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold px-3 py-1 rounded-lg shadow-xs">
                            {conn}
                            <button 
                              type="button" 
                              onClick={() => setFormConnections(formConnections.filter(c => c !== conn))}
                              className="text-gray-400 hover:text-gray-700 font-extrabold cursor-pointer text-sm ml-1"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                        {formConnections.length === 0 && (
                          <span className="text-sm text-gray-455 italic">Õppekavaseoseid pole lisatud</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 my-8 pt-8"></div>

                {/* Section 3: Toimumise info */}
                <div className="space-y-6">
                  <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    Toimumise info
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Price input */}
                    <div className="space-y-1.5">
                      <label className="text-base font-extrabold text-gray-800 block">Hind õpilase kohta *</label>
                      <input
                        type="text"
                        required
                        placeholder="nt. 10€"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                      />
                    </div>

                    {/* Duration */}
                    <div className="space-y-1.5">
                      <label className="text-base font-extrabold text-gray-800 block">Kestus *</label>
                      <input
                        type="text"
                        required
                        placeholder="nt. 90 min"
                        value={formDuration}
                        onChange={(e) => setFormDuration(e.target.value)}
                        className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                      />
                    </div>

                    {/* Min group size */}
                    <div className="space-y-1.5">
                      <label className="text-base font-extrabold text-gray-800 block">Minimaalne grupp *</label>
                      <input
                        type="number"
                        required
                        placeholder="10"
                        value={formMinGroupSize}
                        onChange={(e) => setFormMinGroupSize(parseInt(e.target.value) || 0)}
                        className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                      />
                    </div>

                    {/* Max group size */}
                    <div className="space-y-1.5">
                      <label className="text-base font-extrabold text-gray-800 block">Maksimaalne grupp *</label>
                      <input
                        type="number"
                        required
                        placeholder="30"
                        value={formMaxGroupSize}
                        onChange={(e) => setFormMaxGroupSize(parseInt(e.target.value) || 0)}
                        className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* County select */}
                    <div className="space-y-1.5">
                      <label className="text-base font-extrabold text-gray-800 block">Maakond *</label>
                      <select
                        value={formCounty}
                        onChange={(e) => setFormCounty(e.target.value)}
                        className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 cursor-pointer h-[54px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      >
                        {ESTONIAN_COUNTIES.map(cnt => (
                          <option key={cnt} value={cnt}>{cnt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location name */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-base font-extrabold text-gray-800 block">Toimumiskoht *</label>
                      <input
                        type="text"
                        required
                        placeholder="nt. Eesti Rahva Muuseum"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <label className="text-base font-extrabold text-gray-800 block">Täpne aadress *</label>
                    <input
                      type="text"
                      required
                      placeholder="nt. Muuseumi tee 2, 60532 Tartu"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                    />
                  </div>

                  {/* Accessibility & outdoor checkboxes */}
                  <div className="space-y-2">
                    <label className="text-base font-extrabold text-gray-800 block uppercase tracking-wider">Muu toimumisinfo</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-gray-50 p-5 rounded-xl border border-gray-150 text-base font-bold text-gray-700">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formAccessibility.wheelchair}
                          onChange={(e) => setFormAccessibility({ ...formAccessibility, wheelchair: e.target.checked })}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded cursor-pointer"
                        />
                        Ligipääs ratastooliga
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formAccessibility.hev}
                          onChange={(e) => setFormAccessibility({ ...formAccessibility, hev: e.target.checked })}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded cursor-pointer"
                        />
                        Sobib erivajadustega õpilastele
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formOutdoor}
                          onChange={(e) => setFormOutdoor(e.target.checked)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded cursor-pointer"
                        />
                        Toimub välitingimustes
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 my-8 pt-8"></div>

                {/* Section 4: Meedia ja õppematerjalid */}
                <div className="space-y-6">
                  <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    Meedia ja õppematerjalid
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Kaanefoto (Image Box Preview) */}
                    <div className="space-y-3">
                      <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">Programmi kaanefoto *</label>
                      <div className="border border-gray-200 bg-gray-50 rounded-2xl overflow-hidden h-48 flex flex-col items-center justify-center relative group shadow-xs">
                        {formImage ? (
                          <>
                            <img 
                              src={formImage} 
                              alt="Programmi kaanefoto eelvaade" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30">
                                Kaanefoto valitud
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <span className="text-base text-gray-450 font-semibold">Pilti pole veel valitud</span>
                          </div>
                        )}
                      </div>

                      {/* Image upload zone or URL */}
                      <div className="space-y-3 pt-2">
                        <div className="flex flex-col sm:flex-row gap-3">
                          {/* File input (custom styled) */}
                          <label className="flex-1 bg-white border border-gray-300 rounded-xl px-5 py-3.5 text-base font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all cursor-pointer shadow-xs active:scale-98 border-dashed border-2 hover:border-blue-400">
                            <PlusCircle className="w-5 h-5 text-gray-400" />
                            Vali fail arvutist
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 2 * 1024 * 1024) {
                                    showToast('Fail on liiga suur (maksimaalselt 2MB)!', 'error');
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    if (typeof reader.result === 'string') {
                                      setFormImage(reader.result);
                                      showToast('Kaanefoto edukalt laetud!', 'success');
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                          
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="või sisesta pildi URL..."
                              value={formImage.startsWith('data:image') ? '' : formImage}
                              onChange={(e) => setFormImage(e.target.value)}
                              className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs h-[54px]"
                            />
                          </div>
                        </div>

                        {/* Presets Row */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setFormImage('https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800&auto=format&fit=crop')}
                            className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 py-3 rounded-xl text-sm font-extrabold text-gray-650 transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            Ajalugu (ERM)
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormImage('https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop')}
                            className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 py-3 rounded-xl text-sm font-extrabold text-gray-650 transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            Kunst ja disain
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Õppematerjalid (Dynamic documents list) */}
                    <div className="space-y-3">
                      <label className="text-base font-extrabold text-gray-800 uppercase tracking-wider block">Õppematerjalid</label>
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row gap-2 bg-gray-50 p-4 rounded-xl border border-gray-150">
                          <input
                            type="text"
                            placeholder="Materjali nimetus (nt. Tööleht)"
                            value={newMaterialName}
                            onChange={(e) => setNewMaterialName(e.target.value)}
                            className="block flex-1 px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                          <button
                            type="button"
                            onClick={handleAddMaterial}
                            className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-750 py-3.5 px-6 rounded-xl text-sm font-bold cursor-pointer transition-all shadow-xs active:scale-98 flex items-center justify-center gap-2 sm:w-auto w-full shrink-0"
                          >
                            <PlusCircle className="w-5 h-5 text-gray-400" />
                            Lisa õppematerjal
                          </button>
                        </div>

                        {/* Display added materials list */}
                        <div className="space-y-2 max-h-48 overflow-y-auto pt-1">
                          {formMaterials.map((mat, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 border border-gray-200 p-4 rounded-xl text-base font-bold text-gray-700 shadow-xs">
                              <span className="flex items-center gap-2 truncate"><FileText className="w-5 h-5 text-gray-400" /> {mat.name}</span>
                              <button 
                                type="button" 
                                onClick={() => handleRemoveMaterial(idx)}
                                className="text-red-500 hover:text-red-750 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200 shadow-xs"
                              >
                                <Trash className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 my-8 pt-8"></div>

                {/* Section 5: Broneerimine */}
                <div className="space-y-6">
                  <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    Broneerimine
                  </h3>
                  
                  {/* Radio Options */}
                  <div className="flex flex-col sm:flex-row gap-6 bg-gray-50 p-5 rounded-2xl border border-gray-150">
                    <label className="flex items-center gap-3.5 cursor-pointer select-none flex-1">
                      <input
                        type="radio"
                        name="booking-method"
                        checked={formBookingMethod === 'platform'}
                        onChange={() => setFormBookingMethod('platform')}
                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-base font-bold text-gray-800">Broneerimine läbi platvormi</span>
                    </label>

                    <label className="flex items-center gap-3.5 cursor-pointer select-none flex-1">
                      <input
                        type="radio"
                        name="booking-method"
                        checked={formBookingMethod === 'contact'}
                        onChange={() => setFormBookingMethod('contact')}
                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-base font-bold text-gray-800">Muu broneerimiskanal (e-mail, telefon)</span>
                    </label>
                  </div>

                  {formBookingMethod === 'platform' ? (
                    // OPTION 1: Platform Booking (Saadaval olevad ajad)
                    <div className="space-y-4 pt-4 border-t border-gray-100 animate-fade-in">
                      <h4 className="text-base font-extrabold text-gray-850 uppercase tracking-wider block">Saadaval olevad ajad</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-150">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Kuupäev</label>
                          <input
                            type="date"
                            value={newDateInput}
                            onChange={(e) => setNewDateInput(e.target.value)}
                            className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 h-[54px]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Kellaaeg</label>
                          <input
                            type="time"
                            value={newTimeInput}
                            onChange={(e) => setNewTimeInput(e.target.value)}
                            className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 h-[54px]"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={handleAddAvailableTime}
                            className="w-full bg-blue-600 hover:bg-blue-700 border border-blue-600 text-white py-3.5 px-6 rounded-xl text-base font-bold transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 h-[54px]"
                          >
                            <PlusCircle className="w-5 h-5" />
                            Lisa kuupäev ja aeg
                          </button>
                        </div>
                      </div>

                      {/* Active Times Grid */}
                      <div className="flex flex-wrap gap-2.5 mt-3 bg-gray-50 p-4 rounded-xl border border-gray-150 min-h-[52px] items-center">
                        {formAvailableTimes.length > 0 ? (
                          formAvailableTimes.map((item) => {
                            const parts = item.split(' ');
                            const displayStr = parts.length === 2 
                              ? `${formatDateEstonian(parts[0])} kell ${parts[1]}` 
                              : item;
                            return (
                              <span key={item} className="inline-flex items-center gap-2 bg-white border border-gray-250 text-gray-700 text-sm font-bold px-3.5 py-1.5 rounded-lg shadow-xs hover:border-gray-300 transition-colors">
                                {displayStr}
                                <button 
                                  type="button"
                                  onClick={() => handleRemoveAvailableTime(item)}
                                  className="text-gray-450 hover:text-red-650 rounded-full font-extrabold cursor-pointer text-sm ml-1 w-4 h-4 flex items-center justify-center hover:bg-red-50"
                                >
                                  &times;
                                </button>
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-sm text-gray-450 italic pl-1">Ühtegi kuupäeva ja kellaaega pole lisatud (õpetajad ei saa broneerida)</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    // OPTION 2: Contact Booking (E-post, telefon, lisainfo)
                    <div className="space-y-4 pt-4 border-t border-gray-100 animate-fade-in">
                      <p className="text-sm font-semibold text-gray-500 leading-relaxed">
                        Täida allolevad kontaktandmed, mille kaudu õpetajad saavad Teiega ühendust võtta.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-base font-extrabold text-gray-800 block">Email *</label>
                          <input
                            type="email"
                            required={formBookingMethod === 'contact'}
                            placeholder="haridus@asutus.ee"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-base font-extrabold text-gray-800 block">Telefon *</label>
                          <input
                            type="text"
                            required={formBookingMethod === 'contact'}
                            placeholder="+372 ..."
                            value={formPhone}
                            onChange={(e) => setFormPhone(e.target.value)}
                            className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                          />
                        </div>
                      </div>

                      {/* Additional Info textarea for contact booking */}
                      <div className="space-y-1.5">
                        <label className="text-base font-extrabold text-gray-800 block">Lisainfo</label>
                        <textarea
                          rows={3}
                          placeholder="nt. Kirjuta siia, millal ja kuidas soovid broneeringute kokkuleppeid teha..."
                          value={formAdditionalInfo}
                          onChange={(e) => setFormAdditionalInfo(e.target.value)}
                          className="block w-full px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 my-8 pt-8"></div>

                {/* Section 6: Avalikustamise olek */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-150">
                  <div>
                    <span className="text-base font-extrabold text-gray-800 block uppercase tracking-wider">Avalikustamise olek</span>
                    <span className="text-xs sm:text-sm text-gray-500 font-semibold block mt-0.5">Kas programm on salvestamise järel õpetajatele nähtav?</span>
                  </div>
                  
                  <select
                    value={formPublished ? 'true' : 'false'}
                    onChange={(e) => setFormPublished(e.target.value === 'true')}
                    className="bg-white border border-gray-300 rounded-xl px-5 py-3.5 text-base font-extrabold text-gray-800 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-[54px]"
                  >
                    <option value="true">Avalik (nähtav)</option>
                    <option value="false">Mitteavalik (draft)</option>
                  </select>
                </div>
              </div>

              {/* FORM FOOTER BUTTONS */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProgramId(null);
                    setActiveTab('programmid');
                  }}
                  className="bg-white border border-gray-300 text-gray-700 px-8 py-3.5 rounded-xl text-base font-bold hover:bg-gray-50 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  Tühista
                </button>
                
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-10 py-3.5 rounded-xl text-base font-bold hover:bg-blue-700 transition-all shadow-xs flex items-center gap-2 cursor-pointer transform active:scale-98"
                >
                  Järgmine samm: Eelvaade
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: LIVE PREVIEW LAYOUT */}
          {formStep === 'preview' && (
            <div className="p-6 space-y-8 bg-gray-50/20">
              
              {/* Informative Preview Header */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-sm text-blue-900 leading-relaxed font-semibold">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p>See on programmi eelvaade.</p>
                  <p className="text-xs text-blue-700 font-semibold mt-0.5">Kontrollige andmete paigutust ja detaile. Kui olete rahul, vajutage all paremas nurgas "Salvesta ja avalikusta".</p>
                </div>
              </div>

              {/* LIVE SIMULATED PROGRAM DETAIL VIEW */}
              <div className="space-y-6 max-w-4xl mx-auto">
                
                {/* 1. MAJOR CARD: Banner Image and Basic details */}
                <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-md flex flex-col md:flex-row">
                  
                  {/* Banner Image left side */}
                  <div className="md:w-5/12 h-64 md:h-auto min-h-[250px] relative overflow-hidden shrink-0">
                    <img 
                      src={formImage} 
                      alt={formTitle} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>

                  {/* Banner details right side */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 leading-tight mb-4">
                        {formTitle}
                      </h1>

                      <p className="text-sm font-semibold text-gray-500 leading-normal mb-6">
                        {formShortDesc}
                      </p>

                      {/* Detail Badges Grid */}
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-xs font-semibold text-gray-700">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Korraldaja:</span>
                          <span className="font-extrabold text-gray-900 leading-normal block mt-0.5">Eesti Rahva Muuseum</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Toimumiskoht:</span>
                          <span className="font-extrabold text-gray-900 leading-normal block mt-0.5">{formLocation} ({formCounty})</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Keel(ed):</span>
                          <span className="font-extrabold text-gray-900 leading-normal block mt-0.5">{formLanguages.join(', ') || 'Eesti'}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Sihtgrupp:</span>
                          <span className="font-extrabold text-gray-900 leading-normal block mt-0.5">{formTargetGroups.join(', ') || 'Kõik vanused'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-between items-center border-t border-gray-100 pt-5 mt-6 gap-4">
                      <div className="flex gap-4 text-xs font-extrabold text-gray-405 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> {formDuration}</span>
                        <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-gray-400" /> {formMinGroupSize} kuni {formMaxGroupSize} õpilast</span>
                      </div>
                      
                      <span className="text-xl font-extrabold text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-100 shadow-2xs">
                        {formPrice} / õpilane
                      </span>
                    </div>

                  </div>
                </div>

                {/* 2. SUB CARD: Description & categories */}
                <div className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 shadow-xs space-y-6">
                  
                  {/* Curriculums / Categories Row */}
                  <div className="flex flex-wrap gap-4 items-center border-b border-gray-100 pb-5">
                    
                    {formCategories.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Kategooriad:</span>
                        <div className="flex flex-wrap gap-1">
                          {formCategories.map(cat => (
                            <span key={cat} className="bg-blue-50/50 border border-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {formConnections.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Õppekavaseosed:</span>
                        <div className="flex flex-wrap gap-1">
                          {formConnections.map(conn => (
                            <span key={conn} className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                              {conn}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Full description */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">Programmi kirjeldus</h2>
                    <p className="text-sm font-semibold text-gray-650 leading-relaxed whitespace-pre-wrap font-normal">
                      {formFullDesc}
                    </p>
                  </div>
                </div>

                {/* 3. TOIMUMISE INFO BLOCK: Address, constraints, lisainfo */}
                <div className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 shadow-xs space-y-5">
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">Toimumise info</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-semibold text-gray-700">
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Aadress:</span>
                      <span className="text-gray-900 leading-snug block">{formAddress}</span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Grupi suurus:</span>
                      <span className="text-gray-900 leading-snug block">Minimaalne: <strong className="font-extrabold">{formMinGroupSize}</strong>, Maksimaalne: <strong className="font-extrabold">{formMaxGroupSize}</strong> õpilast</span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Oluline info:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${formAccessibility.wheelchair ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
                          {formAccessibility.wheelchair ? '✓ Ratastooliga ligipääs' : '✗ Ratastooliga puudub'}
                        </span>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${formAccessibility.hev ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
                          {formAccessibility.hev ? '✓ HEV õppijatele sobiv' : '✗ HEV tugi puudub'}
                        </span>
                        {formOutdoor && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-50 border border-orange-200 text-orange-700">
                            ☀ Välitingimustes
                          </span>
                        )}
                      </div>
                    </div>

                    {formAdditionalInfo && (
                      <div className="space-y-1.5 sm:col-span-2 border-t border-gray-100 pt-3">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Lisainfo:</span>
                        <p className="text-xs text-gray-500 font-semibold leading-relaxed font-normal italic">
                          "{formAdditionalInfo}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. ÕPPEMATERJALID DOWNLOAD BLOCKS */}
                {formMaterials.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 shadow-xs space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">Õppematerjalid</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {formMaterials.map((mat, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-150 hover:bg-gray-100/50 hover:border-gray-200 transition-all group/mat">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded border border-gray-200 shadow-xs">
                              <FileText className="w-4.5 h-4.5 text-gray-450" />
                            </div>
                            <span className="text-xs font-extrabold text-gray-800 truncate">{mat.name}</span>
                          </div>
                          <button type="button" className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors shadow-xs bg-white border border-gray-200 flex items-center justify-center">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. BRONEERIMINE: Premium Interactive preview */}
                <div className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 shadow-xs space-y-5">
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">Broneerimine</h2>
                  
                  {formBookingMethod === 'platform' ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-150 p-4 rounded-xl text-xs text-blue-800 font-semibold flex items-start gap-2">
                        <Info className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          Interaktiivne eelvaade õpetaja broneerimisest.
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* Dates grid */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-3">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">1. Vali kuupäev:</span>
                          {availableDates.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1">
                              {availableDates.map((dateStr) => {
                                const isSelected = activePreviewDate === dateStr;
                                return (
                                  <button
                                    key={dateStr}
                                    type="button"
                                    onClick={() => {
                                      setSelectedPreviewDateStr(dateStr);
                                      setSelectedPreviewTimeStr('');
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-xl border font-extrabold text-sm transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                                      isSelected
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-150'
                                    }`}
                                  >
                                    <span>{formatDateEstonian(dateStr)}</span>
                                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-8 text-center text-sm font-semibold text-gray-400 italic bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                              Kuupäevi pole veel lisatud. Lisa ajad esimeses sammus!
                            </div>
                          )}
                        </div>

                        {/* Times grid */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-3">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">2. Vali kellaaeg:</span>
                          {activePreviewDate ? (
                            <div className="grid grid-cols-2 gap-2">
                              {formAvailableTimes
                                .filter(t => t.startsWith(activePreviewDate))
                                .map(t => {
                                  const timeStr = t.split(' ')[1] || t;
                                  const isSelected = selectedPreviewTimeStr === timeStr;
                                  return (
                                    <button
                                      key={t}
                                      type="button"
                                      onClick={() => setSelectedPreviewTimeStr(timeStr)}
                                      className={`px-3 py-2.5 rounded-xl border font-bold text-xs text-center transition-all cursor-pointer shadow-xs ${
                                        isSelected
                                          ? 'bg-blue-600 text-white border-blue-600'
                                          : 'bg-white hover:bg-blue-50 hover:border-blue-200 text-gray-700 border-gray-250'
                                      }`}
                                    >
                                      {timeStr}
                                    </button>
                                  );
                                })}
                            </div>
                          ) : (
                            <div className="p-8 text-center text-sm font-semibold text-gray-400 italic bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                              Vali esmalt vasakult kuupäev
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Contact Card Preview */
                    <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl shrink-0">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-gray-900">Broneerimine väljaspool platvormi</h4>
                          <p className="text-xs text-gray-500 font-semibold">Õpetajad võtavad broneerimiseks otse teiega ühendust.</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {formEmail && (
                          <div className="bg-white p-4 rounded-xl border border-gray-150 flex items-center gap-3 shadow-xs">
                            <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">E-post:</span>
                              <span className="text-sm font-bold text-blue-600 break-all">{formEmail}</span>
                            </div>
                          </div>
                        )}
                        {formPhone && (
                          <div className="bg-white p-4 rounded-xl border border-gray-150 flex items-center gap-3 shadow-xs">
                            <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Telefon:</span>
                              <span className="text-sm font-bold text-gray-800">{formPhone}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. KONTAKT BLOCKS */}
                <div className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 shadow-xs space-y-4">
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">Kontaktandmed</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {formEmail && (
                      <div className="flex items-center p-3 rounded-xl bg-gray-50 border border-gray-150">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded border border-gray-200 shadow-xs shrink-0">
                            <Mail className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">E-post</span>
                            <span className="text-xs font-extrabold text-blue-600">{formEmail}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {formPhone && (
                      <div className="flex items-center p-3 rounded-xl bg-gray-50 border border-gray-150">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded border border-gray-200 shadow-xs shrink-0">
                            <Phone className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Telefon</span>
                            <span className="text-xs font-extrabold text-blue-600">{formPhone}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* PREVIEW STEP ACTION BUTTONS */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-150 bg-white p-4 rounded-2xl border border-gray-150">
                <button
                  type="button"
                  onClick={() => setFormStep('form')}
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all cursor-pointer shadow-xs active:scale-98 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-500" />
                  Tagasi andmeid muutma
                </button>
                
                <button
                  type="button"
                  onClick={handleSaveProgramFinal}
                  className="bg-green-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer transform active:scale-98"
                >
                  <Check className="w-4.5 h-4.5" />
                  Salvesta ja avalikusta
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* POPUP MODAL 1: "Vaata" Booking Info popup */}
      {viewBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setViewBooking(null)}
          ></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 transform transition-all duration-300 animate-scale-up">
            
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                Broneeringu info: <span className="font-extrabold text-blue-600">{viewBooking.programTitle}</span>
              </h2>
              <button 
                onClick={() => setViewBooking(null)}
                className="p-1.5 hover:bg-gray-250 rounded-full transition-all text-gray-400 hover:text-gray-900 cursor-pointer"
                aria-label="Sule detailinfo aken"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-4">
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  viewBooking.status === 'kinnitatud' ? 'bg-green-100 text-green-700' :
                  viewBooking.status === 'tagasilukatud' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {viewBooking.status === 'kinnitatud' ? <CheckCircle2 className="w-5 h-5" /> : 
                   viewBooking.status === 'tagasilukatud' ? <X className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Staatus</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-base font-extrabold capitalize ${
                      viewBooking.status === 'kinnitatud' ? 'text-green-700' :
                      viewBooking.status === 'tagasilukatud' ? 'text-red-700' : 'text-yellow-700'
                    }`}>
                      {viewBooking.status === 'ootel' ? 'Kinnitamata' : viewBooking.status === 'kinnitatud' ? 'Kinnitatud' : 'Tagasi lükatud'}
                    </span>
                  </div>
                  {viewBooking.status === 'tagasilukatud' && viewBooking.rejectionReason && (
                    <div className="mt-2 text-sm text-gray-650 bg-white border border-red-100 p-2.5 rounded-lg">
                      <span className="font-bold text-red-700 block text-xs uppercase tracking-wider mb-1">Tagasilükkamise põhjus:</span>
                      "{viewBooking.rejectionReason}"
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                    Sündmuse info
                  </h3>
                  <ul className="space-y-1.5 text-sm font-medium text-gray-700">
                    <li><span className="text-gray-400 font-semibold text-xs block">Kuupäev:</span> {formatDateEstonian(viewBooking.date)}</li>
                    <li><span className="text-gray-400 font-semibold text-xs block">Kellaaeg:</span> {viewBooking.time}</li>
                    <li><span className="text-gray-400 font-semibold text-xs block">Kestus:</span> {viewBooking.duration || '1.5 tundi'}</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-blue-600" />
                    Kooli info
                  </h3>
                  <ul className="space-y-1.5 text-sm font-medium text-gray-700">
                    <li><span className="text-gray-400 font-semibold text-xs block">Kool:</span> {viewBooking.schoolName}</li>
                    <li><span className="text-gray-400 font-semibold text-xs block">Linn:</span> {viewBooking.cityName}</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    Grupi info
                  </h3>
                  <ul className="space-y-1.5 text-sm font-medium text-gray-700">
                    <li><span className="text-gray-400 font-semibold text-xs block">Osalejate arv:</span> {viewBooking.studentsCount} õpilast</li>
                    <li><span className="text-gray-400 font-semibold text-xs block">Klass:</span> {viewBooking.className || '8A'}</li>
                  </ul>
                </div>
              </div>

            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3.5">
              <button 
                onClick={() => setViewBooking(null)}
                className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all cursor-pointer shadow-xs active:scale-98"
              >
                Sule aken
              </button>

              {viewBooking.status === 'ootel' && (
                <>
                  <button 
                    onClick={() => {
                      handleConfirmBooking(viewBooking.id);
                      setViewBooking(null);
                    }}
                    className="bg-green-600 text-white hover:bg-green-700 px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                  >
                    Kinnita broneering
                  </button>
                  <button 
                    onClick={() => {
                      handleOpenRejectionPopup(viewBooking);
                      setViewBooking(null);
                    }}
                    className="bg-red-500 text-white hover:bg-red-600 px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                  >
                    Lükka tagasi
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL 2: "Lükka tagasi" confirmation & reason popup */}
      {rejectionsBooking && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setRejectionsBooking(null)}
          ></div>

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 transform transition-all duration-300 animate-scale-up">
            
            <div className="p-6 border-b border-gray-100 bg-red-50 flex items-center gap-3">
              <div className="p-2 bg-red-100 text-red-700 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-red-950">Lükka broneering tagasi</h2>
                <p className="text-xs text-red-700 font-semibold mt-0.5">Programmile: {rejectionsBooking.programTitle}</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                Kas oled kindel, et soovid selle broneeringu tagasi lükata? See tegevus teavitab õpetajat.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                  Tagasilükkamise põhjus (Kohustuslik) *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="nt. Antud kuupäeval on muuseumis teine suursündmus ning saal on hõivatud. Palun valige teine kuupäev."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-semibold text-gray-700 shadow-xs"
                ></textarea>
                <span className="text-[10px] text-gray-400 font-semibold block text-right">
                  {rejectionReason.trim().length} / 5+ tähemärki
                </span>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3.5">
              <button 
                onClick={() => setRejectionsBooking(null)}
                className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all cursor-pointer shadow-xs active:scale-98"
              >
                Tühista
              </button>
              
              <button 
                onClick={handleSaveRejection}
                disabled={rejectionReason.trim().length < 5}
                className={`px-6 py-2 rounded-xl text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-98 flex items-center gap-1 ${
                  rejectionReason.trim().length < 5 
                    ? 'bg-red-300 text-white cursor-not-allowed' 
                    : 'bg-red-600 text-white hover:bg-red-750'
                }`}
              >
                <X className="w-4 h-4" />
                Kinnita tagasilükkamine
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

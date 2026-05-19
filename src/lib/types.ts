export interface Program {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  organizer: string;
  location: string;
  languages: string[];
  targetGroups: string[]; // e.g. "1. - 3. klass"
  participantCount: string; // e.g. "10 - 30 õpilast"
  duration: string; // e.g. "90 min"
  price: string; // e.g. "10€ / Õpilane"
  categories: string[]; // e.g. "Kirjandus", "Muuseumid ja kultuuripärand"
  curriculumConnections: string[];
  accessibility: {
    wheelchair: boolean;
    hev: boolean;
    signLanguage: boolean;
    audioDescription: boolean;
  };
  materials: {
    name: string;
    url: string;
  }[];
  image: string;
  contactEmail?: string;
  contactPhone?: string;
  reviews?: Review[];
  minGroupSize?: number;
  maxGroupSize?: number;
  county?: string;
  address?: string;
  outdoor?: boolean;
  additionalInfo?: string;
  bookingMethod?: 'platform' | 'contact';
  availableTimes?: string[];
}

export interface Review {
  id: string;
  authorName: string;
  authorSchool: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Booking {
  id: string;
  programId: string;
  date: string;
  time: string;
  studentsCount: number;
  status: 'ootel' | 'kinnitatud' | 'tühistatud';
  totalPrice?: number;
}

export interface FilterOptions {
  grades: string[];
  subjects: string[];
  regions: string[];
  accessibility: string[];
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  sender: string;
  date: string;
  time?: string;
  bookingDate?: string;
  broneerija?: string;
  studentsCount?: number;
  location?: string;
  isRead: boolean;
  type: 'cancel' | 'feedback' | 'booking' | 'system';
}


// Fix: Added full type definitions.
export type UserType = 'donor' | 'requester' | 'establishment';

export interface BaseUser {
  id: string;
  username: string;
  email: string;
  password?: string;
  userType: UserType;
  phone: string;
  wilaya: string;
  commune: string;
  profilePictureUrl?: string;
}

export interface Donor extends BaseUser {
  userType: 'donor';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  bloodGroup: string;
  donationHistory: Donation[];
  points: number;
  badges: Badge[];
}

export interface Establishment extends BaseUser {
  userType: 'establishment';
  name: string;
  type: 'Hôpital' | 'Clinique' | 'Banque_de_Sang';
  address: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
}

export interface Requester extends BaseUser {
  userType: 'requester';
  firstName: string;
  lastName: string;
}

export type CurrentUser = Donor | Establishment | Requester | null;

export interface Donation {
  id: string;
  establishmentName: string;
  date: string; // ISO string
  quantity: number; // in units (e.g., bags)
  reason?: string;
}

export interface Request {
  id: string;
  authorId: string; // can be from requester or establishment
  authorName: string;
  bloodGroup: string;
  quantity: number;
  urgency: 'Normal' | 'Urgent';
  wilaya: string;
  commune: string;
  notes: string;
  status: 'Open' | 'Closed' | 'Fulfilled';
  createdAt: string; // ISO string
  establishmentName: string;
  contactName: string;
  contactPhone: string;
  latitude?: number;
  longitude?: number;
  responses?: string[]; // Array of donor IDs who responded
  approvedDonors?: string[]; // Array of donor IDs approved by the request author
}

export interface Badge {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
}

// For signup forms
export type NewDonorData = Omit<Donor, 'id' | 'userType' | 'donationHistory' | 'points' | 'badges'>;
export type NewEstablishmentData = Omit<Establishment, 'id' | 'userType' | 'latitude' | 'longitude' | 'googleMapsUrl'>;
export type NewRequesterData = Omit<Requester, 'id' | 'userType'>;

export type NewUserData = NewDonorData | NewEstablishmentData | NewRequesterData;


// For Gemini Service
export interface ChatMessage {
  role: 'user' | 'model';
  parts: [{ text: string }];
}
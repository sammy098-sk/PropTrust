
export type UserRole = 'landlord' | 'tenant' | 'agent' | 'admin' | 'business' | 'investor';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  verificationLevel?: 'none' | 'basic' | 'advanced';
  rating?: number; // 0-5 stars
  reviewsCount?: number;
  status?: 'active' | 'pending' | 'suspended';
  address?: string;
  employment?: {
    employer: string;
    jobTitle: string;
    duration: string;
    incomeRange: string;
    contractType: string;
  };
  financialProfile?: {
    monthlyIncome: number;
    monthlyExpenses: number;
    currentSavings: number;
    currency: string;
  };
}

export interface NavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  currentUser?: User | null;
  onLogout?: () => void;
  userRole?: string;
  onSearch?: (query: string) => void;
}

export interface NeighborhoodSignals {
  electricityReliability: 'Poor' | 'Fair' | 'Good' | 'Excellent (20h+)';
  waterAvailability: 'Borehole' | 'Corporation' | 'Tanker';
  securityLevel: 'Gated' | 'Street Security' | 'None';
  floodRisk: 'Low' | 'Medium' | 'High';
  noiseLevel: 'Quiet' | 'Moderate' | 'Busy';
}

export interface VerificationDocs {
  idVerified: boolean; // NIN or Passport
  ownershipVerified: boolean; // Deed or C of O
  videoVerified: boolean; // 360 or Walkthrough
  agentLicenseVerified: boolean; // CAC or LASRETRAD
  adminVerified: boolean; // The "Blue Tick" - Platform Verified
}

export interface PropertyFees {
  agencyFeePercentage: number;
  legalFeePercentage: number;
  cautionFee: number;
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  type: 'Flat' | 'Duplex' | 'Self-Con' | 'Bungalow' | 'Land';
  status: 'For Rent' | 'For Sale';
  price: number; // Base yearly rent
  period?: 'Yearly' | 'Monthly'; // For rent
  fees?: PropertyFees;
  totalInitialPayment?: number; // Calculated total for 1st year
  location: {
    address: string;
    city: string; // e.g., Lagos
    area: string; // e.g., Lekki Phase 1
    state: string;
    lat?: number;
    lng?: number;
  };
  description: string;
  features: string[];
  media: {
    coverImage: string;
    images: string[];
    videoUrl?: string; // Essential for trust
    is360?: boolean;
  };
  verification: VerificationDocs;
  neighborhood: NeighborhoodSignals;
  trustScore: number; // 0-100 calculated score
  postedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isRedacted?: boolean; // For safety/anti-scam
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  ownerName: string;
  category: string;
  shortDescription: string;
  fundingGoal: number;
  equityOffered: number;
  location: string;
  fullPitch: string;
  imageUrl: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
}

export interface InvestmentAnalysis {
  riskLevel: 'Low' | 'Medium' | 'High';
  score: number;
  strengths: string[];
  concerns: string[];
  verdict: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

export enum ViewState {
  AUTH = 'AUTH',
  FEED = 'FEED',
  MAP_VIEW = 'MAP_VIEW',
  CREATE_LISTING = 'CREATE_LISTING',
  MESSAGES = 'MESSAGES',
  PROFILE = 'PROFILE',
  PROPERTY_DETAIL = 'PROPERTY_DETAIL',
  LANDING = 'LANDING',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  LANDLORD_DASHBOARD = 'LANDLORD_DASHBOARD',
  TENANT_DASHBOARD = 'TENANT_DASHBOARD',
  INVESTOR_DASHBOARD = 'INVESTOR_DASHBOARD',
  BUSINESS_DASHBOARD = 'BUSINESS_DASHBOARD',
  BUSINESS_FORM = 'BUSINESS_FORM',
  CHAT = 'CHAT',
  LOCATION_SELECTION = 'LOCATION_SELECTION'
}
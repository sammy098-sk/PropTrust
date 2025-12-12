import React, { useState } from 'react';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import PropertyFeed from './components/PropertyFeed';
import ListingWizard from './components/ListingWizard';
import PropertyDetail from './components/PropertyDetail';
import MapView from './components/MapView';
import Auth from './components/Auth';
import ChatSystem from './components/ChatSystem';
import AdminDashboard from './components/AdminDashboard';
import LandlordDashboard from './components/LandlordDashboard';
import TenantDashboard from './components/TenantDashboard';
import TenantProfile from './components/TenantProfile';
import DashboardSwitcher from './components/DashboardSwitcher';
import LocationSelector from './components/LocationSelector';
import InvestorDashboard from './components/InvestorDashboard';
import BusinessDashboard from './components/BusinessDashboard';
import AddBusinessForm from './components/AddBusinessForm';
import BusinessDetail from './components/BusinessDetail';
import AiAssistant from './components/AiAssistant';
import { Property, ViewState, User, Business } from './types';

// --- MOCK REAL ESTATE PROPERTIES ---
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    ownerId: '101',
    title: 'Modern 2 Bed Flat in Lekki Phase 1',
    type: 'Flat',
    status: 'For Rent',
    price: 3500000,
    period: 'Yearly',
    fees: { agencyFeePercentage: 10, legalFeePercentage: 10, cautionFee: 200000 },
    totalInitialPayment: 4400000,
    location: { address: 'Admiralty Way', area: 'Lekki Phase 1', city: 'Lagos', state: 'Lagos', lat: 6.4474, lng: 3.4711 },
    description: 'Newly built luxury flat with fitted kitchen. 24hrs light and uniform security. Service charge is 500k/year.',
    features: ['24h Light', 'Serviced', 'Fitted Kitchen'],
    media: {
      coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=800&q=80'
      ],
      videoUrl: 'yes',
    },
    verification: { idVerified: true, ownershipVerified: true, videoVerified: true, agentLicenseVerified: true, adminVerified: true },
    neighborhood: { electricityReliability: 'Excellent (20h+)', waterAvailability: 'Corporation', securityLevel: 'Gated', floodRisk: 'Low', noiseLevel: 'Moderate' },
    trustScore: 95,
    postedAt: new Date()
  },
  {
    id: '2',
    ownerId: '102',
    title: 'Cheap Self-Con in Yaba (Student Area)',
    type: 'Self-Con',
    status: 'For Rent',
    price: 600000,
    period: 'Yearly',
    fees: { agencyFeePercentage: 0, legalFeePercentage: 5, cautionFee: 50000 },
    totalInitialPayment: 680000,
    location: { address: 'Akoka Road', area: 'Yaba', city: 'Lagos', state: 'Lagos', lat: 6.5095, lng: 3.3711 },
    description: 'Decent room close to Unilag. Water runs well. Direct landlord, no agent fee.',
    features: ['Close to Campus', 'Water'],
    media: {
      coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'
      ],
    },
    verification: { idVerified: true, ownershipVerified: false, videoVerified: false, agentLicenseVerified: false, adminVerified: false },
    neighborhood: { electricityReliability: 'Fair', waterAvailability: 'Borehole', securityLevel: 'Street Security', floodRisk: 'Medium', noiseLevel: 'Busy' },
    trustScore: 60,
    postedAt: new Date()
  },
  {
    id: '3',
    ownerId: '103',
    title: 'Luxury 4 Bed Duplex in Ikoyi',
    type: 'Duplex',
    status: 'For Sale',
    price: 450000000,
    totalInitialPayment: 450000000,
    location: { address: 'Banana Island Rd', area: 'Ikoyi', city: 'Lagos', state: 'Lagos', lat: 6.4549, lng: 3.4246 },
    description: 'Exquisite waterfront property with private jetty, swimming pool, and cinema.',
    features: ['Waterfront', 'Pool', 'Cinema'],
    media: {
      coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      images: [
         'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
      ],
      videoUrl: 'yes',
    },
    verification: { idVerified: true, ownershipVerified: true, videoVerified: true, agentLicenseVerified: true, adminVerified: true },
    neighborhood: { electricityReliability: 'Excellent (20h+)', waterAvailability: 'Corporation', securityLevel: 'Gated', floodRisk: 'Low', noiseLevel: 'Quiet' },
    trustScore: 98,
    postedAt: new Date()
  },
  {
    id: '4',
    ownerId: '104',
    title: 'Compact Room in Orile',
    type: 'Self-Con',
    status: 'For Rent',
    price: 100000,
    period: 'Yearly',
    fees: { agencyFeePercentage: 10, legalFeePercentage: 10, cautionFee: 20000 },
    totalInitialPayment: 140000,
    location: { address: 'Badagry Exp Way', area: 'Orile', city: 'Lagos', state: 'Lagos', lat: 6.4698, lng: 3.3220 },
    description: 'Very affordable single room. Shared toilet but private entrance. Good for starters.',
    features: ['Cheap', 'Accessible'],
    media: { 
        coverImage: 'https://images.unsplash.com/photo-1595429035839-c99c298ffdde?auto=format&fit=crop&w=800&q=80', 
        images: ['https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?auto=format&fit=crop&w=800&q=80'] 
    },
    verification: { idVerified: true, ownershipVerified: false, videoVerified: false, agentLicenseVerified: false, adminVerified: false },
    neighborhood: { electricityReliability: 'Poor', waterAvailability: 'Borehole', securityLevel: 'Street Security', floodRisk: 'Medium', noiseLevel: 'Busy' },
    trustScore: 50,
    postedAt: new Date()
  },
  {
    id: '5',
    ownerId: '105',
    title: 'Decent Self-Con in Ikorodu',
    type: 'Self-Con',
    status: 'For Rent',
    price: 150000,
    period: 'Yearly',
    fees: { agencyFeePercentage: 10, legalFeePercentage: 10, cautionFee: 30000 },
    totalInitialPayment: 210000,
    location: { address: 'Agric Bus Stop', area: 'Ikorodu', city: 'Lagos', state: 'Lagos', lat: 6.6169, lng: 3.5081 },
    description: 'Spacious room with wardrobe and kitchen cabinet. Fenced compound.',
    features: ['Wardrobe', 'Tiled'],
    media: { 
        coverImage: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2e?auto=format&fit=crop&w=800&q=80', 
        images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'] 
    },
    verification: { idVerified: true, ownershipVerified: true, videoVerified: false, agentLicenseVerified: false, adminVerified: false },
    neighborhood: { electricityReliability: 'Fair', waterAvailability: 'Borehole', securityLevel: 'Gated', floodRisk: 'Low', noiseLevel: 'Moderate' },
    trustScore: 70,
    postedAt: new Date()
  },
  {
    id: '6',
    ownerId: '106',
    title: 'Room & Parlour (Mini Flat)',
    type: 'Flat',
    status: 'For Rent',
    price: 200000,
    period: 'Yearly',
    fees: { agencyFeePercentage: 10, legalFeePercentage: 10, cautionFee: 40000 },
    totalInitialPayment: 280000,
    location: { address: 'Oju Ore', area: 'Sango Ota', city: 'Ogun', state: 'Ogun', lat: 6.7091, lng: 3.2345 },
    description: 'Clean mini flat, painted and tiled. Easy access to Lagos via Toll Gate.',
    features: ['Painted', 'Tiled'],
    media: { 
        coverImage: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80', 
        images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'] 
    },
    verification: { idVerified: true, ownershipVerified: false, videoVerified: false, agentLicenseVerified: false, adminVerified: false },
    neighborhood: { electricityReliability: 'Fair', waterAvailability: 'Borehole', securityLevel: 'None', floodRisk: 'Low', noiseLevel: 'Moderate' },
    trustScore: 65,
    postedAt: new Date()
  },
  {
    id: '7',
    ownerId: '107',
    title: 'Standard Shop Space',
    type: 'Bungalow',
    status: 'For Rent',
    price: 250000,
    period: 'Yearly',
    fees: { agencyFeePercentage: 10, legalFeePercentage: 5, cautionFee: 20000 },
    totalInitialPayment: 307500,
    location: { address: 'Egbeda Junction', area: 'Alimosho', city: 'Lagos', state: 'Lagos', lat: 6.5882, lng: 3.2878 },
    description: 'Lock-up shop perfect for retail or POS business. Busy road.',
    features: ['Busy Road', 'Security'],
    media: { 
        coverImage: 'https://images.unsplash.com/photo-1572911299943-4b68d601d5d1?auto=format&fit=crop&w=800&q=80', 
        images: ['https://images.unsplash.com/photo-1582281298055-e25b84a30b15?auto=format&fit=crop&w=800&q=80'] 
    },
    verification: { idVerified: true, ownershipVerified: true, videoVerified: false, agentLicenseVerified: true, adminVerified: true },
    neighborhood: { electricityReliability: 'Good', waterAvailability: 'Corporation', securityLevel: 'Street Security', floodRisk: 'Low', noiseLevel: 'Busy' },
    trustScore: 80,
    postedAt: new Date()
  },
  {
    id: '8',
    ownerId: '108',
    title: '2 Bedroom Flat in Mowe',
    type: 'Flat',
    status: 'For Rent',
    price: 350000,
    period: 'Yearly',
    fees: { agencyFeePercentage: 10, legalFeePercentage: 10, cautionFee: 50000 },
    totalInitialPayment: 470000,
    location: { address: 'Ofada Road', area: 'Mowe', city: 'Ogun', state: 'Ogun', lat: 6.8080, lng: 3.4429 },
    description: 'New house, all ensuite. Large compound. 30mins drive to Berger.',
    features: ['Ensuite', 'Large Compound'],
    media: { 
        coverImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80', 
        images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'] 
    },
    verification: { idVerified: true, ownershipVerified: true, videoVerified: true, agentLicenseVerified: false, adminVerified: false },
    neighborhood: { electricityReliability: 'Good', waterAvailability: 'Borehole', securityLevel: 'Gated', floodRisk: 'Low', noiseLevel: 'Quiet' },
    trustScore: 85,
    postedAt: new Date()
  },
  {
    id: '9',
    ownerId: '109',
    title: 'Upstairs Self-Con in Yaba',
    type: 'Self-Con',
    status: 'For Rent',
    price: 400000,
    period: 'Yearly',
    fees: { agencyFeePercentage: 10, legalFeePercentage: 10, cautionFee: 50000 },
    totalInitialPayment: 530000,
    location: { address: 'Sabo', area: 'Yaba', city: 'Lagos', state: 'Lagos', lat: 6.5130, lng: 3.3762 },
    description: 'Perfect for tech workers. Close to CcHub. Tiled, running water.',
    features: ['Central', 'Water'],
    media: { 
        coverImage: 'https://images.unsplash.com/photo-1633505299968-3d6f46a2a5f5?auto=format&fit=crop&w=800&q=80', 
        images: ['https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=800&q=80'] 
    },
    verification: { idVerified: true, ownershipVerified: true, videoVerified: false, agentLicenseVerified: true, adminVerified: true },
    neighborhood: { electricityReliability: 'Good', waterAvailability: 'Corporation', securityLevel: 'Street Security', floodRisk: 'Low', noiseLevel: 'Busy' },
    trustScore: 88,
    postedAt: new Date()
  },
  {
    id: '10',
    ownerId: '110',
    title: 'Renovated Mini Flat',
    type: 'Flat',
    status: 'For Rent',
    price: 500000,
    period: 'Yearly',
    fees: { agencyFeePercentage: 10, legalFeePercentage: 10, cautionFee: 50000 },
    totalInitialPayment: 650000,
    location: { address: 'Bode Thomas', area: 'Surulere', city: 'Lagos', state: 'Lagos', lat: 6.4950, lng: 3.3556 },
    description: 'A clean mini flat in a central location. Just renovated.',
    features: ['Renovated', 'Accessible'],
    media: { 
        coverImage: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80', 
        images: ['https://images.unsplash.com/photo-1512918580421-b2feee3b85a6?auto=format&fit=crop&w=800&q=80'] 
    },
    verification: { idVerified: true, ownershipVerified: true, videoVerified: true, agentLicenseVerified: true, adminVerified: true },
    neighborhood: { electricityReliability: 'Good', waterAvailability: 'Corporation', securityLevel: 'Gated', floodRisk: 'Low', noiseLevel: 'Moderate' },
    trustScore: 92,
    postedAt: new Date()
  },
  {
    id: '11',
    ownerId: '111',
    title: '3 Bedroom Flat in Egbeda',
    type: 'Flat',
    status: 'For Rent',
    price: 800000,
    period: 'Yearly',
    fees: { agencyFeePercentage: 10, legalFeePercentage: 10, cautionFee: 100000 },
    totalInitialPayment: 1060000,
    location: { address: 'Gowon Estate', area: 'Egbeda', city: 'Lagos', state: 'Lagos', lat: 6.6053, lng: 3.2844 },
    description: 'Family apartment in a secure estate. 3 Toilets, 2 Baths.',
    features: ['Estate', 'Family'],
    media: { 
        coverImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80', 
        images: ['https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80'] 
    },
    verification: { idVerified: true, ownershipVerified: true, videoVerified: true, agentLicenseVerified: true, adminVerified: true },
    neighborhood: { electricityReliability: 'Good', waterAvailability: 'Borehole', securityLevel: 'Gated', floodRisk: 'Low', noiseLevel: 'Quiet' },
    trustScore: 90,
    postedAt: new Date()
  },
  {
    id: '12',
    ownerId: '112',
    title: 'Executive 2 Bed in Ikeja',
    type: 'Flat',
    status: 'For Rent',
    price: 1200000,
    period: 'Yearly',
    fees: { agencyFeePercentage: 10, legalFeePercentage: 5, cautionFee: 100000 },
    totalInitialPayment: 1480000,
    location: { address: 'Allen Avenue', area: 'Ikeja', city: 'Lagos', state: 'Lagos', lat: 6.6018, lng: 3.3515 },
    description: 'Premium finish. Close to Alausa. POP ceiling, screeded walls.',
    features: ['POP', 'Premium'],
    media: { 
        coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', 
        images: ['https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80'] 
    },
    verification: { idVerified: true, ownershipVerified: true, videoVerified: true, agentLicenseVerified: true, adminVerified: true },
    neighborhood: { electricityReliability: 'Excellent (20h+)', waterAvailability: 'Corporation', securityLevel: 'Gated', floodRisk: 'Low', noiseLevel: 'Moderate' },
    trustScore: 94,
    postedAt: new Date()
  },
  {
    id: '13',
    ownerId: '113',
    title: 'Standard Room in Ibadan',
    type: 'Self-Con',
    status: 'For Rent',
    price: 150000,
    period: 'Yearly',
    fees: { agencyFeePercentage: 10, legalFeePercentage: 10, cautionFee: 20000 },
    totalInitialPayment: 200000,
    location: { address: 'Agbowo', area: 'Ibadan', city: 'Oyo', state: 'Oyo', lat: 7.4426, lng: 3.9076 },
    description: 'Walkable distance to UI gate. Student friendly environment.',
    features: ['Student', 'Cheap'],
    media: { 
        coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', 
        images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80'] 
    },
    verification: { idVerified: true, ownershipVerified: false, videoVerified: false, agentLicenseVerified: false, adminVerified: false },
    neighborhood: { electricityReliability: 'Fair', waterAvailability: 'Borehole', securityLevel: 'None', floodRisk: 'Low', noiseLevel: 'Quiet' },
    trustScore: 75,
    postedAt: new Date()
  }
];

// --- MOCK BUSINESSES FOR INVESTMENT ---
const MOCK_BUSINESSES: Business[] = [
  {
    id: 'b1',
    ownerId: 'u2',
    name: 'FarmCrowdy 2.0',
    ownerName: 'Emeka Nwadike',
    category: 'Green Energy',
    shortDescription: 'Solar-powered irrigation systems for rural farmers.',
    fundingGoal: 25000,
    equityOffered: 15,
    location: 'Kaduna',
    fullPitch: 'We provide affordable, solar-powered irrigation to increase crop yield by 40%.',
    imageUrl: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=800&q=80',
    tags: ['AgriTech', 'Solar', 'Impact'],
    status: 'approved'
  },
  {
    id: 'b2',
    ownerId: 'u3',
    name: 'SwiftLogistics',
    ownerName: 'Tunde Bakare',
    category: 'Service',
    shortDescription: 'Last-mile delivery using electric bikes in Lagos.',
    fundingGoal: 10000,
    equityOffered: 10,
    location: 'Lagos',
    fullPitch: 'Solving the traffic problem in Lagos with fleet of e-bikes for rapid delivery.',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    tags: ['Logistics', 'EV', 'Urban'],
    status: 'approved'
  },
  {
    id: 'b3',
    ownerId: 'u4',
    name: 'Mama\'s Kitchen Chain',
    ownerName: 'Funke Akindele',
    category: 'Food & Beverage',
    shortDescription: 'Scaling authentic Nigerian fast food to 10 locations.',
    fundingGoal: 40000,
    equityOffered: 20,
    location: 'Ibadan',
    fullPitch: 'We have a proven model with 2 profitable locations. Seeking funds to expand.',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    tags: ['Food', 'Retail', 'Expansion'],
    status: 'approved'
  },
  {
    id: 'b4',
    ownerId: 'u5',
    name: 'TechTutor',
    ownerName: 'Chioma Ajunwa',
    category: 'Technology',
    shortDescription: 'EdTech platform for coding skills in local languages.',
    fundingGoal: 15000,
    equityOffered: 12,
    location: 'Remote',
    fullPitch: 'Bridging the digital divide by teaching Python and JS in Pidgin and Yoruba.',
    imageUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80',
    tags: ['EdTech', 'Social Impact', 'Education'],
    status: 'approved'
  },
  {
    id: 'b5',
    ownerId: 'u6',
    name: 'Urban Wears',
    ownerName: 'Seun Kuti',
    category: 'Retail',
    shortDescription: 'Contemporary African fashion with global shipping.',
    fundingGoal: 20000,
    equityOffered: 15,
    location: 'Lagos',
    fullPitch: 'Exporting Nigerian culture through high-quality streetwear.',
    imageUrl: 'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?auto=format&fit=crop&w=800&q=80',
    tags: ['Fashion', 'E-commerce', 'Export'],
    status: 'approved'
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.FEED);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Real Estate State
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [bookedInspections, setBookedInspections] = useState<string[]>([]);

  // Business State
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') setCurrentView(ViewState.ADMIN_DASHBOARD);
    else if (user.role === 'landlord') setCurrentView(ViewState.LANDLORD_DASHBOARD);
    else if (user.role === 'investor') setCurrentView(ViewState.INVESTOR_DASHBOARD);
    else if (user.role === 'business') setCurrentView(ViewState.BUSINESS_DASHBOARD);
    else setCurrentView(ViewState.FEED);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(ViewState.AUTH);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleCreateListing = (newProp: Property) => {
    setProperties([newProp, ...properties]);
    setCurrentView(ViewState.LANDLORD_DASHBOARD);
  };

  const handleUpdateBusiness = (newBusiness: Business) => {
    const exists = businesses.find(b => b.id === newBusiness.id);
    if (exists) {
        setBusinesses(businesses.map(b => b.id === newBusiness.id ? newBusiness : b));
    } else {
        setBusinesses([newBusiness, ...businesses]);
    }
  };

  const handleBookInspection = (propertyId: string) => {
      if (!currentUser) {
          setCurrentView(ViewState.AUTH);
          return;
      }
      setBookedInspections(prev => [...prev, propertyId]);
  };

  const navigateToProfile = () => {
    if (!currentUser) {
      setCurrentView(ViewState.AUTH);
      return;
    }
    if (currentUser.role === 'admin') setCurrentView(ViewState.ADMIN_DASHBOARD);
    else if (currentUser.role === 'landlord') setCurrentView(ViewState.LANDLORD_DASHBOARD);
    else if (currentUser.role === 'investor') setCurrentView(ViewState.INVESTOR_DASHBOARD);
    else if (currentUser.role === 'business') setCurrentView(ViewState.BUSINESS_DASHBOARD);
    else setCurrentView(ViewState.PROFILE);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.AUTH:
        return <Auth onLogin={handleLogin} onNavigate={setCurrentView} />;
      
      case ViewState.CREATE_LISTING:
        return currentUser ? (
           <ListingWizard onSubmit={handleCreateListing} onCancel={() => setCurrentView(ViewState.LANDLORD_DASHBOARD)} />
        ) : <Auth onLogin={handleLogin} onNavigate={setCurrentView} />;

      case ViewState.MESSAGES:
        return currentUser ? (
          <div className="pb-16"><ChatSystem currentUser={currentUser} /></div>
        ) : <Auth onLogin={handleLogin} onNavigate={setCurrentView} />;
      
      case ViewState.MAP_VIEW:
        return (
            <MapView 
                properties={properties} 
                onSelect={setSelectedProperty} 
                bookedInspections={bookedInspections}
                onBookInspection={handleBookInspection}
            />
        );
      
      case ViewState.LOCATION_SELECTION:
        return (
          <LocationSelector 
             onSelect={(loc) => {
                setSearchQuery(loc);
                setCurrentView(ViewState.FEED);
             }}
             onClose={() => setCurrentView(ViewState.FEED)}
          />
        );

      case ViewState.ADMIN_DASHBOARD:
        return <AdminDashboard />;

      case ViewState.LANDLORD_DASHBOARD:
        return currentUser ? (
          <LandlordDashboard 
             currentUser={currentUser} 
             properties={properties} 
             onNavigate={setCurrentView} 
             onEditProperty={(p) => console.log('Edit', p)}
             onUpdateUser={handleUpdateUser}
          />
        ) : <Auth onLogin={handleLogin} onNavigate={setCurrentView} />;

      case ViewState.TENANT_DASHBOARD:
        return currentUser ? (
           <TenantDashboard currentUser={currentUser} onNavigate={setCurrentView} />
        ) : <Auth onLogin={handleLogin} onNavigate={setCurrentView} />;
      
      case ViewState.INVESTOR_DASHBOARD:
        return (
            <InvestorDashboard 
                businesses={businesses} 
                onViewDetails={setSelectedBusiness} 
            />
        );

      case ViewState.BUSINESS_DASHBOARD:
        return currentUser ? (
            <BusinessDashboard 
                userBusiness={businesses.find(b => b.ownerId === currentUser.id)}
                onUpdateBusiness={handleUpdateBusiness}
            />
        ) : <Auth onLogin={handleLogin} onNavigate={setCurrentView} />;

      case ViewState.BUSINESS_FORM:
         return (
             <AddBusinessForm 
                onAddBusiness={(b) => { handleUpdateBusiness(b); setCurrentView(ViewState.BUSINESS_DASHBOARD); }}
                onCancel={() => setCurrentView(ViewState.FEED)}
             />
         );

      case ViewState.PROFILE:
         return currentUser ? (
            <TenantProfile 
                user={currentUser} 
                onNavigate={setCurrentView} 
                onUpdate={handleUpdateUser}
            />
         ) : <Auth onLogin={handleLogin} onNavigate={setCurrentView} />;

      case ViewState.FEED:
      default:
        return <PropertyFeed properties={properties} onSelect={setSelectedProperty} searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      <main className="max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden relative">
        <Navbar 
           currentView={currentView} 
           onNavigate={(view) => {
               if (view === ViewState.PROFILE) navigateToProfile();
               else setCurrentView(view);
           }}
           currentUser={currentUser}
           onLogout={handleLogout}
           onSearch={setSearchQuery}
        />
        
        {renderContent()}
        
        {/* Global AI Assistant - Always Available */}
        <AiAssistant />
        
        {/* Helper for switching views during demo */}
        <DashboardSwitcher onSwitch={(view, user) => {
          setCurrentUser(user);
          setCurrentView(view);
        }} />

        <MobileNav 
          currentView={currentView} 
          onNavigate={(view) => {
             if (view === ViewState.PROFILE) navigateToProfile();
             else setCurrentView(view);
          }} 
          userRole={currentUser?.role} 
        />
        
        {selectedProperty && (
          <PropertyDetail 
            property={selectedProperty} 
            onClose={() => setSelectedProperty(null)}
            isBooked={bookedInspections.includes(selectedProperty.id)}
            onBookInspection={handleBookInspection}
          />
        )}

        {selectedBusiness && (
            <BusinessDetail 
                business={selectedBusiness}
                onClose={() => setSelectedBusiness(null)}
            />
        )}
      </main>
    </div>
  );
};

export default App;
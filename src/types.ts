export type PropertyType =
  | 'House'
  | 'Apartment'
  | 'Villa'
  | 'Condo'
  | 'Townhouse'
  | 'Commercial'
  | 'Office'
  | 'Land';

export type PropertyStatus = 'For Sale' | 'For Rent' | 'Sold' | 'New Construction';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  neighborhood: string;
  lat: number;
  lng: number;
  type: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  area: number; // sqft
  lotSize: number;
  yearBuilt: number;
  parking: number;
  hoa: number;
  taxes: number;
  amenities: string[];
  images: string[];
  agentId: string;
  featured?: boolean;
  luxury?: boolean;
  views: number;
  saves: number;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  agency: string;
  avatar: string;
  phone: string;
  email: string;
  bio: string;
  listings: number;
  deals: number;
  rating: number;
  reviews: number;
  years: number;
  city: string;
}

export interface City {
  name: string;
  state: string;
  slug: string;
  population: number;
  medianPrice: number;
  listings: number;
  image: string;
  description: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: string;
  status: 'New' | 'Contacted' | 'Negotiating' | 'Closed';
  source: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Guest' | 'Buyer' | 'Seller' | 'Agent' | 'Admin';
  avatar?: string;
}

export interface MarketPoint {
  month: string;
  price: number;
}

export interface NeighborhoodStat {
  name: string;
  walkScore: number;
  transitScore: number;
  crime: 'Low' | 'Medium' | 'High';
  schools: number;
  medianPrice: number;
  priceGrowth: number;
}

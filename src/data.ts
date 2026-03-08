import type { Property, Agent, City, Lead, NeighborhoodStat, MarketPoint } from './types';

const img = (seed: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const PHOTO_SEEDS = [
  'photo-1568605114967-8130f3a36994',
  'photo-1600585154340-be6161a56a0c',
  'photo-1600596542815-ffad4c1539a9',
  'photo-1600607687939-ce8a6c25118c',
  'photo-1600566753190-17f0baa2a6c3',
  'photo-1600047509807-ba8f99d2cdde',
  'photo-1570129477492-45c003edd2be',
  'photo-1582268611958-ebfd161ef9cf',
  'photo-1598228726150-52b7e2ec3f43',
  'photo-1512917774080-9991f1c4c750',
  'photo-1613490493576-7fde63acd811',
  'photo-1600585154526-990dced4db0d',
  'photo-1580587771525-78b9dba3b914',
  'photo-1605146769289-440113cc3d00',
  'photo-1564013799919-ab600027ffc6',
  'photo-1564078516393-cf04bd966897',
  'photo-1583608205776-bfd35f0d9f83',
  'photo-1600573472592-401b489a3cdc',
  'photo-1600566753376-12c8ab7fb75b',
  'photo-1613977257363-707ba9348227',
  'photo-1600585154363-67eb9e2e2099',
  'photo-1600607687644-aac4c3eac7f4',
  'photo-1600607687166-48ad7cdca554',
  'photo-1586023492125-27b2c045efd7',
  'photo-1600210492486-724fe5c67fb0',
  'photo-1600566753086-00f18fe6ba66',
  'photo-1600585154245-838b3e54f81b',
  'photo-1600607687920-4e2a09cf159d',
  'photo-1600607688969-a5bfcd646154',
  'photo-1600607688694-624021ba10bb',
  'photo-1600607689966-24a9f2d3a377',
  'photo-1600607689926-9f41b32f3b23',
  'photo-1600607689423-1a3cd972b8b6',
  'photo-1600607689295-6d5a6b297a56',
  'photo-1600607689156-3a8ab0fd0f1e',
  'photo-1600607689022-2c1a0c6cf4e7',
  'photo-1600607688865-7e4c6f6c5a8e',
  'photo-1600607688767-9b0c69a35f67',
  'photo-1600607688660-15f0b0876a1e',
  'photo-1600607688557-9d2c087d2596',
  'photo-1600607688457-20f24c88c8a0',
  'photo-1600607688345-865c5adcc397',
  'photo-1600607688248-8f0c1e38ffc7',
  'photo-1600607688142-1a1e8d19b2c0',
  'photo-1600607688043-12d589c7b420',
  'photo-1600607687939-5c03d5d2a86f',
  'photo-1600607687820-ec8e8d0b8962',
];

const pickImages = (i: number, count = 5) => {
  const out: string[] = [];
  for (let j = 0; j < count; j++) out.push(img(PHOTO_SEEDS[(i + j) % PHOTO_SEEDS.length]));
  return out;
};

export const AGENTS: Agent[] = [
  {
    id: 'a1',
    name: 'Sarah Mitchell',
    title: 'Senior Listing Agent',
    agency: 'Havenly Realty',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
    phone: '(415) 555-0134',
    email: 'sarah@havenly.com',
    bio: 'Top 1% agent in the Bay Area with 14+ years of experience in luxury residential real estate.',
    listings: 42,
    deals: 318,
    rating: 4.96,
    reviews: 284,
    years: 14,
    city: 'San Francisco',
  },
  {
    id: 'a2',
    name: 'James Rodriguez',
    title: 'Commercial & Investment Specialist',
    agency: 'Metro Capital Advisors',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    phone: '(212) 555-0198',
    email: 'james@metrocapital.com',
    bio: 'Focused on multi-family and commercial investment properties across NYC and tri-state area.',
    listings: 28,
    deals: 192,
    rating: 4.91,
    reviews: 156,
    years: 11,
    city: 'New York',
  },
  {
    id: 'a3',
    name: 'Emily Chen',
    title: 'Luxury Property Consultant',
    agency: 'Sotheby\'s International',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
    phone: '(310) 555-0245',
    email: 'emily.chen@sothebys.com',
    bio: 'Specializing in architecturally significant homes and estates above $5M.',
    listings: 19,
    deals: 128,
    rating: 5.0,
    reviews: 98,
    years: 9,
    city: 'Los Angeles',
  },
  {
    id: 'a4',
    name: 'Michael Thompson',
    title: 'Residential Expert',
    agency: 'Havenly Realty',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80',
    phone: '(312) 555-0312',
    email: 'michael@havenly.com',
    bio: 'First-time homebuyer specialist. Patient, thorough, and always available.',
    listings: 35,
    deals: 241,
    rating: 4.89,
    reviews: 211,
    years: 8,
    city: 'Chicago',
  },
  {
    id: 'a5',
    name: 'Priya Patel',
    title: 'Downtown Condo Specialist',
    agency: 'Urban Living Group',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80',
    phone: '(206) 555-0455',
    email: 'priya@urbanliving.com',
    bio: 'Downtown high-rise and loft expert. Knows every building inside out.',
    listings: 22,
    deals: 176,
    rating: 4.94,
    reviews: 142,
    years: 10,
    city: 'Seattle',
  },
  {
    id: 'a6',
    name: 'David Kim',
    title: 'Multi-Family Investor',
    agency: 'Keller Williams',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    phone: '(617) 555-0521',
    email: 'david.kim@kw.com',
    bio: 'Investment-focused agent helping clients build cash-flowing portfolios.',
    listings: 16,
    deals: 98,
    rating: 4.87,
    reviews: 74,
    years: 7,
    city: 'Boston',
  },
];

const CITIES: City[] = [
  { name: 'New York', state: 'NY', slug: 'new-york', population: 8336817, medianPrice: 785000, listings: 4821, image: img('photo-1496442226666-8d4d0e62e6e9', 1600, 900), description: 'The city that never sleeps — iconic brownstones, sleek high-rises, and world-class culture.' },
  { name: 'Los Angeles', state: 'CA', slug: 'los-angeles', population: 3979576, medianPrice: 925000, listings: 3942, image: img('photo-1506905925346-21bda4d32df4', 1600, 900), description: 'Sun-soaked living from beachfront Malibu to the Hollywood Hills and vibrant downtown.' },
  { name: 'Chicago', state: 'IL', slug: 'chicago', population: 2693976, medianPrice: 385000, listings: 2814, image: img('photo-1477959858617-67f85cf4f1df', 1600, 900), description: 'Architectural masterpiece city with lakefront living and diverse neighborhood charm.' },
  { name: 'San Francisco', state: 'CA', slug: 'san-francisco', population: 874961, medianPrice: 1450000, listings: 1892, image: img('photo-1501594907352-04cda38ebc29', 1600, 900), description: 'Tech capital, rolling hills, Victorian homes, and one of the world\'s most beautiful bays.' },
  { name: 'Seattle', state: 'WA', slug: 'seattle', population: 749256, medianPrice: 795000, listings: 1684, image: img('photo-1502175353174-a7a44e84da10', 1600, 900), description: 'Emerald City — tech boom, Puget Sound views, and a booming condo market.' },
  { name: 'Boston', state: 'MA', slug: 'boston', population: 692600, medianPrice: 712000, listings: 1428, image: img('photo-1501979376261-14c82b492909', 1600, 900), description: 'Historic brownstones, world-class universities, and a thriving innovation economy.' },
  { name: 'Miami', state: 'FL', slug: 'miami', population: 467963, medianPrice: 585000, listings: 2104, image: img('photo-1535498730771-e735b998cd64', 1600, 900), description: 'Tropical lifestyle, oceanfront condos, and international investment magnet.' },
  { name: 'Austin', state: 'TX', slug: 'austin', population: 964254, medianPrice: 525000, listings: 2318, image: img('photo-1531218150217-54595bc2b934', 1600, 900), description: 'Live music capital, tech boom, and one of the fastest-growing cities in America.' },
  { name: 'Denver', state: 'CO', slug: 'denver', population: 715522, medianPrice: 595000, listings: 1764, image: img('photo-1519501025264-65ba15a82390', 1600, 900), description: 'Mile-high city with outdoor lifestyle, craft beer, and a booming tech scene.' },
  { name: 'San Diego', state: 'CA', slug: 'san-diego', population: 1423851, medianPrice: 825000, listings: 2048, image: img('photo-1538970272646-f61fabb3a8a2', 1600, 900), description: 'Perfect weather year-round, beach communities, and strong biotech sector.' },
  { name: 'Portland', state: 'OR', slug: 'portland', population: 654741, medianPrice: 545000, listings: 1384, image: img('photo-1518544801976-3e159e50e5bb', 1600, 900), description: 'Craft coffee, food trucks, bridges, and the gateway to the Pacific Northwest.' },
  { name: 'Nashville', state: 'TN', slug: 'nashville', population: 691243, medianPrice: 425000, listings: 1524, image: img('photo-1575367499871-1b00d30f3f19', 1600, 900), description: 'Music City USA — booming growth, southern charm, and affordable luxury.' },
];

// Generate a rich dataset of properties
const TYPES: Property['type'][] = ['House', 'Apartment', 'Villa', 'Condo', 'Townhouse', 'Commercial', 'Office', 'Land'];
const STATUSES: Property['status'][] = ['For Sale', 'For Rent', 'For Sale', 'For Sale', 'New Construction'];
const AMENITIES_POOL = ['Pool', 'Gym', 'Garden', 'Elevator', 'Security', 'Furnished', 'Parking', 'Balcony', 'Fireplace', 'Smart Home', 'EV Charging', 'Rooftop', 'Concierge', 'Pet Friendly', 'Ocean View', 'Mountain View'];

const STREETS = ['Maple', 'Oak', 'Pine', 'Elm', 'Cedar', 'Park', 'Main', 'Lake', 'Hill', 'River', 'Sunset', 'Riverside', 'Seaside', 'Mountain', 'Valley', 'Golden Gate', 'Broadway', '5th Avenue', 'Park Place', 'Ocean'];
const SUFFIXES = ['St', 'Ave', 'Blvd', 'Rd', 'Dr', 'Ct', 'Way', 'Ln', 'Pl'];

function randomAmenities(seed: number, count: number) {
  const picks: string[] = [];
  for (let i = 0; i < count; i++) {
    picks.push(AMENITIES_POOL[(seed * (i + 3)) % AMENITIES_POOL.length]);
  }
  return Array.from(new Set(picks));
}

// Coordinates for major cities (approximate)
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'New York': { lat: 40.7128, lng: -74.006 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
  'Chicago': { lat: 41.8781, lng: -87.6298 },
  'San Francisco': { lat: 37.7749, lng: -122.4194 },
  'Seattle': { lat: 47.6062, lng: -122.3321 },
  'Boston': { lat: 42.3601, lng: -71.0589 },
  'Miami': { lat: 25.7617, lng: -80.1918 },
  'Austin': { lat: 30.2672, lng: -97.7431 },
  'Denver': { lat: 39.7392, lng: -104.9903 },
  'San Diego': { lat: 32.7157, lng: -117.1611 },
  'Portland': { lat: 45.5152, lng: -122.6784 },
  'Nashville': { lat: 36.1627, lng: -86.7816 },
};

const NEIGHBORHOODS: Record<string, string[]> = {
  'New York': ['Manhattan', 'Brooklyn Heights', 'Williamsburg', 'SoHo', 'Tribeca', 'Upper West Side', 'Astoria', 'Park Slope'],
  'Los Angeles': ['Beverly Hills', 'Santa Monica', 'Venice', 'Silver Lake', 'Downtown LA', 'West Hollywood', 'Malibu', 'Pasadena'],
  'Chicago': ['Lincoln Park', 'Wicker Park', 'River North', 'Lakeview', 'Logan Square', 'The Loop', 'Pilsen', 'Edgewater'],
  'San Francisco': ['Pacific Heights', 'Mission District', 'SOMA', 'Nob Hill', 'Castro', 'Haight-Ashbury', 'Marina', 'Russian Hill'],
  'Seattle': ['Capitol Hill', 'Ballard', 'Queen Anne', 'Fremont', 'Downtown', 'Belltown', 'Green Lake', 'University District'],
  'Boston': ['Back Bay', 'Beacon Hill', 'South End', 'Cambridge', 'Jamaica Plain', 'Dorchester', 'Charlestown', 'North End'],
  'Miami': ['South Beach', 'Coconut Grove', 'Brickell', 'Coral Gables', 'Wynwood', 'Miami Beach', 'Key Biscayne', 'Little Havana'],
  'Austin': ['Downtown', 'South Congress', 'East Austin', 'Barton Hills', 'Tarrytown', 'Hyde Park', 'Mueller', 'Round Rock'],
  'Denver': ['Capitol Hill', 'RiNo', 'LoDo', 'Cherry Creek', 'Highland', 'Washington Park', 'Capitol Hill', 'Golden Triangle'],
  'San Diego': ['Gaslamp Quarter', 'La Jolla', 'Pacific Beach', 'North Park', 'Hillcrest', 'Mission Beach', 'Coronado', 'Point Loma'],
  'Portland': ['Pearl District', 'Alberta', 'Hawthorne', 'Mississippi Ave', 'Sellwood', 'Beaumont', 'Nob Hill', 'Woodstock'],
  'Nashville': ['Downtown', 'East Nashville', 'Germantown', '12South', 'Belmont', 'Green Hills', 'Hillsboro Village', 'West End'],
};

function generateProperties(): Property[] {
  const properties: Property[] = [];
  let idCounter = 1;

  CITIES.forEach((city, cityIdx) => {
    const neighborhoods = NEIGHBORHOODS[city.name] || ['Downtown'];
    const baseCoords = CITY_COORDS[city.name];
    const count = 18 + (cityIdx % 3) * 4;

    for (let i = 0; i < count; i++) {
      const seed = idCounter + cityIdx * 100 + i;
      const type = TYPES[seed % TYPES.length];
      const status = STATUSES[seed % STATUSES.length];
      const neighborhood = neighborhoods[seed % neighborhoods.length];
      const isLuxury = seed % 11 === 0;
      const isFeatured = seed % 7 === 0;

      // Price based on city median and type
      let basePrice = city.medianPrice;
      if (type === 'Villa') basePrice *= 1.8;
      if (type === 'Condo') basePrice *= 0.75;
      if (type === 'Apartment') basePrice *= 0.6;
      if (type === 'Townhouse') basePrice *= 0.9;
      if (type === 'Commercial') basePrice *= 2.2;
      if (type === 'Office') basePrice *= 1.6;
      if (type === 'Land') basePrice *= 0.3;
      if (isLuxury) basePrice *= 2.5;

      const variance = 0.7 + ((seed * 13) % 60) / 100; // 0.7 - 1.3
      let price = Math.round((basePrice * variance) / 1000) * 1000;

      // For rent properties show monthly rent
      if (status === 'For Rent') {
        price = Math.round((price * 0.008) / 50) * 50;
      }

      const bedrooms = type === 'Land' ? 0 : Math.max(1, (seed % 6) + (isLuxury ? 2 : 0));
      const bathrooms = type === 'Land' ? 0 : Math.max(1, Math.floor(bedrooms * 0.8) + (seed % 2));
      const area = type === 'Land' ? 5000 + (seed % 20) * 1000 : 600 + bedrooms * 350 + (seed % 5) * 100;
      const lotSize = type === 'Land' ? area : area * (2 + (seed % 4));
      const yearBuilt = 1920 + (seed % 105);
      const parking = (seed % 4);
      const hoa = type === 'Condo' || type === 'Apartment' ? 150 + (seed % 8) * 50 : 0;
      const taxes = Math.round(price * 0.012);

      // Spread coordinates around city center
      const lat = baseCoords.lat + ((seed % 100) - 50) * 0.003;
      const lng = baseCoords.lng + ((seed * 7) % 100 - 50) * 0.004;

      const streetNum = 100 + (seed % 9900);
      const street = STREETS[seed % STREETS.length];
      const suffix = SUFFIXES[seed % SUFFIXES.length];
      const address = `${streetNum} ${street} ${suffix}`;

      const title = isLuxury
        ? `Luxury ${type.toLowerCase()} in ${neighborhood}`
        : status === 'New Construction'
        ? `New ${type.toLowerCase()} available in ${neighborhood}`
        : `${bedrooms}bd ${type.toLowerCase()} · ${neighborhood}`;

      const description = `${title}. Beautifully maintained ${type.toLowerCase()} featuring ${bedrooms} bedrooms, ${bathrooms} bathrooms, and ${area.toLocaleString()} sqft of living space. Located in the heart of ${neighborhood}, this property offers the perfect blend of comfort and convenience.`;

      properties.push({
        id: `p${idCounter}`,
        title,
        description,
        price,
        address,
        city: city.name,
        state: city.state,
        zip: `${10000 + (seed * 17) % 89999}`,
        neighborhood,
        lat,
        lng,
        type,
        status,
        bedrooms,
        bathrooms,
        area,
        lotSize,
        yearBuilt,
        parking,
        hoa,
        taxes,
        amenities: randomAmenities(seed, 4 + (seed % 5)),
        images: pickImages(seed, 6),
        agentId: AGENTS[seed % AGENTS.length].id,
        featured: isFeatured,
        luxury: isLuxury,
        views: 100 + (seed * 11) % 5000,
        saves: 5 + (seed * 7) % 400,
        createdAt: new Date(Date.now() - (seed % 120) * 86400000).toISOString(),
      });
      idCounter++;
    }
  });

  return properties;
}

export const PROPERTIES: Property[] = generateProperties();
export const CITIES_DATA: City[] = CITIES;

// Neighborhood stats
export const NEIGHBORHOOD_STATS: NeighborhoodStat[] = [
  { name: 'Downtown', walkScore: 95, transitScore: 92, crime: 'Medium', schools: 8, medianPrice: 725000, priceGrowth: 5.2 },
  { name: 'Midtown', walkScore: 88, transitScore: 85, crime: 'Low', schools: 12, medianPrice: 685000, priceGrowth: 4.8 },
  { name: 'Uptown', walkScore: 82, transitScore: 78, crime: 'Low', schools: 15, medianPrice: 825000, priceGrowth: 6.1 },
  { name: 'Westside', walkScore: 75, transitScore: 70, crime: 'Low', schools: 18, medianPrice: 925000, priceGrowth: 7.3 },
  { name: 'Eastside', walkScore: 70, transitScore: 65, crime: 'Medium', schools: 14, medianPrice: 525000, priceGrowth: 3.9 },
  { name: 'Riverside', walkScore: 68, transitScore: 60, crime: 'Low', schools: 10, medianPrice: 612000, priceGrowth: 4.5 },
];

// Market data
export const MARKET_HISTORY: MarketPoint[] = [
  { month: 'Jan', price: 612000 },
  { month: 'Feb', price: 618000 },
  { month: 'Mar', price: 625000 },
  { month: 'Apr', price: 635000 },
  { month: 'May', price: 648000 },
  { month: 'Jun', price: 662000 },
  { month: 'Jul', price: 675000 },
  { month: 'Aug', price: 682000 },
  { month: 'Sep', price: 685000 },
  { month: 'Oct', price: 678000 },
  { month: 'Nov', price: 672000 },
  { month: 'Dec', price: 668000 },
];

// Demo leads
export const DEMO_LEADS: Lead[] = [
  { id: 'l1', name: 'John Anderson', email: 'john.anderson@email.com', phone: '(415) 555-1234', message: 'Very interested in this property. Would like to schedule a tour this weekend.', propertyId: 'p1', status: 'New', source: 'Property Page', createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'l2', name: 'Maria Garcia', email: 'maria.g@email.com', phone: '(212) 555-5678', message: 'Is this still available? What are the HOA fees?', propertyId: 'p5', status: 'Contacted', source: 'Property Page', createdAt: new Date(Date.now() - 8 * 3600000).toISOString() },
  { id: 'l3', name: 'Robert Kim', email: 'rkim@email.com', phone: '(310) 555-9012', message: 'Cash buyer. Can close in 14 days. Please send disclosures.', propertyId: 'p12', status: 'Negotiating', source: 'Saved Search Alert', createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: 'l4', name: 'Jennifer Lee', email: 'jlee@email.com', phone: '(312) 555-3456', message: 'First-time homebuyer. Need help with financing options.', propertyId: 'p8', status: 'New', source: 'Organic Search', createdAt: new Date(Date.now() - 36 * 3600000).toISOString() },
  { id: 'l5', name: 'David Wilson', email: 'dwilson@email.com', phone: '(206) 555-7890', message: 'Investor looking for similar properties in this area.', propertyId: 'p22', status: 'Closed', source: 'Referral', createdAt: new Date(Date.now() - 72 * 3600000).toISOString() },
  { id: 'l6', name: 'Sophia Martinez', email: 'sophia.m@email.com', phone: '(617) 555-2345', message: 'Love the neighborhood! Can we see the floor plans?', propertyId: 'p15', status: 'Contacted', source: 'Property Page', createdAt: new Date(Date.now() - 48 * 3600000).toISOString() },
];

// Helper: get property by id
export const getPropertyById = (id: string) => PROPERTIES.find(p => p.id === id);
export const getAgentById = (id: string) => AGENTS.find(a => a.id === id);
export const getCityBySlug = (slug: string) => CITIES_DATA.find(c => c.slug === slug);

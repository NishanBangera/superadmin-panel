export type AdStatus = "Pending" | "Active" | "Rejected" | "Sold"
export type PostingType = "Free" | "Promotional" | "Sell ZoqoDeal"
/** Frontend listedBy: agent | landlord only (no Developer in the post-ad form) */
export type ListedBy = "Landlord" | "Agent"

export type PropertyDetails = {
  propertyType?:
    | "Apartment"
    | "Villa"
    | "Townhouse"
    | "Penthouse"
    | "Land"
    | "Commercial"
    | "Office"
    | "Shop"
    | "Warehouse"
    | "Studio"
    | "Chalet"
    | "Farm"
  bedrooms?: string
  bathrooms?: number
  area?: number // Built-up Area in sqm
  landArea?: number // Land/Plot Area in sqm
  floorNumber?: string
  furnishing?: "yes" | "partly" | "no"
  projectStatus?: "ready" | "under-construction"
  handoverBy?: string
  paymentMethod?: "daily" | "monthly" | "quarterly" | "yearly"
  buildingArea?: number // Building Area in sqm
  priceNegotiable?: boolean
  amenities?: string[]
  advancedFeatures?: string[]
  nearbyFacilities?: string[]
}

export type AdUser = {
  name: string
  initials: string
  email: string
  phone: string
  memberSince: string
  isVerified?: boolean
  accountType: ListedBy
  totalAds?: number
}

export type Ad = {
  id: string
  title: string
  titleAr?: string
  category: string
  subcategory?: string
  postingType: PostingType
  governorate: string
  city: string
  location: string
  address?: string
  user: AdUser
  status: AdStatus
  price: number
  postedDate: string
  expiryDate: string
  featured: boolean
  verified?: boolean
  views: number
  clicks: number
  favorites: number
  rejectionReason?: string
  description: string
  images?: string[]
  videoUrl?: string
  propertyDetails: PropertyDetails
}

export const categories = [
  "Apartments",
  "Villas",
  "Land",
  "Commercial Properties",
  "Studios",
  "Chalets",
  "Farms",
  "Rooms",
  "Projects",
] as const

export const postingTypes: PostingType[] = ["Free", "Promotional", "Sell ZoqoDeal"]

export const statuses: AdStatus[] = ["Pending", "Active", "Rejected", "Sold"]

export const governorates = [
  "Muscat",
  "Al Batinah",
  "Al Dakhiliya",
  "Al Dhahirah",
  "Al Sharqiya",
  "Al Wustaa",
  "Buraimi",
  "Dhofar",
  "Musandam",
] as const

export const citiesByGovernorate: Record<string, string[]> = {
  Muscat: [
    "Sultan Haitham City",
    "Al Jafnayn",
    "Al Khoud",
    "Al Khuwair",
    "Al Maabilah",
    "Al Mawaleh",
    "Al Mouj",
    "Al-Bistan",
    "Al-Hail",
    "Al-Sifah",
    "Al-Wuttayah",
    "Amerat",
    "Ansab",
    "Azaiba",
    "Barr al Jissah",
    "Bosher",
    "Darsait",
    "Ghala",
    "Ghubrah",
    "Halban",
    "Hamriya",
    "Madinat Sultan Qaboos",
    "Manumah",
    "Misfah",
    "Muscat Hills",
    "Muttrah",
    "Qantab",
    "Quriyat",
    "Qurm",
    "Rusail",
    "Ruwi",
    "Seeb",
    "Sidab",
    "Wadi Al Kabir",
    "Yenkit",
    "Yiti",
    "Other",
  ],
  "Al Batinah": [
    "Al 'Awabi",
    "Al Khaboura",
    "Al Masnaah",
    "Al Rumais",
    "Barka",
    "Liwa",
    "Nakhl",
    "Rustaq",
    "Saham",
    "Shinas",
    "Sohar",
    "Suwaiq",
    "Wadi Al Ma'awal",
    "Other",
  ],
  "Al Dakhiliya": [
    "Adam",
    "Bahla",
    "Bidbid",
    "Hamra",
    "Izki",
    "Manah",
    "Nizwa",
    "Sumail",
    "Other",
  ],
  "Al Dhahirah": ["Dhank", "Ibri", "Yunqul", "Other"],
  "Al Sharqiya": [
    "Al Kamil and Al Waafi",
    "Al Mudaibi",
    "Al Qabil",
    "Bidiya",
    "Dima and Al Taaiyin",
    "Ibra",
    "Ja'alan Bani Bu Ali",
    "Jalan Bani buhassan",
    "Masira",
    "Sinaw",
    "Sur",
    "Wadi Bani Khalid",
    "Other",
  ],
  "Al Wustaa": ["Al Duqum", "Al Jazur", "Haima", "Mahut", "Other"],
  Buraimi: ["Al Buraimi", "Al Sinainah", "Mahdah", "Other"],
  Dhofar: [
    "Al Mazyona",
    "Dhalkut",
    "Mirbat",
    "Muqshin",
    "Rakhyut",
    "Sadah",
    "Salala",
    "Shalim and The Hallaniyat Island",
    "Taqah",
    "Thumrait",
    "Other",
  ],
  Musandam: ["Bukha", "Dibba", "Khasab", "Limah", "Madha", "Other"],
}

export const propertyTypes = [
  "Apartment",
  "Villa",
  "Townhouse",
  "Penthouse",
  "Studio",
  "Land",
  "Commercial",
  "Office",
  "Shop",
  "Warehouse",
  "Chalet",
  "Farm",
] as const

/** Matches platform countChoiceSchema: studio | 1..9+ */
export const bedroomOptions = [
  { value: "studio", label: "Studio" },
  { value: "1", label: "1 BHK" },
  { value: "2", label: "2 BHK" },
  { value: "3", label: "3 BHK" },
  { value: "4", label: "4 BHK" },
  { value: "5", label: "5 BHK" },
  { value: "6", label: "6 BHK" },
  { value: "7", label: "7 BHK" },
  { value: "8", label: "8 BHK" },
  { value: "9+", label: "9+ BHK" },
] as const

export const bathroomOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9+"] as const

/** Matches platform furnishingLabel(): yes → Furnished, partly → Partly Furnished, no → Unfurnished */
export const furnishingOptions = [
  { value: "yes", label: "Furnished" },
  { value: "partly", label: "Partly Furnished" },
  { value: "no", label: "Unfurnished" },
] as const

export const listedByOptions: ListedBy[] = ["Landlord", "Agent"]

/** Rent listings use daily/monthly/quarterly/yearly */
export const paymentMethods = [
  { value: "daily", label: "Daily" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
] as const

export const paymentMethodLabels: Record<string, string> = {
  daily: "Daily",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
}

export const projectStatusOptions = [
  { value: "ready", label: "Ready" },
  { value: "under-construction", label: "Under Construction" },
] as const

/** Amenities for apartments/villas/house */
export const availableAmenities = [
  "pool",
  "gym",
  "parking",
  "elevator",
  "garden",
  "central-ac",
  "maids-room",
  "balcony",
  "security",
  "storage",
  "laundry",
  "pets-allowed",
] as const

export const amenityLabels: Record<string, string> = {
  "pool": "Pool",
  "gym": "Gym",
  "parking": "Parking",
  "elevator": "Elevator",
  "garden": "Garden",
  "central-ac": "Central AC",
  "maids-room": "Maid's Room",
  "balcony": "Balcony",
  "security": "Security",
  "storage": "Storage",
  "laundry": "Laundry",
  "pets-allowed": "Pets Allowed",
}

/** Advanced Features */
export const advancedFeaturesList = [
  "smart-home",
  "solar-panels",
  "private-pool",
] as const

export const advancedFeaturesLabels: Record<string, string> = {
  "smart-home": "Smart Home",
  "solar-panels": "Solar Panels",
  "private-pool": "Private Pool",
}

/** Nearby facilities */
export const nearbyFacilitiesList = [
  "Masjid",
  "School",
  "Kindergarten",
  "Shops",
  "Beach",
  "Highway",
  "Houses",
] as const

export const nearbyFacilitiesLabels: Record<string, string> = {
  "Masjid": "Masjid",
  "School": "School",
  "Kindergarten": "Kindergarten",
  "Shops": "Shops",
  "Beach": "Beach",
  "Highway": "Highway",
  "Houses": "Houses",
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function realEstateAd(
  input: Omit<Ad, "user" | "favorites" | "location"> & {
    userName: string
    userEmail?: string
    userPhone?: string
    userAccountType?: ListedBy
    memberSince?: string
    isVerified?: boolean
  }
): Ad {
  const {
    userName,
    userEmail,
    userPhone,
    userAccountType = "Agent",
    memberSince = "Jan 2024",
    isVerified = true,
    ...rest
  } = input

  const generatedEmail =
    userEmail || `${userName.toLowerCase().replace(/[^a-z0-9]/g, ".")}@zoqodeal.om`
  const generatedPhone = userPhone || "+968 9" + Math.floor(1000000 + Math.random() * 9000000)
  const governorate = input.governorate || "Muscat"
  const location = `${governorate}, ${input.city}`

  return {
    ...rest,
    governorate,
    location,
    user: {
      name: userName,
      initials: initialsOf(userName),
      email: generatedEmail,
      phone: generatedPhone,
      memberSince,
      isVerified,
      accountType: userAccountType,
      totalAds: Math.floor(Math.random() * 8) + 1,
    },
    favorites: Math.round(input.views * 0.04),
  }
}

export const adsData: Ad[] = [
  realEstateAd({
    id: "AD-10231",
    title: "3BHK Sea-View Villa",
    category: "Villas",
    subcategory: "Residential Villas",
    postingType: "Promotional",
    governorate: "Muscat",
    city: "Al Mouj",
    address: "Sector 4, Marina Way 12",
    userName: "Ahmed Al Farsi",
    userAccountType: "Agent",
    status: "Pending",
    price: 950,
    postedDate: "2026-08-14",
    expiryDate: "2026-09-28",
    featured: true,
    verified: true,
    views: 420,
    clicks: 68,
    propertyDetails: {
      propertyType: "Villa",
      bedrooms: "3",
      bathrooms: 4,
      area: 360,
      landArea: 480,
      furnishing: "partly",
      projectStatus: "ready",
      paymentMethod: "monthly",
      priceNegotiable: false,
      amenities: ["pool", "garden", "balcony", "central-ac", "parking", "security", "maids-room"],
      advancedFeatures: ["smart-home", "private-pool"],
      nearbyFacilities: ["Beach", "Shops", "Masjid", "School"],
    },
    description:
      "Stunning contemporary 3-bedroom villa situated right in the heart of Al Mouj waterfront district. Boasts direct beach access, private temperature-controlled pool, landscaped garden, and high-end German kitchen fittings. Available for immediate occupancy under yearly contract.",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10232",
    title: "Luxury 2BHK Apartment",
    category: "Apartments",
    subcategory: "Apartments for Sale",
    postingType: "Sell ZoqoDeal",
    governorate: "Muscat",
    city: "Muscat Hills",
    address: "Golf Tower B, 5th Floor",
    userName: "ZoqoDeal Verified Sales",
    userAccountType: "Agent",
    status: "Active",
    price: 78000,
    postedDate: "2026-08-01",
    expiryDate: "2026-09-15",
    featured: true,
    verified: true,
    views: 1840,
    clicks: 230,
    propertyDetails: {
      propertyType: "Apartment",
      bedrooms: "2",
      bathrooms: 3,
      area: 155,
      floorNumber: "5th Floor",
      furnishing: "no",
      projectStatus: "ready",
      priceNegotiable: true,
      amenities: ["pool", "gym", "parking", "balcony", "security", "elevator", "central-ac"],
      advancedFeatures: ["smart-home"],
      nearbyFacilities: ["Shops", "Masjid", "School"],
    },
    description:
      "Exclusive ZoqoDeal managed listing: Spectacular golf course-facing 2 bedroom residence in Muscat Hills Integrated Tourism Complex. Features open-plan living, en-suite bathrooms for both bedrooms, and underground designated parking.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10233",
    title: "Prime Retail Shop",
    category: "Commercial Properties",
    subcategory: "Shops & Retail",
    postingType: "Free",
    governorate: "Muscat",
    city: "Muttrah",
    address: "Souq Gate 3, Corniche Road",
    userName: "Al Rawahi Real Estate",
    userAccountType: "Agent",
    status: "Active",
    price: 480,
    postedDate: "2026-07-28",
    expiryDate: "2026-09-11",
    featured: false,
    verified: true,
    views: 940,
    clicks: 112,
    propertyDetails: {
      propertyType: "Shop",
      bathrooms: 1,
      area: 60,
      floorNumber: "Ground Floor",
      furnishing: "no",
      projectStatus: "ready",
      paymentMethod: "monthly",
      amenities: ["central-ac", "security", "storage"],
      nearbyFacilities: ["Highway", "Masjid", "Beach"],
    },
    description:
      "High foot-traffic corner shop unit facing the historical Muttrah promenade. Suitable for luxury perfume, jewelry, souvenir trade, or boutique retail.",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10234",
    title: "Residential Land Plot",
    category: "Land",
    subcategory: "Residential Land",
    postingType: "Sell ZoqoDeal",
    governorate: "Muscat",
    city: "Ansab",
    address: "Phase 4, Plot 182",
    userName: "ZoqoDeal Lands Division",
    userAccountType: "Agent",
    status: "Active",
    price: 145000,
    postedDate: "2026-07-20",
    expiryDate: "2026-09-03",
    featured: true,
    verified: true,
    views: 1980,
    clicks: 256,
    propertyDetails: {
      propertyType: "Land",
      landArea: 600,
      area: 600,
      projectStatus: "ready",
      priceNegotiable: true,
      amenities: ["security"],
      nearbyFacilities: ["School", "Masjid", "Houses"],
    },
    description:
      "Direct ZoqoDeal Partner Plot: Corner residential plot on a 20-meter paved road with scenic mountain views. Electricity, fiber optic, and municipal water connections readily available at plot boundary.",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10235",
    title: "Furnished Studio Apartment",
    category: "Studios",
    subcategory: "Apartments for Rent",
    postingType: "Free",
    governorate: "Muscat",
    city: "Ruwi",
    address: "Bldg 45, Street 18",
    userName: "Ali Al Balushi",
    userAccountType: "Landlord",
    status: "Sold",
    price: 220,
    postedDate: "2026-06-25",
    expiryDate: "2026-08-09",
    featured: false,
    verified: false,
    views: 780,
    clicks: 96,
    propertyDetails: {
      propertyType: "Studio",
      bedrooms: "studio",
      bathrooms: 1,
      area: 52,
      floorNumber: "2nd Floor",
      furnishing: "yes",
      projectStatus: "ready",
      paymentMethod: "monthly",
      amenities: ["central-ac", "elevator"],
      nearbyFacilities: ["Highway", "Shops", "Masjid"],
    },
    description:
      "Cozy, turnkey studio apartment with brand new Scandinavian furniture, smart TV, fitted kitchenette, and all utilities included in rent.",
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10236",
    title: "Modern 4BHK Townhouse",
    category: "Villas",
    subcategory: "Townhouses",
    postingType: "Promotional",
    governorate: "Muscat",
    city: "Qurm",
    address: "Way 2914, Villa Compound 7",
    userName: "Salim Al Kindi",
    userAccountType: "Agent",
    status: "Active",
    price: 185000,
    postedDate: "2026-08-06",
    expiryDate: "2026-09-20",
    featured: true,
    verified: true,
    views: 1420,
    clicks: 195,
    propertyDetails: {
      propertyType: "Townhouse",
      bedrooms: "4",
      bathrooms: 5,
      area: 320,
      landArea: 280,
      floorNumber: "G + 2",
      furnishing: "partly",
      projectStatus: "ready",
      priceNegotiable: false,
      amenities: ["pool", "garden", "balcony", "central-ac", "parking", "security", "maids-room"],
      advancedFeatures: ["smart-home"],
      nearbyFacilities: ["School", "Shops", "Houses"],
    },
    description:
      "Brand new 4-bedroom luxury townhouse located in exclusive Qurum Heights. Includes private elevator, rooftop barbecue terrace with panoramic city views, high ceilings, and double covered garage.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10237",
    title: "Luxury Marina Penthouse",
    category: "Villas",
    subcategory: "Penthouses",
    postingType: "Sell ZoqoDeal",
    governorate: "Muscat",
    city: "Qurm",
    address: "Saraya Waterfront Tower 1, 14th Floor",
    userName: "ZoqoDeal Premium Deals",
    userAccountType: "Agent",
    status: "Sold",
    price: 340000,
    postedDate: "2026-07-22",
    expiryDate: "2026-09-05",
    featured: true,
    verified: true,
    views: 3120,
    clicks: 410,
    propertyDetails: {
      propertyType: "Penthouse",
      bedrooms: "4",
      bathrooms: 5,
      area: 490,
      floorNumber: "14th Penthouse",
      furnishing: "yes",
      projectStatus: "ready",
      amenities: ["pool", "gym", "parking", "balcony", "security", "elevator", "maids-room"],
      advancedFeatures: ["smart-home", "private-pool"],
      nearbyFacilities: ["Beach", "Masjid", "Houses"],
    },
    description:
      "Exclusive ZoqoDeal Signature Deal: The pinnacle of coastal luxury living in Oman. Ultra-luxury triplex penthouse with 360-degree ocean views, double-height ceilings, private infinity pool, Italian marble flooring, and 24-hour concierge.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10238",
    title: "Seafront Luxury Residences",
    category: "Projects",
    subcategory: "New Developments",
    postingType: "Promotional",
    governorate: "Al Sharqiya",
    city: "Sur",
    address: "Al Aija Waterfront District",
    userName: "Nasser Al Harthy",
    userAccountType: "Agent",
    status: "Pending",
    price: 65000,
    postedDate: "2026-08-12",
    expiryDate: "2026-09-26",
    featured: true,
    verified: true,
    views: 310,
    clicks: 45,
    propertyDetails: {
      propertyType: "Apartment",
      bedrooms: "2",
      bathrooms: 2,
      area: 120,
      projectStatus: "under-construction",
      handoverBy: "Q4 2027",
      amenities: ["pool", "gym", "parking", "balcony", "security", "elevator"],
      advancedFeatures: ["smart-home"],
      nearbyFacilities: ["Beach", "Masjid", "School"],
    },
    description:
      "A flagship sustainable coastal development in Sur. Offering 1, 2, and 3 bedroom seafront apartments with a 5-year flexible developer payment plan: 10% down payment, 40% during construction, 50% on handover in late 2027.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10239",
    title: "Modern 1BHK Apartment",
    category: "Apartments",
    subcategory: "Apartments for Rent",
    postingType: "Free",
    governorate: "Muscat",
    city: "Al Khuwair",
    address: "Near Grand Mall, Street 41",
    userName: "Saif Al Nabhani",
    userAccountType: "Landlord",
    status: "Pending",
    price: 320,
    postedDate: "2026-08-11",
    expiryDate: "2026-09-25",
    featured: false,
    verified: false,
    views: 180,
    clicks: 22,
    propertyDetails: {
      propertyType: "Apartment",
      bedrooms: "1",
      bathrooms: 2,
      area: 85,
      floorNumber: "3rd Floor",
      furnishing: "yes",
      projectStatus: "ready",
      paymentMethod: "monthly",
      amenities: ["pool", "gym", "parking", "elevator", "central-ac"],
      nearbyFacilities: ["Shops", "Highway", "Masjid"],
    },
    description:
      "Immaculately maintained 1 bedroom flat with full contemporary furnishings, rooftop pool access, and gym. 2 minutes walk from Muscat Grand Mall and Lulu Hypermarket.",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10240",
    title: "Corporate Office Space",
    category: "Commercial Properties",
    subcategory: "Offices",
    postingType: "Sell ZoqoDeal",
    governorate: "Muscat",
    city: "Azaiba",
    address: "Sultan Qaboos Highway, Tower 4, 6th Floor",
    userName: "ZoqoDeal Corporate Hub",
    userAccountType: "Agent",
    status: "Active",
    price: 1200,
    postedDate: "2026-08-04",
    expiryDate: "2026-09-18",
    featured: true,
    verified: true,
    views: 890,
    clicks: 135,
    propertyDetails: {
      propertyType: "Office",
      bathrooms: 2,
      area: 240,
      floorNumber: "6th Floor",
      furnishing: "yes",
      projectStatus: "ready",
      paymentMethod: "monthly",
      amenities: ["central-ac", "parking", "security", "elevator"],
      nearbyFacilities: ["Highway", "Masjid", "Shops"],
    },
    description:
      "ZoqoDeal Commercial Exclusive: Turnkey Grade-A office space with direct visibility from Sultan Qaboos Street. Fitted with partitioned executive cabins, 12-person conference room, server room, and high-speed fiber internet infrastructure.",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10241",
    title: "Beachfront Chalet",
    category: "Chalets",
    subcategory: "Chalets & Holiday Homes",
    postingType: "Free",
    governorate: "Dhofar",
    city: "Salala",
    address: "Hawana Salalah Resort, Villa 22",
    userName: "Mohammed Al Kathiri",
    userAccountType: "Agent",
    status: "Rejected",
    price: 110000,
    postedDate: "2026-08-09",
    expiryDate: "2026-09-23",
    featured: false,
    verified: false,
    views: 290,
    clicks: 31,
    rejectionReason:
      "Uploaded property photos contain third-party watermark and low resolution. Please upload clear authentic photos of the chalet.",
    propertyDetails: {
      propertyType: "Chalet",
      bedrooms: "3",
      bathrooms: 3,
      area: 210,
      landArea: 350,
      furnishing: "yes",
      projectStatus: "ready",
      amenities: ["pool", "garden", "balcony", "central-ac", "parking", "security"],
      advancedFeatures: ["private-pool"],
      nearbyFacilities: ["Beach", "Masjid", "Shops"],
    },
    description:
      "Waterfront 3-bedroom holiday villa in Hawana Salalah. Exceptional seasonal rental yields during the Khareef tourist season. Fully furnished with direct beach access.",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10242",
    title: "Industrial Warehouse",
    category: "Commercial Properties",
    subcategory: "Warehouses",
    postingType: "Sell ZoqoDeal",
    governorate: "Al Batinah",
    city: "Sohar",
    address: "Freezone Logistics Hub, Gate 4",
    userName: "ZoqoDeal Industrial Logistics",
    userAccountType: "Agent",
    status: "Sold",
    price: 3200,
    postedDate: "2026-07-29",
    expiryDate: "2026-09-12",
    featured: false,
    verified: true,
    views: 650,
    clicks: 72,
    propertyDetails: {
      propertyType: "Warehouse",
      bathrooms: 2,
      area: 1200,
      furnishing: "no",
      projectStatus: "ready",
      paymentMethod: "monthly",
      amenities: ["security", "central-ac"],
      nearbyFacilities: ["Highway"],
    },
    description:
      "ZoqoDeal Verified Commercial: State-of-the-art heavy logistics warehouse in Sohar Freezone with 12m clear ceiling height, heavy floor load capacity (5 ton/sqm), 3 automated loading docks, fire sprinkler system, and built-in administrative office mezzanine.",
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10243",
    title: "Executive 3BHK Penthouse with Pool",
    category: "Apartments",
    subcategory: "Penthouses",
    postingType: "Sell ZoqoDeal",
    governorate: "Muscat",
    city: "Al Mouj",
    address: "Marina Boulevard Block C",
    userName: "ZoqoDeal Premium Deals",
    userAccountType: "Agent",
    status: "Pending",
    price: 240000,
    postedDate: "2026-08-16",
    expiryDate: "2026-09-30",
    featured: true,
    verified: true,
    views: 195,
    clicks: 34,
    propertyDetails: {
      propertyType: "Penthouse",
      bedrooms: "3",
      bathrooms: 4,
      area: 310,
      floorNumber: "8th Floor",
      furnishing: "yes",
      projectStatus: "ready",
      amenities: ["pool", "gym", "parking", "balcony", "security", "elevator", "maids-room"],
      advancedFeatures: ["smart-home", "private-pool"],
      nearbyFacilities: ["Beach", "Shops", "Masjid"],
    },
    description:
      "ZoqoDeal Exclusive Luxury Listing: Direct marina views, private pool, rooftop terrace, and customized Italian interiors.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10244",
    title: "Al Khoud Commercial Plot",
    category: "Land",
    subcategory: "Commercial Land",
    postingType: "Promotional",
    governorate: "Muscat",
    city: "Al Khoud",
    address: "Commercial Market Strip 7",
    userName: "Nasser Al Harthy",
    userAccountType: "Agent",
    status: "Sold",
    price: 92000,
    postedDate: "2026-07-15",
    expiryDate: "2026-08-30",
    featured: true,
    verified: true,
    views: 2240,
    clicks: 310,
    propertyDetails: {
      propertyType: "Land",
      landArea: 450,
      area: 450,
      projectStatus: "ready",
      amenities: ["security"],
      nearbyFacilities: ["Highway", "Shops", "Houses"],
    },
    description:
      "Sold Commercial Corner Plot with building permit for G+4 commercial-residential building.",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
    ],
  }),
]

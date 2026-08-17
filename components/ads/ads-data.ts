export type AdStatus = "Pending" | "Active" | "Rejected" | "Sold"
export type PostingType = "Sale" | "Rent" | "Project"
export type ListedBy = "Landlord" | "Agent" | "Developer"

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
    | "Whole Building"
  bedrooms?: string
  bathrooms?: number
  area?: number // in sqm
  landArea?: number // in sqm (for villas/land)
  floorNumber?: string
  totalFloors?: number
  furnishing?: "Furnished" | "Semi-Furnished" | "Unfurnished"
  ownership?: "Freehold" | "Leasehold" | "GCC Nationals Only"
  parkingSpaces?: number
  developer?: string
  yearBuilt?: number
  completionStatus?: "Ready to move" | "Under construction" | "Off-Plan"
  handoverDate?: string
  zonedFor?: "Residential" | "Commercial" | "Mixed Use" | "Industrial" | "Farm"
  paymentMethod?: "Cash" | "Cheque" | "Installments" | "Monthly" | "Yearly"
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
  governorate?: string
  city: string
  location: string
  address?: string
  user: AdUser
  status: AdStatus
  price: number
  priceUnit?: string
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
  tags?: string[]
}

export const categories = [
  "Apartments",
  "Villas",
  "Land",
  "Commercial properties",
  "Studios",
  "Townhouses & Penthouses",
  "Projects",
] as const

export const postingTypes: PostingType[] = ["Sale", "Rent", "Project"]

export const statuses: AdStatus[] = ["Pending", "Active", "Rejected", "Sold"]

export const governorates = [
  "Muscat",
  "Dhofar",
  "Al Batinah",
  "Al Dakhiliya",
  "Al Sharqiya",
  "Musandam",
] as const

export const citiesByGovernorate: Record<string, string[]> = {
  Muscat: [
    "Al Mouj",
    "Muscat Hills",
    "Al Khuwair",
    "Qurum",
    "Seeb",
    "Al Khoud",
    "Azaiba",
    "Bosher",
    "Madinat Sultan Qaboos",
    "Ruwi",
    "Muttrah",
    "Al Amerat",
    "Al Ansab",
  ],
  Dhofar: ["Salalah", "Taqah", "Mirbat"],
  "Al Batinah": ["Sohar", "Barka", "Rustaq", "Saham"],
  "Al Dakhiliya": ["Nizwa", "Bahla", "Samail", "Izki"],
  "Al Sharqiya": ["Sur", "Ibra", "Jalan Bani Bu Ali"],
  Musandam: ["Khasab", "Dibba"],
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
  "Whole Building",
] as const

export const bedroomOptions = [
  "Studio",
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK",
  "5 BHK",
  "6+ BHK",
] as const

export const bathroomOptions = [1, 2, 3, 4, 5, 6, "7+"] as const

export const furnishingOptions = [
  "Furnished",
  "Semi-Furnished",
  "Unfurnished",
] as const

export const ownershipOptions = [
  "Freehold",
  "Leasehold",
  "GCC Nationals Only",
] as const

export const listedByOptions: ListedBy[] = ["Landlord", "Agent", "Developer"]

export const availableAmenities = [
  "Swimming Pool",
  "Gym & Fitness Center",
  "Covered Parking",
  "Balcony",
  "Private Garden",
  "24/7 Security",
  "Elevator",
  "Maid's Room",
  "Storage Room",
  "Pets Allowed",
  "Central A/C",
  "Sea / Waterfront View",
  "Built-in Wardrobes",
  "Fitted Kitchen Appliances",
  "Smart Access System",
  "Children's Play Area",
] as const

export const advancedFeaturesList = [
  "Smart Home Automation",
  "Solar Panels",
  "Private Jacuzzi",
  "Barbecue Area",
  "Concierge Service",
  "Driver's Room",
  "Private Pool",
] as const

export const nearbyFacilitiesList = [
  "School",
  "Mosque / Masjid",
  "Shopping Mall",
  "Beach / Waterfront",
  "Public Transport",
  "Hospital / Clinic",
  "Public Park",
  "Kindergarten",
] as const

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
      totalAds: Math.floor(Math.random() * 12) + 1,
    },
    favorites: Math.round(input.views * 0.04),
    priceUnit:
      input.priceUnit || (input.postingType === "Rent" ? "OMR / month" : "OMR"),
  }
}

export const adsData: Ad[] = [
  realEstateAd({
    id: "AD-10231",
    title: "3BHK Sea-View Villa with Private Pool — Al Mouj",
    category: "Villas",
    subcategory: "Residential Villas",
    postingType: "Rent",
    governorate: "Muscat",
    city: "Al Mouj",
    address: "Sector 4, Marina Way 12",
    userName: "Ahmed Al Farsi",
    userAccountType: "Agent",
    status: "Pending",
    price: 950,
    priceUnit: "OMR / month",
    postedDate: "2026-08-14",
    expiryDate: "2026-09-28",
    featured: true,
    verified: true,
    views: 420,
    clicks: 68,
    propertyDetails: {
      propertyType: "Villa",
      bedrooms: "3 BHK",
      bathrooms: 4,
      area: 360,
      landArea: 480,
      furnishing: "Semi-Furnished",
      ownership: "Freehold",
      parkingSpaces: 2,
      developer: "Al Mouj",
      yearBuilt: 2023,
      completionStatus: "Ready to move",
      zonedFor: "Residential",
      paymentMethod: "Cheque",
      priceNegotiable: false,
      amenities: [
        "Swimming Pool",
        "Private Garden",
        "Balcony",
        "Central A/C",
        "Covered Parking",
        "24/7 Security",
        "Maid's Room",
        "Sea / Waterfront View",
        "Built-in Wardrobes",
        "Fitted Kitchen Appliances",
      ],
      advancedFeatures: ["Smart Home Automation", "Private Pool", "Barbecue Area"],
      nearbyFacilities: ["Beach / Waterfront", "Shopping Mall", "Mosque / Masjid", "School"],
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
    title: "Luxury 2BHK Apartment for Sale — Muscat Hills",
    category: "Apartments",
    subcategory: "Apartments for Sale",
    postingType: "Sale",
    governorate: "Muscat",
    city: "Muscat Hills",
    address: "Golf Tower B, 5th Floor",
    userName: "Huda Al Saidi",
    userAccountType: "Agent",
    status: "Active",
    price: 78000,
    priceUnit: "OMR",
    postedDate: "2026-08-01",
    expiryDate: "2026-09-15",
    featured: true,
    verified: true,
    views: 1840,
    clicks: 230,
    propertyDetails: {
      propertyType: "Apartment",
      bedrooms: "2 BHK",
      bathrooms: 3,
      area: 155,
      floorNumber: "5th Floor",
      totalFloors: 8,
      furnishing: "Unfurnished",
      ownership: "Freehold",
      parkingSpaces: 1,
      developer: "Majan",
      yearBuilt: 2022,
      completionStatus: "Ready to move",
      zonedFor: "Residential",
      paymentMethod: "Cash",
      priceNegotiable: true,
      amenities: [
        "Swimming Pool",
        "Gym & Fitness Center",
        "Covered Parking",
        "Balcony",
        "24/7 Security",
        "Elevator",
        "Central A/C",
      ],
      advancedFeatures: ["Smart Access System"],
      nearbyFacilities: ["Shopping Mall", "Hospital / Clinic", "School"],
    },
    description:
      "Spectacular golf course-facing 2 bedroom residence in Muscat Hills Integrated Tourism Complex. Grants investor residency upon purchase. Features open-plan living, en-suite bathrooms for both bedrooms, and underground designated parking.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10233",
    title: "Prime Commercial Retail Shop — Muttrah Souq",
    category: "Commercial properties",
    subcategory: "Shops & Retail",
    postingType: "Rent",
    governorate: "Muscat",
    city: "Muttrah",
    address: "Souq Gate 3, Corniche Road",
    userName: "Al Rawahi Real Estate",
    userAccountType: "Developer",
    status: "Active",
    price: 480,
    priceUnit: "OMR / month",
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
      furnishing: "Unfurnished",
      ownership: "Leasehold",
      parkingSpaces: 0,
      completionStatus: "Ready to move",
      zonedFor: "Commercial",
      paymentMethod: "Cheque",
      amenities: ["Central A/C", "24/7 Security", "Storage Room"],
      nearbyFacilities: ["Public Transport", "Mosque / Masjid", "Beach / Waterfront"],
    },
    description:
      "High foot-traffic corner shop unit facing the historical Muttrah promenade. Suitable for luxury perfume, jewelry, souvenir trade, or coffee shop. Municipality commercial license approved.",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10234",
    title: "Freehold Residential Land 600 sqm — Al Ansab Phase 4",
    category: "Land",
    subcategory: "Residential Land",
    postingType: "Sale",
    governorate: "Muscat",
    city: "Al Ansab",
    address: "Phase 4, Plot 182",
    userName: "Bader Al Ghafri",
    userAccountType: "Landlord",
    status: "Active",
    price: 145000,
    priceUnit: "OMR",
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
      ownership: "Freehold",
      completionStatus: "Ready to move",
      zonedFor: "Residential",
      paymentMethod: "Cash",
      priceNegotiable: true,
      amenities: ["24/7 Security"],
      nearbyFacilities: ["School", "Mosque / Masjid", "Public Park"],
    },
    description:
      "Corner residential plot on a 20-meter paved road with scenic mountain views. Electricity, fiber optic, and municipal water connections readily available at the plot boundary. Ready for immediate villa construction.",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10235",
    title: "Fully Furnished Studio Apartment for Rent — Ruwi High St",
    category: "Studios",
    subcategory: "Apartments for Rent",
    postingType: "Rent",
    governorate: "Muscat",
    city: "Ruwi",
    address: "Bldg 45, Street 18",
    userName: "Ali Al Balushi",
    userAccountType: "Landlord",
    status: "Sold",
    price: 220,
    priceUnit: "OMR / month",
    postedDate: "2026-06-25",
    expiryDate: "2026-08-09",
    featured: false,
    verified: false,
    views: 780,
    clicks: 96,
    propertyDetails: {
      propertyType: "Studio",
      bedrooms: "Studio",
      bathrooms: 1,
      area: 52,
      floorNumber: "2nd Floor",
      totalFloors: 5,
      furnishing: "Furnished",
      ownership: "Leasehold",
      parkingSpaces: 1,
      yearBuilt: 2021,
      completionStatus: "Ready to move",
      zonedFor: "Residential",
      paymentMethod: "Monthly",
      amenities: ["Central A/C", "Elevator", "Built-in Wardrobes"],
      nearbyFacilities: ["Public Transport", "Shopping Mall", "Hospital / Clinic"],
    },
    description:
      "Cozy, turnkey studio apartment with brand new Scandinavian furniture, smart TV, fitted kitchenette, and all utilities included in rent. Walking distance to Ruwi CBD bus station.",
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10236",
    title: "4BHK Modern Townhouse with Rooftop Terrace — Qurum 29",
    category: "Townhouses & Penthouses",
    subcategory: "Townhouses",
    postingType: "Sale",
    governorate: "Muscat",
    city: "Qurum",
    address: "Way 2914, Villa Compound 7",
    userName: "Salim Al Kindi",
    userAccountType: "Agent",
    status: "Active",
    price: 185000,
    priceUnit: "OMR",
    postedDate: "2026-08-06",
    expiryDate: "2026-09-20",
    featured: true,
    verified: true,
    views: 1420,
    clicks: 195,
    propertyDetails: {
      propertyType: "Townhouse",
      bedrooms: "4 BHK",
      bathrooms: 5,
      area: 320,
      landArea: 280,
      floorNumber: "G + 2",
      furnishing: "Semi-Furnished",
      ownership: "Freehold",
      parkingSpaces: 2,
      yearBuilt: 2024,
      completionStatus: "Ready to move",
      zonedFor: "Residential",
      paymentMethod: "Cheque",
      priceNegotiable: false,
      amenities: [
        "Swimming Pool",
        "Private Garden",
        "Balcony",
        "Central A/C",
        "Covered Parking",
        "24/7 Security",
        "Maid's Room",
        "Built-in Wardrobes",
      ],
      advancedFeatures: ["Smart Home Automation", "Private Jacuzzi"],
      nearbyFacilities: ["School", "Shopping Mall", "Public Park"],
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
    title: "Marina Penthouse with Private Infinity Pool — Jissah Bay",
    category: "Townhouses & Penthouses",
    subcategory: "Penthouses",
    postingType: "Sale",
    governorate: "Muscat",
    city: "Qurum",
    address: "Saraya Waterfront Tower 1, 14th Floor",
    userName: "Saraya Realty",
    userAccountType: "Developer",
    status: "Active",
    price: 340000,
    priceUnit: "OMR",
    postedDate: "2026-07-22",
    expiryDate: "2026-09-05",
    featured: true,
    verified: true,
    views: 3120,
    clicks: 410,
    propertyDetails: {
      propertyType: "Penthouse",
      bedrooms: "4 BHK",
      bathrooms: 5,
      area: 490,
      floorNumber: "14th Penthouse",
      totalFloors: 14,
      furnishing: "Furnished",
      ownership: "Freehold",
      parkingSpaces: 3,
      developer: "Saraya Bandar Jissah",
      yearBuilt: 2024,
      completionStatus: "Ready to move",
      zonedFor: "Residential",
      paymentMethod: "Cash",
      amenities: [
        "Swimming Pool",
        "Gym & Fitness Center",
        "Covered Parking",
        "Balcony",
        "24/7 Security",
        "Elevator",
        "Maid's Room",
        "Sea / Waterfront View",
        "Fitted Kitchen Appliances",
        "Smart Access System",
      ],
      advancedFeatures: ["Smart Home Automation", "Private Pool", "Concierge Service"],
      nearbyFacilities: ["Beach / Waterfront", "Hospital / Clinic", "Public Park"],
    },
    description:
      "The pinnacle of coastal luxury living in Oman. Ultra-luxury triplex penthouse with 360-degree ocean views, double-height ceilings, private infinity pool, Italian marble flooring, and dedicated 24-hour concierge.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10238",
    title: "Seafront Off-Plan Luxury Residences — Sur Waves Project",
    category: "Projects",
    subcategory: "New Developments",
    postingType: "Project",
    governorate: "Al Sharqiya",
    city: "Sur",
    address: "Al Aija Waterfront District",
    userName: "Omran Group",
    userAccountType: "Developer",
    status: "Pending",
    price: 65000,
    priceUnit: "Starting from",
    postedDate: "2026-08-12",
    expiryDate: "2026-09-26",
    featured: true,
    verified: true,
    views: 310,
    clicks: 45,
    propertyDetails: {
      propertyType: "Whole Building",
      bedrooms: "2 BHK",
      bathrooms: 2,
      area: 120,
      developer: "Omran",
      yearBuilt: 2027,
      completionStatus: "Under construction",
      handoverDate: "Q4 2027",
      ownership: "Freehold",
      zonedFor: "Mixed Use",
      paymentMethod: "Installments",
      amenities: [
        "Swimming Pool",
        "Gym & Fitness Center",
        "Covered Parking",
        "Balcony",
        "24/7 Security",
        "Elevator",
        "Sea / Waterfront View",
      ],
      advancedFeatures: ["Smart Home Automation", "Concierge Service"],
      nearbyFacilities: ["Beach / Waterfront", "Mosque / Masjid", "School"],
    },
    description:
      "A flagship sustainable coastal development by Omran Group in Sur. Offering 1, 2, and 3 bedroom seafront apartments with a 5-year flexible developer payment plan: 10% down payment, 40% during construction, 50% on handover in late 2027.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10239",
    title: "1BHK Apartment with Balcony for Rent — Al Khuwair",
    category: "Apartments",
    subcategory: "Apartments for Rent",
    postingType: "Rent",
    governorate: "Muscat",
    city: "Al Khuwair",
    address: "Near Grand Mall, Street 41",
    userName: "Saif Al Nabhani",
    userAccountType: "Landlord",
    status: "Pending",
    price: 320,
    priceUnit: "OMR / month",
    postedDate: "2026-08-11",
    expiryDate: "2026-09-25",
    featured: false,
    verified: false,
    views: 180,
    clicks: 22,
    propertyDetails: {
      propertyType: "Apartment",
      bedrooms: "1 BHK",
      bathrooms: 2,
      area: 85,
      floorNumber: "3rd Floor",
      totalFloors: 6,
      furnishing: "Furnished",
      ownership: "Leasehold",
      parkingSpaces: 1,
      yearBuilt: 2022,
      completionStatus: "Ready to move",
      zonedFor: "Residential",
      paymentMethod: "Monthly",
      amenities: [
        "Swimming Pool",
        "Gym & Fitness Center",
        "Covered Parking",
        "Elevator",
        "Central A/C",
      ],
      nearbyFacilities: ["Shopping Mall", "Public Transport", "Mosque / Masjid"],
    },
    description:
      "Immaculately maintained 1 bedroom flat with full contemporary furnishings, rooftop pool access, and gym. 2 minutes walk from Muscat Grand Mall and Lulu Hypermarket.",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10240",
    title: "Modern Fitted Corporate Office Space — Azaiba Commercial",
    category: "Commercial properties",
    subcategory: "Offices",
    postingType: "Rent",
    governorate: "Muscat",
    city: "Azaiba",
    address: "Sultan Qaboos Highway, Tower 4, 6th Floor",
    userName: "Gulf Commercial Assets",
    userAccountType: "Agent",
    status: "Active",
    price: 1200,
    priceUnit: "OMR / month",
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
      totalFloors: 10,
      furnishing: "Furnished",
      ownership: "Leasehold",
      parkingSpaces: 4,
      yearBuilt: 2023,
      completionStatus: "Ready to move",
      zonedFor: "Commercial",
      paymentMethod: "Cheque",
      amenities: [
        "Central A/C",
        "Covered Parking",
        "24/7 Security",
        "Elevator",
        "Smart Access System",
      ],
      nearbyFacilities: ["Public Transport", "Hospital / Clinic", "Shopping Mall"],
    },
    description:
      "Turnkey Grade-A office space with direct visibility from Sultan Qaboos Street. Fitted with partitioned executive cabins, 12-person conference room, server room, and high-speed fiber internet infrastructure.",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10241",
    title: "Chalet with Private Beach & Garden — Salalah Beach",
    category: "Villas",
    subcategory: "Chalets & Holiday Homes",
    postingType: "Sale",
    governorate: "Dhofar",
    city: "Salalah",
    address: "Hawana Salalah Resort, Villa 22",
    userName: "Mohammed Al Kathiri",
    userAccountType: "Agent",
    status: "Rejected",
    price: 110000,
    priceUnit: "OMR",
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
      bedrooms: "3 BHK",
      bathrooms: 3,
      area: 210,
      landArea: 350,
      furnishing: "Furnished",
      ownership: "Freehold",
      parkingSpaces: 2,
      developer: "Omran",
      yearBuilt: 2022,
      completionStatus: "Ready to move",
      zonedFor: "Residential",
      paymentMethod: "Cash",
      amenities: [
        "Swimming Pool",
        "Private Garden",
        "Balcony",
        "Central A/C",
        "Covered Parking",
        "24/7 Security",
        "Sea / Waterfront View",
      ],
      advancedFeatures: ["Private Pool", "Barbecue Area"],
      nearbyFacilities: ["Beach / Waterfront", "Hospital / Clinic", "Shopping Mall"],
    },
    description:
      "Waterfront 3-bedroom holiday villa in Hawana Salalah. Exceptional seasonal rental yields during the Khareef tourist season. Fully furnished with direct beach access.",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80",
    ],
  }),
  realEstateAd({
    id: "AD-10242",
    title: "Commercial Industrial Warehouse 1200 sqm — Sohar Freezone",
    category: "Commercial properties",
    subcategory: "Warehouses",
    postingType: "Rent",
    governorate: "Al Batinah",
    city: "Sohar",
    address: "Freezone Logistics Hub, Gate 4",
    userName: "Batinah Logistics Co.",
    userAccountType: "Developer",
    status: "Active",
    price: 3200,
    priceUnit: "OMR / month",
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
      furnishing: "Unfurnished",
      ownership: "Leasehold",
      parkingSpaces: 10,
      yearBuilt: 2023,
      completionStatus: "Ready to move",
      zonedFor: "Industrial",
      paymentMethod: "Cheque",
      amenities: ["24/7 Security", "Central A/C"],
      nearbyFacilities: ["Public Transport"],
    },
    description:
      "State-of-the-art heavy logistics warehouse in Sohar Freezone with 12m clear ceiling height, heavy floor load capacity (5 ton/sqm), 3 automated loading docks, fire sprinkler system, and built-in administrative office mezzanine.",
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
    ],
  }),
]

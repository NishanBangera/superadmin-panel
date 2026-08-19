import { type PostingType } from "@/components/ads/ads-data"

export type ReportReason =
  | "Fraud / Scam Suspected"
  | "Misleading Information / Price"
  | "Fake / Copyrighted Photos"
  | "Already Sold / Unavailable"
  | "Inappropriate Content"
  | "Wrong Contact Information"
  | "Duplicate Listing"
  | "Other"

export type ReportStatus = "Pending" | "Investigating" | "Resolved" | "Dismissed"

export type ListingReport = {
  id: string
  adId: string
  adTitle: string
  adCategory: string
  adImage?: string
  adPrice: number
  adPostingType: PostingType
  reportedBy: {
    name: string
    email: string
    phone: string
  }
  seller: {
    name: string
    email: string
    phone: string
    accountType: string
  }
  reason: ReportReason
  details: string
  reportedDate: string
  status: ReportStatus
  actionTaken?: string
  moderatorNotes?: string
  resolvedAt?: string
}

export const reportReasons: ReportReason[] = [
  "Fraud / Scam Suspected",
  "Misleading Information / Price",
  "Fake / Copyrighted Photos",
  "Already Sold / Unavailable",
  "Inappropriate Content",
  "Wrong Contact Information",
  "Duplicate Listing",
  "Other",
]

export const reportStatuses: ReportStatus[] = [
  "Pending",
  "Investigating",
  "Resolved",
  "Dismissed",
]

export const initialReportsData: ListingReport[] = [
  {
    id: "REP-2041",
    adId: "AD-10241",
    adTitle: "Beachfront Chalet",
    adCategory: "Chalets",
    adImage:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80",
    adPrice: 110000,
    adPostingType: "Free",
    reportedBy: {
      name: "Tariq Al Zadjali",
      email: "tariq.zadjali@gmail.com",
      phone: "+968 91234567",
    },
    seller: {
      name: "Mohammed Al Kathiri",
      email: "mohammed.al.kathiri@zoqodeal.om",
      phone: "+968 95412890",
      accountType: "Agent",
    },
    reason: "Fake / Copyrighted Photos",
    details:
      "The photos uploaded for this Hawana Salalah chalet are scraped from a luxury hotel website in Dubai with watermarks removed. I visited the location and the actual villa is under dispute.",
    reportedDate: "2026-08-15T14:30:00Z",
    status: "Pending",
  },
  {
    id: "REP-2042",
    adId: "AD-10231",
    adTitle: "3BHK Sea-View Villa",
    adCategory: "Villas",
    adImage:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80",
    adPrice: 950,
    adPostingType: "Promotional",
    reportedBy: {
      name: "Maryam Al Balushi",
      email: "maryam.b@outlook.com",
      phone: "+968 98765432",
    },
    seller: {
      name: "Ahmed Al Farsi",
      email: "ahmed.al.farsi@zoqodeal.om",
      phone: "+968 91122334",
      accountType: "Agent",
    },
    reason: "Misleading Information / Price",
    details:
      "The listing specifies 950 OMR/month on ZoqoDeal, but when I contacted the agent via WhatsApp, he insisted on 1,400 OMR/month + 10% commission. The posted price is bait.",
    reportedDate: "2026-08-16T09:15:00Z",
    status: "Investigating",
    moderatorNotes: "Contacted agent requesting lease agreement verification.",
  },
  {
    id: "REP-2043",
    adId: "AD-10235",
    adTitle: "Furnished Studio Apartment",
    adCategory: "Studios",
    adImage:
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop&q=80",
    adPrice: 220,
    adPostingType: "Free",
    reportedBy: {
      name: "Rashid Al Hadhrami",
      email: "rashid.h@yahoo.com",
      phone: "+968 93456789",
    },
    seller: {
      name: "Ali Al Balushi",
      email: "ali.al.balushi@zoqodeal.om",
      phone: "+968 94567812",
      accountType: "Landlord",
    },
    reason: "Already Sold / Unavailable",
    details:
      "The landlord told me this studio flat was rented out two months ago and he forgot to remove the listing.",
    reportedDate: "2026-08-10T11:20:00Z",
    status: "Resolved",
    actionTaken: "Ad Marked as Sold",
    moderatorNotes: "Verified with owner. Listing status updated to Sold.",
    resolvedAt: "2026-08-11T16:00:00Z",
  },
  {
    id: "REP-2044",
    adId: "AD-10233",
    adTitle: "Prime Retail Shop",
    adCategory: "Commercial Properties",
    adImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    adPrice: 480,
    adPostingType: "Free",
    reportedBy: {
      name: "Khalfan Al Maskari",
      email: "khalfan.m@gmail.com",
      phone: "+968 97654321",
    },
    seller: {
      name: "Al Rawahi Real Estate",
      email: "al.rawahi.real.estate@zoqodeal.om",
      phone: "+968 92345678",
      accountType: "Agent",
    },
    reason: "Wrong Contact Information",
    details:
      "The phone number listed belongs to a private citizen who has received dozens of calls inquiring about a shop.",
    reportedDate: "2026-08-17T08:45:00Z",
    status: "Pending",
  },
  {
    id: "REP-2045",
    adId: "AD-10234",
    adTitle: "Residential Land Plot",
    adCategory: "Land",
    adImage:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
    adPrice: 145000,
    adPostingType: "Sell ZoqoDeal",
    reportedBy: {
      name: "Salim Al Shibli",
      email: "salim.shibli@hotmail.com",
      phone: "+968 95678901",
    },
    seller: {
      name: "ZoqoDeal Lands Division",
      email: "bader.al.ghafri@zoqodeal.om",
      phone: "+968 96789012",
      accountType: "Agent",
    },
    reason: "Duplicate Listing",
    details:
      "This same plot in Ansab Phase 4 is listed twice under different accounts with slightly different dimensions.",
    reportedDate: "2026-08-12T17:10:00Z",
    status: "Dismissed",
    actionTaken: "Dismissed - No Violation",
    moderatorNotes: "Verified: One is Plot 182 and the other is adjacent Plot 183. Not duplicates.",
    resolvedAt: "2026-08-13T10:30:00Z",
  },
  {
    id: "REP-2046",
    adId: "AD-10239",
    adTitle: "Modern 1BHK Apartment",
    adCategory: "Apartments",
    adImage:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
    adPrice: 320,
    adPostingType: "Free",
    reportedBy: {
      name: "Hassan Al Lawati",
      email: "hassan.lawati@gmail.com",
      phone: "+968 99887766",
    },
    seller: {
      name: "Saif Al Nabhani",
      email: "saif.al.nabhani@zoqodeal.om",
      phone: "+968 93344556",
      accountType: "Landlord",
    },
    reason: "Fraud / Scam Suspected",
    details:
      "Seller demanded a 100 OMR reservation transfer via wire before allowing me to view the flat in Al Khuwair.",
    reportedDate: "2026-08-17T15:20:00Z",
    status: "Pending",
  },
]

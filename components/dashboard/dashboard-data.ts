export const kpis = [
  {
    labelKey: "totalUsers",
    value: "48,219",
    change: "+4.6%",
    trend: "up" as const,
    icon: "users" as const,
  },
  {
    labelKey: "activeListings",
    value: "12,904",
    change: "+2.1%",
    trend: "up" as const,
    icon: "megaphone" as const,
  },
  {
    labelKey: "pendingApprovals",
    value: "186",
    change: "-8 today",
    trend: "down" as const,
    icon: "clock" as const,
  },
  {
    labelKey: "featuredAds",
    value: "342",
    change: "+18 this week",
    trend: "up" as const,
    icon: "star" as const,
  },
  {
    labelKey: "revenueMTD",
    value: "5,842.300 OMR",
    change: "+11.3%",
    trend: "up" as const,
    icon: "wallet" as const,
  },
  {
    labelKey: "activeSubscriptions",
    value: "1,027",
    change: "+64 this month",
    trend: "up" as const,
    icon: "credit-card" as const,
  },
]

export const revenueTrend = [
  { month: "Mar", revenue: 3120, listings: 780 },
  { month: "Apr", revenue: 3480, listings: 845 },
  { month: "May", revenue: 3910, listings: 902 },
  { month: "Jun", revenue: 4260, listings: 968 },
  { month: "Jul", revenue: 5120, listings: 1040 },
  { month: "Aug", revenue: 5842, listings: 1104 },
]

export const categoryPerformance = [
  { category: "Motors", listings: 3420 },
  { category: "Real Estate", listings: 2890 },
  { category: "Mobile & Tablets", listings: 2140 },
  { category: "Electronics", listings: 1760 },
  { category: "Services", listings: 1310 },
  { category: "Jobs", listings: 980 },
]

export const recentActivity = [
  {
    actor: "Sara Al Balushi",
    action: "approved ad",
    target: "Toyota Land Cruiser 2022",
    time: "2 minutes ago",
    type: "approve" as const,
  },
  {
    actor: "System",
    action: "flagged listing for review",
    target: "iPhone 15 Pro Max — price mismatch",
    time: "18 minutes ago",
    type: "flag" as const,
  },
  {
    actor: "Ahmed Al Farsi",
    action: "rejected ad",
    target: "Villa in Al Mouj — incomplete documents",
    time: "42 minutes ago",
    type: "reject" as const,
  },
  {
    actor: "Fatma Al Hinai",
    action: "blocked user",
    target: "user #48213 for repeated spam",
    time: "1 hour ago",
    type: "block" as const,
  },
  {
    actor: "System",
    action: "processed payment",
    target: "Business package — 16 listings / 1 year",
    time: "2 hours ago",
    type: "payment" as const,
  },
  {
    actor: "Khalid Al Riyami",
    action: "marked ad as sold",
    target: "Nissan Patrol 2020",
    time: "3 hours ago",
    type: "sold" as const,
  },
]

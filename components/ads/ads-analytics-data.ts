export const trailingDays = [
  "Jul 30",
  "Jul 31",
  "Aug 01",
  "Aug 02",
  "Aug 03",
  "Aug 04",
  "Aug 05",
  "Aug 06",
  "Aug 07",
  "Aug 08",
  "Aug 09",
  "Aug 10",
  "Aug 11",
  "Aug 12",
]

const perAdViewsPattern = [
  120, 145, 160, 210, 180, 240, 260, 300, 280, 340, 360, 410, 390, 460,
]
const perAdClicksPattern = [
  14, 18, 20, 26, 24, 30, 34, 38, 36, 44, 46, 52, 50, 58,
]

const aggregateViewsPattern = [
  4200, 4460, 4310, 4820, 5010, 5240, 5390, 5610, 5480, 5820, 6040, 6280, 6150, 6510,
]
const aggregateClicksPattern = [
  520, 560, 540, 610, 640, 690, 705, 740, 720, 770, 810, 845, 830, 880,
]

export function buildAdTrend(seed: number) {
  const scale = 0.6 + (seed % 7) * 0.08
  return trailingDays.map((day, i) => ({
    day,
    views: Math.round(perAdViewsPattern[i] * scale),
    clicks: Math.round(perAdClicksPattern[i] * scale),
  }))
}

export const aggregateTrend = trailingDays.map((day, i) => ({
  day,
  views: aggregateViewsPattern[i],
  clicks: aggregateClicksPattern[i],
}))

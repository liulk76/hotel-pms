import * as React from "react"

export type RoomTypeKey = "standard" | "deluxe" | "twin" | "suite"

export interface DailySummary {
  date: string
  roomRevenue: number
  restaurantRevenue: number
  otherRevenue: number
  roomsAvailable: number
  roomsSold: number
  roomTypeOccupancy: Record<RoomTypeKey, number>
}

export interface OrderRecord {
  date: string
  time: string
  roomType: string
  orderNo: string
  roomFee: number
  paymentMethod: string
}

export const ROOM_TYPE_LABELS: Record<RoomTypeKey, string> = {
  standard: "标准房",
  deluxe: "豪华房",
  twin: "双床房",
  suite: "套房",
}

export const ROOM_TYPE_ORDER: RoomTypeKey[] = ["standard", "deluxe", "twin", "suite"]

export function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function totalRevenue(d: DailySummary) {
  return d.roomRevenue + d.restaurantRevenue + d.otherRevenue
}

export interface PeriodAggregate {
  totalRevenue: number
  roomRevenue: number
  restaurantRevenue: number
  otherRevenue: number
  occupancyRate: number
  revPAR: number
  roomTypeOccupancy: Record<RoomTypeKey, number>
}

const EMPTY_ROOM_TYPE_OCCUPANCY: Record<RoomTypeKey, number> = {
  standard: 0,
  deluxe: 0,
  twin: 0,
  suite: 0,
}

export function aggregate(days: DailySummary[]): PeriodAggregate {
  if (days.length === 0) {
    return {
      totalRevenue: 0,
      roomRevenue: 0,
      restaurantRevenue: 0,
      otherRevenue: 0,
      occupancyRate: 0,
      revPAR: 0,
      roomTypeOccupancy: EMPTY_ROOM_TYPE_OCCUPANCY,
    }
  }

  let roomRevenue = 0
  let restaurantRevenue = 0
  let otherRevenue = 0
  let roomsSold = 0
  let roomsAvailable = 0
  const occSum: Record<RoomTypeKey, number> = { standard: 0, deluxe: 0, twin: 0, suite: 0 }

  for (const d of days) {
    roomRevenue += d.roomRevenue
    restaurantRevenue += d.restaurantRevenue
    otherRevenue += d.otherRevenue
    roomsSold += d.roomsSold
    roomsAvailable += d.roomsAvailable
    for (const key of ROOM_TYPE_ORDER) {
      occSum[key] += d.roomTypeOccupancy[key]
    }
  }

  const roomTypeOccupancy = Object.fromEntries(
    ROOM_TYPE_ORDER.map((key) => [key, occSum[key] / days.length])
  ) as Record<RoomTypeKey, number>

  return {
    totalRevenue: roomRevenue + restaurantRevenue + otherRevenue,
    roomRevenue,
    restaurantRevenue,
    otherRevenue,
    occupancyRate: roomsAvailable ? (roomsSold / roomsAvailable) * 100 : 0,
    revPAR: roomsAvailable ? roomRevenue / roomsAvailable : 0,
    roomTypeOccupancy,
  }
}

export function percentChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100
  return ((current - previous) / previous) * 100
}

export type DatePreset = "today" | "yesterday" | "7d" | "30d" | "month"

export const DATE_PRESET_LABELS: Record<DatePreset, string> = {
  today: "今日",
  yesterday: "昨日",
  "7d": "近7天",
  "30d": "近30天",
  month: "本月",
}

export interface SimpleDateRange {
  from: Date
  to: Date
}

export function getPresetRange(preset: DatePreset, referenceDate: Date): SimpleDateRange {
  const to = new Date(referenceDate)
  to.setHours(0, 0, 0, 0)
  const from = new Date(to)

  switch (preset) {
    case "today":
      break
    case "yesterday":
      to.setDate(to.getDate() - 1)
      from.setTime(to.getTime())
      break
    case "7d":
      from.setDate(from.getDate() - 6)
      break
    case "30d":
      from.setDate(from.getDate() - 29)
      break
    case "month":
      from.setDate(1)
      break
  }
  return { from, to }
}

export function daysBetween(from: Date, to: Date) {
  const ms = to.getTime() - from.getTime()
  return Math.round(ms / 86400000) + 1
}

export function getPreviousRange(range: SimpleDateRange): SimpleDateRange {
  const length = daysBetween(range.from, range.to)
  const to = new Date(range.from)
  to.setDate(to.getDate() - 1)
  const from = new Date(to)
  from.setDate(from.getDate() - (length - 1))
  return { from, to }
}

export function filterByRange<T extends { date: string }>(
  rows: T[],
  range: SimpleDateRange
): T[] {
  const fromKey = toDateKey(range.from)
  const toKey = toDateKey(range.to)
  return rows.filter((row) => row.date >= fromKey && row.date <= toKey)
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load ${url}: ${res.status}`)
  }
  return res.json() as Promise<T>
}

function randomDelay() {
  const ms = 1000 + Math.random() * 1000
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useBusinessData() {
  const [daily, setDaily] = React.useState<DailySummary[] | null>(null)
  const [orders, setOrders] = React.useState<OrderRecord[] | null>(null)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    let cancelled = false
    Promise.all([
      fetchJson<DailySummary[]>("/data/business-daily.json"),
      fetchJson<OrderRecord[]>("/data/business-orders.json"),
      randomDelay(),
    ])
      .then(([dailyData, orderData]) => {
        if (cancelled) return
        setDaily(dailyData)
        setOrders(orderData)
      })
      .catch((err: Error) => {
        if (cancelled) return
        setError(err)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { daily, orders, loading: !daily || !orders, error }
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { ROOM_TYPE_LABELS, ROOM_TYPE_ORDER, type RoomTypeKey } from "./data"

interface CompositionSegment {
  key: string
  label: string
  value: number
  color: string
}

export function RevenueComposition({
  roomRevenue,
  restaurantRevenue,
  otherRevenue,
}: {
  roomRevenue: number
  restaurantRevenue: number
  otherRevenue: number
}) {
  const total = roomRevenue + restaurantRevenue + otherRevenue
  const segments: CompositionSegment[] = [
    { key: "room", label: "客房", value: roomRevenue, color: "var(--chart-1)" },
    { key: "restaurant", label: "餐饮", value: restaurantRevenue, color: "var(--chart-2)" },
    { key: "other", label: "其他", value: otherRevenue, color: "var(--chart-3)" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>收入构成</CardTitle>
        <CardDescription>各业务线收入占比</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex h-6 gap-[2px] overflow-hidden rounded-full bg-muted">
          {segments.map((segment, index) => (
            <div
              key={segment.key}
              className={
                index === 0
                  ? "rounded-l-full"
                  : index === segments.length - 1
                    ? "rounded-r-full"
                    : ""
              }
              style={{
                flexGrow: total ? segment.value : 1,
                flexBasis: 0,
                backgroundColor: segment.color,
              }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {segments.map((segment) => {
            const pct = total ? (segment.value / total) * 100 : 0
            return (
              <div key={segment.key} className="flex items-center gap-2 text-sm">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-muted-foreground">{segment.label}</span>
                <span className="ml-auto font-medium tabular-nums">{pct.toFixed(1)}%</span>
                <span className="w-24 text-right text-muted-foreground tabular-nums">
                  ¥{Math.round(segment.value).toLocaleString("zh-CN")}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function RoomTypeOccupancy({
  occupancy,
}: {
  occupancy: Record<RoomTypeKey, number>
}) {
  const rows = ROOM_TYPE_ORDER.map((key) => ({
    key,
    label: ROOM_TYPE_LABELS[key],
    value: occupancy[key],
  })).sort((a, b) => b.value - a.value)

  return (
    <Card>
      <CardHeader>
        <CardTitle>房型经营情况</CardTitle>
        <CardDescription>各房型入住率</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-sm text-muted-foreground">{row.label}</span>
            <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${Math.min(100, row.value)}%`, backgroundColor: "var(--chart-1)" }}
              />
            </div>
            <span className="w-14 shrink-0 text-right text-sm font-medium tabular-nums">
              {row.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

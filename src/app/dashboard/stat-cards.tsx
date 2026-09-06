import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  // CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function formatCurrency(value: number) {
  return `¥${Math.round(value).toLocaleString("zh-CN")}`
}

function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`
}

function Delta({ value }: { value: number }) {
  const up = value >= 0
  return (
    <Badge variant="outline">
      {up ? (
        <TrendingUpIcon className="text-green-600" />
      ) : (
        <TrendingDownIcon className="text-red-600" />
      )}
      <span className={up ? "text-green-600" : "text-red-600"}>
        {up ? "+" : ""}
        {value.toFixed(1)}%
      </span>
    </Badge>
  )
}

interface StatCardProps {
  label: string
  value: string
  delta: number
  compareLabel: string
}

function StatCard({ label, value, delta, compareLabel }: StatCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        {/* <CardAction>
          <Delta value={delta} />
        </CardAction> */}
      </CardHeader>
      <CardFooter className="text-sm text-muted-foreground flex gap-4">
        {compareLabel}<Delta value={delta} />
      </CardFooter>
    </Card>
  )
}

export function StatCards({
  totalRevenue,
  totalRevenueDelta,
  roomRevenue,
  roomRevenueDelta,
  occupancyRate,
  occupancyRateDelta,
  revPAR,
  revPARDelta,
  compareLabel,
}: {
  totalRevenue: number
  totalRevenueDelta: number
  roomRevenue: number
  roomRevenueDelta: number
  occupancyRate: number
  occupancyRateDelta: number
  revPAR: number
  revPARDelta: number
  compareLabel: string
}) {
  return (
    <div className="grid grid-cols-4 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      <StatCard
        label="营业总额"
        value={formatCurrency(totalRevenue)}
        delta={totalRevenueDelta}
        compareLabel={compareLabel}
      />
      <StatCard
        label="客房收入"
        value={formatCurrency(roomRevenue)}
        delta={roomRevenueDelta}
        compareLabel={compareLabel}
      />
      <StatCard
        label="入住率"
        value={formatPercent(occupancyRate)}
        delta={occupancyRateDelta}
        compareLabel={compareLabel}
      />
      <StatCard
        label="RevPAR"
        value={formatCurrency(revPAR)}
        delta={revPARDelta}
        compareLabel={compareLabel}
      />
    </div>
  )
}

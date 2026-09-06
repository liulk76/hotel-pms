import * as React from "react"
import { DownloadIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import * as XLSX from "xlsx"

import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  DATE_PRESET_LABELS,
  aggregate,
  daysBetween,
  filterByRange,
  getPresetRange,
  getPreviousRange,
  percentChange,
  toDateKey,
  totalRevenue,
  useBusinessData,
  type DatePreset,
  type SimpleDateRange,
} from "./data"
import { OrderTable } from "./order-table"
import { RevenueComposition, RoomTypeOccupancy } from "./revenue-breakdown"
import { RevenueTrendChart } from "./revenue-trend-chart"
import { StatCards } from "./stat-cards"
import Loading from "@/components/loading"

const TODAY = new Date(2026, 8, 6)

export default function Page() {
  const { daily, orders, loading, error } = useBusinessData()
  const [preset, setPreset] = React.useState<DatePreset | null>("today")
  const [range, setRange] = React.useState<SimpleDateRange>(() =>
    getPresetRange("today", TODAY)
  )

  const handlePresetChange = (value: string | null) => {
    if (!value) return
    const nextPreset = value as DatePreset
    setPreset(nextPreset)
    setRange(getPresetRange(nextPreset, TODAY))
  }

  const handleRangeChange = (value: DateRange | undefined) => {
    if (value?.from && value.to) {
      setPreset(null)
      setRange({ from: value.from, to: value.to })
    } else if (!value) {
      setPreset("today")
      setRange(getPresetRange("today", TODAY))
    }
  }

  const filteredDays = React.useMemo(
    () => (daily ? filterByRange(daily, range) : []),
    [daily, range]
  )
  const previousRange = React.useMemo(() => getPreviousRange(range), [range])
  const previousDays = React.useMemo(
    () => (daily ? filterByRange(daily, previousRange) : []),
    [daily, previousRange]
  )
  const filteredOrders = React.useMemo(
    () => (orders ? filterByRange(orders, range) : []),
    [orders, range]
  )

  const currentAgg = React.useMemo(() => aggregate(filteredDays), [filteredDays])
  const previousAgg = React.useMemo(() => aggregate(previousDays), [previousDays])

  const trendData = React.useMemo(() => {
    if (!daily) return []
    const rangeLen = daysBetween(range.from, range.to)
    const trendLen = Math.min(60, Math.max(rangeLen, 14))
    const trendStart = new Date(range.to)
    trendStart.setDate(trendStart.getDate() - (trendLen - 1))
    return filterByRange(daily, { from: trendStart, to: range.to }).map((d) => ({
      date: d.date,
      revenue: totalRevenue(d),
    }))
  }, [daily, range])

  const handleExport = () => {
    if (!daily || !orders) return

    const summarySheet = XLSX.utils.aoa_to_sheet([
      ["指标", "数值"],
      ["营业总额", Math.round(currentAgg.totalRevenue)],
      ["客房收入", Math.round(currentAgg.roomRevenue)],
      ["餐饮收入", Math.round(currentAgg.restaurantRevenue)],
      ["其他收入", Math.round(currentAgg.otherRevenue)],
      ["入住率(%)", Number(currentAgg.occupancyRate.toFixed(1))],
      ["RevPAR", Math.round(currentAgg.revPAR)],
    ])

    const orderRows = filteredOrders
      .slice()
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .map((o) => [o.date, o.time, o.roomType, o.orderNo, o.roomFee, o.paymentMethod])
    const orderSheet = XLSX.utils.aoa_to_sheet([
      ["日期", "时间", "房型", "订单号", "房费", "支付方式"],
      ...orderRows,
    ])

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, summarySheet, "汇总")
    XLSX.utils.book_append_sheet(workbook, orderSheet, "营业明细")
    XLSX.writeFile(
      workbook,
      `酒店营业报表_${toDateKey(range.from)}_${toDateKey(range.to)}.xlsx`
    )
  }

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-semibold">酒店营业报表</h1>
          <div className="flex items-center gap-2">
            <Select
              items={DATE_PRESET_LABELS}
              value={preset ?? undefined}
              onValueChange={handlePresetChange}
            >
              <SelectTrigger className="w-28" size="sm">
                <SelectValue placeholder="自定义" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(DATE_PRESET_LABELS) as DatePreset[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {DATE_PRESET_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DateRangePicker
              value={{ from: range.from, to: range.to }}
              onChange={handleRangeChange}
            />
            <Button variant="outline" onClick={handleExport} disabled={loading}>
              <DownloadIcon />
              导出报表
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
            数据加载失败：{error.message}
          </div>
        )}
        {loading && !error ? (
          <Loading />
        ) : (
          <>
            <StatCards
              totalRevenue={currentAgg.totalRevenue}
              totalRevenueDelta={percentChange(currentAgg.totalRevenue, previousAgg.totalRevenue)}
              roomRevenue={currentAgg.roomRevenue}
              roomRevenueDelta={percentChange(currentAgg.roomRevenue, previousAgg.roomRevenue)}
              occupancyRate={currentAgg.occupancyRate}
              occupancyRateDelta={percentChange(
                currentAgg.occupancyRate,
                previousAgg.occupancyRate
              )}
              revPAR={currentAgg.revPAR}
              revPARDelta={percentChange(currentAgg.revPAR, previousAgg.revPAR)}
              compareLabel="较上一统计周期"
            />

            <RevenueTrendChart data={trendData} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <RevenueComposition
                roomRevenue={currentAgg.roomRevenue}
                restaurantRevenue={currentAgg.restaurantRevenue}
                otherRevenue={currentAgg.otherRevenue}
              />
              <RoomTypeOccupancy occupancy={currentAgg.roomTypeOccupancy} />
            </div>

            <OrderTable orders={filteredOrders} />
          </>
        )}
      </div>
      </div>
    </>
  )
}

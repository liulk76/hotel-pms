import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  DownloadIcon,
} from "lucide-react"
import type { DateRange } from "react-day-picker"
import * as XLSX from "xlsx"

import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FlexRender, useTable } from "@tanstack/react-table"

import { amountKeys, columns, features, getTotalRevenue } from "./columns"
import { useRevenueData } from "./data"
import type { RevenueRow } from "./data"
import Loading from "@/components/loading"

const TODAY = new Date(2026, 8, 6)

const amountLabels: Record<(typeof amountKeys)[number], string> = {
  roomFee: "房费",
  restaurantFee: "餐费",
  product: "商品",
  meetingFee: "会议费",
  roomCompensation: "客房赔偿",
  otherConsumption: "其他消费",
  memberCard: "会员卡",
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getDefaultDateRange(): DateRange {
  const to = new Date(TODAY)
  to.setHours(0, 0, 0, 0)
  const from = new Date(to)
  from.setDate(from.getDate() - 29)
  return { from, to }
}

const YYReport = () => {
  const { data: allData, loading, error } = useRevenueData()
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    getDefaultDateRange
  )
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 30,
  })

  const data = React.useMemo(() => {
    if (!allData) return []
    if (!dateRange?.from || !dateRange?.to) return allData
    const from = toDateKey(dateRange.from)
    const to = toDateKey(dateRange.to)
    return allData.filter((row) => row.date >= from && row.date <= to)
  }, [allData, dateRange])

  const totals = React.useMemo(() => {
    const sums = Object.fromEntries(amountKeys.map((key) => [key, 0])) as Record<
      (typeof amountKeys)[number],
      number
    >
    for (const row of data) {
      for (const key of amountKeys) {
        sums[key] += row[key]
      }
    }
    return sums
  }, [data])

  const totalRevenueSum = React.useMemo(
    () => data.reduce((sum, row) => sum + getTotalRevenue(row), 0),
    [data]
  )

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }

  const handleExport = () => {
    const header = ["日期", "当日总营收", ...amountKeys.map((key) => amountLabels[key])]
    const rows = data.map((row: RevenueRow) => [
      row.date,
      getTotalRevenue(row),
      ...amountKeys.map((key) => row[key]),
    ])
    const totalsRow = [
      "合计",
      totalRevenueSum,
      ...amountKeys.map((key) => totals[key]),
    ]

    const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows, totalsRow])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "营收报表")

    const from = dateRange?.from ? toDateKey(dateRange.from) : "全部"
    const to = dateRange?.to ? toDateKey(dateRange.to) : "全部"
    XLSX.writeFile(workbook, `酒店营收报表_${from}_${to}.xlsx`)
  }

  const table = useTable({
    features,
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
  })

  return (
    <>
      <div className="relative flex flex-1 flex-col gap-4 overflow-hidden p-4 md:p-6">
        {loading && (
          <Loading />
        )}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
            数据加载失败：{error.message}
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-semibold">酒店营业总额报表</h1>
          <div className="flex items-center gap-2">
            <Button onClick={handleExport} disabled={loading}>
              <DownloadIcon />
              导出 Excel
            </Button>
            <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border">
          <ScrollArea className="min-h-0 flex-1">
            <table className="w-full caption-bottom text-sm">
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <FlexRender header={header} />
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          <FlexRender cell={cell} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      暂无数据
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter className="sticky bottom-0 z-10 bg-muted">
                <TableRow className="hover:bg-muted">
                  <TableCell className="font-medium">合计</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    ¥{totalRevenueSum.toLocaleString("zh-CN")}
                  </TableCell>
                  {amountKeys.map((key) => (
                    <TableCell key={key} className="text-right tabular-nums">
                      ¥{totals[key].toLocaleString("zh-CN")}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            </table>
          </ScrollArea>

          <div className="flex shrink-0 items-center justify-between border-t bg-background px-4 py-3">
            <div className="hidden text-sm text-muted-foreground lg:block">
              共 {data.length} 条
            </div>
            <div className="flex w-full items-center justify-center gap-8 lg:w-fit">
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                第 {table.state.pagination.pageIndex + 1} 页 / 共{" "}
                {Math.max(table.getPageCount(), 1)} 页
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="hidden size-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">第一页</span>
                  <ChevronsLeftIcon />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">上一页</span>
                  <ChevronLeftIcon />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">下一页</span>
                  <ChevronRightIcon />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">最后一页</span>
                  <ChevronsRightIcon />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default YYReport

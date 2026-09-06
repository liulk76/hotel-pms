import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { OrderRecord } from "./data"

const PAGE_SIZE = 10

function formatDateTime(date: string, time: string) {
  const [, month, day] = date.split("-")
  return `${month}-${day} ${time}`
}

export function OrderTable({ orders }: { orders: OrderRecord[] }) {
  const [pageIndex, setPageIndex] = React.useState(0)

  const sorted = React.useMemo(
    () => [...orders].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)),
    [orders]
  )

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))

  React.useEffect(() => {
    setPageIndex(0)
  }, [orders])

  const safePageIndex = Math.min(pageIndex, pageCount - 1)
  const rows = sorted.slice(safePageIndex * PAGE_SIZE, safePageIndex * PAGE_SIZE + PAGE_SIZE)

  return (
    <Card>
      <CardHeader>
        <CardTitle>营业明细</CardTitle>
        <CardDescription>共 {sorted.length} 条</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead>房型</TableHead>
                <TableHead>订单号</TableHead>
                <TableHead className="text-right">房费</TableHead>
                <TableHead>支付方式</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length ? (
                rows.map((order) => (
                  <TableRow key={order.orderNo}>
                    <TableCell>{formatDateTime(order.date, order.time)}</TableCell>
                    <TableCell>{order.roomType}</TableCell>
                    <TableCell className="text-muted-foreground">{order.orderNo}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      ¥{order.roomFee.toLocaleString("zh-CN")}
                    </TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end gap-4">
          <div className="text-sm font-medium">
            第 {safePageIndex + 1} 页 / 共 {pageCount} 页
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={safePageIndex === 0}
            >
              <span className="sr-only">上一页</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
              disabled={safePageIndex >= pageCount - 1}
            >
              <span className="sr-only">下一页</span>
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

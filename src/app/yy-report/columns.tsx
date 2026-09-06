import {
  columnVisibilityFeature,
  createColumnHelper,
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
} from "@tanstack/react-table"

import type { RevenueRow } from "./data"

export const features = tableFeatures({
  columnVisibilityFeature,
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

const columnHelper = createColumnHelper<typeof features, RevenueRow>()

function AmountCell({ value }: { value: number }) {
  return <div className="text-right tabular-nums">¥{value.toLocaleString("zh-CN")}</div>
}

export type AmountKey = Exclude<keyof RevenueRow, "date">

export const amountKeys: AmountKey[] = [
  "roomFee",
  "restaurantFee",
  "product",
  "meetingFee",
  "roomCompensation",
  "otherConsumption",
  "memberCard",
]

export function getTotalRevenue(row: RevenueRow) {
  return amountKeys.reduce((sum, key) => sum + row[key], 0)
}

function amountColumn(id: AmountKey, label: string) {
  return columnHelper.accessor(id, {
    header: () => <div className="text-right">{label}</div>,
    cell: ({ row }) => <AmountCell value={row.original[id]} />,
  })
}

export const columns = columnHelper.columns([
  columnHelper.accessor("date", {
    header: "日期",
  }),
  columnHelper.display({
    id: "totalRevenue",
    header: () => <div className="text-right">当日总营收</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium tabular-nums">
        ¥{getTotalRevenue(row.original).toLocaleString("zh-CN")}
      </div>
    ),
  }),
  amountColumn("roomFee", "房费"),
  amountColumn("restaurantFee", "餐费"),
  amountColumn("product", "商品"),
  amountColumn("memberCard", "会员卡"),
  amountColumn("meetingFee", "会议费"),
  amountColumn("roomCompensation", "客房赔偿"),
  amountColumn("otherConsumption", "其他消费"),
])

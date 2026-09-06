import { cn } from "cn"
import { zhCN } from "date-fns/locale"
import { CalendarIcon, XIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className={cn(
                "w-[260px] justify-start text-left font-normal",
                !value?.from && "text-muted-foreground"
              )}
            />
          }
        >
          <CalendarIcon />
          {value?.from ? (
            value.to ? (
              <>
                {formatDate(value.from)} ~ {formatDate(value.to)}
              </>
            ) : (
              formatDate(value.from)
            )
          ) : (
            <span>选择日期区间</span>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            locale={zhCN}
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            showOutsideDays={false}
          />
        </PopoverContent>
      </Popover>
      {value?.from && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => onChange(undefined)}
        >
          <XIcon />
          <span className="sr-only">清空日期</span>
        </Button>
      )}
    </div>
  )
}

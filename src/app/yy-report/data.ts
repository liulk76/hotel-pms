import * as React from "react"

export interface RevenueRow {
  date: string
  roomFee: number
  restaurantFee: number
  product: number
  meetingFee: number
  roomCompensation: number
  otherConsumption: number
  memberCard: number
}

function randomDelay() {
  const ms = 1000 + Math.random() * 1000
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useRevenueData() {
  const [data, setData] = React.useState<RevenueRow[] | null>(null)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    let cancelled = false

    Promise.all([
      fetch("/data/yy-report-revenue.json").then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load yy-report-revenue.json: ${res.status}`)
        }
        return res.json() as Promise<RevenueRow[]>
      }),
      randomDelay(),
    ])
      .then(([rows]) => {
        if (cancelled) return
        setData(rows)
      })
      .catch((err: Error) => {
        if (cancelled) return
        setError(err)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading: !data && !error, error }
}

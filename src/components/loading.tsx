import { Loader2Icon } from "lucide-react"

const Loading = () => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/10 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-md text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
        加载数据...
      </div>
    </div>
  )
}

export default Loading
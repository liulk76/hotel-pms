import { AlertCircleIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function AlertDestructive() {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>登录失败</AlertTitle>
      <AlertDescription>
        请检查您的用户名和密码是否正确
      </AlertDescription>
    </Alert>
  )
}

export default AlertDestructive
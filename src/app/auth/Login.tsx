import logo from "@/assets/logo.svg"
import { LoginForm } from "@/components/login-form"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/hotel-bg.jpg"
          alt="酒店大堂"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.6]"
        />
      </div>
      <div className="flex gap-4 py-10">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex justify-center gap-2 md:justify-center mb-10">
            <a href="#" className="flex items-center gap-2 font-medium">
              <img src={logo} alt="住客邦" className="size-6 rounded-md" />
              住客邦 - 酒店云数平台
            </a>
          </div>
          <Card className="w-full max-w-sm px-2 py-5 shadow-2xl">
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

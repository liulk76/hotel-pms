import { cn } from "cn"
import { useLocation } from "wouter"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { login } from "@/lib/auth"
import { useState } from "react"
import { users } from '@/lib/user'
import LoginAlert from './login-alert'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginAlert, setLoginAlert] = useState(false)
  const [, navigate] = useLocation()
  const [loginLoading, setLoginLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoginLoading(true)
    await new Promise(res => setTimeout(res, 500))
    const currentUser = users.find(item => item.username === username && item.pwd === password)
    if(currentUser) {
      setLoginAlert(false)
      login({ ...currentUser, loginTime: new Date().getTime() })
      navigate("/dashboard")
    } else {
      setLoginAlert(true)
    }
    setLoginLoading(false)
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">登录您的账户</h1>
          <p className="text-sm text-balance text-muted-foreground">
            请填写下方用户名和密码登录系统
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="username">用户名</FieldLabel>
          <Input
            onChange={e => setUsername(e.target.value)}
            id="username"
            type="username"
            placeholder="Zhangsan9527"
            required
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">密码</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              忘记密码?
            </a>
          </div>
          <Input onChange={e => setPassword(e.target.value)} placeholder="********" id="password" type="password" required />
        </Field>
        {loginAlert && <LoginAlert /> }
        <Field>
          <Button type="submit" disabled={loginLoading}>登录</Button>
        </Field>
        <FieldSeparator>或使用以下方式登录</FieldSeparator>
        <Field>
          <Button variant="outline" type="button">
            <img style={{ height: 16, width: 16 }} src="https://ts4.tc.mm.bing.net/th/id/ODF.BvtHqZTl6qLypPDIASUGoA?w=32&amp;h=32&amp;qlt=91&amp;pcl=fffffa&amp;o=6&amp;pid=1.2" height="32" width="32" alt="Global web icon" data-bm="30"></img>
            微信单点登录
          </Button>
          <FieldDescription className="text-center">
            还没有账号?{" "}
            <a href="#" className="underline underline-offset-4">
              点击注册
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

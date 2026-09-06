import { lazy, Suspense } from "react"
import { Redirect, Route, Switch } from "wouter"

import Loading from "@/components/loading"
import { isAuthenticated } from "@/lib/auth"
import { Layout } from "./components/layout"

const LoginPage = lazy(() => import("./app/auth/Login"))
const Dashboard = lazy(() => import("./app/dashboard"))
const YYReport = lazy(() => import("./app/yy-report"))

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  if (!isAuthenticated()) {
    return <Redirect to="/login" />
  }
  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    </Layout>
  )
}

const App = () => {
  return (
    <Switch>
      <Route path="/login">
        <Suspense fallback={<Loading loadingText="加载页面中，请稍后..." />}>
          <LoginPage />
        </Suspense>
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/yy-report">
        <ProtectedRoute component={YYReport} />
      </Route>
      <Route path="/">
        <Redirect to={isAuthenticated() ? "/dashboard" : "/login"} />
      </Route>
      <Route>
        <Redirect to="/login" />
      </Route>
    </Switch>
  )
}

export default App

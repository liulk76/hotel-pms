import { Redirect, Route, Switch } from "wouter"

import LoginPage from "./app/auth/Login"
import Dashboard from "./app/dashboard"
import YYReport from "./app/yy-report"
import { isAuthenticated } from "@/lib/auth"

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  if (!isAuthenticated()) {
    return <Redirect to="/login" />
  }
  return <Component />
}

const App = () => {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
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

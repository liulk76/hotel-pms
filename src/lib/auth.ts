const AUTH_KEY = "auth"

export function isAuthenticated() {
  const loginDataStr = localStorage.getItem(AUTH_KEY)
  if(loginDataStr) {
    const loginData = JSON.parse(loginDataStr)
    if(new Date().getTime() - loginData.loginTime < 1800000) {
      return true
    }
    return false
  }
  return false
}
// eslint-disable-next-line
export function login(loginData: any) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(loginData))
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}

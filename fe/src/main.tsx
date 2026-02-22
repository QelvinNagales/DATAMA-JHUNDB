import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AdminApp from './AdminApp.tsx'
import MemberLogin from './MemberLogin.tsx'
import StaffLogin from './StaffLogin.tsx'
import PublicRegisterPage from './PublicRegisterPage.tsx'

const pathname = window.location.pathname

function Root() {
  if (pathname === '/restricted-staff-auth') {
    return <StaffLogin />
  }
  if (pathname === '/login') {
    return <MemberLogin />
  }
  if (pathname === '/register') {
    return <PublicRegisterPage />
  }
  if (pathname.startsWith('/admin')) {
    return <AdminApp />
  }
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)

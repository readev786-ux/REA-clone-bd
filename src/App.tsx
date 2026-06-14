import { useEffect } from 'react'
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './hooks/useAuth'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'
import Developments from './pages/Developments'
import DevelopmentDetail from './pages/DevelopmentDetail'
import Investments from './pages/Investments'
import About from './pages/About'
import Insights from './pages/Insights'
import InsightDetail from './pages/InsightDetail'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/Login'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminInquiries from './pages/admin/AdminInquiries'
import AdminAppointments from './pages/admin/AdminAppointments'
import AdminProjects from './pages/admin/AdminProjects'
import DevelopmentEditor from './pages/admin/DevelopmentEditor'
import AdminImport from './pages/admin/AdminImport'
import AdminMedia from './pages/admin/AdminMedia'
import AdminContent from './pages/admin/AdminContent'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 },
  },
})

// Honour Vite's base path so routing works under a subpath (e.g. GitHub Pages).
const ROUTER_BASENAME = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter basename={ROUTER_BASENAME}>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/developments" element={<Developments />} />
              <Route path="/developments/:slug" element={<DevelopmentDetail />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="/about" element={<About />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/insights/:slug" element={<InsightDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="projects/new" element={<DevelopmentEditor />} />
              <Route path="projects/:id/edit" element={<DevelopmentEditor />} />
              <Route path="import" element={<AdminImport />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="content" element={<AdminContent />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

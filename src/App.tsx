import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Certificates from './sections/Certificates'
import Badges from './sections/Badges'
import Contact from './sections/Contact'

import AdminDashboard from './admin/pages/AdminDashboard'

export default function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : ''
  const search = typeof window !== 'undefined' ? window.location.search : ''
  const hash = typeof window !== 'undefined' ? window.location.hash : ''

  const params = typeof window !== 'undefined' ? new URLSearchParams(search) : new URLSearchParams('')
  const isAdminByQuery = params.get('admin') === '1'
  const isAdminByHash = hash.includes('#/admin') || hash === '#/admin'
  const isAdminByPath =
    path === '/admin' ||
    path === '/admin.html' ||
    path.startsWith('/admin/')

  const isAdmin = isAdminByQuery || isAdminByHash || isAdminByPath

  if (isAdmin) {
    return <AdminDashboard />
  }

  return (
    <div className="bg-base-950">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certificates />
        <Badges />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

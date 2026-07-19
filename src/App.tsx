import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Certificates from './sections/Certificates'
import Badges from './sections/Badges'
import Contact from './sections/Contact'

export default function App() {
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

import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from './components/Header'
import Footer from './components/Footer'
import PortalRedirect from './components/PortalRedirect'
import Home from './pages/Home'
import Schools from './pages/Schools'
import SchoolPrograms from './pages/SchoolPrograms'
import SchoolOverview from './pages/SchoolOverview'
import Admissions from './pages/Admissions'
import NotFound from './pages/NotFound'
import { CONTACT, LINKS } from './config'

function WhatsAppButton() {
  return (
    <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-xl hover:scale-105 transition">
      <svg viewBox="0 0 32 32" className="w-8 h-8 fill-white" aria-hidden="true">
        <path d="M16.004 3C9.377 3 4 8.377 4 15.004c0 2.386.624 4.62 1.71 6.556L4 29l7.62-1.677a11.94 11.94 0 0 0 4.384.83h.005c6.627 0 12.004-5.377 12.004-12.004C28.013 8.377 22.636 3 16.004 3zm0 21.86h-.004a9.9 9.9 0 0 1-5.05-1.386l-.362-.215-3.77.831.82-3.68-.235-.377a9.87 9.87 0 0 1-1.51-5.03c0-5.47 4.45-9.92 9.926-9.92 2.65 0 5.14 1.032 7.014 2.907a9.86 9.86 0 0 1 2.905 7.017c0 5.47-4.45 9.853-9.734 9.853zm5.44-7.39c-.298-.15-1.762-.87-2.036-.968-.273-.1-.472-.15-.67.15-.198.298-.767.968-.94 1.167-.174.198-.348.223-.646.075-.298-.15-1.257-.463-2.394-1.475-.885-.79-1.483-1.766-1.657-2.064-.174-.298-.018-.46.13-.61.135-.134.298-.348.447-.522.15-.174.198-.298.298-.497.1-.198.05-.373-.025-.522-.075-.15-.67-1.614-.918-2.21-.242-.58-.487-.502-.67-.51-.174-.008-.373-.01-.572-.01a1.1 1.1 0 0 0-.796.373c-.273.298-1.042 1.018-1.042 2.483s1.067 2.88 1.216 3.078c.15.198 2.1 3.204 5.086 4.494.71.307 1.264.49 1.696.626.712.226 1.36.194 1.872.118.571-.085 1.762-.72 2.01-1.415.248-.696.248-1.29.174-1.415-.075-.124-.273-.198-.571-.348z" />
      </svg>
    </a>
  )
}

// Scroll to the top on each new page, or to #section links.
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

function App() {
  const { i18n } = useTranslation()
  useEffect(() => {
    document.documentElement.lang = i18n.language.startsWith('fr') ? 'fr' : 'en'
  }, [i18n.language])

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollManager />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/schools/:code" element={<SchoolOverview />} />
          <Route path="/schools/:code/programmes" element={<SchoolPrograms />} />
          <Route path="/admissions" element={<Admissions />} />
          {/* Old addresses: these services now live in the Kazek portal. */}
          <Route path="/apply" element={<PortalRedirect to={LINKS.apply} />} />
          <Route path="/student-login" element={<PortalRedirect to={LINKS.portal} />} />
          <Route path="/admin-login" element={<PortalRedirect to={LINKS.portal} />} />
          <Route path="/admin" element={<PortalRedirect to={LINKS.portal} />} />
          <Route path="/results" element={<PortalRedirect to={LINKS.portal} />} />
          <Route path="/recordings" element={<PortalRedirect to={LINKS.portal} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App

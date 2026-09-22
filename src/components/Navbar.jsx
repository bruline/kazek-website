import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import kazekLogo from '../assets/kazek-logo.png'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()

  function toggleLanguage() {
    const newLang = i18n.language === 'en' ? 'fr' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <nav className="bg-brand-black sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <img src={kazekLogo} alt="Kazek University" className="h-12 w-auto" />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-9 items-center">
          <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white">{t('nav.home')}</Link>
          <Link to="/schools" className="text-sm font-medium text-gray-300 hover:text-white">{t('nav.schools')}</Link>
          <Link to="/admissions" className="text-sm font-medium text-gray-300 hover:text-white">{t('nav.admissions')}</Link>
          <Link to="/student-login" className="text-sm font-medium text-gray-300 hover:text-white">
            {t('nav.studentLogin', 'Student Login')}
          </Link>
          <Link to="/admin-login" className="text-sm font-medium text-gray-300 hover:text-white">
            {t('nav.adminLogin', 'Admin Login')}
          </Link>
          <button
            onClick={toggleLanguage}
            className="border border-white/20 rounded-md px-3 py-1.5 text-xs text-gray-300 hover:border-brand-blue hover:text-white"
          >
            {i18n.language === 'en' ? 'FR' : 'EN'}
          </button>
          <Link
            to="/apply"
            className="bg-brand-red text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:opacity-90"
          >
            {t('nav.apply')}
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggleLanguage} className="border border-white/20 rounded-md px-2 py-1 text-xs text-gray-300">
            {i18n.language === 'en' ? 'FR' : 'EN'}
          </button>
          <button className="text-white" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <span className="text-2xl">✕</span> : <span className="text-2xl">☰</span>}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-1 px-6 pb-4">
          <Link to="/" className="py-2 text-gray-300" onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/schools" className="py-2 text-gray-300" onClick={() => setMenuOpen(false)}>{t('nav.schools')}</Link>
          <Link to="/admissions" className="py-2 text-gray-300" onClick={() => setMenuOpen(false)}>{t('nav.admissions')}</Link>
          <Link to="/student-login" className="py-2 text-gray-300" onClick={() => setMenuOpen(false)}>
            {t('nav.studentLogin', 'Student Login')}
          </Link>
          <Link to="/admin-login" className="py-2 text-gray-300" onClick={() => setMenuOpen(false)}>
            {t('nav.adminLogin', 'Admin Login')}
          </Link>
          <Link
            to="/apply"
            className="bg-brand-red text-white px-4 py-2 rounded-md text-center mt-2 font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            {t('nav.apply')}
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import kazekLogo from '../assets/kazek-logo.png'
import { CONTACT, LINKS } from '../config'
import { usePortalData } from '../lib/portal'
import Icon from './Icon'

function TopBar() {
  const { t, i18n } = useTranslation()
  return (
    <div className="bg-navy-950 text-white/90 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="hidden md:flex items-center gap-5">
          <span className="flex items-center gap-1.5"><Icon name="pin" className="w-4 h-4" />{CONTACT.address}</span>
          <span className="text-white/30">|</span>
          <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-1.5 hover:text-white"><Icon name="mail" className="w-4 h-4" />{CONTACT.email}</a>
          <span className="text-white/30">|</span>
          <a href={CONTACT.phoneHref} className="flex items-center gap-1.5 hover:text-white"><Icon name="phone" className="w-4 h-4" />(+237) {CONTACT.phone}</a>
        </div>
        <a href={CONTACT.phoneHref} className="md:hidden flex items-center gap-1.5"><Icon name="phone" className="w-4 h-4" />(+237) {CONTACT.phone}</a>
        <label className="flex items-center gap-2">
          <span className="sr-only">{t('top.language')}</span>
          <Icon name="globe" className="w-4 h-4" />
          <select
            value={i18n.language.startsWith('fr') ? 'fr' : 'en'}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="bg-navy-900 border border-white/25 rounded px-2 py-0.5 text-white text-sm"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </label>
      </div>
    </div>
  )
}

function AnnouncementBar() {
  const { t } = useTranslation()
  const { data } = usePortalData('admissions')
  const open = data?.open && data.current_period
  return (
    <div className="bg-gradient-to-r from-brand-700 to-brand-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-display font-semibold text-base sm:text-lg tracking-wide">
          {open ? t('announce.open', { year: data.current_period.academic_year }) : t('announce.default')}
        </p>
        <a href={LINKS.apply} className="flex items-center gap-2 bg-white text-brand-700 rounded-full px-4 py-1.5 text-sm font-bold hover:bg-brand-50">
          {t('announce.cta')} <Icon name="arrow" className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}

const navLinkClass = ({ isActive }) =>
  `text-[1.05rem] ${isActive ? 'text-brand-700 font-bold' : 'text-slate-700 hover:text-brand-700'}`

export default function Header() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const close = () => setOpen(false)

  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/schools', label: t('nav.schools') },
    { to: '/admissions', label: t('nav.admissions') },
    { to: '/#campus-life', label: t('nav.campus'), anchor: true },
    { to: '#contact', label: t('nav.contact'), anchor: true },
  ]

  return (
    <>
      <TopBar />
      <AnnouncementBar />
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-6">
          <Link to="/" onClick={close} className="shrink-0">
            <img src={kazekLogo} alt="Kazek University" className="h-12 sm:h-14 w-auto" />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) =>
              link.anchor ? (
                <a key={link.label} href={link.to} className="text-[1.05rem] text-slate-700 hover:text-brand-700">{link.label}</a>
              ) : (
                <NavLink key={link.label} to={link.to} end={link.end} className={navLinkClass}>{link.label}</NavLink>
              )
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a href={LINKS.apply} className="flex items-center gap-2 bg-brand-700 text-white px-5 py-3 rounded-lg font-bold hover:bg-brand-600">
              <Icon name="cap" /> {t('nav.apply')}
            </a>
            <a href={LINKS.portal} className="flex items-center gap-2 border border-slate-300 text-slate-700 px-5 py-3 rounded-lg hover:border-brand-700 hover:text-brand-700">
              <Icon name="login" /> {t('nav.portal')}
            </a>
          </div>

          <button className="lg:hidden text-slate-800" onClick={() => setOpen(!open)} aria-label={t('nav.menu')} aria-expanded={open}>
            <Icon name={open ? 'close' : 'menu'} className="w-7 h-7" />
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-slate-200 px-4 pb-5 pt-2 flex flex-col gap-1">
            {links.map((link) =>
              link.anchor ? (
                <a key={link.label} href={link.to} onClick={close} className="py-2.5 text-slate-700">{link.label}</a>
              ) : (
                <NavLink key={link.label} to={link.to} end={link.end} onClick={close} className={({ isActive }) => `py-2.5 ${isActive ? 'text-brand-700 font-bold' : 'text-slate-700'}`}>{link.label}</NavLink>
              )
            )}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <a href={LINKS.apply} className="bg-brand-700 text-white text-center py-3 rounded-lg font-bold">{t('nav.apply')}</a>
              <a href={LINKS.portal} className="border border-slate-300 text-center py-3 rounded-lg text-slate-700">{t('nav.portal')}</a>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

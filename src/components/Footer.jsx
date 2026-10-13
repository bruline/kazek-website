import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import kazekLogo from '../assets/kazek-logo.png'
import { CONTACT, LINKS } from '../config'
import { usePortalData, pick } from '../lib/portal'
import Icon from './Icon'

function FooterLink({ to, href, children }) {
  const inner = (
    <span className="flex items-start gap-2 hover:text-white">
      <Icon name="chevron" className="w-4 h-4 mt-1 shrink-0" />
      <span>{children}</span>
    </span>
  )
  return <li>{to ? <Link to={to}>{inner}</Link> : <a href={href}>{inner}</a>}</li>
}

export default function Footer() {
  const { t, i18n } = useTranslation()
  const isFr = i18n.language.startsWith('fr')
  const { data } = usePortalData('programmes')
  const schools = data?.schools ?? []

  return (
    <footer id="contact" className="bg-navy-950 text-white/75 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-white rounded-lg p-1.5"><img src={kazekLogo} alt="" className="h-10 w-auto" /></span>
            <span className="font-display font-bold text-2xl text-white">Kazek University</span>
          </div>
          <p className="leading-relaxed mb-5">{t('footer.about')}</p>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2"><Icon name="pin" className="w-4 h-4" />{CONTACT.address}</li>
            <li><a href={CONTACT.phoneHref} className="flex items-center gap-2 hover:text-white"><Icon name="phone" className="w-4 h-4" />(+237) {CONTACT.phone}</a></li>
            <li><a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-white"><Icon name="mail" className="w-4 h-4" />{CONTACT.email}</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-bold text-xl text-white pb-3 mb-4 border-b border-white/10">{t('footer.studies')}</h3>
          <ul className="space-y-2.5">
            {schools.map((school) => (
              <FooterLink key={school.code} to={`/schools/${school.code}`}>{pick(isFr, school.name, school.name_fr)}</FooterLink>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display font-bold text-xl text-white pb-3 mb-4 border-b border-white/10">{t('footer.useful')}</h3>
          <ul className="space-y-2.5">
            <FooterLink to="/admissions">{t('nav.admissions')}</FooterLink>
            <FooterLink href={LINKS.apply}>{t('nav.apply')}</FooterLink>
            <FooterLink href={LINKS.portal}>{t('nav.portal')}</FooterLink>
            <FooterLink to="/schools">{t('nav.schools')}</FooterLink>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-bold text-xl text-white pb-3 mb-4 border-b border-white/10">{t('footer.stay')}</h3>
          <p className="mb-5">{t('footer.stayBody')}</p>
          <div className="flex flex-col gap-3">
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-accent-green text-white rounded-lg py-3 font-bold hover:opacity-90">
              {t('footer.whatsapp')}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="flex items-center justify-center gap-2 border border-white/25 text-white rounded-lg py-3 hover:bg-white/10">
              <Icon name="mail" className="w-4 h-4" /> {t('footer.email')}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row justify-between gap-2 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Kazek University Institute of Technology and Management. {t('footer.rights')}</p>
          <p>{t('footer.authorization')}</p>
        </div>
      </div>
    </footer>
  )
}

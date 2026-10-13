import { useTranslation } from 'react-i18next'
import campusBuilding from '../assets/campus-building.jpg'
import Icon from '../components/Icon'
import { PageHero } from '../components/Section'
import { LINKS } from '../config'
import { usePortalData } from '../lib/portal'

function AdmissionStatus() {
  const { t, i18n } = useTranslation()
  const { data } = usePortalData('admissions')
  if (!data) return null
  const format = (iso) => new Date(iso).toLocaleDateString(i18n.language.startsWith('fr') ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  let text = t('admissions.closed')
  let tone = 'bg-amber-50 text-amber-900 border-amber-200'
  if (data.open && data.current_period) {
    text = t('admissions.openNow', { year: data.current_period.academic_year, date: format(data.current_period.closes_on) })
    tone = 'bg-green-50 text-green-900 border-green-200'
  } else if (data.next_period) {
    text = t('admissions.nextPeriod', { year: data.next_period.academic_year, date: format(data.next_period.opens_on) })
  }
  return <p className={`mb-12 rounded-xl border px-6 py-4 text-lg font-bold ${tone}`}>{text}</p>
}

export default function Admissions() {
  const { t } = useTranslation()
  const steps = [1, 2, 3, 4, 5].map((n) => ({ title: t(`admissions.step${n}Title`), body: t(`admissions.step${n}Body`) }))

  return (
    <>
      <PageHero kicker={t('admissions.kicker')} title={t('admissions.title')} intro={t('admissions.intro')} background={campusBuilding} />
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <AdmissionStatus />
          <ol className="space-y-6">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
                <span className="font-display font-bold text-4xl text-brand-100 w-14 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="font-display font-bold text-2xl text-navy-950">{step.title}</h2>
                  <p className="text-slate-600 text-lg mt-1">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-14">
            <p className="kicker">{t('admissions.kicker')}</p>
            <h2 className="font-display font-bold text-4xl text-navy-950 mt-2 mb-6">{t('admissions.requirementsTitle')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {['straight', 'topup'].map((key) => (
                <div key={key} className="rounded-2xl border border-slate-200 p-6">
                  <span className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4"><Icon name="edit" className="w-6 h-6" /></span>
                  <h3 className="font-display font-bold text-xl text-navy-950">{t(`admissions.${key}Title`)}</h3>
                  <p className="text-slate-600 mt-2">{t(`admissions.${key}Body`)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 text-center">
            <a href={LINKS.apply} className="inline-flex items-center gap-2 bg-accent-orange text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90">
              <Icon name="cap" /> {t('admissions.cta')}
            </a>
            <p className="mt-5">
              <a href={LINKS.portal} className="text-brand-700 underline">{t('admissions.portalCta')}</a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

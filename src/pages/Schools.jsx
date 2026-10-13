import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import campusBuilding from '../assets/campus-building.jpg'
import Icon from '../components/Icon'
import { PageHero } from '../components/Section'
import { awardShort, usePortalData, pick } from '../lib/portal'

export default function Schools() {
  const { t, i18n } = useTranslation()
  const isFr = i18n.language.startsWith('fr')
  const { data } = usePortalData('programmes')
  const schools = data?.schools ?? []

  return (
    <>
      <PageHero kicker={t('schools.kicker')} title={t('schools.title')} intro={t('schools.intro')} background={campusBuilding} />
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-6">
          {schools.map((school, i) => {
            const awards = [...new Set(school.programmes.map((p) => awardShort(p.award, isFr)))]
            return (
              <Link key={school.code} to={`/schools/${school.code}`}
                className="group flex gap-6 rounded-2xl border border-slate-200 bg-white p-8 hover:border-brand-700 hover:shadow-lg transition">
                <span className="font-display font-bold text-5xl text-brand-100 group-hover:text-brand-700/25">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="font-display font-bold text-xl text-brand-700">{school.code}</p>
                  <h2 className="font-display font-bold text-2xl text-navy-950 leading-tight">{pick(isFr, school.name, school.name_fr)}</h2>
                  <p className="mt-3 text-slate-500">{t('home.programmeCount', { count: school.programmes.length })} · {awards.join(' · ')}</p>
                  <p className="mt-4 inline-flex items-center gap-2 text-brand-700 font-bold">
                    {t('schools.viewProgrammes')} <Icon name="arrow" className="w-4 h-4" />
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}

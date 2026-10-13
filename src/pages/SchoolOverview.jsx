import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Icon from '../components/Icon'
import Photo from '../components/Photo'
import { SectionHeading } from '../components/Section'
import { LINKS } from '../config'
import { SCHOOL_PROFILES } from '../data/schoolProfiles'
import { awardShort, pick, usePortalData } from '../lib/portal'
import NotFound from './NotFound'

const WHY_ICONS = ['star', 'cap', 'globe', 'users']

export default function SchoolOverview() {
  const { code } = useParams()
  const { t, i18n } = useTranslation()
  const isFr = i18n.language.startsWith('fr')
  const { data } = usePortalData('programmes')

  const school = data?.schools?.find((s) => s.code === code)
  const profile = SCHOOL_PROFILES[code]
  if (!school || !profile) return <NotFound />
  const text = isFr ? profile.fr : profile.en
  const name = pick(isFr, school.name, school.name_fr)

  // Facts worked out from the portal's programme list.
  const awards = [...new Set(school.programmes.map((p) => awardShort(p.award, isFr)))]
  const durations = school.programmes.map((p) => p.duration_years)
  const minYears = Math.min(...durations)
  const maxYears = Math.max(...durations)
  const modes = [...new Map(school.programmes.flatMap((p) => p.study_modes).map((m) => [m.code, pick(isFr, m.name, m.name_fr)])).values()]
  const specialisations = [...new Set(school.programmes.map((p) => pick(isFr, p.name, p.name_fr)))].sort((a, b) => a.localeCompare(b))
  const programmesUrl = `/schools/${school.code}/programmes`

  const facts = [
    { value: specialisations.length, label: t('overview.factSpecialisations') },
    { value: awards.join(' · '), label: t('overview.factAwards') },
    { value: minYears === maxYears ? t('schools.years', { count: minYears }) : `${minYears}–${t('schools.years', { count: maxYears })}`, label: t('overview.factDuration') },
    { value: modes.length, label: t('overview.factModes') },
  ]

  return (
    <>
      {/* Cover */}
      <section className="relative overflow-hidden text-white">
        <Photo photo={profile.hero} alt="" eager showCredit creditClass="absolute bottom-2 right-3 z-10" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-700/95 via-brand-700/80 to-brand-700/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <Link to="/schools" className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-8">
            <span className="rotate-180"><Icon name="arrow" className="w-4 h-4" /></span> {t('schools.back')}
          </Link>
          <p className="kicker !text-blue-200">{school.code} · {awards.join(' · ')}</p>
          <h1 className="font-display font-bold text-4xl md:text-6xl mt-3 max-w-4xl leading-[1.05]">{name}</h1>
          <p className="mt-5 text-xl md:text-2xl text-blue-50/90 max-w-3xl leading-relaxed">{text.tagline}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to={programmesUrl} className="flex items-center gap-2 bg-accent-orange px-7 py-4 rounded-xl font-bold text-lg shadow-lg hover:opacity-90">
              {t('overview.viewProgrammes')} <Icon name="arrow" />
            </Link>
            <a href={LINKS.apply} className="flex items-center gap-2 border border-white/40 px-7 py-4 rounded-xl text-lg hover:bg-white/10">
              <Icon name="cap" /> {t('nav.apply')}
            </a>
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section className="bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {facts.map((f) => (
            <div key={f.label}>
              <p className="font-display font-bold text-3xl md:text-4xl">{f.value}</p>
              <p className="mt-1 text-blue-200 uppercase tracking-wider text-xs md:text-sm">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[3fr_2fr] gap-12 items-center">
          <div>
            <p className="kicker">{t('overview.aboutKicker')}</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-navy-950 mt-2">{t('overview.aboutTitle')}</h2>
            <div className="mt-6 space-y-5 text-lg leading-[1.9] text-slate-700">
              {text.intro.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
            </div>
          </div>
          <figure className="rounded-[2rem] bg-slate-100 p-3">
            <div className="relative">
              <Photo photo={profile.side} alt={name} showCredit creditClass="absolute bottom-3 left-4"
                className="w-full aspect-[4/5] object-cover rounded-[1.6rem]" />
            </div>
          </figure>
        </div>
      </section>

      {/* Why study here */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading kicker={t('overview.whyKicker')} title={t('overview.whyTitle')} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {text.why.map((item, i) => (
              <div key={item.title} className="rounded-2xl bg-white border border-slate-200 p-7">
                <span className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Icon name={WHY_ICONS[i % WHY_ICONS.length]} className="w-7 h-7" />
                </span>
                <h3 className="font-display font-bold text-xl text-navy-950 mt-5">{item.title}</h3>
                <p className="text-slate-600 mt-2 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialisations */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading kicker={t('overview.specKicker')} title={t('overview.specTitle')}
            subtitle={t('overview.specSubtitle', { awards: awards.join(', ') })} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialisations.map((spec, i) => (
              <div key={spec} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/70 px-5 py-4">
                <span className="font-display font-bold text-2xl text-brand-100 w-10">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-display font-bold text-lg text-navy-950">{spec}</span>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link to={programmesUrl} className="inline-flex items-center gap-2 bg-brand-700 text-white px-7 py-4 rounded-xl font-bold text-lg hover:bg-brand-600">
              {t('overview.viewProgrammes')} <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* Careers */}
      <section className="bg-navy-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading kicker={t('overview.careersKicker')} title={t('overview.careersTitle')} light />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {text.careers.map((career) => (
              <div key={career} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-5 py-4">
                <Icon name="chevron" className="w-5 h-5 text-accent-gold shrink-0" />
                <span className="text-lg">{career}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-5">
          {profile.gallery.map((photo) => (
            <figure key={photo.src} className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100">
              <Photo photo={photo} alt="" showCredit creditClass="absolute bottom-2 left-3" className="w-full h-full object-cover" />
            </figure>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-brand-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h2 className="font-display font-bold text-4xl md:text-5xl">{t('overview.ctaTitle')}</h2>
          <p className="mt-3 text-lg text-blue-100">{t('overview.ctaBody')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to={programmesUrl} className="bg-white text-brand-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-50">
              {t('overview.viewProgrammes')}
            </Link>
            <a href={LINKS.apply} className="bg-white/15 border border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/25">
              {t('nav.apply')}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

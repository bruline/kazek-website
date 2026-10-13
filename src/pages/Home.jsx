import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import campusBuilding from '../assets/campus-building.jpg'
import campusClassroom from '../assets/campus-classroom.jpg'
import schoolHealth from '../assets/school-health.jpg'
import schoolHospitality from '../assets/school-hospitality.jpg'
import schoolEducation from '../assets/school-education.jpg'
import schoolVocational from '../assets/school-vocational.jpg'
import president from '../assets/president.jpg'
import eventDefense from '../assets/event-defense.jpg'
import eventYouthDay from '../assets/event-youth-day.jpg'
import eventFreshmen from '../assets/event-freshmen.jpg'
import eventCulturalDay from '../assets/event-cultural-day.jpg'
import eventVolunteerDay from '../assets/event-volunteer-day.jpg'
import logoMinesup from '../assets/logo-minesup.png'
import logoDouala from '../assets/logo-university-of-douala.png'
import Icon from '../components/Icon'
import { SectionHeading } from '../components/Section'
import { LINKS } from '../config'
import { awardShort, usePortalData, pick } from '../lib/portal'

const slides = [
  { src: campusBuilding, key: 'slide1' },
  { src: campusClassroom, key: 'slide2' },
  { src: schoolHealth, key: 'slide3' },
  { src: schoolHospitality, key: 'slide4' },
  { src: schoolEducation, key: 'slide5' },
  { src: schoolVocational, key: 'slide6' },
]

const events = [
  { src: eventDefense, key: 'event1', badge: 'bg-accent-gold text-navy-950' },
  { src: eventFreshmen, key: 'event3', badge: 'bg-brand-700 text-white' },
  { src: eventCulturalDay, key: 'event4', badge: 'bg-accent-green text-white' },
  { src: eventYouthDay, key: 'event2', badge: 'bg-accent-orange text-white' },
  { src: eventVolunteerDay, key: 'event5', badge: 'bg-brand-500 text-white' },
]

function HeroSlideshow() {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500)
    return () => clearInterval(timer)
  }, [])
  return (
    <div className="rounded-3xl bg-white/10 border border-white/20 p-3 backdrop-blur-sm shadow-2xl">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
        {slides.map((slide, i) => (
          <img key={slide.src} src={slide.src} alt={t(`home.${slide.key}`)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`} />
        ))}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-end justify-between">
          <p className="text-white text-sm">{t(`home.${slides[index].key}`)}</p>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setIndex(i)} aria-label={`Slide ${i + 1}`}
                className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  const { t } = useTranslation()
  return (
    <section className="relative overflow-hidden text-white">
      <img src={campusBuilding} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-brand-700/85" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
        <div>
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="flex items-center gap-2 rounded-full border border-accent-gold/70 bg-navy-950/30 px-4 py-2 text-sm font-bold text-accent-gold">
              <Icon name="trophy" className="w-4 h-4" /> {t('home.badgeAuthorized')}
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm">
              <Icon name="shield" className="w-4 h-4" /> {t('home.badgeMentored')}
            </span>
          </div>
          <p className="uppercase tracking-[0.12em] text-blue-100 text-lg">{t('home.kicker')}</p>
          <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1.05] mt-3">{t('home.heroTitle')}</h1>
          <p className="mt-6 text-xl md:text-2xl text-blue-50/90 leading-relaxed max-w-2xl">{t('home.heroSubtitle')}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={LINKS.apply} className="flex items-center gap-2 bg-accent-orange px-7 py-4 rounded-xl font-bold text-lg shadow-lg hover:opacity-90">
              <Icon name="cap" /> {t('home.applyNow')}
            </a>
            <Link to="/schools" className="bg-accent-green px-7 py-4 rounded-xl font-bold text-lg shadow-lg hover:opacity-90">
              {t('home.explore')}
            </Link>
            <a href="#contact" className="border border-white/40 px-7 py-4 rounded-xl text-lg hover:bg-white/10">
              {t('home.contactUs')}
            </a>
          </div>
        </div>
        <HeroSlideshow />
      </div>
    </section>
  )
}

function FeatureCards() {
  const { t } = useTranslation()
  const items = [
    { icon: 'star', title: t('home.feature1Title'), body: t('home.feature1Body'), href: '#president' },
    { icon: 'cap', title: t('home.feature2Title'), body: t('home.feature2Body'), to: '/schools' },
    { icon: 'edit', title: t('home.feature3Title'), body: t('home.feature3Body'), to: '/admissions' },
  ]
  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 md:divide-x divide-slate-200">
        {items.map((item) => {
          const content = (
            <div className="flex gap-5 p-8 h-full hover:bg-slate-50 transition">
              <span className="w-16 h-16 shrink-0 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
                <Icon name={item.icon} className="w-8 h-8" />
              </span>
              <div>
                <h3 className="font-display font-bold text-2xl text-navy-950">{item.title}</h3>
                <p className="mt-2 text-slate-600 text-lg leading-relaxed">{item.body}</p>
              </div>
            </div>
          )
          return item.to ? <Link key={item.title} to={item.to}>{content}</Link> : <a key={item.title} href={item.href}>{content}</a>
        })}
      </div>
    </section>
  )
}

function Stats() {
  const { t } = useTranslation()
  const { data } = usePortalData('programmes')
  const schools = data?.schools ?? []
  const programmes = schools.reduce((n, s) => n + s.programmes.length, 0)
  const stats = [
    { value: schools.length, label: t('home.statsSchools') },
    { value: programmes, label: t('home.statsProgrammes') },
    { value: 4, label: t('home.statsModes') },
    { value: 2, label: t('home.statsLanguages') },
  ]
  return (
    <section className="bg-navy-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-display font-bold text-5xl md:text-6xl text-white">{s.value}</p>
            <p className="mt-1 text-blue-200 uppercase tracking-wider text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function PresidentMessage() {
  const { t } = useTranslation()
  return (
    <section id="president" className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[2fr_3fr] gap-12 items-start">
        <div className="max-w-md mx-auto lg:mx-0 w-full">
          <div className="rounded-[2rem] bg-slate-200/70 p-3">
            <img src={president} alt={t('home.presidentName')} style={{ objectPosition: '45% 20%' }}
              className="w-full aspect-[4/5] object-cover rounded-[1.6rem]" />
          </div>
        </div>
        <div>
          <p className="kicker">{t('home.presidentKicker')}</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-navy-950 mt-2">{t('home.presidentTitle')}</h2>
          <div className="relative mt-8 pl-10">
            <Icon name="quote" className="absolute left-0 top-0 w-8 h-8 text-brand-100" strokeWidth={3} />
            <div className="space-y-5 text-lg leading-[1.9] text-slate-700">
              <p>{t('home.presidentP1')}</p>
              <p>{t('home.presidentP2')}</p>
              <p>{t('home.presidentP3')}</p>
            </div>
            <p className="font-display font-bold text-2xl text-navy-950 mt-8">{t('home.presidentName')}</p>
            <p className="text-brand-700">{t('home.presidentRole')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function SchoolCards() {
  const { t, i18n } = useTranslation()
  const isFr = i18n.language.startsWith('fr')
  const { data } = usePortalData('programmes')
  const schools = data?.schools ?? []
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading kicker={t('home.schoolsKicker')} title={t('home.schoolsTitle')} subtitle={t('home.schoolsSubtitle')}
          linkTo="/schools" linkLabel={t('home.allProgrammes')} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school, i) => {
            const awards = [...new Set(school.programmes.map((p) => awardShort(p.award, isFr)))]
            return (
              <Link key={school.code} to={`/schools/${school.code}`}
                className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-8 hover:border-brand-700 hover:bg-white hover:shadow-lg transition">
                <p className="font-display font-bold text-5xl text-brand-100 group-hover:text-brand-700/20">{String(i + 1).padStart(2, '0')}</p>
                <p className="font-display font-bold text-2xl text-brand-700 mt-3">{school.code}</p>
                <h3 className="text-lg text-slate-700 mt-1 leading-snug">{pick(isFr, school.name, school.name_fr)}</h3>
                <p className="mt-4 text-sm text-slate-500">{t('home.programmeCount', { count: school.programmes.length })} · {awards.join(' · ')}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CampusLife() {
  const { t } = useTranslation()
  return (
    <section id="campus-life" className="bg-slate-50 py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading kicker={t('home.campusKicker')} title={t('home.campusTitle')} subtitle={t('home.campusSubtitle')} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {events.map((event) => (
            <article key={event.key} className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg transition">
              <div className="relative aspect-[16/10]">
                <img src={event.src} alt={t(`home.${event.key}Title`)} className="w-full h-full object-cover" loading="lazy" />
                <span className={`absolute top-4 left-4 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${event.badge}`}>
                  {t(`home.${event.key}Tag`)}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-xl text-navy-950">{t(`home.${event.key}Title`)}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function JoinBand() {
  const { t } = useTranslation()
  return (
    <section className="relative overflow-hidden text-white">
      <img src={campusClassroom} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-brand-700/85" />
      <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="kicker !text-blue-200">{t('home.ctaKicker')}</p>
        <h2 className="font-display font-bold text-4xl md:text-5xl mt-3">{t('home.ctaTitle')}</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href={LINKS.apply} className="flex items-center gap-2 bg-white text-brand-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-50">
            <Icon name="cap" /> {t('nav.apply')}
          </a>
          <a href="#contact" className="bg-white/15 border border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/25">
            {t('home.contactUs')}
          </a>
        </div>
      </div>
    </section>
  )
}

function Partners() {
  const { t } = useTranslation()
  const partners = [
    { src: logoDouala, name: 'University of Douala' },
    { src: logoMinesup, name: 'MINESUP' },
  ]
  return (
    <section className="bg-white py-14">
      <p className="text-center uppercase tracking-[0.2em] text-slate-500 font-bold text-sm">{t('home.partnersTitle')}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-14">
        {partners.map((p) => (
          <img key={p.name} src={p.src} alt={p.name} title={p.name}
            className="h-20 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition" />
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureCards />
      <Stats />
      <PresidentMessage />
      <SchoolCards />
      <CampusLife />
      <JoinBand />
      <Partners />
    </>
  )
}

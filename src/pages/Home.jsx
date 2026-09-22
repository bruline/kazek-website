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

const slides = [
  { src: campusBuilding, caption: 'Our campus at Mile 2, Limbe' },
  { src: campusClassroom, caption: 'Students in class' },
  { src: schoolHealth, caption: 'School of Health and Biomedical Science' },
  { src: schoolHospitality, caption: 'School of Hospitality' },
  { src: schoolEducation, caption: 'School of Education' },
  { src: schoolVocational, caption: 'Center for Vocational Studies' },
]

function HeroSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden border border-white/10">
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.caption}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <p className="text-white text-sm font-medium">{slides[index].caption}</p>
      </div>
      <div className="absolute top-3 right-3 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            className={`w-2 h-2 rounded-full ${i === index ? 'bg-brand-blue' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  )
}

const events = [
  { src: eventDefense, titleKey: 'home.event1Title', fallback: '2025 MBA & Bachelor Defense' },
  { src: eventYouthDay, titleKey: 'home.event2Title', fallback: 'Youth Day' },
  { src: eventFreshmen, titleKey: 'home.event3Title', fallback: 'Welcome Freshmen' },
  { src: eventCulturalDay, titleKey: 'home.event4Title', fallback: 'Cultural Day' },
  { src: eventVolunteerDay, titleKey: 'home.event5Title', fallback: 'Volunteerism Day' },
]

const partners = [
  { src: logoDouala, name: 'University of Douala' },
  { src: logoMinesup, name: 'MINESUP' },
]

function Home() {
  const { t } = useTranslation()

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-black relative overflow-hidden">
        <svg
          width="520" height="520" viewBox="0 0 520 520"
          className="absolute -top-40 -right-40 opacity-100 pointer-events-none"
        >
          <circle cx="260" cy="260" r="259" fill="none" stroke="#1DA1E8" strokeWidth="1" opacity="0.35" />
          <circle cx="260" cy="260" r="220" fill="none" stroke="#1DA1E8" strokeWidth="1" opacity="0.2" />
        </svg>

        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-brand-blue text-xs font-semibold tracking-widest uppercase mb-4">
              Limbe, Cameroon · Kazek Tech
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-6">
              {t('home.heroTitle')}
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/apply"
                className="bg-brand-red text-white px-8 py-4 rounded-md font-semibold hover:opacity-90"
              >
                {t('home.applyNow')}
              </Link>
              <Link
                to="/schools"
                className="text-brand-blue font-semibold text-sm border-b border-brand-blue pb-0.5 hover:opacity-80"
              >
                {t('home.viewAllSchools')} →
              </Link>
            </div>
          </div>

          <HeroSlideshow />
        </div>
      </section>

      {/* Accreditation strip */}
      <section className="bg-brand-blue py-4 px-6 text-center text-sm font-medium text-brand-black">
        {t('home.accreditation')}
      </section>

      {/* Why Kazek */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8 text-center">
        <div>
          <h3 className="font-display font-semibold text-lg text-gray-800 mb-2">{t('home.why1Title')}</h3>
          <p className="text-gray-600 text-sm">{t('home.why1Body')}</p>
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg text-gray-800 mb-2">{t('home.why2Title')}</h3>
          <p className="text-gray-600 text-sm">{t('home.why2Body')}</p>
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg text-gray-800 mb-2">{t('home.why3Title')}</h3>
          <p className="text-gray-600 text-sm">{t('home.why3Body')}</p>
        </div>
      </section>

      {/* Message from the President */}
      <section className="bg-brand-black py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-10 items-start">
          <div className="md:col-span-2">
            <img
              src={president}
              alt="Pr. Njomo Louis Mosake"
              style={{ objectPosition: '45% 20%' }}
              className="w-full aspect-[4/5] object-cover rounded-xl border border-white/10"
            />
          </div>
          <div className="md:col-span-3">
            <p className="text-brand-blue text-xs font-semibold tracking-widest uppercase mb-3">
              {t('home.presidentLabel', 'Message from the President')}
            </p>
            <div className="text-gray-300 leading-relaxed space-y-4 mb-6">
              <p>
                {t(
                  'home.presidentP1',
                  'Welcome to the website of the Kazek University Institute of Technology and Management, a special place nestled in the seaside city of Limbe. At Kazek you will have the opportunity to study alongside world-class professors and at the same time enjoy the fabulous natural position of the city, situated between the rainforest-swathed foothills of Mt Cameroon and the dramatic Atlantic coastline. Whether you are pursuing a certificate, Diploma, Bachelor or Master degree, we invite you to be part of our distinctive community.'
                )}
              </p>
              <p>
                {t(
                  'home.presidentP2',
                  'We invite you to take a look around our new website to get to know about Kazek University. As you explore our website you will discover that we believe in developing you for lifelong learning and a career that is purpose-driven and meaningful. You will find a wealth of information about our programs, certifications, student services, facilities and activities.'
                )}
              </p>
              <p>
                {t(
                  'home.presidentP3',
                  'We hope you will find our website not only informative but also easy to navigate.'
                )}
              </p>
              <p>
                {t(
                  'home.presidentP4',
                  'We invite you to visit our campus and meet us in person. We welcome the chance to share with you how becoming a member of the Kazek learning community can help you prepare for all your future endeavors.'
                )}
              </p>
            </div>
            <p className="font-display font-semibold text-white">
              {t('home.presidentName', 'Pr. Njomo Louis Mosake')}
            </p>
            <p className="text-gray-400 text-sm">
              {t('home.presidentRole', 'President, Kazek University')}
            </p>
          </div>
        </div>
      </section>

      {/* Campus Life */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-brand-blue text-xs font-semibold tracking-widest uppercase mb-3">
              {t('home.campusLabel', 'Campus Life')}
            </p>
            <h2 className="font-display text-2xl font-bold text-gray-800">
              {t('home.campusTitle', 'Life at Kazek')}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
            {events.map((event) => (
              <div key={event.titleKey} className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                <img
                  src={event.src}
                  alt={t(event.titleKey, event.fallback)}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-display font-semibold text-sm text-gray-800">
                    {t(event.titleKey, event.fallback)}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner logos */}
      <section className="bg-gray-50 py-14 px-6 border-t border-gray-200">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-brand-blue text-xs font-semibold tracking-widest uppercase mb-8">
            {t('home.partnersLabel', 'Mentored & Accredited By')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {partners.map((partner) => (
              <img
                key={partner.name}
                src={partner.src}
                alt={partner.name}
                className="h-20 w-20 object-contain rounded-full bg-white border border-gray-200 shadow-sm p-1"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Schools preview */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-4">{t('home.schoolsPreviewTitle')}</h2>
          <p className="text-gray-600 mb-8">{t('home.schoolsPreviewBody')}</p>
          <Link
            to="/schools"
            className="inline-block bg-brand-black text-white px-6 py-3 rounded-md hover:opacity-90 font-medium"
          >
            {t('home.viewAllSchools')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
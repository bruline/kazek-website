import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import campusBuilding from '../assets/campus-building.jpg'
import campusClassroom from '../assets/campus-classroom.jpg'
import schoolHealth from '../assets/school-health.jpg'
import schoolHospitality from '../assets/school-hospitality.jpg'
import schoolEducation from '../assets/school-education.jpg'
import schoolVocational from '../assets/school-vocational.jpg'

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
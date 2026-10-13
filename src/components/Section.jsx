import { Link } from 'react-router-dom'
import Icon from './Icon'

// Section heading in the reference style: small blue label, big title,
// subtitle, and an optional "see all" button on the right.
export function SectionHeading({ kicker, title, subtitle, linkTo, linkLabel, light = false }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
      <div>
        <p className={`kicker ${light ? '!text-blue-200' : ''}`}>{kicker}</p>
        <h2 className={`font-display font-bold text-4xl md:text-5xl mt-2 ${light ? 'text-white' : 'text-navy-950'}`}>{title}</h2>
        {subtitle && <p className={`mt-3 text-lg ${light ? 'text-blue-100' : 'text-slate-600'}`}>{subtitle}</p>}
      </div>
      {linkTo && (
        <Link to={linkTo} className="self-start md:self-auto flex items-center gap-2 border border-slate-200 bg-white rounded-lg px-5 py-3 text-slate-700 hover:border-brand-700 hover:text-brand-700 shrink-0">
          {linkLabel} <Icon name="arrow" className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}

// Blue banner at the top of inner pages (Schools, Admissions...).
export function PageHero({ kicker, title, intro, background }) {
  return (
    <section className="relative bg-brand-700 text-white overflow-hidden">
      {background && <img src={background} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-700/95 to-brand-700/70" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <p className="kicker !text-blue-200">{kicker}</p>
        <h1 className="font-display font-bold text-4xl md:text-6xl mt-3 max-w-3xl">{title}</h1>
        {intro && <p className="mt-4 text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed">{intro}</p>}
      </div>
    </section>
  )
}

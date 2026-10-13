import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import campusClassroom from '../assets/campus-classroom.jpg'
import Icon from '../components/Icon'
import { PageHero } from '../components/Section'
import { LINKS } from '../config'
import { awardShort, formatFcfa, pick, usePortalData } from '../lib/portal'
import NotFound from './NotFound'

function ProgrammeCard({ programme, fee, isFr, t }) {
  const modes = programme.study_modes.map((m) => pick(isFr, m.name, m.name_fr)).join(' · ')
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-7 flex flex-col">
      <p className="font-display font-bold text-brand-700 text-lg">{awardShort(programme.award, isFr)}</p>
      <h3 className="font-display font-bold text-2xl text-navy-950 leading-tight">{pick(isFr, programme.name, programme.name_fr)}</h3>
      <p className="text-slate-500 mt-1">{pick(isFr, programme.award.name, programme.award.name_fr)}</p>

      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-slate-500">{t('schools.duration')}</dt>
          <dd className="font-bold text-slate-800">
            {t('schools.years', { count: programme.duration_years })}
            {programme.top_up_duration_years && <span className="block font-normal text-slate-600">{t('schools.topUp', { count: programme.top_up_duration_years })}</span>}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">{t('schools.modes')}</dt>
          <dd className="font-bold text-slate-800">{modes}</dd>
        </div>
        {fee && (
          <>
            <div>
              <dt className="text-slate-500">{t('schools.yearlyFees')}</dt>
              <dd className="font-bold text-brand-700 text-base">{formatFcfa(fee.total)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{t('schools.applicationFee')}</dt>
              <dd className="font-bold text-slate-800">{formatFcfa(fee.application_fee)}</dd>
            </div>
          </>
        )}
      </dl>

      {fee?.installments?.length > 0 && (
        <details className="mt-5 text-sm">
          <summary className="cursor-pointer text-brand-700 font-bold">{t('schools.installments')}</summary>
          <ul className="mt-3 divide-y divide-slate-100">
            {fee.installments.map((inst) => (
              <li key={inst.label} className="flex justify-between py-1.5">
                <span>{inst.label} · {new Date(inst.due_date).toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="font-bold">{formatFcfa(inst.amount)}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <a href={LINKS.apply} className="mt-6 self-start flex items-center gap-2 bg-brand-700 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-brand-600">
        {t('nav.apply')} <Icon name="arrow" className="w-4 h-4" />
      </a>
    </article>
  )
}

export default function SchoolPrograms() {
  const { code } = useParams()
  const { t, i18n } = useTranslation()
  const isFr = i18n.language.startsWith('fr')
  const { data } = usePortalData('programmes')
  const { data: fees, live: feesLive } = usePortalData('fees')

  const school = data?.schools?.find((s) => s.code === code)
  if (data && !school) return <NotFound />

  const feeByCode = Object.fromEntries((fees?.programmes ?? []).map((f) => [f.programme_code, f]))

  return (
    <>
      <PageHero kicker={school.code} title={pick(isFr, school.name, school.name_fr)}
        intro={fees?.academic_year ? t('schools.feesYear', { year: fees.academic_year }) : undefined} background={campusClassroom} />
      <section className="bg-slate-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link to={`/schools/${school.code}`} className="inline-flex items-center gap-2 text-brand-700 font-bold mb-8">
            <span className="rotate-180"><Icon name="arrow" className="w-4 h-4" /></span> {t('schools.backToSchool')}
          </Link>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {school.programmes.map((programme) => (
              <ProgrammeCard key={programme.code} programme={programme} fee={feeByCode[programme.code]} isFr={isFr} t={t} />
            ))}
          </div>
          {!feesLive && <p className="mt-8 text-sm text-slate-500">{t('schools.savedCopy')}</p>}
        </div>
      </section>
    </>
  )
}

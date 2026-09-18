import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Admissions() {
  const { t } = useTranslation()

  const steps = [
    { title: t('admissions.step1Title'), body: t('admissions.step1Body') },
    { title: t('admissions.step2Title'), body: t('admissions.step2Body') },
    { title: t('admissions.step3Title'), body: t('admissions.step3Body') },
    { title: t('admissions.step4Title'), body: t('admissions.step4Body') },
    { title: t('admissions.step5Title'), body: t('admissions.step5Body') },
  ]

  return (
    <div>
      <section className="bg-brand-black py-16 px-6 text-center">
        <p className="text-brand-blue text-xs font-semibold tracking-widest uppercase mb-3">
          {t('admissions.eyebrow')}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white max-w-2xl mx-auto">
          {t('admissions.title')}
        </h1>
        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
          {t('admissions.intro')}
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-8 mb-16">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-5">
              <div className="w-10 h-10 rounded-full bg-brand-black text-white flex items-center justify-center font-display font-bold flex-shrink-0">
                {i + 1}
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-gray-800">{step.title}</h3>
                <p className="text-gray-600 mt-1">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-6">
            {t('admissions.requirementsTitle')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-brand-black mb-2">{t('admissions.straightTitle')}</h3>
              <p className="text-gray-600 text-sm">{t('admissions.straightBody')}</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-brand-black mb-2">{t('admissions.topupTitle')}</h3>
              <p className="text-gray-600 text-sm">{t('admissions.topupBody')}</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/apply"
            className="inline-block bg-brand-red text-white px-8 py-4 rounded-md font-semibold hover:opacity-90"
          >
            {t('admissions.cta')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Admissions
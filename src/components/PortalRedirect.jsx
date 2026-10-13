import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// Old website addresses (/apply, /student-login, /results...) now live in the
// Kazek portal. Anyone using an old link or bookmark is sent there.
export default function PortalRedirect({ to }) {
  const { t } = useTranslation()
  useEffect(() => {
    window.location.replace(to)
  }, [to])
  return (
    <div className="max-w-md mx-auto text-center py-24 px-4">
      <h1 className="font-display font-bold text-2xl text-navy-950">{t('redirect.title')}</h1>
      <p className="text-slate-600 mt-2">{t('redirect.body')}</p>
      <a href={to} className="inline-block mt-6 bg-brand-700 text-white px-6 py-3 rounded-lg font-bold">{t('redirect.button')}</a>
    </div>
  )
}

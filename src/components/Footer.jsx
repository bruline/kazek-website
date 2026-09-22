import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

function Footer() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('submitting')
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.trim().toLowerCase() })

    if (error) {
      // Duplicate email still counts as a successful subscription from the user's point of view
      if (error.code === '23505') {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } else {
      setStatus('success')
      setEmail('')
    }
  }

  return (
    <footer className="bg-brand-black text-gray-400 py-12 px-6 mt-auto border-t border-white/10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-10 text-sm">
        <div>
          <h4 className="text-brand-blue font-display font-semibold text-xs uppercase tracking-wide mb-3">
            Kazek University
          </h4>
          <p className="text-white">{t('footer.instituteName')}</p>
          <p>{t('footer.location')}</p>
        </div>
        <div>
          <h4 className="text-brand-blue font-display font-semibold text-xs uppercase tracking-wide mb-3">
            {t('footer.contact')}
          </h4>
          <p>Tel: 654227103</p>
          <p>Email: info@kazekuniversity.com</p>
        </div>
        <div>
          <h4 className="text-brand-blue font-display font-semibold text-xs uppercase tracking-wide mb-3">
            {t('footer.mentoredBy')}
          </h4>
          <p>University of Douala</p>
        </div>
        <div>
          <h4 className="text-brand-blue font-display font-semibold text-xs uppercase tracking-wide mb-3">
            {t('footer.newsletterTitle', 'Stay Updated')}
          </h4>
          {status === 'success' ? (
            <p className="text-white">{t('footer.newsletterSuccess', "You're subscribed!")}</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletterPlaceholder', 'Your email')}
                className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-brand-blue"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="bg-brand-blue text-brand-black text-sm font-semibold rounded-md px-3 py-2 hover:opacity-90 disabled:opacity-60"
              >
                {status === 'submitting'
                  ? t('footer.newsletterSubmitting', 'Subscribing...')
                  : t('footer.newsletterSubmit', 'Subscribe')}
              </button>
              {status === 'error' && (
                <p className="text-red-400 text-xs">
                  {t('footer.newsletterError', 'Something went wrong. Please try again.')}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
      <p className="text-center text-xs text-gray-600 mt-10">
        © {new Date().getFullYear()} Kazek University Institute of Technology and Management
      </p>
    </footer>
  )
}

export default Footer
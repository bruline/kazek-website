import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-brand-black text-gray-400 py-12 px-6 mt-auto border-t border-white/10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-sm">
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
          <p>ESSEC Douala</p>
          <p>University of Douala</p>
        </div>
      </div>
      <p className="text-center text-xs text-gray-600 mt-10">
        © {new Date().getFullYear()} Kazek University Institute of Technology and Management
      </p>
    </footer>
  )
}

export default Footer
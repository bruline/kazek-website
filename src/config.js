/*
 * Where the Kazek University Management System (the portal) lives.
 * Set VITE_PORTAL_URL in Vercel (Settings → Environment Variables) if it ever
 * changes. Until the portal is online, the website shows the programme and
 * fee list saved in src/data/ (a copy of the portal's public data).
 */
export const PORTAL_URL = (import.meta.env.VITE_PORTAL_URL || 'https://portal.kazekuniversity.com').replace(/\/$/, '')

export const LINKS = {
  apply: `${PORTAL_URL}/admissions/signup/`,
  portal: `${PORTAL_URL}/accounts/login/`,
}

export const CONTACT = {
  address: 'Mile 2, Limbe, Cameroon',
  phone: '654 227 103',
  phoneHref: 'tel:+237654227103',
  email: 'info@kazekuniversity.com',
  whatsapp: 'https://wa.me/237654227103',
}

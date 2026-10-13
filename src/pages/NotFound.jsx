import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-24 px-4">
      <p className="font-display font-bold text-7xl text-brand-100">404</p>
      <h1 className="font-display font-bold text-3xl text-navy-950 mt-2">Page not found · Page introuvable</h1>
      <Link to="/" className="inline-block mt-6 bg-brand-700 text-white px-6 py-3 rounded-lg font-bold">Kazek University</Link>
    </div>
  )
}

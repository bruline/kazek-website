import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

function Schools() {
  const { t, i18n } = useTranslation()
  const isFr = i18n.language === 'fr'

  const [schools, setSchools] = useState([]) // [{ en, fr }]
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSchools() {
      const { data, error } = await supabase
        .from('programs')
        .select('school_name, school_name_fr')

      if (error) {
        console.error('Error fetching schools:', error)
        setLoading(false)
        return
      }

      const seen = new Map()
      for (const row of data) {
        if (!seen.has(row.school_name)) {
          seen.set(row.school_name, row.school_name_fr || row.school_name)
        }
      }
      setSchools([...seen.entries()].map(([en, fr]) => ({ en, fr })))
      setLoading(false)
    }

    fetchSchools()
  }, [])

  if (loading) {
    return <p className="text-center py-20 text-gray-500">Loading schools...</p>
  }

  if (schools.length === 0) {
    return (
      <p className="text-center py-20 text-gray-500">
        No schools found yet — this page will show data once the programs
        table has been filled in.
      </p>
    )
  }

  return (
    <div>
      <section className="bg-brand-black py-16 px-6 text-center">
        <p className="text-brand-blue text-xs font-semibold tracking-widest uppercase mb-3">
          {isFr ? 'Académique' : 'Academics'}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
          {isFr ? 'Nos Écoles' : 'Our Schools'}
        </h1>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {schools.map((school) => (
            <Link
              key={school.en}
              to={`/schools/${encodeURIComponent(school.en)}`}
              className="block bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-brand-blue transition"
            >
              <h2 className="font-display text-xl font-semibold text-gray-800">
                {isFr ? school.fr : school.en}
              </h2>
              <p className="text-brand-red mt-2 text-sm font-medium">
                {isFr ? 'Voir les programmes →' : 'View programs →'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Schools
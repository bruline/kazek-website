import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

const DURATION_FR = {
  '2 years': '2 ans',
  '3 years straight / 1 year top-up': '3 ans en entrée directe / 1 an en top-up',
  '3 years': '3 ans',
  '4 years straight / 1 year top-up': '4 ans en entrée directe / 1 an en top-up',
  '12 months': '12 mois',
}

const MODE_FR = {
  Day: 'Journée',
  Evening: 'Soirée',
  Weekend: 'Weekend',
  Online: 'En ligne',
}

function SchoolPrograms() {
  const { schoolName } = useParams()
  const decodedSchoolName = decodeURIComponent(schoolName)
  const { i18n } = useTranslation()
  const isFr = i18n.language === 'fr'

  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPrograms() {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('school_name', decodedSchoolName)

      if (error) {
        console.error('Error fetching programs:', error)
        setLoading(false)
        return
      }

      setPrograms(data)
      setLoading(false)
    }

    fetchPrograms()
  }, [decodedSchoolName])

  function translateDuration(value) {
    return isFr ? (DURATION_FR[value] || value) : value
  }

  function translateModes(value) {
    if (!isFr) return value.split(',').join(' / ')
    return value.split(',').map((m) => MODE_FR[m.trim()] || m.trim()).join(' / ')
  }

  if (loading) {
    return <p className="text-center py-20 text-gray-500">Loading programs...</p>
  }

  if (programs.length === 0) {
    return (
      <p className="text-center py-20 text-gray-500">
        No programs found for this school.
      </p>
    )
  }

  const displaySchoolName = isFr
    ? (programs[0].school_name_fr || decodedSchoolName)
    : decodedSchoolName

  const grouped = {}
  for (const row of programs) {
    const programKey = row.program_name
    const displayProgramName = isFr ? (row.program_name_fr || row.program_name) : row.program_name
    const displaySpecName = isFr ? (row.specialization_name_fr || row.specialization_name) : row.specialization_name

    if (!grouped[programKey]) {
      grouped[programKey] = {
        displayProgramName,
        duration: row.duration,
        study_modes: row.study_modes,
        application_fee_frs: row.application_fee_frs,
        tuition_frs: row.tuition_frs,
        uniform_frs: row.uniform_frs,
        union_frs: row.union_frs,
        id_frs: row.id_frs,
        total_frs: row.total_frs,
        registration_frs: row.registration_frs,
        installment1_frs: row.installment1_frs,
        installment1_deadline: row.installment1_deadline,
        installment2_frs: row.installment2_frs,
        installment2_deadline: row.installment2_deadline,
        installment3_frs: row.installment3_frs,
        installment3_deadline: row.installment3_deadline,
        specializations: [],
      }
    }
    grouped[programKey].specializations.push(displaySpecName)
  }

  const formatFrs = (amount) => `${amount.toLocaleString()} FCFA`

  const labels = isFr
    ? {
        back: '← Retour à toutes les écoles',
        specializations: 'Spécialisations',
        fees: 'Frais',
        schedule: "Structure de Paiement",
        application: 'Dossier',
        tuition: 'Scolarité',
        uniform: 'Tenue',
        union: "Association d'Étudiants",
        id: 'Carte Étudiante',
        total: 'Total',
        registration: 'Inscription',
        inst1: '1ère Tranche',
        inst2: '2ème Tranche',
        inst3: '3ème Tranche',
        apply: 'Postuler pour ce programme',
      }
    : {
        back: '← Back to all schools',
        specializations: 'Specializations',
        fees: 'Fees',
        schedule: 'Payment Schedule',
        application: 'Application',
        tuition: 'Tuition',
        uniform: 'Uniform',
        union: 'Student Union',
        id: 'Student ID',
        total: 'Total',
        registration: 'Registration',
        inst1: '1st Installment',
        inst2: '2nd Installment',
        inst3: '3rd Installment',
        apply: 'Apply for this program',
      }

  return (
    <div>
      <section className="bg-brand-black py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/schools" className="text-brand-blue text-sm hover:underline">
            {labels.back}
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mt-4">
            {displaySchoolName}
          </h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {Object.entries(grouped).map(([programKey, info]) => (
            <div key={programKey} className="border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="font-display text-2xl font-semibold text-gray-800">{info.displayProgramName}</h2>
              <p className="text-gray-500 mb-4">
                {translateDuration(info.duration)} · {translateModes(info.study_modes)}
              </p>

              <h3 className="font-semibold text-gray-700 mt-4 mb-1">{labels.specializations}</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {info.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="bg-blue-50 text-brand-blue text-sm px-3 py-1 rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">{labels.fees}</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-1 text-gray-600">{labels.application}</td>
                        <td className="py-1 text-right">{formatFrs(info.application_fee_frs)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 text-gray-600">{labels.tuition}</td>
                        <td className="py-1 text-right">{formatFrs(info.tuition_frs)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 text-gray-600">{labels.uniform}</td>
                        <td className="py-1 text-right">{formatFrs(info.uniform_frs)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 text-gray-600">{labels.union}</td>
                        <td className="py-1 text-right">{formatFrs(info.union_frs)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 text-gray-600">{labels.id}</td>
                        <td className="py-1 text-right">{formatFrs(info.id_frs)}</td>
                      </tr>
                      <tr className="font-semibold">
                        <td className="py-1">{labels.total}</td>
                        <td className="py-1 text-right">{formatFrs(info.total_frs)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">{labels.schedule}</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-1 text-gray-600">{labels.registration}</td>
                        <td className="py-1 text-right">{formatFrs(info.registration_frs)}</td>
                        <td className="py-1 text-right text-gray-400">31 Oct</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 text-gray-600">{labels.inst1}</td>
                        <td className="py-1 text-right">{formatFrs(info.installment1_frs)}</td>
                        <td className="py-1 text-right text-gray-400">{info.installment1_deadline}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 text-gray-600">{labels.inst2}</td>
                        <td className="py-1 text-right">{formatFrs(info.installment2_frs)}</td>
                        <td className="py-1 text-right text-gray-400">{info.installment2_deadline}</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-gray-600">{labels.inst3}</td>
                        <td className="py-1 text-right">{formatFrs(info.installment3_frs)}</td>
                        <td className="py-1 text-right text-gray-400">{info.installment3_deadline}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Link
                to="/apply"
                className="inline-block mt-6 bg-brand-red text-white px-5 py-2 rounded-md hover:opacity-90 text-sm font-semibold"
              >
                {labels.apply}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SchoolPrograms
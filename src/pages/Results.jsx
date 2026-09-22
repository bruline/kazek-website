import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Results() {
  const [session, setSession] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [term, setTerm] = useState('2026/2027 Semester 1')
  const [isPaidUp, setIsPaidUp] = useState(false)
  const [results, setResults] = useState([])
  const [showBreakdown, setShowBreakdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        navigate('/student-login')
        return
      }
      setSession(data.session)
      setCheckingSession(false)
    }
    checkSession()
  }, [navigate])

  useEffect(() => {
    if (!session) return

    async function fetchEverything() {
      setLoading(true)
      setShowBreakdown(false)

      const { data: profileData, error: profileError } = await supabase
        .from('student_profiles')
        .select('id, full_name, matriculation_number')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        console.error(profileError)
        setLoading(false)
        return
      }
      setProfile(profileData)

      const { data: feeData, error: feeError } = await supabase
        .from('fee_status')
        .select('is_paid_up')
        .eq('student_id', session.user.id)
        .eq('term', term)
        .maybeSingle()

      if (feeError) {
        console.error(feeError)
      }
      const paidUp = feeData?.is_paid_up ?? false
      setIsPaidUp(paidUp)

      if (paidUp) {
        const [caRes, examRes] = await Promise.all([
          supabase
            .from('ca_results')
            .select('score, lecture_courses(code, title)')
            .eq('student_id', session.user.id)
            .eq('term', term)
            .eq('is_published', true),
          supabase
            .from('exam_results')
            .select('score, lecture_courses(code, title)')
            .eq('student_id', session.user.id)
            .eq('term', term)
            .eq('is_published', true),
        ])

        const byCourse = {}

        if (!caRes.error) {
          caRes.data.forEach((row) => {
            const key = row.lecture_courses?.code || row.lecture_courses?.title || 'unknown'
            if (!byCourse[key]) byCourse[key] = { course: row.lecture_courses, ca: null, exam: null }
            byCourse[key].ca = row.score
          })
        }
        if (!examRes.error) {
          examRes.data.forEach((row) => {
            const key = row.lecture_courses?.code || row.lecture_courses?.title || 'unknown'
            if (!byCourse[key]) byCourse[key] = { course: row.lecture_courses, ca: null, exam: null }
            byCourse[key].exam = row.score
          })
        }

        setResults(Object.values(byCourse))
      } else {
        setResults([])
      }

      setLoading(false)
    }

    fetchEverything()
  }, [session, term])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/student-login')
  }

  if (checkingSession || loading) {
    return <p className="text-center py-20 text-gray-500">Loading results...</p>
  }

  // Overall summary: average of (CA + Exam) across courses that have at least one published score.
  const coursesWithData = results.filter((r) => r.ca !== null || r.exam !== null)
  const coursesComplete = results.filter((r) => r.ca !== null && r.exam !== null)
  const overallAverage =
    coursesComplete.length > 0
      ? (
          coursesComplete.reduce((sum, r) => sum + Number(r.ca) + Number(r.exam), 0) /
          coursesComplete.length
        ).toFixed(1)
      : null

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-blue-700">My Results</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:underline">
          Log out
        </button>
      </div>

      {profile && (
        <p className="text-sm text-gray-500 mb-4">
          {profile.full_name || 'Student'} · Matric No. {profile.matriculation_number || '—'}
        </p>
      )}

      <div className="flex gap-2 mb-8 border-b">
        <Link
          to="/recordings"
          className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-brand-black"
        >
          Recordings
        </Link>
        <span className="px-4 py-2 text-sm font-medium border-b-2 border-brand-red text-brand-black">
          My Results
        </span>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <label className="text-sm font-medium text-gray-700">Term:</label>
        <input
          className="border rounded px-3 py-2 text-sm w-64"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      {!isPaidUp ? (
        <div className="border border-red-200 bg-red-50 rounded-lg p-6 text-center">
          <p className="text-red-700 font-medium">Results unavailable</p>
          <p className="text-red-600 text-sm mt-1">
            Please clear outstanding fees with the registrar to view your results for this term.
          </p>
        </div>
      ) : coursesWithData.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No published results yet for this term.
        </p>
      ) : (
        <div>
          <div className="border rounded-lg p-6 mb-4 bg-gray-50 text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Overall Average</p>
            <p className="text-4xl font-bold text-gray-800 mb-1">
              {overallAverage !== null ? overallAverage : '—'}
            </p>
            <p className="text-sm text-gray-500">
              Based on {coursesComplete.length} fully published course
              {coursesComplete.length === 1 ? '' : 's'}
              {coursesWithData.length > coursesComplete.length &&
                ` (${coursesWithData.length - coursesComplete.length} more partially published)`}
            </p>
          </div>

          <button
            onClick={() => setShowBreakdown((v) => !v)}
            className="w-full mb-6 bg-brand-black text-white py-2 rounded-md font-medium hover:opacity-90"
          >
            {showBreakdown ? 'Hide Course Breakdown' : 'View Course Breakdown'}
          </button>

          {showBreakdown && (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-3">Course</th>
                    <th className="p-3">CA Score</th>
                    <th className="p-3">Exam Score</th>
                    <th className="p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {coursesWithData.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3">
                        {r.course?.code ? `${r.course.code} — ${r.course.title}` : r.course?.title || '—'}
                      </td>
                      <td className="p-3">
                        {r.ca ?? <span className="text-gray-400">Not yet published</span>}
                      </td>
                      <td className="p-3">
                        {r.exam ?? <span className="text-gray-400">Not yet published</span>}
                      </td>
                      <td className="p-3">
                        {r.ca !== null && r.exam !== null ? (
                          <span className="font-semibold">{Number(r.ca) + Number(r.exam)}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Results
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function getYouTubeId(url) {
  if (!url) return null
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

function Recordings() {
  const [session, setSession] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [recordings, setRecordings] = useState([])
  const [loading, setLoading] = useState(true)
  const [schoolFilter, setSchoolFilter] = useState('')
  const [activeRecording, setActiveRecording] = useState(null)
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

    async function fetchRecordings() {
      const { data, error } = await supabase
        .from('lecture_recordings')
        .select('*, lecture_courses(title, code, programs(school_name, program_name, specialization_name))')
        .order('recorded_on', { ascending: false })

      if (error) {
        console.error('Error fetching recordings:', error)
      } else {
        setRecordings(data)
      }
      setLoading(false)
    }

    fetchRecordings()
  }, [session])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/student-login')
  }

  if (checkingSession || loading) {
    return <p className="text-center py-20 text-gray-500">Loading recordings...</p>
  }

  const schoolOptions = [
    ...new Set(recordings.map((r) => r.lecture_courses?.programs?.school_name).filter(Boolean)),
  ]

  const filtered = schoolFilter
    ? recordings.filter((r) => r.lecture_courses?.programs?.school_name === schoolFilter)
    : recordings

  const activeVideoId = activeRecording ? getYouTubeId(activeRecording.video_url) : null

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Recorded Lectures</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:underline">
          Log out
        </button>
      </div>

      <div className="flex gap-2 mb-8 border-b">
        <span className="px-4 py-2 text-sm font-medium border-b-2 border-brand-red text-brand-black">
          Recordings
        </span>
        <Link
          to="/results"
          className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-brand-black"
        >
          My Results
        </Link>
      </div>

      <select
        className="border rounded px-3 py-2 text-sm mb-6"
        value={schoolFilter}
        onChange={(e) => setSchoolFilter(e.target.value)}
      >
        <option value="">All Schools</option>
        {schoolOptions.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      {filtered.length === 0 && (
        <p className="text-gray-500 text-center py-10">No recordings available yet.</p>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((rec) => {
          const videoId = getYouTubeId(rec.video_url)
          const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
          const course = rec.lecture_courses
          const program = course?.programs

          return (
            <button
              key={rec.id}
              onClick={() => setActiveRecording(rec)}
              className="text-left border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="relative aspect-video bg-gray-100">
                {thumbnail ? (
                  <img src={thumbnail} alt={rec.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Invalid video link
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-brand-red ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h2 className="font-semibold text-gray-800 text-sm leading-snug mb-1">{rec.title}</h2>
                <p className="text-xs text-gray-500 leading-snug">
                  {program?.school_name}
                  {course ? ` · ${course.code || course.title}` : ''}
                  {' · '}{rec.recorded_on}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {activeRecording && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setActiveRecording(null)}
        >
          <div
            className="bg-white rounded-lg overflow-hidden max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="font-semibold text-gray-800 text-sm">{activeRecording.title}</h3>
              <button
                onClick={() => setActiveRecording(null)}
                className="text-gray-400 hover:text-gray-700 text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="aspect-video bg-black">
              {activeVideoId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                  title={activeRecording.title}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <p className="text-white text-center py-20 text-sm">Invalid video link.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Recordings
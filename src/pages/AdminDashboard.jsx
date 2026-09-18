import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function AdminDashboard() {
  const [session, setSession] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [tab, setTab] = useState('applications')
  const navigate = useNavigate()

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        navigate('/admin-login')
        return
      }
      setSession(data.session)
      setCheckingSession(false)
    }
    checkSession()
  }, [navigate])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin-login')
  }

  if (checkingSession) {
    return <p className="text-center py-20 text-gray-500">Loading...</p>
  }

  return (
    <div>
      <section className="bg-brand-black py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-white">Admin Dashboard</h1>
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white">
            Log out
          </button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-2 mb-8 border-b">
          <button
            onClick={() => setTab('applications')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              tab === 'applications'
                ? 'border-brand-red text-brand-black'
                : 'border-transparent text-gray-500'
            }`}
          >
            Applications
          </button>
          <button
            onClick={() => setTab('recordings')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              tab === 'recordings'
                ? 'border-brand-red text-brand-black'
                : 'border-transparent text-gray-500'
            }`}
          >
            Recordings
          </button>
        </div>

        {tab === 'applications' ? <ApplicationsTab /> : <RecordingsTab />}
      </div>
    </div>
  )
}

function ApplicationsTab() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [schoolFilter, setSchoolFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    async function fetchApplications() {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false })

      if (error) {
        console.error('Error fetching applications:', error)
      } else {
        setApplications(data)
      }
      setLoading(false)
    }
    fetchApplications()
  }, [])

  async function updateStatus(id, newStatus) {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      console.error('Error updating status:', error)
      return
    }

    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    )
  }

  async function viewDocument(path) {
    if (!path) return

    const { data, error } = await supabase.storage
      .from('applicant-documents')
      .createSignedUrl(path, 60) // link valid for 60 seconds

    if (error) {
      console.error('Error creating signed URL:', error)
      alert('Could not open this document. Please try again.')
      return
    }

    window.open(data.signedUrl, '_blank')
  }

  function exportToCSV() {
    const headers = Object.keys(applications[0] || {})
    const rows = applications.map((app) => headers.map((h) => `"${app[h] ?? ''}"`).join(','))
    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'applications.csv'
    a.click()
  }

  if (loading) {
    return <p className="text-center py-20 text-gray-500">Loading applications...</p>
  }

  const filtered = applications.filter((app) => {
    const matchesSchool = schoolFilter ? app.school_name === schoolFilter : true
    const matchesStatus = statusFilter ? app.status === statusFilter : true
    return matchesSchool && matchesStatus
  })

  const schoolOptions = [...new Set(applications.map((a) => a.school_name))]

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select
          className="border rounded px-3 py-2 text-sm"
          value={schoolFilter}
          onChange={(e) => setSchoolFilter(e.target.value)}
        >
          <option value="">All Schools</option>
          {schoolOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          className="border rounded px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="accepted_with_condition">Accepted with Condition</option>
          <option value="not_accepted">Not Accepted</option>
        </select>

        <button
          onClick={exportToCSV}
          className="ml-auto bg-brand-black text-white px-4 py-2 rounded-md text-sm hover:opacity-90"
        >
          Export to CSV
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">School</th>
              <th className="p-3">Program</th>
              <th className="p-3">Specialization</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Documents</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => (
              <tr key={app.id} className="border-t align-top">
                <td className="p-3">{app.full_name}</td>
                <td className="p-3">{app.school_name}</td>
                <td className="p-3">{app.program_name}</td>
                <td className="p-3">{app.specialization_name}</td>
                <td className="p-3">{app.email}<br />{app.phone}</td>
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    {app.birth_certificate_url && (
                      <button
                        onClick={() => viewDocument(app.birth_certificate_url)}
                        className="text-brand-blue text-xs hover:underline text-left"
                      >
                        Birth Certificate
                      </button>
                    )}
                    {app.id_document_url && (
                      <button
                        onClick={() => viewDocument(app.id_document_url)}
                        className="text-brand-blue text-xs hover:underline text-left"
                      >
                        ID Document
                      </button>
                    )}
                    {app.gce_ol_transcript_url && (
                      <button
                        onClick={() => viewDocument(app.gce_ol_transcript_url)}
                        className="text-brand-blue text-xs hover:underline text-left"
                      >
                        O'Level Transcript
                      </button>
                    )}
                    {app.academic_transcript_url && (
                      <button
                        onClick={() => viewDocument(app.academic_transcript_url)}
                        className="text-brand-blue text-xs hover:underline text-left"
                      >
                        A'Level / HND Transcript
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-3 capitalize">{app.status?.replace(/_/g, ' ')}</td>
                <td className="p-3">
                  <select
                    className="border rounded px-2 py-1 text-xs"
                    value={app.status}
                    onChange={(e) => updateStatus(app.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="accepted_with_condition">Accepted with Condition</option>
                    <option value="not_accepted">Not Accepted</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-10">No applications match these filters.</p>
      )}
    </div>
  )
}

function RecordingsTab() {
  const [allPrograms, setAllPrograms] = useState([])
  const [recordings, setRecordings] = useState([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    title: '',
    school_name: '',
    program_name: '',
    specialization_name: '',
    course_name: '',
    recording_date: '',
    youtube_url: '',
    uploaded_by: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    async function fetchData() {
      const [programsRes, recordingsRes] = await Promise.all([
        supabase.from('programs').select('*'),
        supabase.from('lecture_recordings').select('*').order('recording_date', { ascending: false }),
      ])

      if (programsRes.error) console.error(programsRes.error)
      else setAllPrograms(programsRes.data)

      if (recordingsRes.error) console.error(recordingsRes.error)
      else setRecordings(recordingsRes.data)

      setLoading(false)
    }
    fetchData()
  }, [])

  const schoolOptions = [...new Set(allPrograms.map((p) => p.school_name))]
  const programOptions = [
    ...new Set(
      allPrograms.filter((p) => p.school_name === form.school_name).map((p) => p.program_name)
    ),
  ]
  const specializationOptions = allPrograms
    .filter((p) => p.school_name === form.school_name && p.program_name === form.program_name)
    .map((p) => p.specialization_name)

  function handleChange(field, value) {
    const updated = { ...form, [field]: value }
    if (field === 'school_name') {
      updated.program_name = ''
      updated.specialization_name = ''
    }
    if (field === 'program_name') {
      updated.specialization_name = ''
    }
    setForm(updated)
  }

  async function handleAddRecording(e) {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    const { data, error } = await supabase
      .from('lecture_recordings')
      .insert([form])
      .select()

    setSubmitting(false)

    if (error) {
      console.error(error)
      setErrorMsg('Could not save recording. Check the YouTube link and try again.')
      return
    }

    setRecordings((prev) => [data[0], ...prev])
    setSuccessMsg('Recording added.')
    setForm({
      title: '',
      school_name: '',
      program_name: '',
      specialization_name: '',
      course_name: '',
      recording_date: '',
      youtube_url: '',
      uploaded_by: '',
    })
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('lecture_recordings').delete().eq('id', id)
    if (error) {
      console.error(error)
      return
    }
    setRecordings((prev) => prev.filter((r) => r.id !== id))
  }

  if (loading) {
    return <p className="text-center py-20 text-gray-500">Loading recordings...</p>
  }

  return (
    <div>
      <div className="border rounded-lg p-6 mb-10">
        <h2 className="font-display font-semibold text-gray-800 mb-4">Add a Recording</h2>
        <form onSubmit={handleAddRecording} className="grid md:grid-cols-2 gap-4">
          <input
            required
            placeholder="Title (e.g. Financial Accounting — Week 3)"
            className="border rounded px-3 py-2 md:col-span-2"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />

          <select
            required
            className="border rounded px-3 py-2"
            value={form.school_name}
            onChange={(e) => handleChange('school_name', e.target.value)}
          >
            <option value="">Select School</option>
            {schoolOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            required
            disabled={!form.school_name}
            className="border rounded px-3 py-2"
            value={form.program_name}
            onChange={(e) => handleChange('program_name', e.target.value)}
          >
            <option value="">Select Program</option>
            {programOptions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          <select
            required
            disabled={!form.program_name}
            className="border rounded px-3 py-2"
            value={form.specialization_name}
            onChange={(e) => handleChange('specialization_name', e.target.value)}
          >
            <option value="">Select Specialization</option>
            {specializationOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <input
            placeholder="Course Name (e.g. Financial Accounting Basics)"
            className="border rounded px-3 py-2"
            value={form.course_name}
            onChange={(e) => handleChange('course_name', e.target.value)}
          />

          <input
            required
            type="date"
            className="border rounded px-3 py-2"
            value={form.recording_date}
            onChange={(e) => handleChange('recording_date', e.target.value)}
          />

          <input
            required
            placeholder="YouTube Link (Unlisted)"
            className="border rounded px-3 py-2 md:col-span-2"
            value={form.youtube_url}
            onChange={(e) => handleChange('youtube_url', e.target.value)}
          />

          <input
            placeholder="Uploaded By (e.g. Registrar)"
            className="border rounded px-3 py-2 md:col-span-2"
            value={form.uploaded_by}
            onChange={(e) => handleChange('uploaded_by', e.target.value)}
          />

          {errorMsg && <p className="text-red-600 text-sm md:col-span-2">{errorMsg}</p>}
          {successMsg && <p className="text-green-700 text-sm md:col-span-2">{successMsg}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-brand-red text-white py-2 rounded-md font-semibold hover:opacity-90 disabled:opacity-50 md:col-span-2"
          >
            {submitting ? 'Saving...' : 'Add Recording'}
          </button>
        </form>
      </div>

      <h2 className="font-display font-semibold text-gray-800 mb-4">All Recordings</h2>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">School / Program</th>
              <th className="p-3">Date</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {recordings.map((rec) => (
              <tr key={rec.id} className="border-t">
                <td className="p-3">{rec.title}</td>
                <td className="p-3">{rec.school_name} · {rec.program_name}</td>
                <td className="p-3">{rec.recording_date}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="text-red-600 text-xs hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {recordings.length === 0 && (
        <p className="text-center text-gray-500 py-10">No recordings added yet.</p>
      )}
    </div>
  )
}

export default AdminDashboard
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

  const tabs = [
    { key: 'applications', label: 'Applications' },
    { key: 'recordings', label: 'Recordings' },
    { key: 'students', label: 'Students' },
    { key: 'results', label: 'Results' },
  ]

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
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                tab === t.key
                  ? 'border-brand-red text-brand-black'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'applications' && <ApplicationsTab />}
        {tab === 'recordings' && <RecordingsTab />}
        {tab === 'students' && <StudentsTab />}
        {tab === 'results' && <ResultsTab />}
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
  const [allCourses, setAllCourses] = useState([])
  const [recordings, setRecordings] = useState([])
  const [loading, setLoading] = useState(true)

  const [schoolName, setSchoolName] = useState('')
  const [programName, setProgramName] = useState('')
  const [specializationName, setSpecializationName] = useState('')
  const [courseId, setCourseId] = useState('')

  const [showNewCourse, setShowNewCourse] = useState(false)
  const [newCourseCode, setNewCourseCode] = useState('')
  const [newCourseTitle, setNewCourseTitle] = useState('')
  const [newCourseLevel, setNewCourseLevel] = useState('')
  const [courseErrorMsg, setCourseErrorMsg] = useState('')
  const [savingCourse, setSavingCourse] = useState(false)

  const [recTitle, setRecTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [recordedOn, setRecordedOn] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    async function fetchData() {
      const [programsRes, coursesRes, recordingsRes] = await Promise.all([
        supabase.from('programs').select('id, school_name, program_name, specialization_name'),
        supabase.from('lecture_courses').select('id, code, title, program_id, level'),
        supabase
          .from('lecture_recordings')
          .select('*, lecture_courses(title, code, program_id, programs(school_name, program_name, specialization_name))')
          .order('recorded_on', { ascending: false }),
      ])

      if (programsRes.error) console.error(programsRes.error)
      else setAllPrograms(programsRes.data)

      if (coursesRes.error) console.error(coursesRes.error)
      else setAllCourses(coursesRes.data)

      if (recordingsRes.error) console.error(recordingsRes.error)
      else setRecordings(recordingsRes.data)

      setLoading(false)
    }
    fetchData()
  }, [])

  const schoolOptions = [...new Set(allPrograms.map((p) => p.school_name))]
  const programOptions = [
    ...new Set(
      allPrograms.filter((p) => p.school_name === schoolName).map((p) => p.program_name)
    ),
  ]
  const specializationOptions = allPrograms
    .filter((p) => p.school_name === schoolName && p.program_name === programName)
    .map((p) => p.specialization_name)

  const selectedProgram = allPrograms.find(
    (p) =>
      p.school_name === schoolName &&
      p.program_name === programName &&
      p.specialization_name === specializationName
  )

  const courseOptions = selectedProgram
    ? allCourses.filter((c) => c.program_id === selectedProgram.id)
    : []

  function handleSchoolChange(value) {
    setSchoolName(value)
    setProgramName('')
    setSpecializationName('')
    setCourseId('')
    setShowNewCourse(false)
  }

  function handleProgramChange(value) {
    setProgramName(value)
    setSpecializationName('')
    setCourseId('')
    setShowNewCourse(false)
  }

  function handleSpecializationChange(value) {
    setSpecializationName(value)
    setCourseId('')
    setShowNewCourse(false)
  }

  async function handleAddCourse(e) {
    e.preventDefault()
    if (!selectedProgram) return
    setSavingCourse(true)
    setCourseErrorMsg('')

    const { data, error } = await supabase
      .from('lecture_courses')
      .insert([
        {
          code: newCourseCode || null,
          title: newCourseTitle,
          level: newCourseLevel ? Number(newCourseLevel) : null,
          program_id: selectedProgram.id,
        },
      ])
      .select()

    setSavingCourse(false)

    if (error) {
      console.error(error)
      setCourseErrorMsg('Could not save course. Please check the fields and try again.')
      return
    }

    const newCourse = data[0]
    setAllCourses((prev) => [...prev, newCourse])
    setCourseId(newCourse.id)
    setShowNewCourse(false)
    setNewCourseCode('')
    setNewCourseTitle('')
    setNewCourseLevel('')
  }

  async function handleAddRecording(e) {
    e.preventDefault()
    if (!courseId) {
      setErrorMsg('Please select a course first.')
      return
    }
    setSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    const { data, error } = await supabase
      .from('lecture_recordings')
      .insert([
        {
          course_id: courseId,
          title: recTitle,
          video_url: videoUrl,
          recorded_on: recordedOn,
        },
      ])
      .select('*, lecture_courses(title, code, program_id, programs(school_name, program_name, specialization_name))')

    setSubmitting(false)

    if (error) {
      console.error(error)
      setErrorMsg('Could not save recording. Check the video link and try again.')
      return
    }

    setRecordings((prev) => [data[0], ...prev])
    setSuccessMsg('Recording added.')
    setRecTitle('')
    setVideoUrl('')
    setRecordedOn('')
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

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <select
            className="border rounded px-3 py-2"
            value={schoolName}
            onChange={(e) => handleSchoolChange(e.target.value)}
          >
            <option value="">Select School</option>
            {schoolOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            className="border rounded px-3 py-2"
            disabled={!schoolName}
            value={programName}
            onChange={(e) => handleProgramChange(e.target.value)}
          >
            <option value="">Select Program</option>
            {programOptions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          <select
            className="border rounded px-3 py-2"
            disabled={!programName}
            value={specializationName}
            onChange={(e) => handleSpecializationChange(e.target.value)}
          >
            <option value="">Select Specialization</option>
            {specializationOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {selectedProgram && (
          <div className="mb-6 border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
            <div className="flex flex-wrap gap-3 items-center mb-2">
              <select
                className="border rounded px-3 py-2"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="">Select Course</option>
                {courseOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code ? `${c.code} — ${c.title}` : c.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCourse((v) => !v)}
                className="text-brand-blue text-sm hover:underline"
              >
                {showNewCourse ? 'Cancel' : '+ Add New Course'}
              </button>
            </div>

            {courseOptions.length === 0 && !showNewCourse && (
              <p className="text-sm text-gray-500">
                No courses yet under this specialization. Click "+ Add New Course" to create one.
              </p>
            )}

            {showNewCourse && (
              <div className="bg-gray-50 border rounded p-4 grid md:grid-cols-3 gap-3">
                <input
                  placeholder="Course Code (e.g. ACC201)"
                  className="border rounded px-3 py-2"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                />
                <input
                  placeholder="Course Title"
                  className="border rounded px-3 py-2 md:col-span-2"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                />
                <input
                  placeholder="Level (e.g. 1, 2, 3)"
                  type="number"
                  className="border rounded px-3 py-2"
                  value={newCourseLevel}
                  onChange={(e) => setNewCourseLevel(e.target.value)}
                />
                <button
                  type="button"
                  disabled={!newCourseTitle || savingCourse}
                  onClick={handleAddCourse}
                  className="bg-brand-black text-white rounded-md px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50 md:col-span-2"
                >
                  {savingCourse ? 'Saving...' : 'Save Course'}
                </button>
                {courseErrorMsg && <p className="text-red-600 text-sm md:col-span-3">{courseErrorMsg}</p>}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleAddRecording} className="grid md:grid-cols-2 gap-4">
          <input
            required
            placeholder="Recording Title (e.g. Week 3 — Depreciation)"
            className="border rounded px-3 py-2 md:col-span-2"
            value={recTitle}
            onChange={(e) => setRecTitle(e.target.value)}
          />

          <input
            required
            placeholder="Video Link (e.g. Unlisted YouTube URL)"
            className="border rounded px-3 py-2 md:col-span-2"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          <input
            required
            type="date"
            className="border rounded px-3 py-2"
            value={recordedOn}
            onChange={(e) => setRecordedOn(e.target.value)}
          />

          {errorMsg && <p className="text-red-600 text-sm md:col-span-2">{errorMsg}</p>}
          {successMsg && <p className="text-green-700 text-sm md:col-span-2">{successMsg}</p>}

          <button
            type="submit"
            disabled={submitting || !courseId}
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
              <th className="p-3">Course</th>
              <th className="p-3">Program</th>
              <th className="p-3">Date</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {recordings.map((rec) => {
              const course = rec.lecture_courses
              const program = course?.programs
              return (
                <tr key={rec.id} className="border-t">
                  <td className="p-3">{rec.title}</td>
                  <td className="p-3">{course ? (course.code ? `${course.code} — ${course.title}` : course.title) : '—'}</td>
                  <td className="p-3">
                    {program
                      ? `${program.school_name} · ${program.program_name} · ${program.specialization_name}`
                      : '—'}
                  </td>
                  <td className="p-3">{rec.recorded_on}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(rec.id)}
                      className="text-red-600 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {recordings.length === 0 && (
        <p className="text-center text-gray-500 py-10">No recordings added yet.</p>
      )}
    </div>
  )
}

function StudentsTab() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [term, setTerm] = useState('2026/2027 Semester 1')
  const [feeMap, setFeeMap] = useState({})
  const [editValues, setEditValues] = useState({})
  const [savingId, setSavingId] = useState('')
  const [togglingId, setTogglingId] = useState('')

  useEffect(() => {
    async function fetchStudents() {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('id, full_name, matriculation_number, level, program_id, programs(school_name, program_name, specialization_name)')
        .eq('role', 'student')
        .order('created_at', { ascending: true })

      if (error) {
        console.error(error)
      } else {
        setStudents(data)
        const initialEdits = {}
        data.forEach((s) => {
          initialEdits[s.id] = {
            full_name: s.full_name || '',
            matriculation_number: s.matriculation_number || '',
          }
        })
        setEditValues(initialEdits)
      }
      setLoading(false)
    }
    fetchStudents()
  }, [])

  useEffect(() => {
    async function fetchFeeStatus() {
      const { data, error } = await supabase
        .from('fee_status')
        .select('student_id, is_paid_up')
        .eq('term', term)

      if (error) {
        console.error(error)
        return
      }

      const map = {}
      data.forEach((row) => {
        map[row.student_id] = row.is_paid_up
      })
      setFeeMap(map)
    }
    if (term) fetchFeeStatus()
  }, [term])

  function handleEditChange(studentId, field, value) {
    setEditValues((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }))
  }

  async function handleSaveStudent(studentId) {
    setSavingId(studentId)
    const values = editValues[studentId]

    const { error } = await supabase
      .from('student_profiles')
      .update({
        full_name: values.full_name || null,
        matriculation_number: values.matriculation_number || null,
      })
      .eq('id', studentId)

    setSavingId('')

    if (error) {
      console.error(error)
      alert('Could not save. The matriculation number may already be in use by another student.')
      return
    }

    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...values } : s))
    )
  }

  async function handleToggleFee(studentId) {
    const current = feeMap[studentId] ?? false
    const next = !current
    setTogglingId(studentId)

    const { error } = await supabase
      .from('fee_status')
      .upsert(
        { student_id: studentId, term, is_paid_up: next },
        { onConflict: 'student_id,term' }
      )

    setTogglingId('')

    if (error) {
      console.error(error)
      return
    }

    setFeeMap((prev) => ({ ...prev, [studentId]: next }))
  }

  if (loading) {
    return <p className="text-center py-20 text-gray-500">Loading students...</p>
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <label className="text-sm font-medium text-gray-700">Term:</label>
        <input
          className="border rounded px-3 py-2 text-sm w-64"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <p className="text-xs text-gray-500">
          Fee status below applies to this term. Type a different term to switch.
        </p>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Full Name</th>
              <th className="p-3">Matriculation No.</th>
              <th className="p-3">Program</th>
              <th className="p-3">Level</th>
              <th className="p-3">Fees ({term || '—'})</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const program = s.programs
              const values = editValues[s.id] || { full_name: '', matriculation_number: '' }
              const isPaidUp = feeMap[s.id] ?? false

              return (
                <tr key={s.id} className="border-t align-top">
                  <td className="p-3">
                    <input
                      className="border rounded px-2 py-1 w-40"
                      placeholder="Full name"
                      value={values.full_name}
                      onChange={(e) => handleEditChange(s.id, 'full_name', e.target.value)}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      className="border rounded px-2 py-1 w-32"
                      placeholder="Matric No."
                      value={values.matriculation_number}
                      onChange={(e) => handleEditChange(s.id, 'matriculation_number', e.target.value)}
                    />
                  </td>
                  <td className="p-3">
                    {program
                      ? `${program.school_name} · ${program.program_name} · ${program.specialization_name}`
                      : '—'}
                  </td>
                  <td className="p-3">{s.level ?? '—'}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleFee(s.id)}
                      disabled={togglingId === s.id || !term}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isPaidUp
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      } disabled:opacity-50`}
                    >
                      {togglingId === s.id ? '...' : isPaidUp ? 'Paid Up' : 'Not Paid'}
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleSaveStudent(s.id)}
                      disabled={savingId === s.id}
                      className="text-brand-blue text-xs hover:underline"
                    >
                      {savingId === s.id ? 'Saving...' : 'Save'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {students.length === 0 && (
        <p className="text-center text-gray-500 py-10">No student accounts yet.</p>
      )}
    </div>
  )
}

function ResultsTab() {
  const [allPrograms, setAllPrograms] = useState([])
  const [allCourses, setAllCourses] = useState([])
  const [students, setStudents] = useState([])
  const [caMap, setCaMap] = useState({}) // student_id -> { id, score, is_published }
  const [examMap, setExamMap] = useState({}) // student_id -> { id, score, is_published }
  const [loading, setLoading] = useState(true)

  const [schoolName, setSchoolName] = useState('')
  const [programName, setProgramName] = useState('')
  const [specializationName, setSpecializationName] = useState('')
  const [courseId, setCourseId] = useState('')
  const [term, setTerm] = useState('2026/2027 Semester 1')

  const [savingKey, setSavingKey] = useState('')

  useEffect(() => {
    async function fetchBase() {
      const [programsRes, coursesRes] = await Promise.all([
        supabase.from('programs').select('id, school_name, program_name, specialization_name'),
        supabase.from('lecture_courses').select('id, code, title, program_id'),
      ])
      if (programsRes.error) console.error(programsRes.error)
      else setAllPrograms(programsRes.data)

      if (coursesRes.error) console.error(coursesRes.error)
      else setAllCourses(coursesRes.data)

      setLoading(false)
    }
    fetchBase()
  }, [])

  const schoolOptions = [...new Set(allPrograms.map((p) => p.school_name))]
  const programOptions = [
    ...new Set(allPrograms.filter((p) => p.school_name === schoolName).map((p) => p.program_name)),
  ]
  const specializationOptions = allPrograms
    .filter((p) => p.school_name === schoolName && p.program_name === programName)
    .map((p) => p.specialization_name)

  const selectedProgram = allPrograms.find(
    (p) =>
      p.school_name === schoolName &&
      p.program_name === programName &&
      p.specialization_name === specializationName
  )

  const courseOptions = selectedProgram
    ? allCourses.filter((c) => c.program_id === selectedProgram.id)
    : []

  function handleSchoolChange(value) {
    setSchoolName(value)
    setProgramName('')
    setSpecializationName('')
    setCourseId('')
  }
  function handleProgramChange(value) {
    setProgramName(value)
    setSpecializationName('')
    setCourseId('')
  }
  function handleSpecializationChange(value) {
    setSpecializationName(value)
    setCourseId('')
    fetchStudentsForProgram(value)
  }

  async function fetchStudentsForProgram(specName) {
    const prog = allPrograms.find(
      (p) =>
        p.school_name === schoolName &&
        p.program_name === programName &&
        p.specialization_name === specName
    )
    if (!prog) return

    const { data, error } = await supabase
      .from('student_profiles')
      .select('id, full_name, matriculation_number')
      .eq('program_id', prog.id)
      .eq('role', 'student')

    if (error) {
      console.error(error)
      return
    }
    setStudents(data)
  }

  useEffect(() => {
    async function fetchScores() {
      if (!courseId || !term || students.length === 0) {
        setCaMap({})
        setExamMap({})
        return
      }

      const studentIds = students.map((s) => s.id)

      const [caRes, examRes] = await Promise.all([
        supabase
          .from('ca_results')
          .select('id, student_id, score, is_published')
          .eq('course_id', courseId)
          .eq('term', term)
          .in('student_id', studentIds),
        supabase
          .from('exam_results')
          .select('id, student_id, score, is_published')
          .eq('course_id', courseId)
          .eq('term', term)
          .in('student_id', studentIds),
      ])

      const nextCaMap = {}
      if (!caRes.error) {
        caRes.data.forEach((row) => {
          nextCaMap[row.student_id] = row
        })
      }
      const nextExamMap = {}
      if (!examRes.error) {
        examRes.data.forEach((row) => {
          nextExamMap[row.student_id] = row
        })
      }
      setCaMap(nextCaMap)
      setExamMap(nextExamMap)
    }
    fetchScores()
  }, [courseId, term, students])

  async function handleScoreChange(table, mapSetter, map, studentId, field, value) {
    const key = `${table}-${studentId}-${field}`
    setSavingKey(key)

    const existing = map[studentId]
    const payload = {
      student_id: studentId,
      course_id: courseId,
      term,
      score: existing?.score ?? null,
      is_published: existing?.is_published ?? false,
      [field]: field === 'score' ? (value === '' ? null : Number(value)) : value,
    }

    const { data, error } = await supabase
      .from(table)
      .upsert(payload, { onConflict: 'student_id,course_id,term' })
      .select()

    setSavingKey('')

    if (error) {
      console.error(error)
      return
    }

    mapSetter((prev) => ({ ...prev, [studentId]: data[0] }))
  }

  if (loading) {
    return <p className="text-center py-20 text-gray-500">Loading...</p>
  }

  return (
    <div>
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <select
          className="border rounded px-3 py-2"
          value={schoolName}
          onChange={(e) => handleSchoolChange(e.target.value)}
        >
          <option value="">Select School</option>
          {schoolOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          className="border rounded px-3 py-2"
          disabled={!schoolName}
          value={programName}
          onChange={(e) => handleProgramChange(e.target.value)}
        >
          <option value="">Select Program</option>
          {programOptions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          className="border rounded px-3 py-2"
          disabled={!programName}
          value={specializationName}
          onChange={(e) => handleSpecializationChange(e.target.value)}
        >
          <option value="">Select Specialization</option>
          {specializationOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          className="border rounded px-3 py-2"
          disabled={!specializationName}
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">Select Course</option>
          {courseOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code ? `${c.code} — ${c.title}` : c.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm font-medium text-gray-700">Term:</label>
        <input
          className="border rounded px-3 py-2 text-sm w-64"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      {courseId && term && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Matric No.</th>
                <th className="p-3">CA Score</th>
                <th className="p-3">CA Published</th>
                <th className="p-3">Exam Score</th>
                <th className="p-3">Exam Published</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const ca = caMap[s.id]
                const exam = examMap[s.id]
                return (
                  <tr key={s.id} className="border-t">
                    <td className="p-3">{s.full_name || '(no name set)'}</td>
                    <td className="p-3">{s.matriculation_number || '—'}</td>
                    <td className="p-3">
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-20"
                        defaultValue={ca?.score ?? ''}
                        onBlur={(e) =>
                          handleScoreChange('ca_results', setCaMap, caMap, s.id, 'score', e.target.value)
                        }
                      />
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          handleScoreChange(
                            'ca_results',
                            setCaMap,
                            caMap,
                            s.id,
                            'is_published',
                            !(ca?.is_published ?? false)
                          )
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          ca?.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {ca?.is_published ? 'Published' : 'Hidden'}
                      </button>
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-20"
                        defaultValue={exam?.score ?? ''}
                        onBlur={(e) =>
                          handleScoreChange('exam_results', setExamMap, examMap, s.id, 'score', e.target.value)
                        }
                      />
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          handleScoreChange(
                            'exam_results',
                            setExamMap,
                            examMap,
                            s.id,
                            'is_published',
                            !(exam?.is_published ?? false)
                          )
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          exam?.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {exam?.is_published ? 'Published' : 'Hidden'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {courseId && term && students.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          No students found for this specialization.
        </p>
      )}
    </div>
  )
}

export default AdminDashboard
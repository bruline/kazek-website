import { useEffect, useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { supabase } from '../lib/supabase'

function Apply() {
  const { t } = useTranslation()
  const [allPrograms, setAllPrograms] = useState([])
  const [loadingPrograms, setLoadingPrograms] = useState(true)

  const [form, setForm] = useState({
    full_name: '',
    date_of_birth: '',
    place_of_birth: '',
    nationality: '',
    address: '',
    email: '',
    phone: '',
    emergency_contact: '',
    emergency_contact_phone: '',
    school_name: '',
    program_name: '',
    specialization_name: '',
    study_mode: '',
  })

  const [entryType, setEntryType] = useState('')
  const [birthCertFile, setBirthCertFile] = useState(null)
  const [idFile, setIdFile] = useState(null)
  const [oLevelFile, setOLevelFile] = useState(null)
  const [transcriptFile, setTranscriptFile] = useState(null)

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function fetchPrograms() {
      const { data, error } = await supabase.from('programs').select('*')
      if (error) {
        console.error('Error fetching programs:', error)
      } else {
        setAllPrograms(data)
      }
      setLoadingPrograms(false)
    }
    fetchPrograms()
  }, [])

  const schoolOptions = [...new Set(allPrograms.map((p) => p.school_name))]

  const programOptions = [
    ...new Set(
      allPrograms
        .filter((p) => p.school_name === form.school_name)
        .map((p) => p.program_name)
    ),
  ]

  const specializationOptions = allPrograms
    .filter(
      (p) =>
        p.school_name === form.school_name &&
        p.program_name === form.program_name
    )
    .map((p) => p.specialization_name)

  const selectedProgramRow = allPrograms.find(
    (p) =>
      p.school_name === form.school_name &&
      p.program_name === form.program_name
  )
  const studyModeOptions = selectedProgramRow
    ? selectedProgramRow.study_modes.split(',')
    : []

  function handleChange(field, value) {
    const updated = { ...form, [field]: value }

    if (field === 'school_name') {
      updated.program_name = ''
      updated.specialization_name = ''
      updated.study_mode = ''
    }
    if (field === 'program_name') {
      updated.specialization_name = ''
      updated.study_mode = ''
    }

    setForm(updated)
  }

  async function uploadDocument(file, label) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${Date.now()}_${label}_${safeName}`

    const { error } = await supabase.storage
      .from('applicant-documents')
      .upload(path, file)

    if (error) {
      throw new Error(`Failed to upload ${label}: ${error.message}`)
    }

    return path
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg('')

    const missingOLevel = entryType === 'straight' && !oLevelFile

    if (!birthCertFile || !idFile || !transcriptFile || missingOLevel) {
      setErrorMsg(t('apply.missingDocs'))
      setSubmitting(false)
      return
    }

    try {
      const birthCertPath = await uploadDocument(birthCertFile, 'birth_certificate')
      const idPath = await uploadDocument(idFile, 'id_document')
      const transcriptPath = await uploadDocument(
        transcriptFile,
        entryType === 'topup' ? 'hnd_transcript' : 'alevel_transcript'
      )

      let oLevelPath = null
      if (entryType === 'straight') {
        oLevelPath = await uploadDocument(oLevelFile, 'olevel_transcript')
      }

      const { error } = await supabase.from('applications').insert([
        {
          ...form,
          birth_certificate_url: birthCertPath,
          id_document_url: idPath,
          academic_transcript_url: transcriptPath,
          gce_ol_transcript_url: oLevelPath,
        },
      ])

      if (error) throw new Error(error.message)

      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setErrorMsg(t('apply.submitError'))
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-brand-black mb-4">
          {t('apply.submittedTitle')}
        </h1>
        <p className="text-gray-600">
          <Trans
            i18nKey="apply.submittedBody"
            values={{
              name: form.full_name,
              specialization: form.specialization_name,
              program: form.program_name,
              email: form.email,
              phone: form.phone,
            }}
          />
        </p>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-brand-black py-16 px-6 text-center">
        <p className="text-brand-blue text-xs font-semibold tracking-widest uppercase mb-3">
          {t('apply.eyebrow')}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
          {t('apply.title')}
        </h1>
        <p className="text-gray-400 mt-2">{t('apply.academicYear')}</p>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              {t('apply.personalInfoTitle')}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input required placeholder={t('apply.fullName')} className="border rounded px-3 py-2"
                value={form.full_name} onChange={(e) => handleChange('full_name', e.target.value)} />
              <input required type="date" className="border rounded px-3 py-2"
                value={form.date_of_birth} onChange={(e) => handleChange('date_of_birth', e.target.value)} />
              <input required placeholder={t('apply.placeOfBirth')} className="border rounded px-3 py-2"
                value={form.place_of_birth} onChange={(e) => handleChange('place_of_birth', e.target.value)} />
              <input required placeholder={t('apply.nationality')} className="border rounded px-3 py-2"
                value={form.nationality} onChange={(e) => handleChange('nationality', e.target.value)} />
              <input required placeholder={t('apply.address')} className="border rounded px-3 py-2 md:col-span-2"
                value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
              <input required type="email" placeholder={t('apply.email')} className="border rounded px-3 py-2"
                value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
              <input required placeholder={t('apply.phone')} className="border rounded px-3 py-2"
                value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
              <input required placeholder={t('apply.emergencyName')} className="border rounded px-3 py-2"
                value={form.emergency_contact} onChange={(e) => handleChange('emergency_contact', e.target.value)} />
              <input required placeholder={t('apply.emergencyPhone')} className="border rounded px-3 py-2"
                value={form.emergency_contact_phone} onChange={(e) => handleChange('emergency_contact_phone', e.target.value)} />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              {t('apply.programTitle')}
            </h2>

            {loadingPrograms ? (
              <p className="text-gray-500 text-sm">{t('apply.loadingPrograms')}</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <select required className="border rounded px-3 py-2"
                  value={form.school_name} onChange={(e) => handleChange('school_name', e.target.value)}>
                  <option value="">{t('apply.selectSchool')}</option>
                  {schoolOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                <select required disabled={!form.school_name} className="border rounded px-3 py-2"
                  value={form.program_name} onChange={(e) => handleChange('program_name', e.target.value)}>
                  <option value="">{t('apply.selectProgram')}</option>
                  {programOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>

                <select required disabled={!form.program_name} className="border rounded px-3 py-2"
                  value={form.specialization_name} onChange={(e) => handleChange('specialization_name', e.target.value)}>
                  <option value="">{t('apply.selectSpecialization')}</option>
                  {specializationOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                <select required disabled={!form.program_name} className="border rounded px-3 py-2"
                  value={form.study_mode} onChange={(e) => handleChange('study_mode', e.target.value)}>
                  <option value="">{t('apply.selectStudyMode')}</option>
                  {studyModeOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              {t('apply.requirementsTitle')}
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('apply.entryTypeQuestion')}
            </label>
            <div className="flex gap-4 mb-6">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  required
                  type="radio"
                  name="entryType"
                  value="straight"
                  checked={entryType === 'straight'}
                  onChange={() => setEntryType('straight')}
                />
                {t('apply.straightEntry')}
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  required
                  type="radio"
                  name="entryType"
                  value="topup"
                  checked={entryType === 'topup'}
                  onChange={() => setEntryType('topup')}
                />
                {t('apply.topUp')}
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('apply.birthCertificate')}
                </label>
                <input
                  required
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="border rounded px-3 py-2 w-full text-sm"
                  onChange={(e) => setBirthCertFile(e.target.files[0])}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('apply.idCard')}
                </label>
                <input
                  required
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="border rounded px-3 py-2 w-full text-sm"
                  onChange={(e) => setIdFile(e.target.files[0])}
                />
              </div>

              {entryType === 'straight' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('apply.oLevel')}
                  </label>
                  <input
                    required
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="border rounded px-3 py-2 w-full text-sm"
                    onChange={(e) => setOLevelFile(e.target.files[0])}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {entryType === 'topup' ? t('apply.hndTranscript') : t('apply.aLevel')}
                </label>
                <input
                  required
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="border rounded px-3 py-2 w-full text-sm"
                  onChange={(e) => setTranscriptFile(e.target.files[0])}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {entryType === ''
                    ? t('apply.selectEntryTypeFirst')
                    : entryType === 'topup'
                    ? t('apply.uploadHnd')
                    : t('apply.uploadALevel')}
                </p>
              </div>
            </div>
          </section>

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <button type="submit" disabled={submitting}
            className="w-full bg-brand-red text-white py-3 rounded-md font-semibold hover:opacity-90 disabled:opacity-50">
            {submitting ? t('apply.submitting') : t('apply.submit')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Apply
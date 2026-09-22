import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Schools from './pages/Schools'
import SchoolPrograms from './pages/SchoolPrograms'
import Apply from './pages/Apply'
import Admissions from './pages/Admissions'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import StudentLogin from './pages/StudentLogin'
import Recordings from './pages/Recordings'
import Results from './pages/Results'

function WhatsAppButton() {
  return (
    <a href="https://wa.me/237654227103" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:opacity-90">
      <svg viewBox="0 0 32 32" className="w-8 h-8 fill-white">
        <path d="M16.004 3C9.377 3 4 8.377 4 15.004c0 2.386.624 4.62 1.71 6.556L4 29l7.62-1.677a11.94 11.94 0 0 0 4.384.83h.005c6.627 0 12.004-5.377 12.004-12.004C28.013 8.377 22.636 3 16.004 3zm0 21.86h-.004a9.9 9.9 0 0 1-5.05-1.386l-.362-.215-3.77.831.82-3.68-.235-.377a9.87 9.87 0 0 1-1.51-5.03c0-5.47 4.45-9.92 9.926-9.92 2.65 0 5.14 1.032 7.014 2.907a9.86 9.86 0 0 1 2.905 7.017c0 5.47-4.45 9.853-9.734 9.853zm5.44-7.39c-.298-.15-1.762-.87-2.036-.968-.273-.1-.472-.15-.67.15-.198.298-.767.968-.94 1.167-.174.198-.348.223-.646.075-.298-.15-1.257-.463-2.394-1.475-.885-.79-1.483-1.766-1.657-2.064-.174-.298-.018-.46.13-.61.135-.134.298-.348.447-.522.15-.174.198-.298.298-.497.1-.198.05-.373-.025-.522-.075-.15-.67-1.614-.918-2.21-.242-.58-.487-.502-.67-.51-.174-.008-.373-.01-.572-.01a1.1 1.1 0 0 0-.796.373c-.273.298-1.042 1.018-1.042 2.483s1.067 2.88 1.216 3.078c.15.198 2.1 3.204 5.086 4.494.71.307 1.264.49 1.696.626.712.226 1.36.194 1.872.118.571-.085 1.762-.72 2.01-1.415.248-.696.248-1.29.174-1.415-.075-.124-.273-.198-.571-.348z" />
      </svg>
    </a>
  )
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/schools/:schoolName" element={<SchoolPrograms />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/recordings" element={<Recordings />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App
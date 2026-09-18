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
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import Profile from './pages/profile/Profile';
import Skills from './pages/skills/Skills';
import Learning from './pages/learning/Learning';
import Coding from './pages/coding/Coding';
import ResumeList from './pages/resume/ResumeList';
import ResumeBuilder from './pages/resume/ResumeBuilder';
import CareerRecommendation from './pages/career/CareerRecommendation';
import RoadmapList from './pages/roadmap/RoadmapList';
import RoadmapDetail from './pages/roadmap/RoadmapDetail';
import InterviewStart from './pages/interview/InterviewStart';
import InterviewSessionPage from './pages/interview/InterviewSession';

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/learning" element={<Learning />} />
      <Route path="/coding" element={<Coding />} />
      <Route path="/resumes" element={<ResumeList />} />
      <Route path="/resumes/:id" element={<ResumeBuilder />} />
      <Route path="/career" element={<CareerRecommendation />} />
      <Route path="/roadmap" element={<RoadmapList />} />
      <Route path="/roadmap/:id" element={<RoadmapDetail />} />
      <Route path="/interview" element={<InterviewStart />} />
      <Route path="/interview/:id" element={<InterviewSessionPage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}


export default App;
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">AI Career Tracker</span>
        <div className="flex items-center gap-4">
                    <div className="flex gap-4">
        <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
        <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900">Profile</Link>
        <Link to="/skills" className="text-sm text-gray-600 hover:text-gray-900">Skills</Link>
        <Link to="/learning" className="text-sm text-gray-600 hover:text-gray-900">Learning</Link>
        <Link to="/coding" className="text-sm text-gray-600 hover:text-gray-900">Coding</Link>
        <Link to="/resumes" className="text-sm text-gray-600 hover:text-gray-900">Resumes</Link>
        <Link to="/career" className="text-sm text-gray-600 hover:text-gray-900">Career AI</Link>
        <Link to="/roadmap" className="text-sm text-gray-600 hover:text-gray-900">Roadmap</Link>
        <Link to="/interview" className="text-sm text-gray-600 hover:text-gray-900">Mock Interview</Link>
        <Link to="/jobs" className="text-sm text-gray-600 hover:text-gray-900">Jobs</Link>
        <Link to="/analytics" className="text-sm text-gray-600 hover:text-gray-900">Analytics</Link>
                {user?.role === 'admin' && (
        <Link to="/admin/users" className="text-sm text-purple-600 font-medium hover:text-purple-800">Admin</Link>
        )}
        <div className="flex items-center gap-4">
        <NotificationBell />
        <span className="text-sm text-gray-600">Hi, {user?.name}</span>
        <Button variant="secondary" onClick={logout}>Log Out</Button>
        </div>
        </div>
          <span className="text-sm text-gray-600">Hi, {user?.name}</span>
          <Button variant="secondary" onClick={logout}>
            Log Out
          </Button>
        </div>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
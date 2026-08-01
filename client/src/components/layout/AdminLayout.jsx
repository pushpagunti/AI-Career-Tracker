import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => (
  <div>
    <div className="flex gap-4 mb-6 border-b pb-3">
      <Link to="/admin/users" className="text-sm font-medium text-gray-700 hover:text-blue-600">Users</Link>
      <Link to="/admin/analytics" className="text-sm font-medium text-gray-700 hover:text-blue-600">Analytics</Link>
      <Link to="/admin/jobs" className="text-sm font-medium text-gray-700 hover:text-blue-600">Jobs</Link>
    </div>
    <Outlet />
  </div>
);

export default AdminLayout;
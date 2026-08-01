import { useState } from 'react';
import { useAdminUsers, useToggleUserActive } from '../../hooks/useAdmin';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AdminUsers = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers(page);
  const toggleMutation = useToggleUserActive();

  if (isLoading) return <p>Loading users...</p>;

  const { users, pagination } = data.data;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Role</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Joined</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b last:border-0">
                <td className="py-2">{u.name}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2 capitalize">{u.role}</td>
                <td className="py-2">
                  <span className={u.isActive ? 'text-green-600' : 'text-red-600'}>
                    {u.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="py-2">
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => toggleMutation.mutate(u._id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {u.isActive ? 'Disable' : 'Enable'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Page {pagination.page} of {pagination.totalPages} ({pagination.total} users)
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <Button variant="secondary" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
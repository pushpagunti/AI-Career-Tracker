import { useState } from 'react';
import { useAdminJobs, useCreateJob, useUpdateJob, useToggleJobActive } from '../../hooks/useAdmin';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const TYPE_OPTIONS = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
];

const emptyForm = {
  title: '', company: '', location: '', type: 'full-time',
  requiredSkills: '', preferredSkills: '', experienceLevel: 'entry', description: '', applyUrl: '',
};

const AdminJobs = () => {
  const { data, isLoading } = useAdminJobs();
  const createMutation = useCreateJob();
  const updateMutation = useUpdateJob();
  const toggleMutation = useToggleJobActive();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      requiredSkills: form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      preferredSkills: form.preferredSkills.split(',').map((s) => s.trim()).filter(Boolean),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload }, { onSuccess: () => { setForm(emptyForm); setEditingId(null); } });
    } else {
      createMutation.mutate(payload, { onSuccess: () => setForm(emptyForm) });
    }
  };

  const handleEdit = (job) => {
    setEditingId(job._id);
    setForm({
      title: job.title, company: job.company, location: job.location, type: job.type,
      requiredSkills: job.requiredSkills.join(', '), preferredSkills: job.preferredSkills.join(', '),
      experienceLevel: job.experienceLevel, description: job.description, applyUrl: job.applyUrl,
    });
  };

  if (isLoading) return <p>Loading jobs...</p>;

  const jobs = data.data.jobs;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Job Management</h1>

      <Card className="mb-6">
        <h2 className="font-semibold mb-3">{editingId ? 'Edit Job' : 'Add New Job'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Select label="Type" options={TYPE_OPTIONS} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
            <Input label="Required Skills (comma-separated)" value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} />
            <Input label="Preferred Skills (comma-separated)" value={form.preferredSkills} onChange={(e) => setForm({ ...form, preferredSkills: e.target.value })} />
            <Input label="Apply URL" value={form.applyUrl} onChange={(e) => setForm({ ...form, applyUrl: e.target.value })} />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingId ? 'Update Job' : 'Create Job'}
            </Button>
            {editingId && (
              <Button variant="secondary" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="space-y-2">
        {jobs.map((job) => (
          <Card key={job._id} className="flex justify-between items-center">
            <div>
              <span className="font-medium">{job.title}</span>
              <span className="text-sm text-gray-500 ml-2">{job.company} · {job.location}</span>
              {!job.isActive && <span className="text-xs text-red-500 ml-2">(inactive)</span>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEdit(job)} className="text-sm text-blue-600 hover:underline">Edit</button>
              <button onClick={() => toggleMutation.mutate(job._id)} className="text-sm text-gray-600 hover:underline">
                {job.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminJobs;
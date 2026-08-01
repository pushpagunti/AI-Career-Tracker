import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResume, useUpdateResume } from '../../hooks/useResumes';
import { downloadResumePdf } from '../../api/resume.api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const emptyResume = {
  title: '',
  personalInfo: { fullName: '', email: '', phone: '', location: '', links: { github: '', linkedin: '', portfolio: '' } },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
};

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useResume(id);
  const updateMutation = useUpdateResume();

  const [form, setForm] = useState(emptyResume);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (data?.data?.resume) {
      setForm(data.data.resume);
    }
  }, [data]);

  // --- Generic helpers for array-of-object fields (education, experience, projects, certifications) ---
  const addArrayItem = (field, emptyItem) => {
    setForm({ ...form, [field]: [...form[field], emptyItem] });
  };

  const removeArrayItem = (field, index) => {
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });
  };

  const updateArrayItem = (field, index, updates) => {
    const updated = form[field].map((item, i) => (i === index ? { ...item, ...updates } : item));
    setForm({ ...form, [field]: updated });
  };

  const handleSave = () => {
    updateMutation.mutate({ id, data: form });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await downloadResumePdf(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${form.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // free the browser-held memory for this blob
    } catch (error) {
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) return <p>Loading resume...</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate('/resumes')} className="text-sm text-blue-600 hover:underline">
          ← Back to Resumes
        </button>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleDownload} isLoading={isDownloading}>
            Download PDF
          </Button>
          <Button onClick={handleSave} isLoading={updateMutation.isPending}>
            Save
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <Input label="Resume Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </Card>

      {/* Personal Info */}
      <Card className="mb-4">
        <h2 className="font-semibold mb-3">Personal Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Full Name" value={form.personalInfo.fullName} onChange={(e) => setForm({ ...form, personalInfo: { ...form.personalInfo, fullName: e.target.value } })} />
          <Input label="Email" value={form.personalInfo.email} onChange={(e) => setForm({ ...form, personalInfo: { ...form.personalInfo, email: e.target.value } })} />
          <Input label="Phone" value={form.personalInfo.phone} onChange={(e) => setForm({ ...form, personalInfo: { ...form.personalInfo, phone: e.target.value } })} />
          <Input label="Location" value={form.personalInfo.location} onChange={(e) => setForm({ ...form, personalInfo: { ...form.personalInfo, location: e.target.value } })} />
          <Input label="GitHub" value={form.personalInfo.links.github} onChange={(e) => setForm({ ...form, personalInfo: { ...form.personalInfo, links: { ...form.personalInfo.links, github: e.target.value } } })} />
          <Input label="LinkedIn" value={form.personalInfo.links.linkedin} onChange={(e) => setForm({ ...form, personalInfo: { ...form.personalInfo, links: { ...form.personalInfo.links, linkedin: e.target.value } } })} />
        </div>
      </Card>

      {/* Summary */}
      <Card className="mb-4">
        <h2 className="font-semibold mb-3">Summary</h2>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
        />
      </Card>

      {/* Education */}
      <Card className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Education</h2>
          <button
            type="button"
            onClick={() => addArrayItem('education', { degree: '', institution: '', fieldOfStudy: '', startYear: '', endYear: '' })}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add
          </button>
        </div>
        {form.education.map((edu, i) => (
          <div key={i} className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-gray-100 last:border-0">
            <Input label="Degree" value={edu.degree} onChange={(e) => updateArrayItem('education', i, { degree: e.target.value })} />
            <Input label="Institution" value={edu.institution} onChange={(e) => updateArrayItem('education', i, { institution: e.target.value })} />
            <Input label="Start Year" value={edu.startYear} onChange={(e) => updateArrayItem('education', i, { startYear: e.target.value })} />
            <div className="flex items-end gap-2">
              <Input label="End Year" value={edu.endYear} onChange={(e) => updateArrayItem('education', i, { endYear: e.target.value })} className="flex-1" />
              <button type="button" onClick={() => removeArrayItem('education', i)} className="text-red-500 text-sm mb-4">
                Remove
              </button>
            </div>
          </div>
        ))}
      </Card>

      {/* Experience */}
      <Card className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Experience</h2>
          <button
            type="button"
            onClick={() => addArrayItem('experience', { role: '', company: '', startDate: '', endDate: '', bullets: [] })}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add
          </button>
        </div>
        {form.experience.map((exp, i) => (
          <div key={i} className="mb-4 pb-4 border-b border-gray-100 last:border-0">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <Input label="Role" value={exp.role} onChange={(e) => updateArrayItem('experience', i, { role: e.target.value })} />
              <Input label="Company" value={exp.company} onChange={(e) => updateArrayItem('experience', i, { company: e.target.value })} />
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bullet points (one per line)</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
              rows={3}
              value={exp.bullets.join('\n')}
              onChange={(e) => updateArrayItem('experience', i, { bullets: e.target.value.split('\n') })}
            />
            <button type="button" onClick={() => removeArrayItem('experience', i)} className="text-red-500 text-sm">
              Remove Experience
            </button>
          </div>
        ))}
      </Card>

      {/* Skills */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Skills</h2>
          <button
            type="button"
            onClick={() => addArrayItem('skills', { category: '', items: [] })}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Category
          </button>
        </div>
        {form.skills.map((s, i) => (
          <div key={i} className="flex gap-3 items-end mb-3">
            <Input label="Category" value={s.category} onChange={(e) => updateArrayItem('skills', i, { category: e.target.value })} className="w-40" />
            <Input
              label="Items (comma-separated)"
              value={s.items.join(', ')}
              onChange={(e) => updateArrayItem('skills', i, { items: e.target.value.split(',').map((t) => t.trim()) })}
              className="flex-1"
            />
            <button type="button" onClick={() => removeArrayItem('skills', i)} className="text-red-500 text-sm mb-4">
              Remove
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default ResumeBuilder;
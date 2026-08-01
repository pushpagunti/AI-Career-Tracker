import { useState } from 'react';
import { useSkills, useAddSkill, useDeleteSkill, useUpdateSkill } from '../../hooks/useSkills';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const CATEGORY_OPTIONS = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'devops', label: 'DevOps' },
  { value: 'dsa', label: 'DSA' },
  { value: 'soft-skill', label: 'Soft Skill' },
  { value: 'other', label: 'Other' },
];

const PROFICIENCY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const Skills = () => {
  const { data, isLoading, error } = useSkills();
  const addSkillMutation = useAddSkill();
  const updateSkillMutation = useUpdateSkill();
  const deleteSkillMutation = useDeleteSkill();

  const [form, setForm] = useState({ name: '', category: 'frontend', proficiency: 'beginner' });
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    addSkillMutation.mutate(form, {
      onSuccess: () => setForm({ name: '', category: 'frontend', proficiency: 'beginner' }),
      onError: (err) => setFormError(err.response?.data?.message || 'Failed to add skill'),
    });
  };

  const handleProficiencyChange = (id, proficiency) => {
    updateSkillMutation.mutate({ id, data: { proficiency } });
  };

  const handleDelete = (id) => {
    deleteSkillMutation.mutate(id);
  };

  if (isLoading) return <p>Loading skills...</p>;
  if (error) return <p className="text-red-600">Failed to load skills.</p>;

  const skills = data.data.skills;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Skills</h1>

      <Card className="mb-6">
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[150px]">
            <Input
              label="Skill name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="w-40">
            <Select
              label="Category"
              options={CATEGORY_OPTIONS}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div className="w-40">
            <Select
              label="Proficiency"
              options={PROFICIENCY_OPTIONS}
              value={form.proficiency}
              onChange={(e) => setForm({ ...form, proficiency: e.target.value })}
            />
          </div>
          <Button type="submit" isLoading={addSkillMutation.isPending} className="mb-4">
            Add Skill
          </Button>
        </form>
        {formError && <p className="text-sm text-red-600 mt-2">{formError}</p>}
      </Card>

      {skills.length === 0 ? (
        <p className="text-gray-500">No skills added yet. Add your first one above.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <Card key={skill._id}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{skill.name}</h3>
                <button
                  onClick={() => handleDelete(skill._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-2 capitalize">{skill.category}</p>
              <Select
                options={PROFICIENCY_OPTIONS}
                value={skill.proficiency}
                onChange={(e) => handleProficiencyChange(skill._id, e.target.value)}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Skills;
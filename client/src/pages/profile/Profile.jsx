import { useState, useEffect } from 'react';
import { useProfile, useSaveProfile } from '../../hooks/useProfile';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';


const EXPERIENCE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
];

const emptyForm = {
  bio: '',
  location: '',
  careerGoal: '',
  experienceLevel: 'student',
  links: { github: '', linkedin: '', portfolio: '' },
};

const Profile = () => {
  const { data, isLoading, error } = useProfile();
  const profileExists = !error; // a successful fetch means a profile already exists
  const saveMutation = useSaveProfile(profileExists);

  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.data?.profile) {
      const p = data.data.profile;
      setForm({
        bio: p.bio || '',
        location: p.location || '',
        careerGoal: p.careerGoal || '',
        experienceLevel: p.experienceLevel || 'student',
        links: { github: p.links?.github || '', linkedin: p.links?.linkedin || '', portfolio: p.links?.portfolio || '' },
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(false);
    saveMutation.mutate(form, { onSuccess: () => setSaved(true) });
  };

  if (isLoading) return <p>Loading profile...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <Input
            label="Bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <Input
            label="Career Goal"
            value={form.careerGoal}
            onChange={(e) => setForm({ ...form, careerGoal: e.target.value })}
            placeholder="e.g. Backend Developer"
          />
          <Select
            label="Experience Level"
            options={EXPERIENCE_OPTIONS}
            value={form.experienceLevel}
            onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
          />
          <Input
            label="GitHub URL"
            value={form.links.github}
            onChange={(e) => setForm({ ...form, links: { ...form.links, github: e.target.value } })}
          />
          <Input
            label="LinkedIn URL"
            value={form.links.linkedin}
            onChange={(e) => setForm({ ...form, links: { ...form.links, linkedin: e.target.value } })}
          />

          <Button type="submit" isLoading={saveMutation.isPending}>
            Save Profile
          </Button>
          {saved && <span className="ml-3 text-sm text-green-600">Saved!</span>}
        </form>
      </Card>
    </div>
  );

};

export default Profile;
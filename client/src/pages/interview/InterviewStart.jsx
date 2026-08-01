import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStartInterview, useInterviews } from '../../hooks/useInterview';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const COUNT_OPTIONS = [
  { value: 3, label: '3 Questions' },
  { value: 5, label: '5 Questions' },
  { value: 10, label: '10 Questions' },
];

const InterviewStart = () => {
  const [form, setForm] = useState({ role: '', difficulty: 'intermediate', questionCount: 5 });
  const startMutation = useStartInterview();
  const { data: historyData } = useInterviews();
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    if (!form.role.trim()) return;
    startMutation.mutate(form, {
      onSuccess: (res) => navigate(`/interview/${res.data.session._id}`),
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mock Interview</h1>

      <Card className="mb-6 max-w-xl">
        <form onSubmit={handleStart}>
          <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Backend Developer" />
          <Select label="Difficulty" options={DIFFICULTY_OPTIONS} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} />
          <Select
            label="Number of Questions"
            options={COUNT_OPTIONS}
            value={form.questionCount}
            onChange={(e) => setForm({ ...form, questionCount: Number(e.target.value) })}
          />
          <Button type="submit" isLoading={startMutation.isPending}>
            Start Interview
          </Button>
        </form>
        {startMutation.isPending && <LoadingState message="Preparing your interview questions..." />}
      </Card>

      <h2 className="text-lg font-semibold mb-3">Past Sessions</h2>
      {historyData?.data?.sessions?.length > 0 && (
        <div className="space-y-2">
          {historyData.data.sessions.map((s) => (
            <Card key={s._id} className="flex justify-between items-center cursor-pointer" onClick={() => navigate(`/interview/${s._id}`)}>
              <div>
                <span className="font-medium">{s.role}</span>
                <span className="text-sm text-gray-500 ml-2 capitalize">{s.difficulty} · {s.status}</span>
              </div>
              {s.overallScore != null && <span className="font-bold">{s.overallScore}/10</span>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewStart;
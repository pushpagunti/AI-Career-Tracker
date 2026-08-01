import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useProblems, useAddProblem, useDeleteProblem, useCodingStats } from '../../hooks/useCoding';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const PLATFORM_OPTIONS = [
  { value: 'leetcode', label: 'LeetCode' },
  { value: 'gfg', label: 'GeeksforGeeks' },
  { value: 'codeforces', label: 'Codeforces' },
  { value: 'hackerrank', label: 'HackerRank' },
  { value: 'other', label: 'Other' },
];

const Coding = () => {
  const { data: statsData, isLoading: statsLoading } = useCodingStats();
  const { data: problemsData, isLoading: problemsLoading } = useProblems();
  const addMutation = useAddProblem();
  const deleteMutation = useDeleteProblem();

  const [form, setForm] = useState({ title: '', platform: 'leetcode', difficulty: 'easy', topics: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate(
      { ...form, topics: form.topics.split(',').map((t) => t.trim()).filter(Boolean) },
      { onSuccess: () => setForm({ title: '', platform: 'leetcode', difficulty: 'easy', topics: '' }) }
    );
  };

  if (statsLoading || problemsLoading) return <p>Loading coding tracker...</p>;

  const stats = statsData.data;
  const problems = problemsData.data.problems;

  const difficultyChartData = [
    { name: 'Easy', count: stats.byDifficulty.easy },
    { name: 'Medium', count: stats.byDifficulty.medium },
    { name: 'Hard', count: stats.byDifficulty.hard },
  ];

  const last7DaysChartData = stats.last7Days.map((d) => ({
    date: d.date.slice(5), // trim year for a cleaner axis label, e.g. "07-25"
    count: d.count,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Coding Progress</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card><p className="text-sm text-gray-500">Total Solved</p><p className="text-2xl font-bold">{stats.totalSolved}</p></Card>
        <Card><p className="text-sm text-gray-500">Current Streak</p><p className="text-2xl font-bold">{stats.currentStreak} 🔥</p></Card>
        <Card><p className="text-sm text-gray-500">Longest Streak</p><p className="text-2xl font-bold">{stats.longestStreak}</p></Card>
        <Card><p className="text-sm text-gray-500">Easy / Med / Hard</p><p className="text-lg font-bold">{stats.byDifficulty.easy}/{stats.byDifficulty.medium}/{stats.byDifficulty.hard}</p></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="font-semibold mb-3">Difficulty Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={difficultyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold mb-3">Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={last7DaysChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="mb-6">
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[150px]">
            <Input label="Problem title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="w-40">
            <Select label="Platform" options={PLATFORM_OPTIONS} value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} />
          </div>
          <div className="w-32">
            <Select label="Difficulty" options={DIFFICULTY_OPTIONS} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} />
          </div>
          <div className="flex-1 min-w-[150px]">
            <Input label="Topics (comma-separated)" value={form.topics} onChange={(e) => setForm({ ...form, topics: e.target.value })} placeholder="Array, Hash Table" />
          </div>
          <Button type="submit" isLoading={addMutation.isPending} className="mb-4">Log Problem</Button>
        </form>
      </Card>

      <div className="space-y-2">
        {problems.map((p) => (
          <Card key={p._id} className="flex justify-between items-center py-3">
            <div>
              <span className="font-medium">{p.title}</span>
              <span className="text-sm text-gray-500 ml-2 capitalize">{p.platform} · {p.difficulty}</span>
            </div>
            <button onClick={() => deleteMutation.mutate(p._id)} className="text-red-500 hover:text-red-700 text-sm">
              Delete
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Coding;

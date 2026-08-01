import { usePlatformAnalytics } from '../../hooks/useAdmin';
import Card from '../../components/ui/Card';

const AdminAnalytics = () => {
  const { data, isLoading } = usePlatformAnalytics();

  if (isLoading) return <p>Loading platform analytics...</p>;

  const a = data.data;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Platform Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card><p className="text-sm text-gray-500">Total Users</p><p className="text-2xl font-bold">{a.totalUsers}</p></Card>
        <Card><p className="text-sm text-gray-500">Active Users</p><p className="text-2xl font-bold">{a.activeUsers}</p></Card>
        <Card><p className="text-sm text-gray-500">Disabled Users</p><p className="text-2xl font-bold">{a.disabledUsers}</p></Card>
        <Card><p className="text-sm text-gray-500">Resumes Created</p><p className="text-2xl font-bold">{a.totalResumesCreated}</p></Card>
        <Card><p className="text-sm text-gray-500">Skills Tracked</p><p className="text-2xl font-bold">{a.totalSkillsTracked}</p></Card>
        <Card><p className="text-sm text-gray-500">Problems Logged</p><p className="text-2xl font-bold">{a.totalProblemsLogged}</p></Card>
        <Card><p className="text-sm text-gray-500">Learning Completed</p><p className="text-2xl font-bold">{a.totalLearningItemsCompleted}</p></Card>
        <Card><p className="text-sm text-gray-500">Interviews Completed</p><p className="text-2xl font-bold">{a.totalInterviewsCompleted}</p></Card>
      </div>

      <Card>
        <h3 className="font-semibold mb-3">Top 10 Skills Platform-Wide</h3>
        <div className="space-y-2">
          {a.topSkills.map((s, i) => (
            <div key={s._id} className="flex justify-between items-center text-sm">
              <span>{i + 1}. {s._id}</span>
              <span className="text-gray-500">{s.count} users</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
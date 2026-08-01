import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  useOverview,
  useSkillsGrowth,
  useCodingActivityTrend,
  useLearningTrend,
  useInterviewTrend,
} from '../../hooks/useAnalytics';
import Card from '../../components/ui/Card';

const Analytics = () => {
  const { data: overview, isLoading: overviewLoading } = useOverview();
  const { data: skillsGrowth } = useSkillsGrowth();
  const { data: codingActivity } = useCodingActivityTrend();
  const { data: learningTrend } = useLearningTrend();
  const { data: interviewTrend } = useInterviewTrend();

  if (overviewLoading) return <p>Loading analytics...</p>;

  const o = overview.data;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card><p className="text-sm text-gray-500">Skills Tracked</p><p className="text-2xl font-bold">{o.totalSkills}</p></Card>
        <Card><p className="text-sm text-gray-500">Learning Completed</p><p className="text-2xl font-bold">{o.completedLearning}</p></Card>
        <Card><p className="text-sm text-gray-500">Problems Solved</p><p className="text-2xl font-bold">{o.totalProblems}</p></Card>
        <Card><p className="text-sm text-gray-500">Current Streak</p><p className="text-2xl font-bold">{o.currentStreak} 🔥</p></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {skillsGrowth && (
          <Card>
            <h3 className="font-semibold mb-3">Skills Growth</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={skillsGrowth.data.skillsGrowth.map((d) => ({ month: d._id, count: d.count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {learningTrend && (
          <Card>
            <h3 className="font-semibold mb-3">Learning Completed / Month</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={learningTrend.data.learningTrend.map((d) => ({ month: d._id, count: d.count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {codingActivity && (
          <Card>
            <h3 className="font-semibold mb-3">Coding Activity (90 days)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={codingActivity.data.codingActivity.map((d) => ({ date: d._id.slice(5), count: d.count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" interval={Math.floor(codingActivity.data.codingActivity.length / 6)} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {interviewTrend?.data?.interviewTrend?.length > 0 && (
          <Card>
            <h3 className="font-semibold mb-3">Interview Scores Over Time</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={interviewTrend.data.interviewTrend.map((s) => ({ date: new Date(s.completedAt).toLocaleDateString(), score: s.overallScore }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analytics;
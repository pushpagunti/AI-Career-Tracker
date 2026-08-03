import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../hooks/useDashboard';
import Card from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import {
  Layers,
  BookOpen,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import PageTransition from "../../components/layout/PageTransition";

const statusColors = {
  'not-started': 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
};

const Dashboard = () => {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    isError,
  } = useDashboard();

  if (isLoading) {
    return <p>Loading your dashboard...</p>;
  }

  if (isError || !data) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">
          Unable to load dashboard. Please login again.
        </p>
      </div>
    );
  }

  // Support both API shapes:
  // { data: {...} } and { ... }
  const dashboard = data.data || data;

  const {
    skillsSummary,
    learningSummary,
    recentActivity,
  } = dashboard;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">
        Welcome back, {user?.name}
      </h1>

      <p className="text-gray-500 mb-6">
        Here's where you stand today.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={Layers}
        label="Total Skills"
        value={skillsSummary?.totalSkills || 0}
        color="blue"
        index={0}
      />

      <StatCard
        icon={BookOpen}
        label="Learning Items"
        value={learningSummary?.totalItems || 0}
        color="purple"
        index={1}
      />

      <StatCard
        icon={CheckCircle2}
        label="Completed"
        value={learningSummary?.completed || 0}
        color="green"
        trend={
          learningSummary?.totalItems
            ? `${learningSummary.completed}/${learningSummary.totalItems}`
            : null
        }
        index={2}
      />

      <StatCard
        icon={TrendingUp}
        label="Completion Rate"
        value={learningSummary?.completionRate || 0}
        suffix="%"
        color="orange"
        index={3}
      />
    </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="font-semibold mb-3">
            Skills by Category
          </h3>

          {!skillsSummary?.byCategory?.length ? (
            <p className="text-sm text-gray-400">
              No skills tracked yet.{" "}
              <Link
                to="/skills"
                className="text-blue-600 hover:underline"
              >
                Add some
              </Link>
            </p>
          ) : (
            <div className="space-y-2">
              {skillsSummary.byCategory.map((c) => (
                <div
                  key={c._id}
                  className="flex justify-between text-sm"
                >
                  <span className="capitalize">
                    {c._id}
                  </span>

                  <span className="text-gray-500">
                    {c.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold mb-3">
            Recent Learning Activity
          </h3>

          {!recentActivity?.length ? (
            <p className="text-sm text-gray-400">
              Nothing logged yet.
            </p>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm"
                >
                  <span>{item.title}</span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      statusColors[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/skills">
          <Card className="text-center hover:shadow-md cursor-pointer">
            ➕ Add Skill
          </Card>
        </Link>

        <Link to="/coding">
          <Card className="text-center hover:shadow-md cursor-pointer">
            💻 Log Problem
          </Card>
        </Link>

        <Link to="/resumes">
          <Card className="text-center hover:shadow-md cursor-pointer">
            📄 Build Resume
          </Card>
        </Link>

        <Link to="/interview">
          <Card className="text-center hover:shadow-md cursor-pointer">
            🎤 Mock Interview
          </Card>
        </Link>
      </div>
    </div>
  );
   return (
    <PageTransition>
      <div>
        {/* existing dashboard */}
      </div>
    </PageTransition>
  );
};

export default Dashboard;
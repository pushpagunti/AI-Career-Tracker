import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}</h1>
      <p className="text-gray-600">Your career tracker dashboard will build out here over the next sub-phases.</p>
    </div>
  );
};

export default Dashboard;
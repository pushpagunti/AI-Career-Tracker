import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoadmaps, useGenerateRoadmap } from '../../hooks/useRoadmap';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';

const RoadmapList = () => {
  const { data, isLoading } = useRoadmaps();
  const generateMutation = useGenerateRoadmap();
  const [targetRole, setTargetRole] = useState('');
  const navigate = useNavigate();

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!targetRole.trim()) return;
    generateMutation.mutate(
      { targetRole },
      { onSuccess: (res) => navigate(`/roadmap/${res.data.roadmap._id}`) }
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Learning Roadmaps</h1>

      <Card className="mb-6">
        <form onSubmit={handleGenerate} className="flex items-end gap-4">
          <div className="flex-1">
            <Input
              label="Target Role"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Backend Developer"
            />
          </div>
          <Button type="submit" isLoading={generateMutation.isPending} className="mb-4">
            Generate Roadmap
          </Button>
        </form>
        {generateMutation.isPending && <LoadingState message="Building your roadmap..." />}
      </Card>

      {isLoading ? (
        <p>Loading roadmaps...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.data.roadmaps.map((r) => (
            <Card key={r._id} className="cursor-pointer hover:shadow-md" onClick={() => navigate(`/roadmap/${r._id}`)}>
              <h3 className="font-semibold">{r.targetRole}</h3>
              <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoadmapList;
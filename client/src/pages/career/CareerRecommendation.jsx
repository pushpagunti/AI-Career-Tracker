import { useGenerateRecommendation, useRecommendationHistory } from '../../hooks/useCareer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';

const fitColors = {
  'strong-match': 'bg-green-100 text-green-700',
  'growth-opportunity': 'bg-blue-100 text-blue-700',
  'stretch-goal': 'bg-purple-100 text-purple-700',
};

const CareerRecommendation = () => {
  const generateMutation = useGenerateRecommendation();
  const { data: historyData, isLoading: historyLoading } = useRecommendationHistory();

  const latest = generateMutation.data?.data;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Career Recommendations</h1>
        <Button onClick={() => generateMutation.mutate()} isLoading={generateMutation.isPending}>
          Generate New Recommendation
        </Button>
      </div>

      {generateMutation.isPending && <LoadingState message="Analyzing your skills and goals..." />}

      {generateMutation.isError && (
        <p className="text-red-600 mb-4">
          {generateMutation.error.response?.data?.message || 'Failed to generate recommendation.'}
        </p>
      )}

      {latest && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {latest.recommendations.map((rec, i) => (
            <Card key={i}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{rec.role}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${fitColors[rec.fitLevel]}`}>
                  {rec.fitLevel.replace('-', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{rec.rationale}</p>
              <p className="text-xs text-gray-400 mb-1">Skill gaps:</p>
              <div className="flex flex-wrap gap-1">
                {rec.skillGaps.map((gap) => (
                  <span key={gap} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {gap}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      <h2 className="text-lg font-semibold mb-3">History</h2>
      {historyLoading ? (
        <p>Loading history...</p>
      ) : historyData.data.history.length === 0 ? (
        <p className="text-gray-500">No past recommendations yet.</p>
      ) : (
        <div className="space-y-2">
          {historyData.data.history.map((h) => (
            <Card key={h._id} className="text-sm">
              <span className="text-gray-400">{new Date(h.createdAt).toLocaleDateString()}</span>
              <span className="ml-3">{h.recommendations.map((r) => r.role).join(', ')}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerRecommendation;
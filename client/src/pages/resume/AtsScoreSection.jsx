import { useState } from 'react';
import { useScoreResume, useScoreHistory } from '../../hooks/useAts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const scoreColor = (percentage) => {
  if (percentage >= 70) return 'text-green-600';
  if (percentage >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

const AtsScoreSection = ({ resumeId }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const scoreMutation = useScoreResume();
  const { data: historyData } = useScoreHistory(resumeId);

  const handleScore = () => {
    if (!jobDescription.trim()) return;
    scoreMutation.mutate(
      { resumeId, jobDescription },
      { onSuccess: (res) => setResult(res.data.result) }
    );
  };

  return (
    <Card className="mt-6">
      <h2 className="font-semibold mb-3">ATS Resume Score</h2>
      <p className="text-sm text-gray-500 mb-3">
        Paste a job description to see how well this resume matches, based on keyword coverage and structure.
      </p>

      <textarea
        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
        rows={5}
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <Button onClick={handleScore} isLoading={scoreMutation.isPending} disabled={!jobDescription.trim()}>
        Score Resume
      </Button>

      {result && (
        <div className="mt-6 border-t pt-4">
          <div className="flex items-baseline gap-2 mb-4">
            <span className={`text-4xl font-bold ${scoreColor(result.overallScore)}`}>
              {result.overallScore}
            </span>
            <span className="text-gray-500">/ 100 overall</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Keyword Match ({result.keywordScore.percentage}%)
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                {result.keywordScore.matched.map((kw) => (
                  <span key={kw} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {kw}
                  </span>
                ))}
              </div>
              {result.keywordScore.missing.length > 0 && (
                <>
                  <p className="text-xs text-gray-500 mb-1">Missing:</p>
                  <div className="flex flex-wrap gap-1">
                    {result.keywordScore.missing.map((kw) => (
                      <span key={kw} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Structure ({result.structureScore.percentage}%)
              </p>
              <ul className="text-sm space-y-1">
                {result.structureScore.checks.map((c) => (
                  <li key={c.label} className="flex items-start gap-2">
                    <span>{c.passed ? '✅' : '⚠️'}</span>
                    <span>
                      {c.label}
                      {!c.passed && <span className="text-gray-400 block text-xs">{c.message}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {historyData?.data?.history?.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Past Attempts</p>
          <div className="space-y-1">
            {historyData.data.history.map((h) => (
              <div key={h._id} className="flex justify-between text-sm text-gray-600">
                <span>{new Date(h.createdAt).toLocaleDateString()}</span>
                <span className={scoreColor(h.overallScore)}>{h.overallScore} / 100</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default AtsScoreSection;
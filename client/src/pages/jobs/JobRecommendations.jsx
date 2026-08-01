import { useRecommendedJobs } from '../../hooks/useJobs';
import Card from '../../components/ui/Card';

const matchColor = (score) => {
  if (score >= 70) return 'bg-green-100 text-green-700';
  if (score >= 40) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

const JobRecommendations = () => {
  const { data, isLoading } = useRecommendedJobs();

  if (isLoading) return <p>Finding matches...</p>;

  const jobs = data.data.jobs;

  if (data.message) {
    return <p className="text-gray-500">{data.message}</p>; // "add skills" empty state from the backend
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Recommended Jobs</h1>
      <div className="space-y-4">
        {jobs.map(({ job, matchScore, matchedRequired, missingRequired, matchedPreferred }) => (
          <Card key={job._id}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.company} · {job.location} · {job.type}</p>
              </div>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${matchColor(matchScore)}`}>
                {matchScore}% match
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{job.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-1">Matched</p>
                <div className="flex flex-wrap gap-1">
                  {[...matchedRequired, ...matchedPreferred].map((s) => (
                    <span key={s} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{s}</span>
                  ))}
                </div>
              </div>
              {missingRequired.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Missing (required)</p>
                  <div className="flex flex-wrap gap-1">
                    {missingRequired.map((s) => (
                      <span key={s} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {job.applyUrl && (
              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-3 inline-block">
                View Listing →
              </a>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobRecommendations;
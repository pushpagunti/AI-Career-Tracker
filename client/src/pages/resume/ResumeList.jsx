import { useNavigate } from 'react-router-dom';
import { useResumes, useCreateResume, useDeleteResume } from '../../hooks/useResumes';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ResumeList = () => {
  const { data, isLoading } = useResumes();
  const createMutation = useCreateResume();
  const deleteMutation = useDeleteResume();
  const navigate = useNavigate();

  const handleCreate = () => {
    createMutation.mutate(
      { title: 'Untitled Resume' },
      { onSuccess: (res) => navigate(`/resumes/${res.data.resume._id}`) }
    );
  };

  if (isLoading) return <p>Loading resumes...</p>;

  const resumes = data.data.resumes;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resumes</h1>
        <Button onClick={handleCreate} isLoading={createMutation.isPending}>
          + New Resume
        </Button>
      </div>

      {resumes.length === 0 ? (
        <p className="text-gray-500">No resumes yet — create your first one, pre-filled from your Profile and Skills.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {resumes.map((r) => (
            <Card key={r._id}>
              <h3 className="font-semibold mb-1">{r.title}</h3>
              <p className="text-xs text-gray-400 mb-3">
                Updated {new Date(r.updatedAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => navigate(`/resumes/${r._id}`)}>
                  Edit
                </Button>
                <button
                  onClick={() => deleteMutation.mutate(r._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeList;
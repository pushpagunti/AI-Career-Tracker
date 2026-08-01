import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterviewSession, useSubmitAnswer, useCompleteInterview } from '../../hooks/useInterview';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';

const InterviewSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useInterviewSession(id);
  const submitMutation = useSubmitAnswer();
  const completeMutation = useCompleteInterview();

  const [answerDraft, setAnswerDraft] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);

  if (isLoading) return <p>Loading session...</p>;

  const session = data.data.session;
  const isComplete = session.status === 'completed';

  const handleSubmit = (index) => {
    if (!answerDraft.trim()) return;
    submitMutation.mutate(
      { sessionId: id, data: { questionIndex: index, answer: answerDraft } },
      {
        onSuccess: () => {
          setAnswerDraft('');
          setActiveIndex(null);
        },
      }
    );
  };

  const handleComplete = () => {
    completeMutation.mutate(id, {
      onSuccess: () => navigate('/interview'),
    });
  };

  const answeredCount = session.questions.filter((q) => q.userAnswer).length;

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{session.role} Interview</h1>
          <p className="text-sm text-gray-500 capitalize">{session.difficulty} · {answeredCount}/{session.questions.length} answered</p>
        </div>
        {!isComplete && answeredCount > 0 && (
          <Button onClick={handleComplete} isLoading={completeMutation.isPending}>
            Finish Interview
          </Button>
        )}
        {isComplete && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Overall Score</p>
            <p className="text-2xl font-bold">{session.overallScore}/10</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {session.questions.map((q, i) => (
          <Card key={i}>
            <p className="font-medium mb-2">
              Q{i + 1}. {q.questionText}
            </p>

            {q.userAnswer ? (
              <div>
                <p className="text-sm text-gray-600 bg-gray-50 rounded p-3 mb-3">{q.userAnswer}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold">Score: {q.feedback.score}/10</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-green-700 font-medium mb-1">Strengths</p>
                    <ul className="text-gray-600 list-disc list-inside">
                      {q.feedback.strengths.map((s, si) => <li key={si}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-yellow-700 font-medium mb-1">Improvements</p>
                    <ul className="text-gray-600 list-disc list-inside">
                      {q.feedback.improvements.map((s, si) => <li key={si}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ) : activeIndex === i ? (
              <div>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  rows={4}
                  value={answerDraft}
                  onChange={(e) => setAnswerDraft(e.target.value)}
                  placeholder="Type your answer..."
                  autoFocus
                />
                {submitMutation.isPending ? (
                  <LoadingState message="Evaluating your answer..." />
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => handleSubmit(i)}>Submit Answer</Button>
                    <Button variant="secondary" onClick={() => { setActiveIndex(null); setAnswerDraft(''); }}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              !isComplete && (
                <Button variant="secondary" onClick={() => setActiveIndex(i)}>
                  Answer
                </Button>
              )
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InterviewSessionPage;
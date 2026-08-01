import { useParams } from 'react-router-dom';
import { useRoadmap, useLinkTopic } from '../../hooks/useRoadmap';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const RoadmapDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useRoadmap(id);
  const linkMutation = useLinkTopic();

  if (isLoading) return <p>Loading roadmap...</p>;

  const roadmap = data.data.roadmap;

  const findLink = (topic) => roadmap.progressLinks.find((p) => p.topic === topic);

  const handleStartTopic = (topic) => {
    linkMutation.mutate({ id, data: { topic, createNew: true, title: topic } });
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-1">{roadmap.targetRole} Roadmap</h1>
      <p className="text-gray-500 mb-6">Based on your skills at time of generation</p>

      <div className="space-y-6">
        {roadmap.stages.map((stage, i) => (
          <Card key={i}>
            <div className="flex justify-between items-baseline mb-3">
              <h2 className="font-semibold">{stage.stageTitle}</h2>
              <span className="text-xs text-gray-400">{stage.estimatedDuration}</span>
            </div>
            <div className="space-y-3">
              {stage.topics.map((topic, j) => {
                const link = findLink(topic.topic);
                const linkedItem = link?.learningItem;
                const isCompleted = linkedItem?.status === 'completed';
                const isInProgress = linkedItem?.status === 'in-progress';

                return (
                  <div key={j} className="border-t pt-3 first:border-0 first:pt-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">
                          {topic.topic}
                          {isCompleted && <span className="ml-2 text-green-600 text-xs">✅ Completed</span>}
                          {isInProgress && <span className="ml-2 text-blue-600 text-xs">In Progress</span>}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{topic.description}</p>
                      </div>
                      {!linkedItem && (
                        <Button
                          variant="secondary"
                          onClick={() => handleStartTopic(topic.topic)}
                          isLoading={linkMutation.isPending}
                          className="text-xs"
                        >
                          Start Learning
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoadmapDetail;
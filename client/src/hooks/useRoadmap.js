import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateRoadmap, getRoadmaps, getRoadmapById, linkTopic } from '../api/roadmap.api';

export const useRoadmaps = () => useQuery({ queryKey: ['roadmaps'], queryFn: getRoadmaps });

export const useRoadmap = (id) =>
  useQuery({ queryKey: ['roadmap', id], queryFn: () => getRoadmapById(id), enabled: Boolean(id) });

export const useGenerateRoadmap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateRoadmap,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roadmaps'] }),
  });
};

export const useLinkTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: linkTopic,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roadmap', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['learningItems'] }); // linking can create a new LearningItem
    },
  });
};
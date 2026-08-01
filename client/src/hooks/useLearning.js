import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLearningItems, addLearningItem, updateLearningItem, deleteLearningItem } from '../api/learning.api';

export const useLearningItems = (status) => {
  return useQuery({
    queryKey: ['learningItems', { status }],
    queryFn: () => getLearningItems(status),
  });
};

const useInvalidateLearning = () => {
  const queryClient = useQueryClient();
  // invalidate ALL learningItems queries, regardless of status filter,
  // since a mutation could affect any filtered view
  return () => queryClient.invalidateQueries({ queryKey: ['learningItems'] });
};

export const useAddLearningItem = () => {
  const invalidate = useInvalidateLearning();
  return useMutation({ mutationFn: addLearningItem, onSuccess: invalidate });
};

export const useUpdateLearningItem = () => {
  const invalidate = useInvalidateLearning();
  return useMutation({ mutationFn: updateLearningItem, onSuccess: invalidate });
};

export const useDeleteLearningItem = () => {
  const invalidate = useInvalidateLearning();
  return useMutation({ mutationFn: deleteLearningItem, onSuccess: invalidate });
};
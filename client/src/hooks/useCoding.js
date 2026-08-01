import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProblems, addProblem, deleteProblem, getCodingStats } from '../api/coding.api';

export const useProblems = (filters = {}) => {
  return useQuery({
    queryKey: ['problems', filters],
    queryFn: () => getProblems(filters),
  });
};

export const useCodingStats = () => {
  return useQuery({
    queryKey: ['codingStats'],
    queryFn: getCodingStats,
  });
};

const useInvalidateCoding = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['problems'] });
    queryClient.invalidateQueries({ queryKey: ['codingStats'] }); // stats depend on problems too
  };
};

export const useAddProblem = () => {
  const invalidate = useInvalidateCoding();
  return useMutation({ mutationFn: addProblem, onSuccess: invalidate });
};

export const useDeleteProblem = () => {
  const invalidate = useInvalidateCoding();
  return useMutation({ mutationFn: deleteProblem, onSuccess: invalidate });
};
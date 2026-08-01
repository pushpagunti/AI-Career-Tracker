import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { scoreResume, getScoreHistory } from '../api/ats.api';

export const useScoreResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scoreResume,
    onSuccess: (_, variables) => {
      // history should reflect this new attempt too
      queryClient.invalidateQueries({ queryKey: ['atsHistory', variables.resumeId] });
    },
  });
};

export const useScoreHistory = (resumeId) => {
  return useQuery({
    queryKey: ['atsHistory', resumeId],
    queryFn: () => getScoreHistory(resumeId),
    enabled: Boolean(resumeId),
  });
};
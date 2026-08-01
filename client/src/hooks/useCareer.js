import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateRecommendation, getRecommendationHistory } from '../api/career.api';

export const useGenerateRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateRecommendation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['careerHistory'] }),
  });
};

export const useRecommendationHistory = () => {
  return useQuery({ queryKey: ['careerHistory'], queryFn: getRecommendationHistory });
};

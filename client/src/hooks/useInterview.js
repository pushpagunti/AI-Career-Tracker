import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviews,
  getInterviewById,
} from '../api/interview.api';

export const useInterviews = () => useQuery({ queryKey: ['interviews'], queryFn: getInterviews });

export const useInterviewSession = (id) =>
  useQuery({ queryKey: ['interview', id], queryFn: () => getInterviewById(id), enabled: Boolean(id) });

export const useStartInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startInterview,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interviews'] }),
  });
};

export const useSubmitAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitAnswer,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['interview', variables.sessionId] });
    },
  });
};

export const useCompleteInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeInterview,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['interview', id] });
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });
};
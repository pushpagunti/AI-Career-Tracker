import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} from '../api/resume.api';

export const useResumes = () => {
  return useQuery({ queryKey: ['resumes'], queryFn: getResumes });
};

export const useResume = (id) => {
  return useQuery({
    queryKey: ['resume', id],
    queryFn: () => getResumeById(id),
    enabled: Boolean(id), // don't fire the request until we actually have an id
  });
};

export const useCreateResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createResume,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  });
};

export const useUpdateResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateResume,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resume', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['resumes'] }); // list view shows updatedAt too
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteResume,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  });
};
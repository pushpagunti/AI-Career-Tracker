import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminUsers,
  toggleUserActive,
  getPlatformAnalytics,
  createJob,
  updateJob,
  toggleJobActive,
} from '../api/admin.api';
import { getJobs } from '../api/job.api';

export const useAdminUsers = (page) => {
  return useQuery({ queryKey: ['adminUsers', page], queryFn: () => getAdminUsers(page) });
};

export const useToggleUserActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleUserActive,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminUsers'] }),
  });
};

export const usePlatformAnalytics = () => {
  return useQuery({ queryKey: ['platformAnalytics'], queryFn: getPlatformAnalytics });
};

export const useAdminJobs = () => {
  // reuse the public job listing endpoint for the admin job list too — same data, admin just gets edit controls on top
  return useQuery({ queryKey: ['adminJobs'], queryFn: () => getJobs({}) });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedJobs'] }); // affects the public/user-facing job view too
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedJobs'] });
    },
  });
};

export const useToggleJobActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleJobActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedJobs'] });
    },
  });
};
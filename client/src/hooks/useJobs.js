import { useQuery } from '@tanstack/react-query';
import { getRecommendedJobs } from '../api/job.api';

export const useRecommendedJobs = () => {
  return useQuery({ queryKey: ['recommendedJobs'], queryFn: getRecommendedJobs });
};
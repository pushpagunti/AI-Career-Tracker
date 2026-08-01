import { useQuery } from '@tanstack/react-query';
import {
  getOverview,
  getSkillsGrowth,
  getCodingActivity,
  getLearningTrend,
  getInterviewTrend,
} from '../api/analytics.api';

export const useOverview = () => useQuery({ queryKey: ['analyticsOverview'], queryFn: getOverview });
export const useSkillsGrowth = () => useQuery({ queryKey: ['skillsGrowth'], queryFn: getSkillsGrowth });
export const useCodingActivityTrend = () => useQuery({ queryKey: ['codingActivityTrend'], queryFn: getCodingActivity });
export const useLearningTrend = () => useQuery({ queryKey: ['learningTrend'], queryFn: getLearningTrend });
export const useInterviewTrend = () => useQuery({ queryKey: ['interviewTrend'], queryFn: getInterviewTrend });
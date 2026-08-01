import axiosInstance from './axiosInstance';

export const getOverview = () => axiosInstance.get('/analytics/overview').then((res) => res.data);
export const getSkillsGrowth = () => axiosInstance.get('/analytics/skills-growth').then((res) => res.data);
export const getCodingActivity = () => axiosInstance.get('/analytics/coding-activity').then((res) => res.data);
export const getLearningTrend = () => axiosInstance.get('/analytics/learning-trend').then((res) => res.data);
export const getInterviewTrend = () => axiosInstance.get('/analytics/interview-trend').then((res) => res.data);
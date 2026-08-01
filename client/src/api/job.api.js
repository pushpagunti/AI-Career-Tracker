import axiosInstance from './axiosInstance';

export const getRecommendedJobs = () => axiosInstance.get('/jobs/recommended').then((res) => res.data);
export const getJobs = (filters) => axiosInstance.get('/jobs', { params: filters }).then((res) => res.data);
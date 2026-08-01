import axiosInstance from './axiosInstance';

export const generateRecommendation = () => axiosInstance.post('/career/recommend').then((res) => res.data);
export const getRecommendationHistory = () => axiosInstance.get('/career/history').then((res) => res.data);
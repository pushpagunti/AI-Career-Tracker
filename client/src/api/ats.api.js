import axiosInstance from './axiosInstance';

export const scoreResume = (data) => axiosInstance.post('/ats/score', data).then((res) => res.data);
export const getScoreHistory = (resumeId) =>
  axiosInstance.get(`/ats/history/${resumeId}`).then((res) => res.data);
import axiosInstance from './axiosInstance';

export const startInterview = (data) => axiosInstance.post('/interview/start', data).then((res) => res.data);
export const submitAnswer = ({ sessionId, data }) =>
  axiosInstance.post(`/interview/${sessionId}/answer`, data).then((res) => res.data);
export const completeInterview = (id) => axiosInstance.post(`/interview/${id}/complete`).then((res) => res.data);
export const getInterviews = () => axiosInstance.get('/interview').then((res) => res.data);
export const getInterviewById = (id) => axiosInstance.get(`/interview/${id}`).then((res) => res.data);
import axiosInstance from './axiosInstance';

export const generateRoadmap = (data) => axiosInstance.post('/roadmap/generate', data).then((res) => res.data);
export const getRoadmaps = () => axiosInstance.get('/roadmap').then((res) => res.data);
export const getRoadmapById = (id) => axiosInstance.get(`/roadmap/${id}`).then((res) => res.data);
export const linkTopic = ({ id, data }) => axiosInstance.post(`/roadmap/${id}/link-topic`, data).then((res) => res.data);
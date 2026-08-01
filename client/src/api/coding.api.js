import axiosInstance from './axiosInstance';

export const getProblems = (filters) => axiosInstance.get('/coding', { params: filters }).then((res) => res.data);
export const addProblem = (data) => axiosInstance.post('/coding', data).then((res) => res.data);
export const deleteProblem = (id) => axiosInstance.delete(`/coding/${id}`).then((res) => res.data);
export const getCodingStats = () => axiosInstance.get('/coding/stats').then((res) => res.data);

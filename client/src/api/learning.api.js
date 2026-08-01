import axiosInstance from './axiosInstance';

export const getLearningItems = (status) =>
  axiosInstance.get('/learning', { params: status ? { status } : {} }).then((res) => res.data);

export const addLearningItem = (data) => axiosInstance.post('/learning', data).then((res) => res.data);

export const updateLearningItem = ({ id, data }) =>
  axiosInstance.put(`/learning/${id}`, data).then((res) => res.data);

export const deleteLearningItem = (id) => axiosInstance.delete(`/learning/${id}`).then((res) => res.data);
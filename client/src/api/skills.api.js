import axiosInstance from './axiosInstance';

export const getSkills = () => axiosInstance.get('/skills').then((res) => res.data);
export const addSkill = (data) => axiosInstance.post('/skills', data).then((res) => res.data);
export const updateSkill = ({ id, data }) => axiosInstance.put(`/skills/${id}`, data).then((res) => res.data);
export const deleteSkill = (id) => axiosInstance.delete(`/skills/${id}`).then((res) => res.data);
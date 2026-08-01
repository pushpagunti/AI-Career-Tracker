import axiosInstance from './axiosInstance';

export const getResumes = () => axiosInstance.get('/resumes').then((res) => res.data);
export const getResumeById = (id) => axiosInstance.get(`/resumes/${id}`).then((res) => res.data);
export const createResume = (data) => axiosInstance.post('/resumes', data).then((res) => res.data);
export const updateResume = ({ id, data }) => axiosInstance.put(`/resumes/${id}`, data).then((res) => res.data);
export const deleteResume = (id) => axiosInstance.delete(`/resumes/${id}`).then((res) => res.data);

export const downloadResumePdf = (id) =>
  axiosInstance.get(`/resumes/${id}/pdf`, { responseType: 'blob' }).then((res) => res.data);

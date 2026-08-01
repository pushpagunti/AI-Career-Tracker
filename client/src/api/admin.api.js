import axiosInstance from './axiosInstance';

export const getAdminUsers = (page) => axiosInstance.get('/admin/users', { params: { page } }).then((res) => res.data);
export const toggleUserActive = (id) => axiosInstance.put(`/admin/users/${id}/toggle-active`).then((res) => res.data);
export const getPlatformAnalytics = () => axiosInstance.get('/admin/analytics').then((res) => res.data);
export const createJob = (data) => axiosInstance.post('/admin/jobs', data).then((res) => res.data);
export const updateJob = ({ id, data }) => axiosInstance.put(`/admin/jobs/${id}`, data).then((res) => res.data);
export const toggleJobActive = (id) => axiosInstance.put(`/admin/jobs/${id}/toggle-active`).then((res) => res.data);
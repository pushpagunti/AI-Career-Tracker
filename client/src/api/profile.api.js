import axiosInstance from './axiosInstance';

export const getProfile = () => axiosInstance.get('/profile').then((res) => res.data);
export const createProfile = (data) => axiosInstance.post('/profile', data).then((res) => res.data);
export const updateProfile = (data) => axiosInstance.put('/profile', data).then((res) => res.data);
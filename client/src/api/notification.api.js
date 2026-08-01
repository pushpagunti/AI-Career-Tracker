import axiosInstance from './axiosInstance';

export const getNotifications = () => axiosInstance.get('/notifications').then((res) => res.data);
export const getUnreadCount = () => axiosInstance.get('/notifications/unread-count').then((res) => res.data);
export const markAsRead = (id) => axiosInstance.put(`/notifications/${id}/read`).then((res) => res.data);
export const markAllAsRead = () => axiosInstance.put('/notifications/read-all').then((res) => res.data);
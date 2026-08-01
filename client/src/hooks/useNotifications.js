import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../api/notification.api';

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    refetchInterval: 30000, // poll every 30s
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: getUnreadCount,
    refetchInterval: 30000,
  });
};

const useInvalidateNotifications = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
  };
};

export const useMarkAsRead = () => {
  const invalidate = useInvalidateNotifications();
  return useMutation({ mutationFn: markAsRead, onSuccess: invalidate });
};

export const useMarkAllAsRead = () => {
  const invalidate = useInvalidateNotifications();
  return useMutation({ mutationFn: markAllAsRead, onSuccess: invalidate });
};
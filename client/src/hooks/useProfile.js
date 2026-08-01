import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, createProfile, updateProfile } from '../api/profile.api';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    retry: false, // a 404 (no profile yet) is expected, not worth retrying
  });
};

export const useSaveProfile = (profileExists) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileExists ? updateProfile : createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
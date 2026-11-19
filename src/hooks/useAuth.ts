import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useAuth() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await api.get('/api/me');
      return response.data;
    },
    retry: false,
  });
}

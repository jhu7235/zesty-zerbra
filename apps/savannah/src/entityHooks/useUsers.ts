import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../clients/api-client';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
}

interface UsersResponse {
  users: User[];
}

interface UserResponse {
  user: User;
}

export const USERS_QUERY_KEY = ['users'] as const;

export function useUsers() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: async (): Promise<User[]> => {
      const response = await apiClient.get<UsersResponse>('/users');
      return response.users;
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserData): Promise<User> => {
      const response = await apiClient.post<UserResponse>('/users', userData);
      return response.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, ...userData }: { id: string } & UpdateUserData): Promise<User> => {
      const response = await apiClient.put<UserResponse>(`/users/${id}`, userData);
      return response.user;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...USERS_QUERY_KEY, data.id] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string): Promise<string> => {
      await apiClient.delete(`/users/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });

  return {
    // Query data and state
    users: usersQuery.data,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    refetch: usersQuery.refetch,

    // Mutations
    createUser: createUserMutation.mutate,
    createUserAsync: createUserMutation.mutateAsync,
    isCreating: createUserMutation.isPending,
    createError: createUserMutation.error,

    updateUser: updateUserMutation.mutate,
    updateUserAsync: updateUserMutation.mutateAsync,
    isUpdating: updateUserMutation.isPending,
    updateError: updateUserMutation.error,

    deleteUser: deleteUserMutation.mutate,
    deleteUserAsync: deleteUserMutation.mutateAsync,
    isDeleting: deleteUserMutation.isPending,
    deleteError: deleteUserMutation.error,
  };
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, id],
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get<UserResponse>(`/users/${id}`);
      return response.user;
    },
    enabled: !!id,
  });
}

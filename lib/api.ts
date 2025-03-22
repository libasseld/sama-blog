import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthCredentials, AuthResponse, Post, CreatePostPayload, Comment, CreateCommentPayload } from './types';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAuth = () => {
  const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  const signup = async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/signup', credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return { login, signup, logout };
};

export const usePosts = () => {
  const queryClient = useQueryClient();

  const getPosts = () => useQuery(['posts'], async () => {
    const { data } = await api.get<Post[]>('/posts');
    return data;
  });

  const getPost = (id: number) => useQuery(['posts', id], async () => {
    const { data } = await api.get<Post>(`/posts/${id}`);
    return data;
  });

  const getComments = (id: number) => useQuery(['comments', id], async () => {
    const { data } = await api.get<Comment[]>(`/posts/${id}/comments`);
    return data;
  });

  const createPost = useMutation(
    async (payload: CreatePostPayload) => {
      const formData = new FormData();
      formData.append('title', payload.title);
      formData.append('content', payload.content);
      console.log(payload.image);
      if (payload.image) {
        formData.append('image', payload.image);
      }
      console.log(formData.get('image'));
      const { data } = await api.post<Post>('/posts', formData);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts']);
      },
    }
  );

  const updatePost = useMutation(
    async ({ id, payload }: { id: number; payload: CreatePostPayload }) => {
      const formData = new FormData();
      formData.append('_method', 'PUT');

      formData.append('title', payload.title);
      formData.append('content', payload.content);
      if (payload.image) {
        formData.append('image', payload.image);
      }
      const { data } = await api.post<Post>(`/posts/${id}`, formData);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts']);
      },
    }
  );

  const deletePost = useMutation(
    async (id: number) => {
      await api.delete(`/posts/${id}`);
      return id;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts']);
      },
    }
  );

  return { getPosts, getPost, getComments, createPost, updatePost, deletePost };
};

export const useComments = () => {
  const queryClient = useQueryClient();

  const createComment = useMutation(
    async ({ postId, payload }: { postId: number; payload: CreateCommentPayload }) => {
      const { data } = await api.post<Comment>(`/posts/${postId}/comments`, payload);
      return data;
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['posts', variables.postId]);
      },
    }
  );

  return { createComment };
};
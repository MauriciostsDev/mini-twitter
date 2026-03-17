import { apiClient } from '../api/apiClient';
import { Post, PaginatedPosts } from '../../domain/models/Post';
import { CreatePostFormData } from '../../domain/schemas/postSchema';

export const postRepository = {
  getPosts: async (page: number = 1, search?: string): Promise<PaginatedPosts> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (search) {
      params.append('search', search);
    }
    
    // O backend precisa suportar paginação retornando os posts e talvez um indicador de next page
    const response = await apiClient.get<PaginatedPosts>('/posts', { params });
    
    // Para efeito de demonstração e Fallback (caso API retorne array direto)
    if (Array.isArray(response.data)) {
        return {
           posts: response.data,
           nextCursor: response.data.length > 0 ? page + 1 : undefined
        }
    }

    return response.data;
  },

  createPost: async (data: CreatePostFormData): Promise<Post> => {
    const response = await apiClient.post<Post>('/posts', data);
    return response.data;
  },

  updatePost: async (id: string, data: { title: string; content: string; image?: string }): Promise<Post> => {
    const response = await apiClient.put<Post>(`/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
     await apiClient.delete(`/posts/${id}`);
  },

  toggleLike: async (id: string): Promise<{ liked: boolean, likesCount: number }> => {
    const response = await apiClient.post<{ liked: boolean, likesCount: number }>(`/posts/${id}/like`);
    return response.data;
  }
};

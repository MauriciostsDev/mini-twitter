import { apiClient } from '../api/apiClient';
import { Post, PaginatedPosts } from '../../domain/models/Post';
import { CreatePostFormData } from '../../domain/schemas/postSchema';
import { useAppStore } from '../../presentation/store/useAppStore';

function getUserId(): string | null {
  const state = useAppStore.getState();
  return state.user?.id ?? null;
}

function getLikedPostsKey(): string {
  const userId = getUserId();
  return userId ? `mini-twitter-likes-${userId}` : '';
}

function getLikedPosts(): Set<string> {
  try {
    const key = getLikedPostsKey();
    if (!key) return new Set();
    const stored = localStorage.getItem(key);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveLikedPosts(likedPosts: Set<string>) {
  const key = getLikedPostsKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify([...likedPosts]));
}

export const postRepository = {
  getPosts: async (page: number = 1, search?: string): Promise<PaginatedPosts> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (search) {
      params.append('search', search);
    }
    
    const response = await apiClient.get<PaginatedPosts>('/posts', { params });
    const data = response.data;
    const likedPosts = getLikedPosts();
    const posts = (Array.isArray(data) ? data : data.posts).map((p: any) => ({
      ...p,
      id: String(p.id),
      authorId: String(p.authorId),
      likedByMe: Boolean(p.likedByMe) || likedPosts.has(String(p.id))
    }));

    return {
      posts,
      nextCursor: Array.isArray(data) ? (posts.length > 0 ? page + 1 : undefined) : data.nextCursor
    };
  },

  createPost: async (data: CreatePostFormData): Promise<Post> => {
    const response = await apiClient.post<Post>('/posts', data);
    return response.data;
  },

  updatePost: async (id: string, data: { title?: string; content: string; image?: string }): Promise<Post> => {
    const response = await apiClient.put<Post>(`/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
     await apiClient.delete(`/posts/${id}`);
  },

  toggleLike: async (id: string): Promise<{ liked: boolean }> => {
    const response = await apiClient.post<{ liked: boolean }>(`/posts/${id}/like`);
    const liked = Boolean(response.data.liked);
    
    // Persist per-user to localStorage
    const likedPosts = getLikedPosts();
    if (liked) {
      likedPosts.add(id);
    } else {
      likedPosts.delete(id);
    }
    saveLikedPosts(likedPosts);
    
    return { liked };
  }
};

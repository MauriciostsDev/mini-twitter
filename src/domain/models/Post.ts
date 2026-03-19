export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  image?: string;
  likesCount: number;
  likedByMe: boolean;
  createdAt: string;
}

export interface PaginatedPosts {
  posts: Post[];
  nextCursor?: number;
}

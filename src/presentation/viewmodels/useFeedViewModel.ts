import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postRepository } from '../../data/repositories/postRepository';
import { CreatePostFormData } from '../../domain/schemas/postSchema';
import { useSearchStore } from '../store/useAppStore';

export function useFeedViewModel() {
  const queryClient = useQueryClient();
  const searchQuery = useSearchStore(state => state.searchQuery);

  // Infinite Query para buscar posts
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['posts', searchQuery],
    queryFn: ({ pageParam = 1 }) => postRepository.getPosts(pageParam, searchQuery),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  // Action para criar um post
  const createMutation = useMutation({
    mutationFn: (newPost: CreatePostFormData) => postRepository.createPost(newPost),
    onSuccess: () => {
      // Invalida o cache e força um reload para mostrar o novo post no topo
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Action para deletar post
  const deleteMutation = useMutation({
    mutationFn: (id: string) => postRepository.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Action para editar post
  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: { title?: string, content: string, image?: string } }) => postRepository.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Action para favoritar post (Optimistic Update)
  const toggleLikeMutation = useMutation({
    mutationFn: (id: string) => postRepository.toggleLike(id),
    onMutate: async (id) => {
      // Cancela queries em andamento para não sobrescrever o state otimista
      await queryClient.cancelQueries({ queryKey: ['posts', searchQuery] })
      
      const previousData = queryClient.getQueryData(['posts', searchQuery]);
      
      // Atualiza o cache de forma otimista localmente
      queryClient.setQueryData(['posts', searchQuery], (oldData: any) => {
         if (!oldData) return oldData;
         
         return {
           ...oldData,
           pages: oldData.pages.map((page: any) => ({
             ...page,
             posts: page.posts.map((post: any) => {
               if (String(post.id) === String(id)) {
                 const isLiking = !post.likedByMe;
                 return {
                   ...post,
                   likedByMe: isLiking,
                   likesCount: isLiking ? post.likesCount + 1 : post.likesCount - 1
                 }
               }
               return post;
             })
           }))
         }
      });
      
      return { previousData };
    },
    onSuccess: (data, id) => {
      // Sincroniza o estado real vindo do server
      queryClient.setQueryData(['posts', searchQuery], (oldData: any) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) => {
              if (String(post.id) === String(id)) {
                return {
                  ...post,
                  likedByMe: data.liked
                }
              }
              return post;
            })
          }))
        }
      });
    },
    onSettled: () => {
      // Re-valida em background para garantir consistência total
    //   queryClient.invalidateQueries({ queryKey: ['posts', searchQuery] });
    }
  });


  return {
    // Estado de leitura
    posts: data?.pages.flatMap((page) => page.posts) ?? [],
    isLoading,
    isError,
    error,
    
    // Paginação
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,

    // Busca
    searchQuery,
    refetch,
    
    // Ações
    createPost: async (newPost: CreatePostFormData) => {
       await createMutation.mutateAsync(newPost);
    },
    isCreating: createMutation.isPending,
    
    deletePost: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,

    editPost: async (id: string, data: { title?: string, content: string, image?: string }) => {
      await editMutation.mutateAsync({ id, data });
    },
    isEditing: editMutation.isPending,

    toggleLike: toggleLikeMutation.mutate,
    isTogglingLike: toggleLikeMutation.isPending,
  };
}

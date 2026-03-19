import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useFeedViewModel } from '../viewmodels/useFeedViewModel';
import { TweetCard } from '../components/tweet/TweetCard';
import { CreatePostForm } from '../components/tweet/CreatePostForm';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function FeedPage() {
  const {
    posts,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    createPost,
    isCreating,
    deletePost,
    editPost,
    toggleLike
  } = useFeedViewModel();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '400px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="space-y-4">
      
      {isAuthenticated && <CreatePostForm onSubmit={createPost} isSubmitting={isCreating} />}

      <div className="space-y-0">
        {isLoading && (
          <div className="flex justify-center py-8">
             <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        )}

        {isError && (
          <div className="bg-red-900/20 text-red-500 border border-red-900/50 p-4 rounded-xl text-center">
             Ocorreu um erro ao carregar o feed. Tente novamente mais tarde.
          </div>
        )}

        {!isLoading && !isError && posts?.length === 0 && (
           <div className="text-center py-12 text-gray-500 bg-[#1E293B] rounded-xl border border-gray-800">
              Nenhum post encontrado.
           </div>
        )}

        {posts.map((post) => (
          <TweetCard 
             key={post.id} 
             post={post} 
             onLike={toggleLike}
             onDelete={deletePost}
             onEdit={editPost}
          />
        ))}

        <div ref={ref} className="py-4 flex justify-center h-10">
           {isFetchingNextPage && <Loader2 className="animate-spin text-blue-500" size={24} />}
        </div>
      </div>
    </div>
  );
}

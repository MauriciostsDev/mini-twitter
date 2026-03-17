import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useFeedViewModel } from '../viewmodels/useFeedViewModel';
import { TweetCard } from '../components/tweet/TweetCard';
import { CreatePostForm } from '../components/tweet/CreatePostForm';
import { Loader2, Search } from 'lucide-react';

export function FeedPage() {
  const {
    posts,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    searchQuery,
    setSearchQuery,
    createPost,
    isCreating,
    deletePost,
    editPost,
    toggleLike
  } = useFeedViewModel();

  const { ref, inView } = useInView({
    // Threshold para trigar o load antes de chegar super no final da tela
    threshold: 0.1, 
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle Search Input (debounce manual simples para não re-renderizar demais se quiser)
  // Mas como o Tanstack query tem queryKey com state, vai reagir instantaneamente
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-6">
      
      {/* Busca */}
      <div className="relative">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
         <input 
            type="text" 
            placeholder="Buscar posts..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors dark:text-white"
         />
      </div>

      <CreatePostForm onSubmit={createPost} isSubmitting={isCreating} />

      <div className="space-y-4">
        {isLoading && (
          <div className="flex justify-center py-8">
             <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        )}

        {isError && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-xl text-center">
             Ocorreu um erro ao carregar o feed. Tente novamente mais tarde.
          </div>
        )}

        {!isLoading && !isError && posts?.length === 0 && (
           <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
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

        {/* Elemento observador do Intersection Observer */}
        <div ref={ref} className="py-4 flex justify-center h-10">
           {isFetchingNextPage && <Loader2 className="animate-spin text-blue-500" size={24} />}
           {!hasNextPage && posts.length > 0 && (
             <span className="text-gray-400 text-sm">Você chegou ao fim!</span>
           )}
        </div>
      </div>
    </div>
  );
}

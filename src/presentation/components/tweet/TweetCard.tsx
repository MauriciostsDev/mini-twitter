import { Post } from '../../../domain/models/Post';
import { useAppStore } from '../../store/useAppStore';
import { Heart, Trash2, Edit2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { CreatePostForm } from './CreatePostForm';

interface TweetCardProps {
  post: Post;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: { title: string; content: string; image?: string }) => Promise<void>;
}

export function TweetCard({ post, onLike, onDelete, onEdit }: TweetCardProps) {
  const currentUser = useAppStore((state) => state.user);
  const isMyPost = currentUser?.id === post.authorId;
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const handleEditSubmit = async (data: { title: string; content: string; imageUrl?: string }) => {
    setIsSubmittingEdit(true);
    try {
      await onEdit(post.id, { title: data.title, content: data.content, image: data.imageUrl });
      setIsEditing(false);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-slate-800 p-4 border-b sm:border border-gray-100 sm:rounded-xl dark:border-slate-700 shadow-sm transition-colors mb-4">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Editando publicação</h3>
        <CreatePostForm 
           initialData={{ title: post.title, content: post.content, imageUrl: post.imageUrl }} 
           onSubmit={handleEditSubmit} 
           isSubmitting={isSubmittingEdit} 
           onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <article className="bg-white dark:bg-slate-800 p-4 border-b sm:border border-gray-100 sm:rounded-xl dark:border-slate-700 shadow-sm transition-colors mb-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {/* Avatar Placeholder */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shrink-0">
             {post.authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{post.authorName}</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
            </span>
          </div>
        </div>

        {isMyPost && (
          <div className="flex gap-2 relative">
             <button 
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                aria-label="Editar post"
             >
                <Edit2 size={18} />
             </button>
             <button 
                onClick={() => onDelete(post.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                aria-label="Deletar post"
             >
                <Trash2 size={18} />
             </button>
          </div>
        )}
      </div>

      <div className="mt-3">
        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-1">{post.title}</h4>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>

        {post.imageUrl && (
          <div className="mt-3 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700 max-h-96">
            <img 
              src={post.imageUrl} 
              alt="Anexo da postagem" 
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                // Fallback para fallbackUI de imagem quebrada
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-6 text-gray-500 dark:text-gray-400">
        <button 
          onClick={() => onLike(post.id)}
          className={`group flex items-center gap-1.5 transition-colors ${post.likedByMe ? 'text-red-500' : 'hover:text-red-500'}`}
        >
          <div className={`p-1.5 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors`}>
             <Heart 
               size={20} 
               className={post.likedByMe ? 'fill-current' : ''} 
             />
          </div>
          <span className="text-sm font-medium">{post.likesCount}</span>
        </button>
      </div>
    </article>
  );
}

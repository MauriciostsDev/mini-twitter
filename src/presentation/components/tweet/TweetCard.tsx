import { Post } from '../../../domain/models/Post';
import { useAppStore } from '../../store/useAppStore';
import { Heart, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { CreatePostForm } from './CreatePostForm';

interface TweetCardProps {
  post: Post;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: { title?: string; content: string; image?: string }) => Promise<void>;
}

export function TweetCard({ post, onLike, onDelete, onEdit }: TweetCardProps) {
  const currentUser = useAppStore((state) => state.user);
  const isMyPost = currentUser?.id === post.authorId;
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const handleEditSubmit = async (data: { title?: string; content: string; image?: string }) => {
    setIsSubmittingEdit(true);
    try {
      await onEdit(post.id, { title: (data.title || '').trim() || post.title, content: data.content, image: data.image });
      setIsEditing(false);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-[var(--bg-card)] p-4 border border-[var(--border-ui)] rounded-xl mb-3 text-[var(--text-main)]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-[15px] text-[var(--text-main)]">Editar publicação</h3>
        </div>
        <CreatePostForm 
           initialData={{ title: post.title, content: post.content, image: post.image }} 
           onSubmit={handleEditSubmit} 
           isSubmitting={isSubmittingEdit} 
           onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <article className="bg-[var(--bg-card)] p-6 border border-[var(--border-ui)] rounded-xl mb-5 transition-all hover:border-[#2a4a6b]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[var(--text-main)] text-[15px]">{post.authorName}</span>
          <span className="text-[13px] text-[var(--text-muted)]">
            @{post.authorName.toLowerCase().replace(/\s/g, '')} · {format(new Date(post.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
          </span>
        </div>

        {isMyPost && (
          <div className="flex gap-0.5">
             <button 
                onClick={() => setIsEditing(true)}
                className="text-[var(--text-muted)] hover:text-blue-400 transition-colors p-1.5 rounded-md hover:bg-blue-500/5"
                title="Editar post"
             >
                <Edit2 size={14} />
             </button>
             <button 
                onClick={() => onDelete(post.id)}
                className="text-[var(--text-muted)] hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-red-500/5"
                title="Deletar post"
             >
                <Trash2 size={14} />
             </button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {post.title && (
          <h4 className="font-bold text-[17px] text-[var(--text-main)] leading-snug">{post.title}</h4>
        )}
        <p className="text-[var(--text-muted)] text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {post.image && (
          <div className="mt-4 rounded-xl overflow-hidden">
            <img 
              src={post.image} 
              alt="Anexo" 
              className="w-full max-h-[400px] object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center">
        <button 
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 transition-all active:scale-90 ${!!post.likedByMe ? 'text-[#ef4444]' : 'text-[#ef4444]/50 hover:text-[#ef4444]'}`}
        >
          <Heart 
            size={18} 
            fill={!!post.likedByMe ? "#ef4444" : "transparent"} 
            className={!!post.likedByMe ? "animate-heart-pop" : ""}
            strokeWidth={2}
          />
          <span className={`text-[13px] font-semibold ${!!post.likedByMe ? 'text-[#ef4444]' : 'text-[var(--text-muted)]'}`}>{post.likesCount}</span>
        </button>
      </div>
    </article>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPostSchema, CreatePostFormData } from '../../../domain/schemas/postSchema';
import { useAppStore } from '../../store/useAppStore';
import { ImagePlus, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface CreatePostFormProps {
  onSubmit: (data: CreatePostFormData) => Promise<void>;
  isSubmitting: boolean;
  initialData?: CreatePostFormData;
  onCancel?: () => void;
}

export function CreatePostForm({ onSubmit, isSubmitting, initialData, onCancel }: CreatePostFormProps) {
  const user = useAppStore((state) => state.user);
  const [showImageUrl, setShowImageUrl] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    mode: 'onChange',
    defaultValues: initialData || {}
  });

  const submitForm = async (data: CreatePostFormData) => {
    try {
      await onSubmit(data);
      reset();
      setShowImageUrl(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="bg-white dark:bg-slate-800 p-4 sm:rounded-xl border-b sm:border border-gray-100 dark:border-slate-700 shadow-sm mb-6 transition-colors">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shrink-0">
          {user?.name?.charAt(0).toUpperCase() || '?'}
        </div>
        
        <div className="w-full space-y-3">
          <input
             type="text"
             placeholder="Título da postagem..."
             {...register('title')}
             className="w-full bg-transparent text-lg font-semibold text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
          />
          {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}

          <textarea
            {...register('content')}
            placeholder="O que está acontecendo?"
            className="w-full bg-transparent resize-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none min-h-[80px]"
          />
          {errors.content && <p className="text-red-500 text-xs">{errors.content.message}</p>}

          {showImageUrl && (
            <div className="mt-2">
               <input
                 type="url"
                 placeholder="Cole a URL da sua imagem (opcional)"
                 {...register('imageUrl')}
                 className="w-full text-sm px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 dark:text-white"
               />
               {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>}
               <p className="text-xs text-gray-400 mt-1">Limite visual de 5MB recomendado pelo requisito.</p>
            </div>
          )}

          <div className="border-t border-gray-100 dark:border-slate-700 pt-3 flex justify-between items-center">
            <button
               type="button"
               onClick={() => setShowImageUrl(!showImageUrl)}
               className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors flex items-center gap-1"
               title="Adicionar imagem"
            >
               <ImagePlus size={20} />
            </button>

            <div className="flex gap-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-gray-500 hover:text-gray-700 font-bold py-1.5 px-4 rounded-full transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                 type="submit"
                 disabled={!isValid || isSubmitting}
                 className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-1.5 px-4 rounded-full transition-colors flex items-center gap-2"
              >
                 {isSubmitting ? (
                   <>
                     <Loader2 size={16} className="animate-spin" />
                     {initialData ? 'Salvando...' : 'Postando...'}
                   </>
                 ) : (initialData ? 'Salvar' : 'Postar')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

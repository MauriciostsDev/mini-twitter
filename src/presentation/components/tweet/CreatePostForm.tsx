import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPostSchema, CreatePostFormData } from '../../../domain/schemas/postSchema';
import { Image as ImageIcon, Loader2, X } from 'lucide-react';
import { useState, useRef } from 'react';

interface CreatePostFormProps {
  onSubmit: (data: CreatePostFormData) => Promise<void>;
  isSubmitting: boolean;
  initialData?: CreatePostFormData;
  onCancel?: () => void;
}

export function CreatePostForm({ onSubmit, isSubmitting, initialData, onCancel }: CreatePostFormProps) {
  const [showImageUrlField, setShowImageUrlField] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    mode: 'onChange',
    defaultValues: initialData || { title: '', content: '', image: '' }
  });

  const image = watch('image');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
       alert('Imagem muito grande: Limite de 5MB');
       return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue('image', reader.result as string, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setValue('image', '', { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submitForm = async (data: CreatePostFormData) => {
    try {
      const finalData = {
          title: (data.title || '').trim() || data.content.substring(0, 15) || 'Novo Post',
          content: data.content,
          image: data.image
      };

      await onSubmit(finalData as CreatePostFormData);
      reset();
      setShowImageUrlField(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-ui)] mb-5 transition-all">
      <div className="w-full">
        {/* Optional title field */}
        <input
          type="text"
          placeholder="Título (opcional)"
          {...register('title')}
          className="w-full bg-transparent text-[13px] font-medium text-[var(--text-muted)] placeholder-[var(--text-muted)] focus:outline-none focus:text-[var(--text-main)] transition-colors mb-2"
        />

         <textarea
          {...register('content')}
          placeholder={initialData ? 'Editar conteúdo...' : 'E aí, o que está rolando?'}
          className="w-full bg-transparent resize-none text-[14px] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none min-h-[60px]"
        />
        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}

        {/* Image Preview */}
        {image && (
            <div className="mt-3 relative inline-block group">
                <img src={image} alt="Preview" className="max-h-56 rounded-lg object-cover border border-[var(--border-ui)]" />
                <button 
                  type="button" 
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-all scale-90 group-hover:scale-100"
                >
                    <X size={12} />
                </button>
            </div>
        )}

        {showImageUrlField && !(image ?? '').startsWith('data:') && (
          <div className="mt-3">
              <input
                type="url"
                placeholder="Insira a URL da imagem..."
                {...register('image')}
                className="w-full text-sm px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-ui)] rounded-lg focus:outline-none focus:border-[#0D93F2] text-[var(--text-main)] transition-all"
              />
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
          </div>
        )}

        {/* Separator */}
        <div className="h-px bg-[var(--border-ui)] mt-4 mb-3" />

        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowImageUrlField(!showImageUrlField);
                }}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${(image ?? '').startsWith('data:') ? 'text-[#0D93F2] bg-[#0D93F2]/10' : 'text-[#0D93F2] hover:bg-[#0D93F2]/10'}`}
                title="Clique para upload / Botão direito para URL"
            >
                <ImageIcon size={24} strokeWidth={2} />
            </button>
          </div>

          <div className="flex gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-[13px] font-semibold py-1.5 px-5 rounded-full border border-[var(--border-ui)] hover:bg-[var(--border-ui)] transition-all"
              >
                Cancelar
              </button>
            )}
            <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="bg-[#0D93F2] hover:bg-[#0284c7] disabled:opacity-30 disabled:cursor-not-allowed text-white text-[13px] font-bold py-1.5 px-6 rounded-full transition-all flex items-center gap-2"
            >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    {initialData ? 'Salvando...' : 'Postando...'}
                  </>
                ) : (initialData ? 'Salvar' : 'Postar')}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

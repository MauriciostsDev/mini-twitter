import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().max(100, 'Tamanho máximo de 100 caracteres').optional().or(z.literal('')),
  content: z.string().min(1, 'O conteúdo é obrigatório').max(280, 'Tamanho máximo de 280 caracteres'),
  image: z.string()
    .optional()
    .or(z.literal(''))
    .refine((val) => {
      if (!val) return true;
      if (val.startsWith('data:image')) return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, 'A imagem deve ser uma URL válida ou um arquivo anexado'),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;

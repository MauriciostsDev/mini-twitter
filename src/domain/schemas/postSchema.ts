import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(3, 'Mínimo de 3 caracteres').max(100, 'Tamanho máximo de 100 caracteres'),
  content: z.string().min(1, 'O conteúdo é obrigatório').max(280, 'Tamanho máximo de 280 caracteres'),
  imageUrl: z.string().url('URL de imagem inválida').optional().or(z.literal('')),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;

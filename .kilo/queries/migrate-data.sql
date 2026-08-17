-- migrate-data.sql
-- Execute no Supabase SQL Editor DEPOIS do schema.sql

-- ============================================
-- Migrate videos.json -> courses, modules, lessons
-- ============================================
INSERT INTO public.courses (title, description, is_published, order_index)
VALUES ('Método Fimathe', 'Curso completo do Método Fimathe', true, 0)
ON CONFLICT DO NOTHING;

INSERT INTO public.modules (course_id, title, description, order_index)
SELECT id, 'Aulas', 'Aulas do Método Fimathe', 0
FROM public.courses
WHERE title = 'Método Fimathe'
ON CONFLICT DO NOTHING;

INSERT INTO public.lessons (module_id, course_id, title, description, video_id, is_published, order_index)
SELECT m.id, c.id, v.title, v.description, v.videoId, true, v.ordem
FROM (
  SELECT title, description, videoId, ROW_NUMBER() OVER (ORDER BY title) - 1 AS ordem
  FROM (VALUES
    ('Aula 01', 'Primeira aula do Método Fimathe', '1jZbpAv2mPx9BadTqUverW0GsJWj860mB'),
    ('Aula 02', 'Segunda aula do Método Fimathe', '1mpoXheY5NtD3IHNthcbPspYvZC6apV-o'),
    ('Aula 03', 'Terceira aula do Método Fimathe', '1OHhr1d89MDph3uNGPZhtcBz2SKW4dYia'),
    ('Aula 04', 'Quarta aula do Método Fimathe', '10TkgRVRnKbBA68AhJ9xN9mFU7H512_Lb'),
    ('Aula 05', 'Quinta aula do Método Fimathe', '1qnvDAEM8YCJ7w7nuBbcdemADf999JGss'),
    ('Aula 06', 'Sexta aula do Método Fimathe', '1kVr4K_9eyBm5Jf_AIeRw14XxHZZ_1_3M')
  ) AS v(title, description, videoId)
) v
JOIN public.courses c ON c.title = 'Método Fimathe'
JOIN public.modules m ON m.course_id = c.id AND m.title = 'Aulas'
ON CONFLICT DO NOTHING;

-- ============================================
-- Migrate certificates
-- ============================================
INSERT INTO public.certificates (title, description, image_url, order_index) VALUES
  ('Fórmula do Ouro', 'Certificado de conclusão do curso Fórmula do Ouro', '/certificados/Formula do Ouro.png', 0),
  ('Laboratório Fimathe', 'Certificado do Laboratório Fimathe', '/certificados/Laboratorio Fimathe.png', 1),
  ('MasterClass Fimathe', 'Certificado de participação na MasterClass', '/certificados/MasterClass Fimathe.png', 2),
  ('Método Fimathe', 'Certificado de conclusão do Método Fimathe', '/certificados/Metodo Fimathe.png', 3),
  ('Scalper', 'Certificado de conclusão do curso de Scalper', '/certificados/Scalper.png', 4)
ON CONFLICT DO NOTHING;

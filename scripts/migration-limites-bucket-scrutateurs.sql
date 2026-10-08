-- ============================================================================
-- MIGRATION : limites serveur du bucket « documents-electoraux »
-- ============================================================================
-- Problème corrigé : la taille (50 Mo) et les types de fichiers acceptés
-- n'étaient vérifiés que dans le navigateur (src/lib/scrutateur.js). Le bucket
-- était créé sans file_size_limit ni allowed_mime_types : un appel direct à
-- l'API Storage pouvait déposer n'importe quel fichier, de n'importe quelle
-- taille (saturation du stockage, hausse de la facture).
--
-- Correctif : Supabase Storage applique lui-même ces deux contraintes à
-- chaque dépôt (rejet HTTP 413 / 415 avant écriture).
--
-- ⚠️ La liste ci-dessous DOIT rester alignée sur TYPES_MIME_ACCEPTES dans
--    src/lib/scrutateur.js. SVG volontairement exclu (peut contenir du script).
--
-- Exécutable en une fois (SQL Editor Supabase). Idempotent.
-- ============================================================================

update storage.buckets
set
  file_size_limit = 52428800, -- 50 Mo
  allowed_mime_types = array[
    -- Procès-verbaux
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text',
    -- Photos
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
    'image/gif',
    -- Audio / vidéo (formats variables selon les téléphones)
    'audio/*',
    'video/*'
  ]
where id = 'documents-electoraux';

-- Vérification :
--   select id, file_size_limit, allowed_mime_types
--   from storage.buckets where id = 'documents-electoraux';

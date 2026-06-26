import { createClient } from '@supabase/supabase-js'

// ----------------------------------------------------------------------------
// Client Supabase partagé pour toute l'application.
// Les identifiants proviennent UNIQUEMENT des variables d'environnement Vite
// (préfixe VITE_). Aucune clé n'est codée en dur dans le dépôt.
// ----------------------------------------------------------------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Message explicite au démarrage si le .env.local n'est pas configuré.
  console.error(
    '[Supabase] Variables manquantes. Copiez .env.example en .env.local ' +
      'et renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

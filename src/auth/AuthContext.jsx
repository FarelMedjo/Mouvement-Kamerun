import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'

// ----------------------------------------------------------------------------
// Contexte d'authentification.
//
// Principe de sécurité : les rôles affichés ici sont TOUJOURS relus depuis la
// table public.user_roles (protégée par RLS : un utilisateur ne lit que ses
// propres rôles). L'interface ne fabrique jamais un rôle de son côté ; elle ne
// fait que refléter ce que la base autorise. Le contrôle d'accès réel reste la
// RLS côté serveur.
// ----------------------------------------------------------------------------

export const ROLES = {
  SCRUTATEUR: 'scrutateur',
  BENEVOLE: 'benevole',
  MEMBRE: 'membre',
  ADMIN: 'admin',
}

// Rôles qu'un utilisateur peut s'attribuer lui-même à l'inscription.
// 'admin' en est volontairement ABSENT (jamais auto-attribuable).
export const ROLES_AUTO_ATTRIBUABLES = [ROLES.SCRUTATEUR, ROLES.BENEVOLE, ROLES.MEMBRE]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)

  // Relit les rôles réels de l'utilisateur depuis la base (RLS appliquée).
  const loadRoles = useCallback(async (userId) => {
    if (!userId) {
      setRoles([])
      return
    }
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
    if (error) {
      console.error('[AuthContext] lecture des rôles :', error.message)
      setRoles([])
      return
    }
    setRoles((data ?? []).map((r) => r.role))
  }, [])

  // S'assure que le rôle choisi à l'inscription est bien enregistré.
  // Utile lorsque la confirmation d'e-mail est activée : aucune session n'existe
  // au moment du signUp, le rôle est donc inséré à la première connexion.
  // Garde-fou : on n'insère QUE 'scrutateur' ou 'benevole' (jamais 'admin'),
  // et la RLS de user_roles refuserait de toute façon tout autre rôle.
  const ensureRoleFromMetadata = useCallback(async (user) => {
    const wanted = user?.user_metadata?.role_souhaite
    if (!wanted || !ROLES_AUTO_ATTRIBUABLES.includes(wanted)) return
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .limit(1)
    if (error || (data && data.length > 0)) return // déjà un rôle, ou erreur
    const { error: insErr } = await supabase
      .from('user_roles')
      .insert({ user_id: user.id, role: wanted })
    if (insErr) console.error('[AuthContext] attribution du rôle :', insErr.message)
  }, [])

  // S'assure que les détails du scrutateur (région, département, arrondissement,
  // bureau de vote) sont enregistrés. Comme pour le rôle, ceci couvre le cas où
  // la confirmation d'e-mail diffère l'ouverture de session : les détails,
  // mémorisés dans les métadonnées à l'inscription, sont insérés à la première
  // session. Idempotent (insère seulement si aucune ligne n'existe).
  // RLS : l'insertion exige user_id = auth.uid().
  const ensureScrutateurDetailsFromMetadata = useCallback(async (user) => {
    const md = user?.user_metadata ?? {}
    if (md.role_souhaite !== 'scrutateur') return
    const details = {
      region: md.sc_region ?? null,
      departement: md.sc_departement ?? null,
      arrondissement: md.sc_arrondissement ?? null,
      bureau_vote: md.sc_bureau_vote ?? null,
    }
    if (!Object.values(details).some(Boolean)) return // rien à enregistrer
    const { data, error } = await supabase
      .from('scrutateur_details')
      .select('user_id')
      .eq('user_id', user.id)
      .limit(1)
    if (error || (data && data.length > 0)) return // déjà présent, ou erreur
    const { error: insErr } = await supabase
      .from('scrutateur_details')
      .insert({ user_id: user.id, ...details })
    if (insErr) console.error('[AuthContext] détails scrutateur :', insErr.message)
  }, [])

  // S'assure que les détails du bénévole (zone géographique, disponibilités,
  // secteurs) sont enregistrés. Même logique que pour le scrutateur : couvre le
  // cas où la confirmation d'e-mail diffère l'ouverture de session ; les détails
  // mémorisés dans les métadonnées à l'inscription sont insérés à la première
  // session. Idempotent (insère seulement si aucune ligne n'existe).
  // RLS : l'insertion exige user_id = auth.uid().
  const ensureBenevoleDetailsFromMetadata = useCallback(async (user) => {
    const md = user?.user_metadata ?? {}
    if (md.role_souhaite !== 'benevole') return
    const secteurs = Array.isArray(md.bn_secteurs) ? md.bn_secteurs : []
    const details = {
      zone: md.bn_zone ?? null,
      disponibilites: md.bn_disponibilites ?? null,
      secteurs,
    }
    // Rien d'utile à enregistrer ?
    if (!details.zone && !details.disponibilites && secteurs.length === 0) return
    const { data, error } = await supabase
      .from('benevole_details')
      .select('user_id')
      .eq('user_id', user.id)
      .limit(1)
    if (error || (data && data.length > 0)) return // déjà présent, ou erreur
    const { error: insErr } = await supabase
      .from('benevole_details')
      .insert({ user_id: user.id, ...details })
    if (insErr) console.error('[AuthContext] détails bénévole :', insErr.message)
  }, [])

  // S'assure que les détails du membre (zone géographique) sont enregistrés.
  // Même logique que scrutateur/bénévole : couvre le cas où la confirmation
  // d'e-mail diffère l'ouverture de session ; la zone mémorisée dans les
  // métadonnées à l'inscription est insérée à la première session. Idempotent
  // (insère seulement si aucune ligne n'existe). RLS : user_id = auth.uid().
  const ensureMembreDetailsFromMetadata = useCallback(async (user) => {
    const md = user?.user_metadata ?? {}
    if (md.role_souhaite !== 'membre') return
    const zone = md.mb_zone ?? null
    if (!zone) return // rien d'utile à enregistrer
    const { data, error } = await supabase
      .from('membre_details')
      .select('user_id')
      .eq('user_id', user.id)
      .limit(1)
    if (error || (data && data.length > 0)) return // déjà présent, ou erreur
    const { error: insErr } = await supabase
      .from('membre_details')
      .insert({ user_id: user.id, zone })
    if (insErr) console.error('[AuthContext] détails membre :', insErr.message)
  }, [])

  // Synchronise session + rôles. Non bloquant pour éviter tout blocage du
  // callback onAuthStateChange de supabase-js.
  const syncFromSession = useCallback(
    async (sess) => {
      const user = sess?.user
      if (!user) {
        setRoles([])
        return
      }
      await ensureRoleFromMetadata(user)
      await ensureScrutateurDetailsFromMetadata(user)
      await ensureBenevoleDetailsFromMetadata(user)
      await ensureMembreDetailsFromMetadata(user)
      await loadRoles(user.id)
    },
    [ensureRoleFromMetadata, ensureScrutateurDetailsFromMetadata, ensureBenevoleDetailsFromMetadata, ensureMembreDetailsFromMetadata, loadRoles]
  )

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session)
      await syncFromSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      // Différé (setTimeout 0) : recommandé pour ne pas appeler d'autres
      // fonctions supabase à l'intérieur du callback (risque de blocage).
      setTimeout(() => {
        if (active) syncFromSession(newSession)
      }, 0)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [syncFromSession])

  // --- Actions d'authentification ---------------------------------------

  const signUp = useCallback(
    async ({ email, password, role, nomComplet, telephone, metaExtra = {} }) => {
      if (!ROLES_AUTO_ATTRIBUABLES.includes(role)) {
        throw new Error("Rôle non autorisé à l'inscription.")
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // nom_complet / telephone sont lus par le trigger handle_new_user
          // pour créer le profil ; role_souhaite sert à attribuer le rôle ;
          // metaExtra transporte d'éventuels détails (ex. bureau du scrutateur).
          data: { nom_complet: nomComplet, telephone, role_souhaite: role, ...metaExtra },
          emailRedirectTo: `${window.location.origin}/connexion`,
        },
      })
      if (error) throw error
      // Session immédiate (confirmation d'e-mail désactivée) : on attribue le
      // rôle et on enregistre les détails tout de suite.
      if (data.session?.user) {
        await ensureRoleFromMetadata(data.session.user)
        await ensureScrutateurDetailsFromMetadata(data.session.user)
        await ensureBenevoleDetailsFromMetadata(data.session.user)
        await ensureMembreDetailsFromMetadata(data.session.user)
        await loadRoles(data.session.user.id)
      }
      return data
    },
    [ensureRoleFromMetadata, ensureScrutateurDetailsFromMetadata, ensureBenevoleDetailsFromMetadata, ensureMembreDetailsFromMetadata, loadRoles]
  )

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  const requestPasswordReset = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
    })
    if (error) throw error
  }, [])

  const updatePassword = useCallback(async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  }, [])

  // Recharge les rôles réels de l'utilisateur courant depuis la base. Utile
  // après l'auto-attribution d'un nouveau rôle (ex. un bénévole qui active son
  // compte scrutateur) pour rafraîchir l'interface sans rechargement de page.
  const refreshRoles = useCallback(async () => {
    const { data } = await supabase.auth.getUser()
    await loadRoles(data?.user?.id)
  }, [loadRoles])

  // --- Dérivés ----------------------------------------------------------

  const hasRole = useCallback((role) => roles.includes(role), [roles])
  const isAdmin = roles.includes(ROLES.ADMIN)

  // Destination « espace personnel » selon le rôle (admin prioritaire).
  const dashboardPath = useMemo(() => {
    if (roles.includes(ROLES.ADMIN)) return '/admin'
    if (roles.includes(ROLES.SCRUTATEUR)) return '/scrutateurs/tableau-de-bord'
    if (roles.includes(ROLES.BENEVOLE)) return '/benevoles/tableau-de-bord'
    if (roles.includes(ROLES.MEMBRE)) return '/membres/tableau-de-bord'
    return '/'
  }, [roles])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session,
      roles,
      loading,
      hasRole,
      isAdmin,
      dashboardPath,
      signUp,
      signIn,
      signOut,
      requestPasswordReset,
      updatePassword,
      refreshRoles,
    }),
    [
      session,
      roles,
      loading,
      hasRole,
      isAdmin,
      dashboardPath,
      signUp,
      signIn,
      signOut,
      requestPasswordReset,
      updatePassword,
      refreshRoles,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans un <AuthProvider>.')
  return ctx
}

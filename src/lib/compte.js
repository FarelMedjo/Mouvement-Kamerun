import { supabase } from './supabase'

// ----------------------------------------------------------------------------
// Gestion de son propre compte (page « Mon compte »).
//
// SÉCURITÉ (rappel) :
//  - Les deux opérations exigent de retaper le MOT DE PASSE ACTUEL. Cette
//    ré-authentification protège contre l'usage d'une session laissée ouverte
//    sur un poste partagé.
//  - Le changement de mot de passe passe par l'API GoTrue
//    (`auth.updateUser`) : le mot de passe n'est jamais manipulé en base par
//    l'application.
//  - La suppression passe par la fonction SECURITY DEFINER
//    `public.supprimer_mon_compte()` (cf. scripts/migration-compte-utilisateur.sql),
//    qui ne peut supprimer QUE l'appelant (auth.uid()) et refuse la
//    suppression du dernier administrateur. La barrière réelle est donc en
//    base, pas dans cet écran.
// ----------------------------------------------------------------------------

export const LONGUEUR_MIN_MOT_DE_PASSE = 8

// Ré-authentifie l'utilisateur courant en revalidant son mot de passe.
// Renvoie l'e-mail du compte ; lève une erreur si le mot de passe est faux.
async function reauthentifier(motDePasseActuel) {
  const { data } = await supabase.auth.getUser()
  const email = data?.user?.email
  if (!email) throw new Error('Session introuvable. Reconnectez-vous.')

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: motDePasseActuel,
  })
  if (error) throw new Error('MOT_DE_PASSE_INCORRECT')

  return email
}

// Change le mot de passe après vérification du mot de passe actuel.
export async function changerMotDePasse({ motDePasseActuel, nouveauMotDePasse }) {
  await reauthentifier(motDePasseActuel)
  const { error } = await supabase.auth.updateUser({ password: nouveauMotDePasse })
  if (error) throw error
}

// Supprime définitivement le compte de l'utilisateur courant, puis ferme la
// session locale. Les données applicatives partent en cascade (profil, rôles,
// détails, métadonnées de fichiers) ; les pièces déposées dans le bucket privé
// `documents-electoraux` sont conservées (suppression réservée à l'admin).
export async function supprimerMonCompte({ motDePasseActuel }) {
  await reauthentifier(motDePasseActuel)

  const { error } = await supabase.rpc('supprimer_mon_compte')
  if (error) throw error

  // Le compte n'existe plus : on nettoie la session locale sans faire échouer
  // l'opération si l'appel réseau de déconnexion part en erreur.
  await supabase.auth.signOut().catch(() => {})
}

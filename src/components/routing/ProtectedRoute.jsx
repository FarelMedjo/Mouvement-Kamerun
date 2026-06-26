import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import Spinner from '../ui/Spinner'

// Garde de route.
//   - Non connecté            -> redirigé vers /connexion (mémorise la cible).
//   - Connecté sans le bon rôle-> redirigé vers /acces-refuse.
//   - L'administrateur passe partout (superset de droits selon la matrice).
//
// Important : `hasRole`/`isAdmin` reflètent les rôles RÉELS lus en base
// (table user_roles, protégée par RLS). Masquer une route n'est qu'un confort :
// la barrière réelle reste la RLS côté serveur, même si l'on contournait l'UI.
export default function ProtectedRoute({ children, role }) {
  const { loading, isAuthenticated, hasRole, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner label="Vérification de la session…" />

  if (!isAuthenticated) {
    return <Navigate to="/connexion" state={{ from: location }} replace />
  }

  if (role && !hasRole(role) && !isAdmin) {
    return <Navigate to="/acces-refuse" replace />
  }

  return children
}

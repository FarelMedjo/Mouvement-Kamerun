import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import Spinner from '../ui/Spinner'

// Aiguillage « /espace » : envoie chaque utilisateur vers le tableau de bord
// correspondant à son rôle réel. Un utilisateur connecté mais sans rôle (cas
// limite) est renvoyé à l'accueil.
export default function EspaceRedirect() {
  const { loading, isAuthenticated, dashboardPath } = useAuth()

  if (loading) return <Spinner label="Ouverture de votre espace…" />
  if (!isAuthenticated) return <Navigate to="/connexion" replace />

  return <Navigate to={dashboardPath} replace />
}

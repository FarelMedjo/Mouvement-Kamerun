import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Placeholder from './pages/Placeholder'

// Pages publiques
import Accueil from './pages/public/Accueil'
import APropos from './pages/public/APropos'
import Programme from './pages/public/Programme'
import Actualites from './pages/public/Actualites'
import ArticleActualite from './pages/public/ArticleActualite'
import MessagesVideo from './pages/public/MessagesVideo'
import Evenements from './pages/public/Evenements'
import Ressources from './pages/public/Ressources'
import Contact from './pages/public/Contact'
import FaireDon from './pages/public/FaireDon'
import Adhesion from './pages/public/Adhesion'

// Authentification
import Connexion from './pages/auth/Connexion'
import Inscription from './pages/auth/Inscription'
import MotDePasseOublie from './pages/auth/MotDePasseOublie'
import ReinitialiserMotDePasse from './pages/auth/ReinitialiserMotDePasse'
import AccesRefuse from './pages/auth/AccesRefuse'

// Espace scrutateurs
import EspaceScrutateurs from './pages/scrutateurs/EspaceScrutateurs'
import ScrutateurDashboard from './pages/scrutateurs/Dashboard'

// Espace bénévoles
import EspaceBenevoles from './pages/benevoles/EspaceBenevoles'

// Espaces protégés
import ProtectedRoute from './components/routing/ProtectedRoute'
import EspaceRedirect from './components/routing/EspaceRedirect'
import BenevoleDashboard from './pages/espace/BenevoleDashboard'
import MembreDashboard from './pages/espace/MembreDashboard'
import AdminDashboard from './pages/espace/AdminDashboard'
import { ROLES } from './auth/AuthContext'
import { useT } from './i18n/LanguageContext'

// Routeur de l'application.
//  - Pages publiques : gabarits provisoires (contenu construit ultérieurement).
//  - Authentification : connexion, inscription, mot de passe oublié/réinitialisation.
//  - Espaces personnels : protégés par rôle réel (RLS en base + garde de route).
export default function App() {
  const t = useT()
  return (
    <Layout>
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<Accueil />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/le-programme" element={<Programme />} />
        <Route path="/actualites" element={<Actualites />} />
        <Route path="/actualites/:id" element={<ArticleActualite />} />
        <Route path="/messages-video" element={<MessagesVideo />} />
        <Route path="/evenements" element={<Evenements />} />
        <Route path="/ressources" element={<Ressources />} />
        <Route path="/faire-un-don" element={<FaireDon />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/adhesion" element={<Adhesion />} />
        <Route path="/scrutateurs" element={<EspaceScrutateurs />} />
        <Route path="/benevoles" element={<EspaceBenevoles />} />

        {/* Authentification */}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
        <Route path="/reinitialiser-mot-de-passe" element={<ReinitialiserMotDePasse />} />
        <Route path="/acces-refuse" element={<AccesRefuse />} />

        {/* Ancienne entrée des maquettes -> écran réel */}
        <Route path="/connexion-scrutateurs" element={<Navigate to="/connexion" replace />} />

        {/* Aiguillage vers le bon espace selon le rôle */}
        <Route path="/espace" element={<EspaceRedirect />} />

        {/* Espaces protégés par rôle */}
        <Route
          path="/scrutateurs/tableau-de-bord"
          element={
            <ProtectedRoute role={ROLES.SCRUTATEUR}>
              <ScrutateurDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/benevoles/tableau-de-bord"
          element={
            <ProtectedRoute role={ROLES.BENEVOLE}>
              <BenevoleDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/membres/tableau-de-bord"
          element={
            <ProtectedRoute role={ROLES.MEMBRE}>
              <MembreDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role={ROLES.ADMIN}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Placeholder titre={t('Page introuvable', 'Page not found')} intro={t("La page demandée n'existe pas.", 'The requested page does not exist.')} />} />
      </Routes>
    </Layout>
  )
}

"use client";

// Importation des hooks nécessaires
import { useState } from "react"; // Hook pour gérer l'état local
import { useAuth } from "../../context/AuthContext"; // Contexte pour l'authentification (login, register)
import { useRouter } from "next/navigation"; // Hook pour la navigation après la connexion

export default function LoginPage() {
  // Destructuration des fonctions login et register depuis le contexte Auth
  const { login, register } = useAuth();
  const router = useRouter(); // Hook pour la redirection après connexion
  const [formData, setFormData] = useState({ username: "", password: "" }); // Gestion des données du formulaire (nom d'utilisateur et mot de passe)
  const [error, setError] = useState(null); // Gestion de l'erreur potentielle lors de la soumission
  const [isRegistering, setIsRegistering] = useState(false); // État pour savoir si l'utilisateur est en mode inscription ou connexion

  // Fonction de gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche la soumission du formulaire par défaut
    setError(null); // Réinitialisation de l'erreur à chaque nouvelle tentative

    // On détermine quelle action effectuer (inscription ou connexion) en fonction de l'état isRegistering
    const action = isRegistering ? register : login;
    const result = action(formData.username, formData.password); // Exécution de l'action d'authentification

    // Si l'action échoue, on affiche le message d'erreur
    if (!result.success) {
      setError(result.message);
    } else {
      // Si l'inscription est réussie, on affiche un message et passe en mode connexion
      isRegistering
        ? (alert("Inscription réussie ! Vous pouvez maintenant vous connecter."), setIsRegistering(false))
        : router.push("/"); // Si la connexion est réussie, on redirige vers la page d'accueil
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100">
      {/* Conteneur principal de la page avec une mise en page centrée */}
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        {/* Titre de la page qui change selon le mode (inscription ou connexion) */}
        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegistering ? "Inscription" : "Connexion"}
        </h2>
        
        {/* Affichage d'une erreur s'il y en a */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Formulaire d'authentification */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            // Mise à jour du nom d'utilisateur dans l'état local
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            // Mise à jour du mot de passe dans l'état local
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          
          {/* Bouton de soumission (connexion ou inscription) */}
          <button
            type="submit"
            className="w-full bg-[#328f7b] text-white p-2 rounded hover:bg-[#28735e] transition"
          >
            {isRegistering ? "S'inscrire" : "Se connecter"} {/* Texte du bouton selon le mode */}
          </button>
        </form>

        {/* Section pour basculer entre le mode inscription et connexion */}
        <p className="text-center mt-4">
          {isRegistering ? "Déjà un compte ?" : "Pas encore de compte ?"}
          <button
            className="text-[#328f7b] font-bold ml-1"
            onClick={() => {
              setIsRegistering(!isRegistering); // Basculer entre inscription et connexion
              setError(null); // Réinitialisation de l'erreur lors du changement de mode
            }}
          >
            {isRegistering ? "Se connecter" : "S'inscrire"} {/* Texte du bouton qui change entre inscription et connexion */}
          </button>
        </p>
      </div>
    </div>
  );
}

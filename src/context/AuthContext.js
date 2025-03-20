"use client"; // Indique que ce fichier est côté client pour Next.js

import { createContext, useContext, useEffect, useState } from "react";

// Crée le contexte d'authentification
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // L'état pour l'utilisateur, initialisé à null (pas de connexion au début)
  const [user, setUser] = useState(null);

  // Quand l'app se charge, on essaie de récupérer l'utilisateur stocké dans localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser); // Si on trouve un utilisateur, on le met dans l'état
  }, []); // Ce code s'exécute une seule fois au démarrage

  // Fonction pour se connecter
  const login = (username, password) => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || []; // On récupère tous les utilisateurs stockés

    // On cherche un utilisateur avec ce nom d'utilisateur et mot de passe
    const existingUser = storedUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (existingUser) {
      // Si on trouve l'utilisateur, on le connecte et on le stocke dans localStorage
      setUser(existingUser);
      localStorage.setItem("user", JSON.stringify(existingUser));
      return { success: true };
    } else {
      // Si pas trouvé, on renvoie un message d'erreur
      return { success: false, message: "Identifiants incorrects" };
    }
  };

  // Fonction pour s'inscrire
  const register = (username, password) => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Si le nom d'utilisateur existe déjà, on retourne un message d'erreur
    if (storedUsers.some((user) => user.username === username)) {
      return { success: false, message: "Ce nom d'utilisateur existe déjà" };
    }

    // Sinon, on crée un nouveau utilisateur et on l'ajoute à la liste
    const newUser = { username, password };
    storedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(storedUsers)); // On sauvegarde les utilisateurs
    return { success: true };
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null); // On vide l'état de l'utilisateur
    localStorage.removeItem("user"); // On enlève l'utilisateur du localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children} {/* On rend les enfants avec le contexte */}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser facilement notre contexte d'authentification dans d'autres composants
export function useAuth() {
  return useContext(AuthContext);
}

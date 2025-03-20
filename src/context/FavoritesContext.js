"use client"; // Indique que ce fichier doit être exécuté côté client dans Next.js

import { createContext, useContext, useEffect, useState } from "react";

// Création du contexte pour gérer les favoris
const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  // L'état pour stocker les favoris, initialisé à un tableau vide
  const [favorites, setFavorites] = useState([]);

  // useEffect pour charger les favoris depuis le localStorage au démarrage de l'application
  useEffect(() => {
    // On récupère les favoris stockés dans le localStorage (s'il y en a)
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites); // On les met dans l'état
  }, []); // Ce code s'exécute une seule fois, lors du montage initial du composant

  // useEffect pour mettre à jour le localStorage chaque fois que les favoris changent
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites)); // On enregistre les favoris dans le localStorage
  }, [favorites]); // Ce code s'exécute chaque fois que "favorites" change

  // Fonction pour ajouter ou enlever un livre des favoris
  const toggleFavorite = (book) => {
    setFavorites((prevFavorites) => {
      // Vérifie si le livre est déjà un favori
      const isAlreadyFavorite = prevFavorites.some((fav) => fav.id === book.id);
      return isAlreadyFavorite
        ? prevFavorites.filter((fav) => fav.id !== book.id) // Si oui, on le retire
        : [...prevFavorites, book]; // Sinon, on l'ajoute
    });
  };

  return (
    // Fournit le contexte à tous les composants enfants
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook personnalisé pour récupérer facilement les favoris dans d'autres composants
export function useFavorites() {
  return useContext(FavoritesContext);
}

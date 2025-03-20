"use client"; // Marque ce composant comme côté client

// Importation des bibliothèques et icônes nécessaires
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaList, FaHeart, FaRegHeart } from "react-icons/fa"; // Icônes pour la liste et les favoris
import { FiPlusSquare } from "react-icons/fi"; // Icône pour le mode "grid"
import { useFavorites } from "../../context/FavoritesContext"; // Contexte pour gérer les favoris
import { useAuth } from "../../context/AuthContext"; // Contexte pour l'authentification

// Fonction pour récupérer les livres depuis une API
const fetchBooks = async () => {
  const res = await fetch("https://example-data.draftbit.com/books");
  return res.json(); // Retourne les données sous forme de JSON
};

const BookPage = () => {
  // Récupération de l'utilisateur authentifié et des favoris depuis les contextes
  const { user } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  
  // États pour gérer les livres, la recherche, les filtres, etc.
  const [books, setBooks] = useState([]); // Liste des livres
  const [search, setSearch] = useState(""); // Valeur de la recherche par titre
  const [minRating, setMinRating] = useState(0); // Note minimale pour filtrer les livres
  const [sortOrder, setSortOrder] = useState("rating-up"); // Ordre de tri (par note)
  const [selectedCategory, setSelectedCategory] = useState("All"); // Catégorie sélectionnée
  const [display, setDisplay] = useState("grid"); // Mode d'affichage ("grid" ou "list")

  // Utilisation du hook useEffect pour charger les livres au démarrage
  useEffect(() => {
    const getBooks = async () => {
      const data = await fetchBooks(); // Récupération des livres depuis l'API
      setBooks(data); // Mise à jour de l'état avec les livres récupérés
    };
    getBooks(); // Appel de la fonction pour récupérer les livres
  }, []);

  // Liste des catégories disponibles pour filtrer les livres
  const categories = ["All", "Classics", "Fiction", "Historical", "Science Fiction", "Fantasy", "Young Adult"];

  // Filtrage des livres selon les critères de recherche, catégorie, note, et tri
  const filteredBooks = books
    .filter(book => book.title.toLowerCase().includes(search.toLowerCase())) // Filtre par titre (recherche)
    .filter(book => selectedCategory === "All" || book.genres?.split(",").some(g => g.trim() === selectedCategory)) // Filtre par catégorie
    .filter(book => book.rating >= minRating) // Filtre par note minimale
    .sort((a, b) => sortOrder === "rating-up" ? a.rating - b.rating : b.rating - a.rating); // Tri par note

  return (
    <section className="w-full px-10 flex gap-10">
      {/* Sidebar gauche pour les filtres */}
      <div className="w-1/4 flex flex-col gap-6">
        {/* Champ de recherche */}
        <input
          type="text"
          placeholder="Search by name"
          className="border p-2 rounded-md w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Mise à jour de la recherche
        />

        {/* Filtre par catégorie */}
        <div className="flex flex-col items-center">
          <h2 className="font-bold italic mb-2">Category</h2>
          <ul className="flex flex-col gap-2 items-center">
            {categories.map(category => (
              <li
                key={category}
                className={`cursor-pointer ${selectedCategory === category ? "font-bold text-green-700 underline" : ""}`}
                onClick={() => setSelectedCategory(category)} // Sélectionner la catégorie
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Filtre par note */}
        <div className="flex flex-col items-center gap-6">
          <h2 className="font-bold italic mb-2">Minimum rating</h2>
          <p>{minRating} / 5</p>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))} // Mise à jour de la note minimale
            className="w-full cursor-pointer"
          />
        </div>
      </div>

      {/* Affichage des livres */}
      <div className="w-3/4">
        {/* Outils de tri et d'affichage */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex gap-3 text-xl">
            {/* Changer de mode d'affichage (grid ou list) */}
            <FiPlusSquare className="cursor-pointer" onClick={() => setDisplay("grid")} />
            <FaList className="cursor-pointer" onClick={() => setDisplay("list")} />
          </div>
          {/* Menu déroulant pour choisir l'ordre de tri */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)} // Changer l'ordre du tri
            className="border border-gray-400 rounded px-3 py-1"
          >
            <option value="rating-up">Rating to up</option>
            <option value="rating-down">Rating to down</option>
          </select>
        </div>

        {/* Affichage des livres filtrés */}
        <div className={display === "grid" ? "grid grid-cols-3 gap-20 h-186 overflow-y-scroll px-10" : "flex flex-col gap-6"}>
          {filteredBooks.map((book) => {
            const isFavorite = favorites.some((fav) => fav.id === book.id); // Vérifier si le livre est favori

            return (
              <div
                key={book.id}
                className={`h-96 p-4 rounded-md shadow-md bg-white relative group`} // "group" pour gérer les styles au survol
              >
                {/* Lien vers la page du livre */}
                <Link className="flex flex-col items-center justify-center" href={`/books/${book.id}`}>
                  <img
                    src={book.image_url}
                    alt={book.title}
                    className="h-60 rounded-md mb-2 group-hover:opacity-80 transition-opacity duration-300" // Effet de transition sur l'image au survol
                  />
                  <h2 className="font-bold text-lg text-center">{book.title}</h2> {/* Titre centré */}
                </Link>

                {/* Icône de cœur pour ajouter/enlever des favoris */}
                {user && (
                  <button
                    onClick={() => toggleFavorite(book)} // Ajouter ou enlever des favoris
                    className="absolute top-2 left-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                  >
                    {/* Afficher un cœur plein si le livre est dans les favoris, sinon un cœur vide */}
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                  </button>
                )}

                {/* Affichage des auteurs du livre */}
                <p className="text-gray-600 italic text-center mt-2">By {book.authors}</p> {/* Aligné sous l'image */}

                {/* Détails du livre au survol (note, nombre d'avis) */}
                <div className="w-full flex justify-evenly items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-full group-hover:translate-y-0 absolute bottom-0 left-0 right-0 bg-white p-2 rounded-t-md shadow-md">
                  <p className="mt-1">⭐ {book.rating} / 5</p>
                  <p className="mt-1">on {book.rating_count} advices</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BookPage;

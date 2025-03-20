"use client"; // Marque ce composant comme côté client

import React, { useState, useEffect } from "react";
import { useFavorites } from "../../../context/FavoritesContext"; // Importation du contexte des favoris
import { useAuth } from "../../../context/AuthContext"; // Importation du contexte d'authentification
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Icônes du cœur pour les favoris

// Fonction asynchrone pour récupérer un livre par son ID depuis l'API
const fetchBookById = async (id) => {
  const res = await fetch("https://example-data.draftbit.com/books");
  const books = await res.json();
  return books.find((book) => book.id === Number(id)); // Retourne le livre dont l'ID correspond
};

// Composant principal BooksDetails pour afficher les détails d'un livre
const BooksDetails = ({ params }) => {
  const { user } = useAuth(); // Utilisation du contexte d'authentification pour vérifier si l'utilisateur est connecté
  const { favorites, toggleFavorite } = useFavorites(); // Utilisation du contexte des favoris pour obtenir la liste et la fonction de gestion des favoris
  const [book, setBook] = useState(null); // État pour stocker les informations du livre
  const [isFavorite, setIsFavorite] = useState(false); // État pour vérifier si le livre est dans les favoris

  const { id } = React.use(params); // Récupère l'ID du livre à partir des paramètres

  // useEffect pour récupérer les détails du livre lorsque l'ID change
  useEffect(() => {
    const getBook = async () => {
      const fetchedBook = await fetchBookById(id); // Appel de la fonction pour récupérer le livre
      setBook(fetchedBook); // Mise à jour de l'état avec les détails du livre
      setIsFavorite(favorites.some((fav) => fav.id === fetchedBook?.id)); // Vérifie si ce livre est dans les favoris
    };

    if (id) {
      getBook(); // Si un ID est présent, on récupère le livre
    }
  }, [id, favorites]); // Ré-exécution de l'effet quand l'ID ou les favoris changent

  // Si aucun livre n'est trouvé, afficher un message
  if (!book) {
    return <div className="text-center text-gray-600">Livre non trouvé</div>;
  }

  return (
    <section className="w-full h-full flex justify-center items-center bg-gray-200 py-20">
      <div className="flex gap-10 items-center justify-center max-w-screen-xl w-full">
        {/* Affichage de l'image du livre */}
        <div className="w-4/12 flex justify-center">
          <img src={book.image_url} alt={book.title} className="rounded-xl h-full" />
        </div>

        {/* Détails du livre */}
        <div className="w-7/12 bg-white p-5 rounded-xl flex flex-col items-center gap-4 shadow-lg">
          {/* Titre du livre avec cœur pour les favoris */}
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-center">{book.title}</h1>
            {user && ( // Si l'utilisateur est connecté, afficher le bouton pour ajouter aux favoris
              <button
                className="text-3xl text-red-500 hover:text-red-700"
                onClick={() => toggleFavorite(book)} // Fonction qui ajoute ou retire le livre des favoris
              >
                {isFavorite ? <FaHeart /> : <FaRegHeart />} {/* Icône qui change selon l'état du favori */}
              </button>
            )}
          </div>

          {/* Auteur du livre */}
          <p className="text-center text-xl">
            By : <span className="italic">{book.authors}</span>
          </p>

          {/* Description du livre */}
          <p className="w-10/12 text-center text-sm overflow-auto">{book.description}</p>

          {/* Informations supplémentaires */}
          <div className="flex flex-col gap-3 w-10/12 bg-gray-200 rounded p-3">
            {/* Edition */}
            <div className="flex justify-between items-center border-b pb-2">
              <span>Edition :</span>
              <span>{book.edition}</span>
            </div>

            {/* Format */}
            <div className="flex justify-between items-center border-b pb-2">
              <span>Format :</span>
              <span>{book.format}</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 items-center justify-between border-b pb-2">
              <span>Genres :</span>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  new Set(book.genres.split(",").map((genre) => genre.trim())) // Transforme la liste de genres en tableau unique
                ).map((genre, index) => (
                  <span key={index} className="px-2 py-1 bg-green-700 rounded-2xl text-white">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Nombre de pages */}
            <div className="flex justify-between items-center border-b pb-2">
              <span>Number of Pages :</span>
              <span>{book.num_pages}</span>
            </div>

            {/* Note */}
            <div className="flex justify-between items-center">
              <span>Rating :</span>
              <span
                className={`font-bold ${
                  book.rating > 4
                    ? "text-green-600"
                    : book.rating < 2.5
                    ? "text-red-600"
                    : "text-black"
                }`}
              >
                {book.rating} / 5 {/* Affichage de la note du livre */}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BooksDetails;

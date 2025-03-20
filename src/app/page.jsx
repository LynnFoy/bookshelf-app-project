//Main Page

"use client"; // Marque ce composant comme côté client

import { useState, useEffect } from "react";
import Link from "next/link";
import Carousel from "../components/Carousel/Carousel";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext"; // Contexte pour l'authentification
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Icônes de cœur pour les favoris

export default function Home() {
  const [books, setBooks] = useState([]); // Liste des livres
  const [visibleBooks, setVisibleBooks] = useState(15); // Nombre de livres à afficher
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // État d'erreur en cas de problème

  const { user } = useAuth(); // Vérification de la connexion de l'utilisateur
  const { favorites, toggleFavorite } = useFavorites(); // Gestion des favoris

  useEffect(() => {
    // Cette fonction va récupérer les livres depuis une API
    const fetchBooks = async () => {
      try {
        const res = await fetch("https://example-data.draftbit.com/books"); // On va chercher les livres
        if (!res.ok) throw new Error("Failed to fetch books"); // Si l'appel échoue
        const data = await res.json();

        // On garde que les livres ayant une note >= 4
        const filteredBooks = data.filter((book) => book.rating >= 4);
        setBooks(filteredBooks); // On met à jour l'état des livres
      } catch (err) {
        setError(err.message); // Si une erreur se produit
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchBooks(); // Lancer la récupération des livres
  }, []); // Utilisation de useEffect pour appeler cette fonction au démarrage

  const loadMoreBooks = () => {
    // Fonction pour charger plus de livres
    setVisibleBooks((prev) => prev + 12); // On ajoute 12 livres supplémentaires
  };

  return (
    <div className="flex flex-col gap-20">
      <Carousel /> {/* Le carousel est affiché en haut de la page */}

      <div className="flex flex-col justify-center gap-2">
        <h4 className="text-center">Books Gallery</h4>
        <h1 className="text-center text-gray-800 text-3xl font-bold">Popular Books</h1>
      </div>

      {/* Message de chargement */}
      {loading && <p className="text-center text-gray-600">Loading books...</p>}

      {/* Affichage de l'erreur */}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {/* Si les livres sont chargés et qu'il n'y a pas d'erreur */}
      {!loading && !error && books.length > 0 && (
        <>
          {/* Affichage des livres */}
          <div className="grid grid-cols-5 gap-6 p-5 bg-gray-200">
            {books.slice(0, visibleBooks).map((book) => {
              const isFavorite = favorites.some((fav) => fav.id === book.id); // Vérifier si le livre est un favori

              return (
                <div key={book.id} className="text-center p-2 bg-white text-black w-4/5 h-[375px] shadow-md mx-auto">
                  <div className="relative group">
                    {/* Affichage du cœur uniquement lors du survol de l'image */}
                    {user && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Empêche la navigation du lien
                          e.preventDefault(); // Empêche le comportement de lien
                          toggleFavorite(book); // Ajouter/enlever des favoris
                        }}
                        className="absolute top-[5px] left-[-5px] text-xl text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-opacity duration-200"
                      >
                        {/* Cœur plein ou contour selon si le livre est favori */}
                        {isFavorite ? <FaHeart /> : <FaRegHeart />}
                      </button>
                    )}

                    {/* Lien vers la page de détails du livre */}
                    <Link href={`/books/${book.id}`} className="no-underline text-black">
                      <img
                        src={book.image_url}
                        alt={book.title}
                        width={175}
                        height={200}
                        className="w-4/5 h-[250px] object-cover mx-auto"
                      />
                      <p className="mt-2 font-medium">{book.title}</p>
                      <p className="text-sm">
                        By : <i>{book.authors}</i>
                      </p>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Afficher le bouton "Load More" si il y a plus de livres à afficher */}
          {visibleBooks < books.length && (
            <button
              onClick={loadMoreBooks} // Appel pour charger plus de livres
              className="block mx-auto bg-green-700 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-800 transition"
            >
              Load More
            </button>
          )}
        </>
      )}

      {/* Si aucun livre avec une note >= 4 n'est trouvé */}
      {!loading && !error && books.length === 0 && (
        <p className="text-center text-gray-600">No books found with rating 4 or higher.</p>
      )}
    </div>
  );
}

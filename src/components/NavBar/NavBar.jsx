"use client"; // Marque ce composant comme côté client pour Next.js

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Permet de récupérer le chemin actuel de l'URL
import { useAuth } from "../../context/AuthContext"; // Contexte pour gérer l'authentification
import { useFavorites } from "../../context/FavoritesContext"; // Contexte pour gérer les favoris
import { FaHeart, FaHeartBroken, FaBook, FaPhoneAlt, FaSearch, FaTimes } from "react-icons/fa"; // Icônes utilisées dans le composant
import { CgMenuLeft } from "react-icons/cg"; // Icône de menu

export default function Navbar() {
  const { user, isLoading, logout } = useAuth(); // On récupère l'utilisateur, l'état de chargement, et la fonction de déconnexion
  const { favorites, toggleFavorite } = useFavorites(); // On récupère les favoris et la fonction pour les activer/désactiver
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Gère l'état d'ouverture du menu latéral
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false); // Gère l'état d'ouverture des favoris
  const pathname = usePathname(); // Récupère l'URL actuelle pour conditionner l'affichage

  if (isLoading) return null; // Si l'authentification est en cours de chargement, ne rien afficher

  // Fonction pour fermer les menus si l'on clique à l'extérieur
  const closeMenus = (event) => {
    if (!event.target.closest(".menu-sidebar") && isMenuOpen) setIsMenuOpen(false);
    if (!event.target.closest(".favorites-sidebar") && isFavoritesOpen) setIsFavoritesOpen(false);
  };

  useEffect(() => {
    // Ajoute l'événement au clic pour fermer les menus quand l'utilisateur clique à l'extérieur
    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus); // Nettoyage de l'événement lors de la destruction du composant
  }, []);

  useEffect(() => {
    // Ferme les menus quand l'URL change
    setIsMenuOpen(false); 
    setIsFavoritesOpen(false);
  }, [pathname]);

  // Classes conditionnelles pour l'animation de l'ouverture du menu et des favoris
  const menuClasses = isMenuOpen ? "translate-x-0" : "-translate-x-full";
  const favoritesClasses = isFavoritesOpen ? "translate-x-0" : "translate-x-full";

  return (
    <>
      {/* Navigation principale */}
      <nav className="flex items-center justify-center p-4 bg-white text-lg h-[10vh] w-full gap-[15%]">
        <div className="flex items-center justify-center w-[30%] gap-[3%]">
          {/* Bouton pour ouvrir le menu */}
          <CgMenuLeft className="w-10 h-10 cursor-pointer" onClick={() => setIsMenuOpen(true)} />
          <Link href="/" className="text-black no-underline">
            <h1>BOOKSHELF.</h1>
          </Link>
        </div>
        
        {/* Barre de recherche (désactivée sur la page "All books") */}
        <div className={`flex items-center justify-center bg-gray-200 p-2 rounded-none w-[20%] ${pathname === "/BookPage" ? "opacity-0 pointer-events-none invisible" : ""}`}>
          <FaSearch className="text-lg cursor-pointer mx-2.5 bg-gray-200" />
          <input type="text" placeholder="Search your book here" className="border-none bg-transparent outline-none ml-2.5 w-full" />
        </div>
        
        {/* Informations de contact et icône favoris */}
        <div className="flex items-center ml-[10%] mr-[5%] gap-5">
          <FaPhoneAlt />
          <span>0485313406</span>
          {user && <FaHeart className="cursor-pointer hover:text-[#328f7b]" onClick={() => setIsFavoritesOpen(true)} />}
        </div>
      </nav>

      {/* Menu latéral */}
      <div className={`fixed top-0 left-0 w-[300px] h-screen bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-10 ${menuClasses}`}>
        <div className="flex justify-between items-center font-bold text-xl pb-2.5 bg-gray-300 p-5">
          <h2>BOOKSHELF</h2>
          {/* Bouton pour fermer le menu */}
          <FaTimes className="text-xl cursor-pointer" onClick={() => setIsMenuOpen(false)} />
        </div>
        <ul className="list-none pl-5 mt-5">
          {/* Liens du menu */}
          <li className="py-2.5 text-xl"><Link href="/" className="text-black no-underline transition-colors hover:text-[#328f7b]">Main page</Link></li>
          <li className="py-2.5 text-xl"><Link href="/BookPage" className="text-black no-underline transition-colors hover:text-[#328f7b]">All books</Link></li>
        </ul>
        
        <div className="text-left pl-5">
          {/* Affichage de l'utilisateur connecté ou du bouton de connexion */}
          {user ? (
            <>
              <p className="font-bold text-xl mb-2.5">Bonjour, {user.username}</p>
              <button className="bg-[#328f7b] text-white border-none p-2.5 cursor-pointer w-1/2 rounded" onClick={logout}>Déconnexion</button>
            </>
          ) : (
            <Link href="/login" className="block text-[#328f7b] text-xl font-bold p-2.5">Connexion</Link>
          )}
        </div>
      </div>

      {/* Fenêtre des favoris */}
      {user && (
        <div className={`fixed top-0 right-0 w-[350px] h-screen bg-white shadow-lg p-5 transform transition-transform duration-300 flex flex-col text-center z-10 ${favoritesClasses}`}>
          {/* Bouton pour fermer les favoris */}
          <FaTimes className="absolute right-3.5 top-3.5 text-lg cursor-pointer" onClick={() => setIsFavoritesOpen(false)} />
          <h2>Favorites</h2>
          {/* Affichage des favoris ou message s'il n'y en a pas */}
          {favorites.length === 0 ? (
            <p>No favorites yet</p>
          ) : (
            <ul>
              {/* Affichage des livres favoris */}
              {favorites.map((book) => (
                <li key={book.id} className="flex items-center p-6 relative transition-colors duration-300 w-full hover:bg-gray-100 rounded">
                  <img src={book.image_url} alt={book.title} className="w-24 h-24 object-cover mr-2.5" />
                  <div className="flex justify-between items-center w-full">
                    <p className="text-left">{book.title}</p>
                    <div className="flex gap-3">
                      {/* Lien vers la page du livre */}
                      <Link href={`/books/${book.id}`}>
                        <FaBook className="w-5 h-5 p-1.5 text-black bg-gray-400 rounded-full cursor-pointer transition-transform duration-300 hover:bg-[#328f7b] hover:text-white hover:scale-110" />
                      </Link>
                      {/* Bouton pour enlever un livre des favoris */}
                      <FaTimes className="w-5 h-5 p-1.5 text-white bg-red-500 rounded-full cursor-pointer transition-transform duration-300 hover:bg-red-700 hover:scale-110" onClick={() => toggleFavorite(book)} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

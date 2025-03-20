"use client";

import { useState, useEffect } from "react";
import "./Carousel.css";

// Définition des diapositives du carrousel avec les images correspondantes
const slides = [
  { image: "/carroussel/01.png" },
  { image: "/carroussel/02.png" },
  { image: "/carroussel/03.png" },
  { image: "/carroussel/04.png" },
];

export default function Carousel() {
  // Déclare les états pour gérer l'index de la diapositive actuelle et l'animation de fondu
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  // Utilise useEffect pour changer automatiquement la diapositive toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 5000); // Appelle nextSlide chaque 5 secondes
    return () => clearInterval(interval); // Nettoie l'intervalle lorsqu'on quitte le composant
  }, [currentIndex]); // L'effet est relancé chaque fois que currentIndex change

  // Fonction pour passer à la diapositive suivante
  const nextSlide = () => {
    setFade(true); // Déclenche l'effet de fondu
    setTimeout(() => {
      // Passe à la diapositive suivante, avec gestion du cycle (retour à la première diapositive après la dernière)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      setFade(false); // Désactive l'effet de fondu
    }, 600); // La durée du fondu est de 600ms
  };

  // Fonction pour revenir à la diapositive précédente
  const prevSlide = () => {
    setFade(true); // Déclenche l'effet de fondu
    setTimeout(() => {
      // Passe à la diapositive précédente, avec gestion du cycle (retour à la dernière diapositive si on est à la première)
      setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
      setFade(false); // Désactive l'effet de fondu
    }, 600); // La durée du fondu est de 600ms
  };

  // Fonction pour aller directement à une diapositive spécifique via les indicateurs (points en bas)
  const goToSlide = (index) => {
    setFade(true); // Déclenche l'effet de fondu
    setTimeout(() => {
      setCurrentIndex(index); // Définit la diapositive souhaitée
      setFade(false); // Désactive l'effet de fondu
    }, 600); // La durée du fondu est de 600ms
  };

  // Récupère la diapositive actuelle en fonction de l'index
  const slide = slides[currentIndex];
  
  return (
    <div className="carousel-container">
      {/* Bouton pour revenir à la diapositive précédente */}
      <button className="carousel-arrow left" onClick={prevSlide}>❮</button>

      {/* Diapositive actuelle avec effet de fondu */}
      <div className={`carousel-slide ${fade ? "fade-out" : "fade-in"}`}>
        <div className="text-content">
          <h5>LET'S MAKE THE BEST INVESTMENT</h5>
          <h1>There Is No Friend As Loyal As A Book</h1>
          <p>Bla bla bla bla bla bla bla bla.</p>
          <button className="slide-button">Shop Now</button>
        </div>
        <div className="image-content">
          {/* Affiche l'image de la diapositive actuelle */}
          <img src={slide.image} alt="slide" />
        </div>
      </div>

      {/* Bouton pour passer à la diapositive suivante */}
      <button className="carousel-arrow right" onClick={nextSlide}>❯</button>

      {/* Indicateurs de navigation pour chaque diapositive */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentIndex ? "active" : ""}`} 
            onClick={() => goToSlide(index)} // Permet de sauter à une diapositive spécifique en cliquant sur un indicateur
          ></span>
        ))}
      </div>
    </div>
  );
}

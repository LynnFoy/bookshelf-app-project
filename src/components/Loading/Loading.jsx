import "./loading.css"; // Importation du fichier CSS pour le style du loader

// Composant Loader qui est affiché lors du chargement de l'application
export default function Loader() {
  return (
    <div className="loader-container">
      {/* Le div spinner crée une animation de chargement */}
      <div className="spinner"></div>
      {/* Un message texte simple pour informer l'utilisateur du chargement */}
      <p>Chargement...</p>
    </div>
  );
}

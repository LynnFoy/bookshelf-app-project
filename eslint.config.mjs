// Importation des modules nécessaires
import { dirname } from "path";  // Utilisé pour récupérer le répertoire d'un fichier
import { fileURLToPath } from "url";  // Utilisé pour obtenir le chemin d'un fichier à partir de son URL
import { FlatCompat } from "@eslint/eslintrc";  // Importation de la classe FlatCompat d'ESLint pour la compatibilité de la configuration

// 1. Définir le chemin du fichier actuel à partir de l'URL du module
const __filename = fileURLToPath(import.meta.url); // Convertit l'URL du module en chemin de fichier

// 2. Définir le répertoire du fichier actuel
const __dirname = dirname(__filename);  // Obtient le répertoire du fichier actuel à partir de son chemin

// 3. Créer une instance de FlatCompat pour travailler avec des configurations ESLint
const compat = new FlatCompat({
  baseDirectory: __dirname,  // Spécifie le répertoire de base pour la compatibilité
});

// 4. Créer une configuration ESLint étendue avec les règles de Next.js et TypeScript
const eslintConfig = [
  // Utilisation des configurations "next/core-web-vitals" et "next/typescript" d'ESLint
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

// 5. Exportation de la configuration ESLint
export default eslintConfig;

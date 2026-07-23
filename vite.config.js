import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuration standard. Le déploiement (Vercel/Netlify) n'a besoin d'aucune
// option particulière ici : "npm run build" produit un dossier dist/ statique.
export default defineConfig({
  plugins: [react()],
});

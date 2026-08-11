import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuration standard. Le déploiement (Vercel/Netlify) n'a besoin d'aucune
// option particulière ici : "npm run build" produit un dossier dist/ statique.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("/src/chapters/") || id.endsWith("/registry.js")) return undefined;
          if (id.includes("-terminale-")) return "chapters-terminale";
          if (id.includes("-premiere-")) return "chapters-premiere";
          if (id.includes("-seconde")) return "chapters-seconde";
          if (id.includes("-troisieme")) return "chapters-troisieme";
          if (id.includes("-quatrieme")) return "chapters-quatrieme";
          if (id.includes("-cinquieme")) return "chapters-cinquieme";
          return "chapters-sixieme";
        },
      },
    },
  },
});

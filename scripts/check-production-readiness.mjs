import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const requiredServerVariables = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_MENSUEL",
  "STRIPE_PRICE_EXAMEN",
  "PUBLIC_APP_URL",
];
const recommendedServerVariables = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM",
];
const publicVariables = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];
const legalFiles = [
  "src/pages/legal/MentionsLegales.jsx",
  "src/pages/legal/CGU.jsx",
  "src/pages/legal/Confidentialite.jsx",
];

let failed = false;
for (const name of [...requiredServerVariables, ...publicVariables]) {
  if (!process.env[name]) {
    console.error(`ERREUR  Variable manquante : ${name}`);
    failed = true;
  }
}
for (const name of recommendedServerVariables) {
  if (!process.env[name]) console.warn(`ATTENTION  Notification e-mail incomplète : ${name}`);
}
if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith("sk_live_")) {
  console.error("ERREUR  STRIPE_SECRET_KEY n'est pas une clé Live.");
  failed = true;
}
if (process.env.PUBLIC_APP_URL && !/^https:\/\/[^/]+$/.test(process.env.PUBLIC_APP_URL)) {
  console.error("ERREUR  PUBLIC_APP_URL doit être une URL HTTPS sans slash final.");
  failed = true;
}

for (const file of legalFiles) {
  const content = await readFile(resolve(root, file), "utf8");
  if (/\[À compléter|\[à compléter|phase de test|ouverture commerciale bloquée|téléphone professionnel\s*:\s*en cours|adhésion (?:au dispositif de médiation )?est en cours|adhésion en cours avant l'ouverture/i.test(content)) {
    console.error(`ERREUR  Informations juridiques provisoires détectées dans ${file}`);
    failed = true;
  }
}

if (failed) {
  console.error("\nRéussiMaths n'est pas prêt pour l'ouverture des paiements Live.");
  process.exitCode = 1;
} else {
  console.log("RéussiMaths : contrôles automatiques de production validés.");
}

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import LearningFeedback from "../components/LearningFeedback";
import MathText from "../components/MathText";
import { useAuth } from "../hooks/useAuth";
import { isRealAdmin } from "../lib/access";
import { colors, fonts } from "../theme";
import { getAllDiscoveryShowcases, getDiagnosticShowcaseExercises } from "../discoveryShowcases";
import { supabase } from "../lib/supabaseClient";

const SAMPLES = [
  ["Nombres relatifs", { type: "numeric", chapter: "Nombres relatifs — Additionner deux relatifs de signes contraires", prompt: "Calcule : \\(-7+12\\)", answer: 5, steps: ["Les signes sont opposés : 12 est le plus « fort ».", "\\(12-7=5\\) : le résultat est positif."] }, "-19"],
  ["Fractions", { type: "numeric", chapter: "Fractions — Addition", prompt: "Calcule : \\(\\frac{2}{3}+\\frac{1}{4}\\)", answer: "11/12", steps: ["\\(\\frac{2}{3}=\\frac{8}{12}\\) et \\(\\frac{1}{4}=\\frac{3}{12}\\)", "\\(\\frac{8}{12}+\\frac{3}{12}=\\frac{11}{12}\\)"] }, "3/7"],
  ["Équation", { type: "numeric", chapter: "Équations — Résoudre", prompt: "Résous : \\(4x-7=13\\)", answer: 5, steps: ["On ajoute 7 dans les deux membres : \\(4x=20\\).", "On divise les deux membres par 4 : \\(x=5\\)."] }, "1,5"],
  ["Pourcentage", { type: "numeric", chapter: "Pourcentages — Évolution", prompt: "Augmente 80 € de 20 %.", answer: 96, answerUnit: "€", steps: ["10 % de 80 vaut 8 ; 20 % vaut donc 16.", "\\(80+16=96\\)"] }, "100"],
  ["Pythagore", { type: "numeric", chapter: "Théorème de Pythagore — Hypoténuse", prompt: "ABC est rectangle en A, AB = 6 cm et AC = 8 cm. Calcule BC.", answer: 10, steps: ["\\(BC^2=AB^2+AC^2\\)", "\\(BC^2=36+64=100\\)", "\\(BC=\\sqrt{100}=10\\text{ cm}\\)"] }, "14"],
  ["Image et antécédent", { type: "numeric", chapter: "Fonctions — Image et antécédent", prompt: "Pour \\(f(x)=3x-2\\), calcule l’image de 4.", answer: 10, steps: ["\\(f(4)=3\\times4-2\\)", "\\(f(4)=10\\)"] }, "2"],
  ["Probabilité", { type: "numeric", chapter: "Probabilités — Issues favorables", prompt: "Un sac contient 3 boules rouges et 2 bleues. Probabilité d’obtenir rouge ?", answer: "3/5", steps: ["Il y a 3 issues favorables et 5 issues possibles.", "\\(P(rouge)=\\frac{3}{5}\\)"] }, "3/2"],
  ["Lecture graphique", { type: "numeric", chapter: "Fonctions — Antécédent graphique", prompt: "Lis l’antécédent de 2.", answer: 3, steps: ["On part de 2 sur l’axe des ordonnées, puis on rejoint la courbe.", "On descend vers l’axe des abscisses : on lit 3."], feedbackGraph: { xMin: -4, xMax: 5, yMin: -3, yMax: 5, lines: [{ a: 1, b: -1, label: "f" }], points: [{ x: 3, y: 2, label: "(3 ; 2)" }], readingPaths: [{ y: 2, xs: [3] }] } }, "2"],
  ["Distributivité", { type: "text", chapter: "Calcul littéral — Développer", prompt: "Développe : \\(3(x+4)\\)", answer: "3x+12", steps: ["\\(3(x+4)=3\\times x+3\\times4\\)", "\\(3x+12\\)"] }, "3x+4"],
  ["Puissances", { type: "numeric", chapter: "Puissances — Parenthèses", prompt: "Calcule : \\((-3)^2\\)", answer: 9, steps: ["\\((-3)^2=(-3)\\times(-3)\\)", "Le produit de deux nombres négatifs est positif : \\(9\\)."] }, "-9"],
  ["Proportionnalité", { type: "numeric", chapter: "Proportionnalité — Retour à l’unité", prompt: "4 cahiers coûtent 10 €. Prix de 6 cahiers ?", answer: 15, steps: ["Retour à l’unité : \\(10\\div4=2{,}50\\) €.", "\\(6\\times2{,}50=15\\) €."] }, "12"],
  ["Longueurs", { type: "numeric", chapter: "Grandeurs et mesures — Unités de longueur", prompt: "Convertis 2,4 m en cm.", answer: 240, conversionTable: { kind: "length", value: 2.4, fromUnit: "m", toUnit: "cm", answer: 240 }, steps: ["\\(1\\text{ m}=100\\text{ cm}\\)", "\\(2{,}4\\times100=240\\)"] }, "2400"],
  ["Aires", { type: "numeric", chapter: "Grandeurs et mesures — Unités d'aire", prompt: "Convertis 2,4 m² en cm².", answer: 24000, conversionTable: { kind: "area", value: 2.4, fromUnit: "m²", toUnit: "cm²", answer: 24000 }, steps: ["\\(1\\text{ m}^2=10 000\\text{ cm}^2\\)", "\\(2{,}4\\times10 000=24 000\\)"] }, "240"],
  ["Volumes", { type: "numeric", chapter: "Géométrie dans l'espace — Conversions", prompt: "Convertis 2,4 m³ en cm³.", answer: 2400000, conversionTable: { kind: "volume", value: 2.4, fromUnit: "m³", toUnit: "cm³", answer: 2400000 }, steps: ["\\(1\\text{ m}^3=1 000 000\\text{ cm}^3\\)", "\\(2{,}4\\times1 000 000=2 400 000\\)"] }, "24000"],
  ["Arrondi", { type: "numeric", chapter: "Nombres décimaux — Arrondir", prompt: "Arrondis 3,146 au centième.", answer: 3.15, steps: ["Le chiffre des centièmes est 4 ; le chiffre suivant est 6.", "Comme 6 est supérieur à 5, le chiffre 4 devient 5."] }, "3,14"],
  ["Unité d’aire", { type: "text", chapter: "Géométrie — Aire", prompt: "Quelle unité convient pour une aire mesurée en centimètres ?", answer: "cm²", steps: ["Une aire mesure une surface : l’unité est élevée au carré.", "On écrit donc cm²."] }, "cm"],
  ["Moyenne pondérée", { type: "numeric", chapter: "Statistiques — Moyenne et effectifs", prompt: "Calcule la moyenne de valeurs associées à des effectifs.", answer: 12, steps: ["On multiplie chaque valeur par son effectif.", "On additionne ces produits puis on divise par l’effectif total."] }, "10"],
  ["Produit de relatifs", { type: "numeric", chapter: "Nombres relatifs — Produit", prompt: "Calcule : \\((-4)\\times(-3)\\)", answer: 12, steps: ["Le produit de deux nombres négatifs est positif.", "\\(4\\times3=12\\)"] }, "-12"],
  ["Fraction irréductible", { type: "text", chapter: "Fractions — Simplifier", prompt: "Donne \\(\\frac{8}{12}\\) sous forme irréductible.", answer: "2/3", steps: ["8 et 12 sont divisibles par 4.", "\\(\\frac{8}{12}=\\frac{2}{3}\\)"] }, "4/6"],
  ["QCM multiple", { type: "multi", chapter: "Raisonnement — Plusieurs réponses", prompt: "Sélectionne toutes les affirmations vraies.", answer: [0, 2], steps: ["Teste chaque affirmation indépendamment.", "Conserve seulement celles qui sont vraies à elles seules."] }, [0]],
  ["Fonction affine — coefficients", { type: "text", chapter: "Fonctions affines — Identifier a et b", prompt: "Dans \\(f(x)=3x-2\\), donne le coefficient directeur.", answer: "3", steps: ["Dans \\(f(x)=ax+b\\), le coefficient directeur est a.", "Ici, \\(a=3\\)."] }, "-2"],
  ["Fonction — variations", { type: "text", chapter: "Fonctions — Sens de variation", prompt: "La courbe descend lorsque x va de -2 à 4. Quel est le sens de variation ?", answer: "décroissante", steps: ["On parcourt la courbe de gauche à droite.", "Les images descendent : la fonction est décroissante."] }, "croissante"],
  ["Fonction — domaine", { type: "text", chapter: "Généralités sur les fonctions — Ensemble de définition", prompt: "Quel nombre est interdit pour \\(f(x)=\\frac{1}{x-2}\\) ?", answer: "2", steps: ["Le dénominateur ne peut pas être nul.", "\\(x-2=0\\), donc \\(x=2\\) est interdit."] }, "0"],
  ["Statistiques — médiane", { type: "numeric", chapter: "Statistiques descriptives — Médiane", prompt: "Détermine la médiane de la série ordonnée : 2 ; 5 ; 7 ; 9 ; 12.", answer: 7, steps: ["L’effectif 5 est impair.", "La troisième valeur, située au centre, est 7."] }, "5"],
  ["Statistiques — quartile", { type: "numeric", chapter: "Statistiques descriptives — Quartiles", prompt: "Le rang du premier quartile est 3. Quelle valeur faut-il lire ?", answer: 8, steps: ["On lit la valeur placée au troisième rang dans la série ordonnée.", "Cette valeur est 8."] }, "3"],
  ["Statistiques — étendue", { type: "numeric", chapter: "Statistiques descriptives — Étendue", prompt: "Une série va de 4 à 19. Calcule son étendue.", answer: 15, steps: ["Étendue = maximum − minimum.", "\\(19-4=15\\)."] }, "19"],
  ["Probabilité — contraire", { type: "numeric", chapter: "Probabilités — Événement contraire", prompt: "On sait que \\(P(A)=0{,}3\\). Calcule \\(P(\\overline A)\\).", answer: 0.7, steps: ["\\(P(\\overline A)=1-P(A)\\)", "\\(1-0{,}3=0{,}7\\)"] }, "0,3"],
  ["Probabilité conditionnelle", { type: "numeric", chapter: "Probabilités conditionnelles — Probabilité conditionnelle", prompt: "Calcule \\(P_A(B)\\) sachant \\(P(A\\cap B)=0{,}2\\) et \\(P(A)=0{,}5\\).", answer: 0.4, steps: ["\\(P_A(B)=\\frac{P(A\\cap B)}{P(A)}\\)", "\\(0{,}2\\div0{,}5=0{,}4\\)"] }, "0,1"],
  ["Probabilités — arbre", { type: "numeric", chapter: "Probabilités conditionnelles — Arbre pondéré", prompt: "Un chemin porte les probabilités 0,6 puis 0,4. Calcule sa probabilité.", answer: 0.24, steps: ["Sur un même chemin, on multiplie.", "\\(0{,}6\\times0{,}4=0{,}24\\)"] }, "1"],
  ["Probabilités — indépendance", { type: "text", chapter: "Probabilités conditionnelles — Indépendance", prompt: "Comment vérifie-t-on que A et B sont indépendants ?", answer: "P(A∩B)=P(A)×P(B)", steps: ["On calcule les deux membres.", "Ils doivent être égaux."] }, "A et B sont différents"],
  ["Probabilités — fréquence", { type: "numeric", chapter: "Probabilités — Fréquence et probabilité", prompt: "Un événement se produit 30 fois en 50 essais. Calcule sa fréquence.", answer: 0.6, steps: ["Fréquence = réalisations ÷ essais.", "\\(30\\div50=0{,}6\\)"] }, "0,4"],
  ["Géométrie — Thalès", { type: "numeric", chapter: "Automatismes — Théorème de Thalès", prompt: "Deux droites sont parallèles. Les rapports correspondants donnent \\(\\dfrac{x}{6}=\\dfrac{4}{3}\\). Calcule \\(x\\).", answer: 8, steps: ["Les côtés correspondants sont écrits dans le même ordre.", "\\(x=6\\times\\dfrac{4}{3}=8\\)."] }, "4,5"],
  ["Géométrie — trigonométrie", { type: "text", chapter: "Automatismes — Trigonométrie", prompt: "On connaît le côté opposé et l’hypoténuse. Quel rapport utilise-t-on ?", answer: "sinus", steps: ["\\(\\sin(angle)=opposé/hypoténuse\\).", "On utilise donc le sinus."] }, "cosinus"],
  ["Géométrie — cercle", { type: "numeric", chapter: "Grandeurs et mesures — Périmètre d'un cercle", prompt: "Calcule le périmètre d’un cercle de rayon 2 cm, avec \\(\\pi\\approx3{,}14\\).", answer: 12.56, steps: ["\\(P=2\\pi r\\)", "\\(2\\times3{,}14\\times2=12{,}56\\text{ cm}\\)"] }, "6,28"],
  ["Géométrie — volume", { type: "numeric", chapter: "Géométrie dans l'espace — Volumes", prompt: "Calcule le volume d’une pyramide d’aire de base 30 cm² et de hauteur 9 cm.", answer: 90, steps: ["\\(V=aire\\ de\\ base\\times hauteur\\div3\\)", "\\(30\\times9\\div3=90\\text{ cm}^3\\)"] }, "270"],
  ["Géométrie — angles du triangle", { type: "numeric", chapter: "Angles — Angles d'un triangle", prompt: "Un triangle possède deux angles de 50° et 60°. Calcule le troisième.", answer: 70, steps: ["La somme des angles vaut 180°.", "\\(180-50-60=70°\\)."] }, "110"],
  ["Géométrie — existence", { type: "qcm", chapter: "Angles — Existence d'un triangle", prompt: "Peut-on construire un triangle de côtés 3 cm, 4 cm et 8 cm ?", answer: "Non", options: ["Oui", "Non"], steps: ["La plus grande longueur est 8 cm.", "\\(8>3+4\\) : le triangle n’existe pas."] }, "Oui"],
  ["Géométrie — transformation", { type: "text", chapter: "Géométrie plane — Translations", prompt: "Quel élément définit une translation ?", answer: "un vecteur", steps: ["Une translation est définie par une direction, un sens et une longueur.", "Ces trois informations sont regroupées dans un vecteur."] }, "un centre"],
  ["Géométrie — aire d’un triangle", { type: "numeric", chapter: "Automatismes — Aire d'un triangle", prompt: "Calcule l’aire d’un triangle de base 8 cm et de hauteur 5 cm.", answer: 20, steps: ["\\(A=base\\times hauteur\\div2\\)", "\\(8\\times5\\div2=20\\text{ cm}^2\\)"] }, "40"],
  ["Géométrie — parallélisme", { type: "text", chapter: "Angles — Tester le parallélisme", prompt: "Deux angles alternes-internes sont égaux. Que peut-on conclure ?", answer: "les droites sont parallèles", steps: ["Les angles sont alternes-internes et égaux.", "Les deux droites sont donc parallèles."] }, "les droites sont perpendiculaires"],
  ["Géométrie — coordonnées", { type: "text", chapter: "Géométrie repérée — Coordonnées", prompt: "Donne les coordonnées du point d’abscisse 2 et d’ordonnée -3.", answer: "(2 ; -3)", steps: ["L’abscisse s’écrit en premier.", "Les coordonnées sont \\((2;-3)\\)."] }, "(-3 ; 2)"],
  ["Géométrie — solide", { type: "text", chapter: "Géométrie dans l'espace — Vocabulaire", prompt: "Comment nomme-t-on un segment commun à deux faces ?", answer: "une arête", steps: ["Le segment appartient à deux faces.", "Il s’agit d’une arête."] }, "un sommet"],
  ["Géométrie — vecteur", { type: "text", chapter: "Vecteurs — Coordonnées", prompt: "A(1 ; 2) et B(4 ; 6). Donne les coordonnées de \\(\\overrightarrow{AB}\\).", answer: "(3 ; 4)", steps: ["\\(x_B-x_A=4-1=3\\)", "\\(y_B-y_A=6-2=4\\)"] }, "(5 ; 8)"],
];

const DISCOVERY_SAMPLES = getAllDiscoveryShowcases().flatMap((showcase) =>
  showcase.showcaseExercises.map((exercise, index) => [
    `Découverte ${showcase.meta.level} — question ${index + 1}`,
    exercise,
    exercise.type === "numeric"
      ? "999999"
      : exercise.type === "qcm"
        ? exercise.options.find((option) => option !== exercise.answer)
        : "réponse erronée",
  ])
);

const ALL_SAMPLES = [...SAMPLES, ...DISCOVERY_SAMPLES];
const DIAGNOSTIC_LEVELS = ["sixieme", "cinquieme", "quatrieme", "troisieme", "seconde", "premiere-spe", "premiere-non-spe", "premiere-techno", "terminale-spe", "terminale-techno"];
const DIAGNOSTIC_SAMPLES = DIAGNOSTIC_LEVELS.flatMap((levelId) =>
  getDiagnosticShowcaseExercises(levelId, 0).map((exercise, index) => [
    `Diagnostic ${levelId} — question ${index + 1}`,
    exercise,
    exercise.type === "numeric" ? "999999" : "réponse erronée",
  ])
);
const LAB_SAMPLES = [...ALL_SAMPLES, ...DIAGNOSTIC_SAMPLES];
const QUALITY_CRITERIA = [
  "L’erreur ou la confusion est nommée précisément.",
  "Le sens mathématique est expliqué avant la procédure.",
  "Toutes les étapes utiles sont visibles, sans saut implicite.",
  "La méthode est réutilisable dans une autre question.",
  "La conclusion répond avec la valeur et l’unité éventuelle.",
  "Un contrôle de cohérence est proposé lorsqu’il est accessible.",
  "Le visuel aide réellement à comprendre et reste lisible sur mobile.",
  "Une question proche permettrait de vérifier l’apprentissage.",
];

function loadReviews() {
  try { return JSON.parse(localStorage.getItem("reussimaths:correction-audits") ?? "{}"); }
  catch { return {}; }
}

export default function CorrectionsLab() {
  const { user, loading } = useAuth();
  const [index, setIndex] = useState(0);
  const [audits, setAudits] = useState(loadReviews);
  const [statusFilter, setStatusFilter] = useState("toutes");
  const [search, setSearch] = useState("");
  const allowed = import.meta.env.DEV || isRealAdmin(user);
  const [title, exercise, response] = LAB_SAMPLES[index];
  useEffect(() => {
    if (!user?.id) return;
    supabase.from("pedagogical_correction_audits").select("sample_key,title,status,checked_criteria,note,updated_at").then(({data,error}) => {
      if (error) { if (error.code !== "42P01") console.error("[CorrectionsLab] chargement :", error.message); return; }
      const remote = Object.fromEntries((data ?? []).map((row)=>[row.sample_key,{checks:row.checked_criteria ?? [],note:row.note ?? "",status:row.status,updatedAt:row.updated_at}]));
      setAudits((local)=>{const merged={...local,...remote};localStorage.setItem("reussimaths:correction-audits",JSON.stringify(merged));return merged;});
    });
  }, [user?.id]);
  const audit = audits[title] ?? { checks: [], note: "", status: "à_revoir" };
  const updateAudit = (next) => {
    const value = { ...audit, ...next, updatedAt: new Date().toISOString() };
    const updated = { ...audits, [title]: value };
    setAudits(updated);
    localStorage.setItem("reussimaths:correction-audits", JSON.stringify(updated));
    if (user?.id) supabase.from("pedagogical_correction_audits").upsert({sample_key:title,title,status:value.status,checked_criteria:value.checks,note:value.note,updated_at:value.updatedAt}).then(({error})=>{if(error&&error.code!=="42P01")console.error("[CorrectionsLab] sauvegarde :",error.message);});
  };
  const checkedCount = audit.checks.length;
  const filteredSamples = useMemo(() => LAB_SAMPLES.map((sample,sampleIndex)=>({sample,sampleIndex})).filter(({sample})=>{
    const status = audits[sample[0]]?.status ?? "à_revoir";
    return (statusFilter === "toutes" || status === statusFilter) && sample[0].toLocaleLowerCase("fr").includes(search.trim().toLocaleLowerCase("fr"));
  }), [audits, search, statusFilter]);
  if (loading) return null;
  if (!allowed) return <main className="min-h-screen p-8" style={{ background: colors.bg, color: colors.ink }}>Accès réservé à l’administration.</main>;
  return (
    <main className="min-h-screen px-4 py-6 sm:px-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-3xl mx-auto">
        <Link to="/admin" className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: colors.slate }}><ArrowLeft size={14} /> Administration</Link>
        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: colors.gold }}>Laboratoire pédagogique</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black" style={{ color: colors.ink, fontFamily: fonts.display }}>Contrôler les corrections</h1>
        <div className="mt-5 grid gap-2 sm:grid-cols-2"><input value={search} onChange={(event)=>setSearch(event.target.value)} placeholder="Rechercher une notion…" className="rounded-xl border bg-white px-3 py-3 text-sm" style={{borderColor:colors.hairline,color:colors.ink}}/><select value={statusFilter} onChange={(event)=>setStatusFilter(event.target.value)} className="rounded-xl border bg-white px-3 py-3 text-sm" style={{borderColor:colors.hairline,color:colors.ink}}><option value="toutes">Toutes les corrections</option><option value="à_revoir">À revoir</option><option value="prioritaire">Prioritaires</option><option value="validée">Validées</option></select></div>
        <label className="block mt-3 text-xs font-bold" style={{ color: colors.slate }}>
          Exemple à examiner
          <select value={index} onChange={(event) => setIndex(Number(event.target.value))} className="mt-2 w-full rounded-xl border bg-white px-3 py-3 text-sm" style={{ borderColor: colors.hairline, color: colors.ink }}>
            {filteredSamples.map(({sample:[sampleTitle],sampleIndex}) => <option key={sampleTitle} value={sampleIndex}>{sampleIndex + 1}. {sampleTitle}</option>)}
          </select>
        </label>
        {filteredSamples.length === 0 && <p className="mt-2 text-xs" style={{color:colors.red}}>Aucune correction ne correspond à ces filtres.</p>}
        <section className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold" style={{ color: colors.slate }}>Erreur simulée : {title}</p>
          <MathText as="p" text={exercise.prompt} className="mt-2 text-sm font-semibold" style={{ color: colors.ink }} />
          <p className="mt-1 text-xs" style={{ color: colors.red }}>Réponse donnée : {Array.isArray(response) ? response.join(", ") : response}</p>
          <div className="mt-4"><LearningFeedback exercise={exercise} response={response} /></div>
        </section>
        <section className="mt-5 rounded-2xl bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><p className="text-[10px] font-black uppercase tracking-[0.15em]" style={{color:colors.gold}}>Validation experte</p><h2 className="mt-1 text-lg font-black" style={{color:colors.ink,fontFamily:fonts.display}}>Grille de qualité pédagogique</h2></div>
            <span className="rounded-full px-3 py-1 text-xs font-black" style={{backgroundColor:checkedCount===QUALITY_CRITERIA.length?`${colors.green}18`:`${colors.gold}18`,color:checkedCount===QUALITY_CRITERIA.length?colors.green:colors.ink}}>{checkedCount}/{QUALITY_CRITERIA.length}</span>
          </div>
          <div className="mt-4 grid gap-2">
            {QUALITY_CRITERIA.map((criterion, criterionIndex) => <label key={criterion} className="flex items-start gap-2 rounded-xl p-2.5 text-xs cursor-pointer" style={{backgroundColor:colors.bg,color:colors.ink}}><input type="checkbox" className="mt-0.5" checked={audit.checks.includes(criterionIndex)} onChange={() => updateAudit({checks:audit.checks.includes(criterionIndex)?audit.checks.filter((item)=>item!==criterionIndex):[...audit.checks,criterionIndex]})}/><span>{criterion}</span></label>)}
          </div>
          <label className="block mt-4 text-xs font-bold" style={{color:colors.slate}}>Décision éditoriale<select value={audit.status} onChange={(event)=>updateAudit({status:event.target.value})} className="mt-1 w-full rounded-xl border bg-white px-3 py-2.5" style={{borderColor:colors.hairline,color:colors.ink}}><option value="à_revoir">À revoir</option><option value="validée">Validée</option><option value="prioritaire">Correction prioritaire</option></select></label>
          <label className="block mt-3 text-xs font-bold" style={{color:colors.slate}}>Note de l’expert<textarea value={audit.note} onChange={(event)=>updateAudit({note:event.target.value})} rows={4} placeholder="Ce qui doit être réécrit, illustré ou vérifié…" className="mt-1 w-full rounded-xl border bg-white px-3 py-2.5 font-normal" style={{borderColor:colors.hairline,color:colors.ink}} /></label>
          <p className="mt-3 text-[10px]" style={{color:colors.slate}}>La validation est conservée sur cet appareil et synchronisée avec votre compte administrateur lorsque la migration est installée. Une correction n’est considérée publiable qu’avec 8 critères validés et le statut « Validée ».</p>
        </section>
      </div>
    </main>
  );
}

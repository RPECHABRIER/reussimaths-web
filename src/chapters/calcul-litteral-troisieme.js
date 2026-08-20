// ---------------------------------------------------------------------------
// Chapitre : Calcul littéral (3e) — sous abonnement.
//
// Correspond au chapitre 3 du manuel de 3e : développer (simple et double
// distributivité avec coefficients quelconques, signe devant une parenthèse,
// identités remarquables (a+b)² et différence de deux carrés), factoriser
// (facteur commun numérique ou en x, facteur commun binomial, différence de
// deux carrés, distinguer une factorisation complète d'une factorisation
// partielle), programmes de calcul (résoudre une équation pour retrouver le
// nombre de départ, démontrer qu'un résultat est toujours un multiple d'un
// entier ou toujours égal au carré du nombre choisi), et problèmes de
// périmètre/aire utilisant le calcul littéral.
// Reprend la tâche intellectuelle des exercices du manuel (la correction du
// livre du professeur a servi à déterminer la méthode et à rédiger les
// steps), avec des nombres et contextes différents à chaque génération pour
// éviter toute reproduction à l'identique.
// Voir automatismes-troisieme.js (thème "calcul-litteral-troisieme") pour
// les mini-exercices "Calcul mental" associés.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr()/frTex() pour utiliser la virgule française — voir fr()/frTex() ci-dessous.
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const nonZero = (min, max) => {
  let n = 0;
  while (n === 0) n = randInt(min, max);
  return n;
};
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

// petit utilitaire : "+ 5" ou "- 5" à partir d'un entier signé
const sgn = (n) => (n >= 0 ? "+" : "-");
const abs = (n) => Math.abs(n);

// =========================== Développer ===========================

// ---------- 1. Développer une simple distributivité k(ax+b) ----------
function genDevelopperSimpleDistributiviteGeneraleNumeric() {
  const k = nonZero(-9, 9);
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const coefX = k * a;
  const constant = k * b;
  const askCoefX = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Développer",
    prompt: `On développe \\(${k}\\left(${a}x ${sgn(b)} ${abs(b)}\\right) = ?x ${askCoefX ? "+ \\ldots" : `${sgn(coefX)} ${abs(coefX)}`}\\). Quel est ${askCoefX ? "le coefficient de x" : "le terme constant"} de cette expression développée ?`,
    answer: askCoefX ? coefX : constant,
    steps: [
      { type: "calcul", text: `${k} \\times ${a}x = ${coefX}x` },
      { type: "calcul", text: `${k} \\times \\left(${b}\\right) = ${constant}` },
      { type: "resultat", text: `${k}\\left(${a}x ${sgn(b)} ${abs(b)}\\right) = ${coefX}x ${sgn(constant)} ${abs(constant)}` },
    ],
  };
}

// ---------- 2. Développer un signe devant une parenthèse, coefficient a ----------
function genDevelopperSigneDevantParentheseNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const isNeg = Math.random() < 0.5;
  const coefX = isNeg ? -a : a;
  const constant = isNeg ? -b : b;
  const askCoefX = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Développer",
    prompt: `On développe \\(${isNeg ? "-" : "+"}\\left(${a}x ${sgn(b)} ${abs(b)}\\right)\\). Quel est ${askCoefX ? "le coefficient de x" : "le terme constant"} de cette expression développée ?`,
    answer: askCoefX ? coefX : constant,
    steps: [
      {
        type: "regle",
        text: isNeg
          ? `Un signe - devant une parenthèse change le signe de chaque terme : ${coefX}x ${sgn(constant)} ${abs(constant)}`
          : `Un signe + devant une parenthèse laisse chaque terme inchangé : ${coefX}x ${sgn(constant)} ${abs(constant)}`,
      },
    ],
  };
}

// ---------- 3. Développer une double distributivité générale (ax+b)(cx+d) ----------
function genDevelopperDoubleDistributiviteGeneraleNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  const d = nonZero(-9, 9);
  const coefX2 = a * c;
  const coefX = a * d + b * c;
  const constant = b * d;
  const ask = pick(["x2", "x", "const"]);
  const prompt =
    ask === "x2"
      ? `On développe \\(\\left(${a}x ${sgn(b)} ${abs(b)}\\right)\\left(${c}x ${sgn(d)} ${abs(d)}\\right) = ?x^{2} ${sgn(coefX)} ${abs(coefX)}x ${sgn(constant)} ${abs(constant)}\\). Quel est le coefficient de \\(x^2\\) ?`
      : ask === "x"
      ? `On développe \\(\\left(${a}x ${sgn(b)} ${abs(b)}\\right)\\left(${c}x ${sgn(d)} ${abs(d)}\\right) = ${coefX2}x^{2} + ?x ${sgn(constant)} ${abs(constant)}\\). Quel est le coefficient de x ?`
      : `On développe \\(\\left(${a}x ${sgn(b)} ${abs(b)}\\right)\\left(${c}x ${sgn(d)} ${abs(d)}\\right) = ${coefX2}x^{2} ${sgn(coefX)} ${abs(coefX)}x + ?\\). Quel est le terme constant ?`;
  const answer = ask === "x2" ? coefX2 : ask === "x" ? coefX : constant;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Développer",
    prompt,
    answer,
    steps: [
      { type: "calcul", text: `${a}x \\times ${c}x = ${coefX2}x^2` },
      { type: "calcul", text: `${a}x \\times \\left(${d}\\right) + \\left(${b}\\right) \\times ${c}x = ${a * d}x ${sgn(b * c)} ${abs(b * c)}x = ${sgn(coefX)} ${abs(coefX)}x` },
      { type: "calcul", text: `\\left(${b}\\right) \\times \\left(${d}\\right) = ${constant}` },
    ],
  };
}

// ---------- 4. Repérer la bonne réduction de (ax+b) - (cx+d) (erreur classique) ----------
function genCorrigerErreurEleveQCM() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  const d = nonZero(-9, 9);
  const coefXOk = a - c;
  const constOk = b - d;
  const correct = `${coefXOk}x ${sgn(constOk)} ${abs(constOk)}`;
  // erreur 1 : oublie de changer le signe du terme constant de la deuxième parenthèse
  const constErr = b + d;
  const wrong1 = `${coefXOk}x ${sgn(constErr)} ${abs(constErr)}`;
  // erreur 2 : oublie de changer le signe du terme en x de la deuxième parenthèse
  const coefXErr = a + c;
  const wrong2 = `${coefXErr}x ${sgn(constOk)} ${abs(constOk)}`;
  const optsSet = new Set([correct, wrong1, wrong2]);
  let bump = 1;
  while (optsSet.size < 3) {
    optsSet.add(`${coefXOk + bump}x ${sgn(constOk)} ${abs(constOk)}`);
    bump++;
  }
  const options = shuffle([...optsSet]);
  return {
    type: "qcm",
    chapter: "Calcul littéral — Développer",
    prompt: `Un élève réduit \\(A = \\left(${a}x ${sgn(b)} ${abs(b)}\\right) - \\left(${c}x ${sgn(d)} ${abs(d)}\\right)\\) et se trompe. Quelle est la forme réduite correcte de A ?`,
    answer: correct,
    options,
    steps: [
      { type: "regle", text: `Soustraire une parenthèse revient à changer le signe de chacun de ses termes : ${a}x ${sgn(b)} ${abs(b)} ${c >= 0 ? "-" : "+"} ${abs(c)}x ${d >= 0 ? "-" : "+"} ${abs(d)}` },
      { type: "calcul", text: `On regroupe les termes en x : ${a} ${c >= 0 ? "-" : "+"} ${abs(c)} = ${coefXOk}` },
      { type: "calcul", text: `On regroupe les termes constants : ${b} ${d >= 0 ? "-" : "+"} ${abs(d)} = ${constOk}` },
      { type: "resultat", text: `A = ${correct}` },
    ],
  };
}

// =========================== Factoriser ===========================

// ---------- 5. Factoriser en mettant x en facteur commun (ax² + bx) ----------
function genFactoriserFacteurCommunXNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const askA = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Factoriser",
    prompt: `On factorise \\(${a}x^{2} ${sgn(b)} ${abs(b)}x = x\\left(?x ${askA ? "+ \\ldots" : `${sgn(a)} ${abs(a)}`}\\right)\\). Quel est ${askA ? "le coefficient de x" : "le terme constant"} du facteur entre parenthèses ?`,
    answer: askA ? a : b,
    steps: [
      { type: "regle", text: `x est un facteur commun aux deux termes : on le met en évidence.` },
      { type: "calcul", text: `${a}x^{2} ${sgn(b)} ${abs(b)}x = x \\times ${a}x + x \\times ${b} = x\\left(${a}x ${sgn(b)} ${abs(b)}\\right)` },
    ],
  };
}

// ---------- 6. Distinguer une factorisation complète d'une factorisation partielle ----------
function genFactoriserPlusGrandFacteurCommunQCM() {
  const g = pick([4, 6, 8, 9]);
  const divisors = { 4: [2], 6: [2, 3], 8: [2, 4], 9: [3] };
  const g2 = pick(divisors[g]);
  let p, q;
  do {
    p = randInt(1, 9);
    q = randInt(1, 9);
  } while (gcd(p, q) !== 1 || p === q);
  const full = `${g}x\\left(${p}x ${sgn(q)} ${abs(q)}\\right)`;
  const partialFactor = g / g2;
  const partial = `${g2}x\\left(${partialFactor * p}x ${sgn(partialFactor * q)} ${abs(partialFactor * q)}\\right)`;
  const options = shuffle([full, partial]);
  return {
    type: "qcm",
    chapter: "Calcul littéral — Factoriser",
    prompt: `L'expression \\(${g * p}x^{2} ${sgn(g * q)} ${abs(g * q)}x\\) peut se factoriser de deux façons : \\(${full}\\) ou \\(${partial}\\). Laquelle est la factorisation complète (avec le plus grand facteur commun possible) ?`,
    answer: full,
    options,
    steps: [
      { type: "resultat", text: `Le plus grand facteur commun de ${g * p} et ${g * q} est ${g}, donc la factorisation complète est ${full}.` },
      { type: "regle", text: `${partial} n'utilise qu'un facteur commun de ${g2}, ce n'est pas le plus grand possible.` },
    ],
  };
}

// ---------- 7. Développer une différence de deux carrés (ax+b)(ax-b) ----------
function genDevelopperDifferenceCarresNumeric() {
  const a = nonZero(2, 9);
  const b = nonZero(2, 9);
  const coefX2 = a * a;
  const constant = -(b * b);
  const askX2 = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Développer",
    prompt: `On développe \\(\\left(${a}x ${sgn(b)} ${abs(b)}\\right)\\left(${a}x ${sgn(-b)} ${abs(-b)}\\right)\\). Quel est ${askX2 ? "le coefficient de \\(x^2\\)" : "le terme constant"} de cette expression développée ?`,
    answer: askX2 ? coefX2 : constant,
    steps: [
      { type: "regle", text: `\\left(${a}x ${sgn(b)} ${abs(b)}\\right)\\left(${a}x ${sgn(-b)} ${abs(-b)}\\right) = \\left(${a}x\\right)^{2} - \\left(${b}\\right)^{2}` },
      { type: "calcul", text: `\\left(${a}x\\right)^2 = ${coefX2}x^2` },
      { type: "resultat", text: `\\left(${b}\\right)^2 = ${b * b}, \\text{ donc le terme constant vaut } ${constant}` },
    ],
  };
}

// ---------- 8. Factoriser une différence de deux carrés a²x² - b² ----------
function genFactoriserDifferenceCarresNumeric() {
  const a = nonZero(2, 9);
  const b = nonZero(2, 9);
  const a2 = a * a;
  const b2 = b * b;
  const askA = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Factoriser",
    prompt: `On factorise \\(${a2}x^{2} - ${b2} = \\left(${askA ? "?" : a}x ${askA ? `+ ${b}` : "+ ?"}\\right)\\left(${a}x - ${b}\\right)\\). Quel est ${askA ? "le coefficient de x" : "le terme constant"} du premier facteur ?`,
    answer: askA ? a : b,
    steps: [
      { type: "calcul", text: `${a2}x^{2} - ${b2} = \\left(${a}x\\right)^{2} - \\left(${b}\\right)^{2}` },
      { type: "resultat", text: `\\left(${a}x\\right)^{2} - \\left(${b}\\right)^{2} = \\left(${a}x - ${b}\\right)\\left(${a}x + ${b}\\right)` },
    ],
  };
}

// ---------- 9. Développer une identité remarquable (ax+b)² ----------
function genIdentiteRemarquableCarreNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const coefX2 = a * a;
  const coefX = 2 * a * b;
  const constant = b * b;
  const askCoefX = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Développer",
    prompt: `On développe \\(\\left(${a}x ${sgn(b)} ${abs(b)}\\right)^{2} = ${coefX2}x^{2} ${askCoefX ? "+ \\ldots x" : `${sgn(coefX)} ${abs(coefX)}x`} ${askCoefX ? `${sgn(constant)} ${abs(constant)}` : "+ \\ldots"}\\). Quel est ${askCoefX ? "le coefficient de x" : "le terme constant"} ?`,
    answer: askCoefX ? coefX : constant,
    steps: [
      { type: "regle", text: `\\left(${a}x ${sgn(b)} ${abs(b)}\\right)^{2} = \\left(${a}x\\right)^{2} + 2 \\times ${a}x \\times \\left(${b}\\right) + \\left(${b}\\right)^{2}` },
      { type: "calcul", text: `\\left(${a}x\\right)^{2} = ${coefX2}x^2` },
      { type: "calcul", text: `2 \\times ${a} \\times ${b} = ${coefX}` },
      { type: "resultat", text: `\\left(${b}\\right)^{2} = ${constant}` },
    ],
  };
}

// ---------- 10. Factoriser avec un facteur commun binomial (px+a)(x-b)+(qx+c)(x-b) ----------
function genFactoriserFacteurCommunBinomeGeneraleNumeric() {
  const p = nonZero(-6, 6);
  const q = nonZero(-6, 6);
  const a = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const coefX = p + q;
  const constant = a + c;
  const askCoefX = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Factoriser",
    prompt: `On factorise \\(\\left(${p}x ${sgn(a)} ${abs(a)}\\right)\\left(x ${sgn(-b)} ${abs(-b)}\\right) + \\left(${q}x ${sgn(c)} ${abs(c)}\\right)\\left(x ${sgn(-b)} ${abs(-b)}\\right) = \\left(x ${sgn(-b)} ${abs(-b)}\\right)\\left(?\\right)\\). Quel est ${askCoefX ? "le coefficient de x" : "le terme constant"} du facteur entre la dernière parenthèse ?`,
    answer: askCoefX ? coefX : constant,
    steps: [
      { type: "regle", text: `\\left(x ${sgn(-b)} ${abs(-b)}\\right) \\text{ est un facteur commun aux deux termes.}` },
      { type: "resultat", text: `On additionne les autres facteurs : \\left(${p}x ${sgn(a)} ${abs(a)}\\right) + \\left(${q}x ${sgn(c)} ${abs(c)}\\right) = ${coefX}x ${sgn(constant)} ${abs(constant)}` },
    ],
  };
}

// =========================== Programmes de calcul ===========================

// ---------- 11. Résoudre l'équation pour retrouver le nombre de départ ----------
function genProgrammeResoudreEquationNumeric() {
  const x0 = nonZero(-9, 9);
  const m = randInt(2, 9);
  const p = randInt(1, 9);
  const k = nonZero(-6, 6);
  const inner = m * x0 - p;
  const target = k * inner;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Programmes de calcul",
    prompt: `Un programme de calcul : choisir un nombre x, le multiplier par ${m}, lui soustraire ${p}, puis multiplier le résultat obtenu par ${k}. Quel nombre de départ x permet d'obtenir ${target} ?`,
    answer: x0,
    steps: [
      { type: "donnee", text: `${k}\\left(${m}x - ${p}\\right) = ${target}` },
      { type: "calcul", text: `${m}x - ${p} = \\dfrac{${target}}{${k}} = ${inner}` },
      { type: "calcul", text: `${m}x = ${inner} + ${p} = ${inner + p}` },
      { type: "resultat", text: `x = \\dfrac{${inner + p}}{${m}} = ${x0}` },
    ],
  };
}

// ---------- 12. Démontrer qu'un résultat est toujours un multiple d'un entier ----------
function genProgrammeMultipleDeKNumeric() {
  const K = randInt(2, 6);
  let r, s;
  do {
    r = randInt(2, 6);
    s = randInt(2, 6);
  } while (gcd(r, s) !== 1);
  const A = K * r;
  const B = K * s;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Programmes de calcul",
    prompt: `Un programme de calcul : choisir un nombre n, le multiplier par ${A}, puis lui soustraire ${B}. Quel que soit l'entier n choisi, le résultat est toujours un multiple d'un même entier. Quel est le plus grand entier possible dont ${A}n - ${B} est toujours un multiple ?`,
    answer: K,
    steps: [
      { type: "calcul", text: `${A}n - ${B} = ${K}\\left(${r}n - ${s}\\right)` },
      { type: "resultat", text: `Comme ${r} et ${s} n'ont pas d'autre diviseur commun que 1, ${K} est le plus grand facteur commun possible : le résultat est toujours un multiple de ${K}.` },
    ],
  };
}

// ---------- 13. Aire d'un rectangle de dimensions (x-a) et (x+a) ----------
function genAireRectangleDifferenceCarresNumeric() {
  const a = randInt(2, 9);
  const x = randInt(a + 1, a + 15);
  const aire = x * x - a * a;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Problèmes",
    prompt: `Un rectangle a pour dimensions \\(\\left(x - ${a}\\right)\\) cm et \\(\\left(x + ${a}\\right)\\) cm. Exprime son aire en fonction de x, puis calcule sa valeur pour \\(x = ${x}\\) cm.`,
    answer: aire,
    steps: [
      { type: "calcul", text: `\\text{Aire} = \\left(x - ${a}\\right)\\left(x + ${a}\\right) = x^{2} - ${a * a}` },
      { type: "resultat", text: `${x}^{2} - ${a * a} = ${aire}` },
    ],
  };
}

// ---------- 14. Programme dont le résultat vaut toujours le carré du nombre choisi ----------
function genProgrammeCarreToujoursNumeric() {
  const a = nonZero(2, 9);
  const n = nonZero(-9, 9);
  const answer = n * n;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Programmes de calcul",
    prompt: `Un programme de calcul : choisir un nombre n, calculer \\(\\left(n + ${a}\\right)\\left(n - ${a}\\right)\\), puis ajouter ${a * a}. Ce programme donne toujours le carré du nombre de départ, quelle que soit la valeur de ${a}. Quel résultat obtient-on pour \\(n = ${n}\\) ?`,
    answer,
    steps: [
      { type: "regle", text: `\\left(n + ${a}\\right)\\left(n - ${a}\\right) + ${a * a} = n^{2} - ${a * a} + ${a * a} = n^{2}` },
      { type: "resultat", text: `Pour n = ${n} : n^{2} = ${answer}` },
    ],
  };
}

// ---------- 15. Reconnaître le bon développement de (ax+b)(cx+d) parmi des erreurs classiques ----------
function genQCMReconnaitreDeveloppementQCM() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  const d = nonZero(-9, 9);
  const coefX2 = a * c;
  const coefXOk = a * d + b * c;
  const constOk = b * d;
  const fmt = (x2, x, k) => `${x2}x^{2} ${sgn(x)} ${abs(x)}x ${sgn(k)} ${abs(k)}`;
  const correct = fmt(coefX2, coefXOk, constOk);
  const wrong1 = fmt(coefX2, a * d - b * c, constOk); // erreur : signe du terme croisé
  const wrong2 = fmt(coefX2, coefXOk, -constOk); // erreur : signe du terme constant
  const wrong3 = fmt(coefX2, 0, constOk); // erreur : terme en x oublié (double distributivité incomplète)
  const optsSet = new Set([correct, wrong1, wrong2, wrong3]);
  let bump = 1;
  while (optsSet.size < 3) {
    optsSet.add(fmt(coefX2, coefXOk + bump, constOk));
    bump++;
  }
  const options = shuffle([...optsSet]);
  return {
    type: "qcm",
    chapter: "Calcul littéral — Développer",
    prompt: `Quel est le développement correct de \\(\\left(${a}x ${sgn(b)} ${abs(b)}\\right)\\left(${c}x ${sgn(d)} ${abs(d)}\\right)\\) ?`,
    answer: correct,
    options,
    steps: [
      { type: "calcul", text: `${a}x \\times ${c}x = ${coefX2}x^2` },
      { type: "calcul", text: `${a}x \\times \\left(${d}\\right) + \\left(${b}\\right) \\times ${c}x = ${sgn(coefXOk)} ${abs(coefXOk)}x` },
      { type: "resultat", text: `\\left(${b}\\right) \\times \\left(${d}\\right) = ${constOk}` },
    ],
  };
}

// ---------- 16. Périmètre d'un carré toujours égal à celui d'un rectangle ----------
function genPerimetreCarreEgalRectangleNumeric() {
  const a = randInt(3, 9);
  let t;
  do {
    t = nonZero(1, 6);
  } while (t === a);
  const largeurConst = a - t;
  const x = randInt(1, 15);
  const perimetre = 4 * x + 4 * a;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Problèmes",
    prompt: `Un carré a pour côté \\(\\left(x + ${a}\\right)\\) cm. Un rectangle a pour longueur \\(\\left(x + ${a + t}\\right)\\) cm et pour largeur \\(\\left(x ${sgn(largeurConst)} ${abs(largeurConst)}\\right)\\) cm. On admet que ces deux figures ont toujours le même périmètre, quelle que soit la valeur de x. Calcule ce périmètre commun pour \\(x = ${x}\\) cm.`,
    answer: perimetre,
    steps: [
      { type: "calcul", text: `\\text{Périmètre du carré} = 4\\left(x + ${a}\\right) = 4x + ${4 * a}` },
      { type: "regle", text: `\\text{Périmètre du rectangle} = 2\\left(x + ${a + t}\\right) + 2\\left(x ${sgn(largeurConst)} ${abs(largeurConst)}\\right) = 4x + ${4 * a}` },
      { type: "resultat", text: `\\text{Pour } x = ${x} : 4 \\times ${x} + ${4 * a} = ${perimetre}` },
    ],
  };
}

const GENERATORS = [
  genDevelopperSimpleDistributiviteGeneraleNumeric,
  genDevelopperSigneDevantParentheseNumeric,
  genDevelopperDoubleDistributiviteGeneraleNumeric,
  genCorrigerErreurEleveQCM,
  genFactoriserFacteurCommunXNumeric,
  genFactoriserPlusGrandFacteurCommunQCM,
  genDevelopperDifferenceCarresNumeric,
  genFactoriserDifferenceCarresNumeric,
  genIdentiteRemarquableCarreNumeric,
  genFactoriserFacteurCommunBinomeGeneraleNumeric,
  genProgrammeResoudreEquationNumeric,
  genProgrammeMultipleDeKNumeric,
  genAireRectangleDifferenceCarresNumeric,
  genProgrammeCarreToujoursNumeric,
  genQCMReconnaitreDeveloppementQCM,
  genPerimetreCarreEgalRectangleNumeric,
];

const DIFFICULTY = {
  genDevelopperSimpleDistributiviteGeneraleNumeric: "facile",
  genDevelopperSigneDevantParentheseNumeric: "facile",
  genFactoriserFacteurCommunXNumeric: "facile",
  genDevelopperDoubleDistributiviteGeneraleNumeric: "standard",
  genFactoriserPlusGrandFacteurCommunQCM: "standard",
  genDevelopperDifferenceCarresNumeric: "standard",
  genFactoriserDifferenceCarresNumeric: "standard",
  genIdentiteRemarquableCarreNumeric: "standard",
  genAireRectangleDifferenceCarresNumeric: "standard",
  genQCMReconnaitreDeveloppementQCM: "standard",
  genCorrigerErreurEleveQCM: "expert",
  genFactoriserFacteurCommunBinomeGeneraleNumeric: "expert",
  genProgrammeResoudreEquationNumeric: "expert",
  genProgrammeMultipleDeKNumeric: "expert",
  genProgrammeCarreToujoursNumeric: "expert",
  genPerimetreCarreEgalRectangleNumeric: "expert",
};

function generate(difficulty) {
  if (difficulty) {
    const pool = GENERATORS.filter((fn) => (DIFFICULTY[fn.name] ?? "standard") === difficulty);
    if (pool.length) return pick(pool)();
  }
  return pick(GENERATORS)();
}

export const SEO_EXAMPLE_GENERATORS = [
  genDevelopperSimpleDistributiviteGeneraleNumeric,
  genDevelopperDoubleDistributiviteGeneraleNumeric,
  genCorrigerErreurEleveQCM,
  genFactoriserFacteurCommunXNumeric,
  genFactoriserDifferenceCarresNumeric,
];

export default {
  meta: {
    id: "calcul-litteral-troisieme",
    title: "Calcul littéral",
    description: "Développer (simple/double distributivité, identités remarquables), factoriser (facteur commun, différence de deux carrés), programmes de calcul et problèmes de périmètre/aire.",
    pourquoi: "Développer et factoriser, c'est disposer de deux façons de voir la même expression — un réflexe indispensable pour résoudre des équations et des problèmes concrets.",
    level: "troisieme",
    free: false,
    order: 4,
    cours: {
      mindMap: {
        title: "Calcul littéral",
        branches: [
          {
            title: "Développer",
            items: [
              "Distributivité simple : \\(k(ax+b) = kax+kb\\), chaque terme entre parenthèses est multiplié par k.",
              "Double distributivité : chaque terme du premier facteur multiplie chaque terme du second.",
              "Un « - » devant une parenthèse change le signe de tous les termes qu'elle contient.",
              "Piège classique : quand on soustrait une parenthèse à deux termes, il faut changer le signe des DEUX termes, pas d'un seul.",
            ],
            formula: "\\((ax+b)(cx+d) = acx^2 + (ad+bc)x + bd\\)",
          },
          {
            title: "Identités remarquables",
            items: [
              "Le carré d'une somme se développe en trois termes : carré, double produit, carré.",
              "Une différence de deux carrés se factorise toujours en un produit somme × différence.",
              "Piège classique : \\((a+b)^2 \\neq a^2+b^2\\) — ne pas oublier le double produit.",
            ],
            formula: "\\((a+b)^2 = a^2+2ab+b^2\\ ;\\ a^2-b^2 = (a+b)(a-b)\\)",
          },
          {
            title: "Factoriser",
            items: [
              "Factoriser, c'est l'opération inverse de développer : on fait apparaître un facteur commun (numérique, en x, ou binomial).",
              "Piège classique : on vise toujours le PLUS GRAND facteur commun possible — une factorisation avec un facteur commun trop petit reste incomplète.",
            ],
            formula: "\\(ax+bx = x(a+b)\\)",
          },
          {
            title: "Programmes de calcul",
            items: [
              "Pour retrouver un nombre de départ, on traduit le programme en équation et on la résout.",
              "Pour démontrer qu'un résultat est toujours un multiple d'un entier, on factorise l'expression littérale correspondante.",
              "Pour démontrer qu'un résultat est toujours égal à une expression donnée (ex. toujours le carré du nombre choisi), on développe puis on simplifie jusqu'à cette expression.",
            ],
          },
          {
            title: "Problèmes de périmètre et d'aire",
            items: [
              "On exprime la grandeur (périmètre, aire) en fonction de x à l'aide du calcul littéral, puis on remplace x par la valeur donnée pour calculer.",
              "Piège classique : le périmètre d'un carré est \\(4 \\times \\text{côté}\\), celui d'un rectangle est \\(2 \\times (\\text{longueur}+\\text{largeur})\\) — ne pas confondre les deux formules.",
            ],
            formula: "\\(\\text{Périmètre rectangle} = 2(L+\\ell)\\ ;\\ \\text{Aire rectangle} = L \\times \\ell\\)",
          },
        ],
      },
    },
  },
  generate,
};

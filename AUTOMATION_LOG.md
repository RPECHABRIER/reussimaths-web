# Automation log — Reussimaths content pipeline

## 2026-07-28, run starting ~20:19 (session ee0dc5a3…)

**Folder-naming anomaly found at start of run.** The connected folder
contained several mis-synced copies from older runs: `reussimaths-web 16`,
`reussimaths-web 17`, `reussimaths-web-update26`, `reussimaths-web-update27`
(none named exactly `reussimaths-web`), plus a `reussimaths-web-update40.zip`.
I initially adopted `reussimaths-web 17` (most complete of the mis-named
copies, 46 chapters) as ground truth and started rebuilding niveau 3e
scaffolding + chapter 1 (nombres-entiers) on top of it.

**Concurrent run discovered mid-session.** Partway through, a bash listing of
the connected folder revealed a correctly-named `reussimaths-web` folder
*already existed*, with a very recent mtime (~20:12–20:17) and containing
`nombres-entiers-troisieme.js`, `reviser-les-bases-troisieme.js`,
`automatismes-troisieme.js`, and a `troisieme` entry in `plannedChapters.js`
— i.e. another run (very likely a genuinely concurrent/overlapping scheduled
invocation) had independently done almost exactly the same unit of work at
the same time, correctly named this time. Diffing confirmed these were
different files (different comments, `dossier-brevet-troisieme` vs
`preparation-brevet-troisieme` id) — not a coincidence of me re-reading my
own writes.

**Decision:** rather than overwrite that newer, correctly-named, verified
work with my redundant duplicate, I discarded my duplicate chapter-1 attempt,
adopted the concurrent run's `reussimaths-web` as ground truth (verified with
a 20k-iteration sanity check on its 3 troisieme files — 0 errors), and moved
on to the *next* unit of work instead of redoing the same one.

**This run's actual net-new contribution:**
- `src/chapters/calcul-numerique-troisieme.js` — chapter 2 of the 3e manuel
  (fractions: +/-/×/÷ and priorités, problème "fraction du reste", puissances:
  calcul, puissance négative, priorités, règles produit/quotient/puissance de
  puissance/produit même exposant, encadrement de racine carrée, carré
  parfait, écriture scientifique — 16 generators). Tested at 40,000 iterations
  standalone, 0 errors.
- Added the matching "Calcul numérique" theme (5 generators) to
  `automatismes-troisieme.js`. Verified exactly one `const THEMES = [`
  declaration after the edit, `node --check` passes, and the full
  automatismes file re-tested at 40,000 iterations across all themes
  (`nombres-entiers-troisieme`, `calcul-numerique-troisieme`, `mix`,
  undefined) — 0 errors.
- Full `npx vite build` succeeds with both new chapters present in the bundle
  (grepped `calcul-numerique-troisieme` in the built JS to confirm).
- Synced back into the connected folder's canonical `reussimaths-web`.

**3e progress so far (across this run + the concurrent one):** chapter 1
(nombres-entiers) and chapter 2 (calcul-numerique) done and tested, plus
level scaffolding (`levels.js` already had all 4 target levels pre-existing;
`plannedChapters.js` troisieme entries for all 15 chapters; free
"Réviser les bases" chapter; Automatismes shell). **12 more 3e chapters
still to go** (calcul-littéral, équations, notion de fonction, fonctions
affines, proportionnalité, statistiques, probabilités, Thalès/triangles
semblables, trigonométrie, transformations, géométrie dans l'espace, mesures
et grandeurs, dossier Brevet) before 3e is complete — then 2nde, Première non
spé, Terminale Spé remain untouched. This is nowhere near zip-ready; per
standing instructions, no zip was produced this run.

**Known cosmetic issue, not fixed (no delete permission / this sandbox
appears to disallow rm even in the ephemeral scratch dir — got "Operation
not permitted" trying to clean up a leftover `dist-verify-check` build dir
there too):** the connected folder's `reussimaths-web/` contains a
self-nested `reussimaths-web/reussimaths-web/` subdirectory — a stray full
duplicate of the project, most likely created by an earlier run's `cp`/
`rsync` without a trailing slash. It does **not** affect the app (chapter
auto-discovery in `registry.js` uses a non-recursive `import.meta.glob`, so
the nested copy is invisible to the build), but it is dead weight that will
need a human (or a run with delete permission) to remove before the final
zip step, so it doesn't get bundled into
`reussimaths-web-updateN.zip`. Also still present: the old mis-named
`reussimaths-web 16`, `reussimaths-web 17`, `reussimaths-web-update26`,
`reussimaths-web-update27` folders and the stale `reussimaths-web-update40.zip`
at the top level of "Application TOP" — historical debris from before the
folder-naming bug was noticed, safe to delete once confirmed unneeded, but
left alone here since deletion wasn't attempted.

**Note for future runs:** if two runs ever overlap again, prefer re-checking
the connected folder's actual `reussimaths-web` (not just trusting your own
in-progress ephemeral copy) before syncing back, to avoid a lost-update race.

## 2026-07-28, continuation run part 2 (same session, still going per Romain's request)

**Net-new:**
- `proportionnalite-troisieme.js` (3e chapitre 7, order 8) — 14 generators:
  simplifier un ratio, reconnaître un ratio équivalent, exprimer un ratio en
  pourcentage, partager selon un ratio, recette à l'échelle (produit en
  croix), deux nombres dans un ratio donné avec une différence connue,
  coefficient multiplicateur d'une évolution (les deux sens : % → CM et
  CM → %), taux d'évolution depuis deux prix, prix final après évolution,
  prix initial depuis le prix final, enchaînement de deux évolutions
  successives, coefficient réciproque pour revenir au prix de départ (via 5
  curated clean pairs so the answer is always an exact integer percentage),
  comparer deux offres de réduction (réduction unique vs deux réductions
  successives). Tested at 40,000 iterations, 0 errors, plus manual
  spot-check of 32 samples confirming correct arithmetic (including the
  percent/coefficient-multiplicateur round-tripping and the decimal
  formatting via fr()).
- Added the matching "Situations de proportionnalité" theme (5 generators)
  to `automatismes-troisieme.js`. Verified exactly one `const THEMES = [`
  declaration (line 701), `node --check` passed, full automatismes file
  re-tested at 40,000 iterations across all 8 theme selectors (7 named
  themes + mix + default) — 0 errors throughout.
- Synced back into the connected folder's canonical `reussimaths-web`.

**3e progress now:** chapters 1–7 done and tested (nombres entiers, calcul
numérique, calcul littéral, équations, notion de fonction, fonctions
affines, situations de proportionnalité). **8 more 3e chapters still to go**
(statistiques, probabilités, Thalès et triangles semblables, trigonométrie
dans le triangle rectangle, transformations dans le plan, géométrie dans
l'espace, mesures et grandeurs, dossier Brevet) before 3e is complete — then
2nde, Première non spé, Terminale Spé remain untouched. Not zip-ready; no
zip produced.

Same known pre-existing issue as before (nested reussimaths-web/reussimaths-web
duplicate, sandbox rm permission denied) — unchanged, doesn't affect the
build, still needs manual cleanup before the eventual final zip.

// ---------------------------------------------------------------------------
// Rendu SVG déclaratif d'un REPÈRE CARTÉSIEN (axes, grille, courbes de
// fonctions, droites, points avec projection, intervalle surligné) — le
// pendant de <Figure /> (géométrie pure) mais pour tout ce qui se lit "sur
// un graphique" : image/antécédent d'une fonction, comparaison de droites,
// ensemble solution d'une inéquation lu sur une courbe, etc.
//
// Utilisé exactement comme <Figure /> : un générateur d'exercice calcule un
// objet `graph` à partir des mêmes nombres aléatoires que l'énoncé, et
// ChapterRunner.jsx / AutomatismesRunner.jsx / MiniDuel.jsx l'affichent via
// <Graph spec={exercise.graph} />.
//
// const spec = {
//   xMin, xMax, yMin, yMax,        // bornes du repère (obligatoires)
//   xStep?, yStep?,                // pas de la grille/graduation (défaut 1)
//   curves?: [{ fn, color?, label?, dashed?, domain?: [a, b] }],
//   lines?:  [{ a, b, color?, label?, dashed? }],   // droite y = a*x + b
//   points?: [{ x, y, label?, color?, project?: bool }],
//   shade?:  [{ from, to, color? }],                // bande verticale (sur x)
//   hideGrid?: bool,
// };
//
// `fn` est une vraie fonction JS (le générateur la connaît déjà pour
// calculer les valeurs de l'énoncé) : elle est échantillonnée point par
// point, pas besoin de la sérialiser ni de la parser depuis une chaîne.
// ---------------------------------------------------------------------------

const ink = "#1B2A4A";
const slate = "#6E7787";
const grid = "rgba(27,42,74,0.10)";
const gold = "#D9A441";
const green = "#3FA66B";
const red = "#D9534F";

const W = 340;
const H = 280;
const PAD_LEFT = 34;
const PAD_RIGHT = 14;
const PAD_TOP = 14;
const PAD_BOTTOM = 26;
const PLOT_W = W - PAD_LEFT - PAD_RIGHT;
const PLOT_H = H - PAD_TOP - PAD_BOTTOM;

function niceNum(n) {
  // Affiche 1 au lieu de 1.0, mais garde une décimale si besoin (0,5 etc.)
  const r = Math.round(n * 100) / 100;
  return String(r).replace(".", ",");
}

// Découpe le segment de droite y = a*x + b (sur x ∈ [xMin, xMax]) à la
// fenêtre [xMin, xMax] x [yMin, yMax] pour ne tracer que la partie visible.
function clipAffineLine(a, b, xMin, xMax, yMin, yMax) {
  const candidates = [];
  const yAtXMin = a * xMin + b;
  const yAtXMax = a * xMax + b;
  candidates.push({ x: xMin, y: yAtXMin });
  candidates.push({ x: xMax, y: yAtXMax });
  if (a !== 0) {
    const xAtYMin = (yMin - b) / a;
    const xAtYMax = (yMax - b) / a;
    if (xAtYMin >= xMin && xAtYMin <= xMax) candidates.push({ x: xAtYMin, y: yMin });
    if (xAtYMax >= xMin && xAtYMax <= xMax) candidates.push({ x: xAtYMax, y: yMax });
  }
  // Ne garde que les points effectivement dans le rectangle (avec une petite marge).
  const inside = candidates.filter((p) => p.y >= yMin - 1e-6 && p.y <= yMax + 1e-6 && p.x >= xMin - 1e-6 && p.x <= xMax + 1e-6);
  if (inside.length < 2) return null;
  // Prend les deux points les plus éloignés (segment visible maximal).
  let best = [inside[0], inside[1]];
  let bestDist = -1;
  for (let i = 0; i < inside.length; i++) {
    for (let j = i + 1; j < inside.length; j++) {
      const d = Math.hypot(inside[i].x - inside[j].x, inside[i].y - inside[j].y);
      if (d > bestDist) {
        bestDist = d;
        best = [inside[i], inside[j]];
      }
    }
  }
  return best;
}

export default function Graph({ spec }) {
  if (!spec || typeof spec.xMin !== "number" || typeof spec.xMax !== "number" || typeof spec.yMin !== "number" || typeof spec.yMax !== "number") {
    return null;
  }
  const { xMin, xMax, yMin, yMax } = spec;
  const xStep = spec.xStep ?? 1;
  const yStep = spec.yStep ?? 1;
  const clipId = `graph-clip-${Math.round(xMin * 7 + yMin * 13 + xMax * 3 + yMax)}-${Math.random().toString(36).slice(2, 7)}`;

  const toPx = (x, y) => ({
    px: PAD_LEFT + ((x - xMin) / (xMax - xMin)) * PLOT_W,
    py: PAD_TOP + ((yMax - y) / (yMax - yMin)) * PLOT_H,
  });

  const xTicks = [];
  for (let v = Math.ceil(xMin / xStep) * xStep; v <= xMax + 1e-9; v += xStep) xTicks.push(Math.round(v * 1000) / 1000);
  const yTicks = [];
  for (let v = Math.ceil(yMin / yStep) * yStep; v <= yMax + 1e-9; v += yStep) yTicks.push(Math.round(v * 1000) / 1000);

  const originVisible = xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0;
  const xAxisY = toPx(0, Math.max(yMin, Math.min(0, yMax))).py;
  const yAxisX = toPx(Math.max(xMin, Math.min(0, xMax)), 0).px;

  return (
    <div className="w-full flex justify-center mb-4">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 340, maxHeight: 280 }}>
        <defs>
          <clipPath id={clipId}>
            <rect x={PAD_LEFT} y={PAD_TOP} width={PLOT_W} height={PLOT_H} />
          </clipPath>
          <marker id={`${clipId}-axis-arrow`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L7,3.5 L0,7 Z" fill={slate} />
          </marker>
        </defs>

        {/* Cadre du repère */}
        <rect x={PAD_LEFT} y={PAD_TOP} width={PLOT_W} height={PLOT_H} fill="none" stroke={grid} strokeWidth="1" />

        {/* Bandes surlignées (ensemble solution, intervalle...) */}
        {(spec.shade || []).map((s, i) => {
          const p1 = toPx(Math.max(s.from, xMin), yMax);
          const p2 = toPx(Math.min(s.to, xMax), yMin);
          return (
            <rect
              key={`shade${i}`}
              x={Math.min(p1.px, p2.px)}
              y={PAD_TOP}
              width={Math.abs(p2.px - p1.px)}
              height={PLOT_H}
              fill={s.color ?? gold}
              opacity="0.16"
            />
          );
        })}

        {/* Grille */}
        {!spec.hideGrid &&
          xTicks.map((v, i) => {
            const { px } = toPx(v, 0);
            return <line key={`gx${i}`} x1={px} y1={PAD_TOP} x2={px} y2={PAD_TOP + PLOT_H} stroke={grid} strokeWidth="1" />;
          })}
        {!spec.hideGrid &&
          yTicks.map((v, i) => {
            const { py } = toPx(0, v);
            return <line key={`gy${i}`} x1={PAD_LEFT} y1={py} x2={PAD_LEFT + PLOT_W} y2={py} stroke={grid} strokeWidth="1" />;
          })}

        {/* Axes (si l'origine est visible) */}
        {originVisible && (
          <>
            <line x1={PAD_LEFT} y1={xAxisY} x2={PAD_LEFT + PLOT_W} y2={xAxisY} stroke={slate} strokeWidth="1.5" markerEnd={`url(#${clipId}-axis-arrow)`} />
            <line x1={yAxisX} y1={PAD_TOP + PLOT_H} x2={yAxisX} y2={PAD_TOP} stroke={slate} strokeWidth="1.5" markerEnd={`url(#${clipId}-axis-arrow)`} />
            {xTicks.map((v, i) => {
              const { px } = toPx(v, 0);
              return <line key={`xt${i}`} x1={px} y1={xAxisY - 4} x2={px} y2={xAxisY + 4} stroke={slate} strokeWidth="1" />;
            })}
            {yTicks.map((v, i) => {
              const { py } = toPx(0, v);
              return <line key={`yt${i}`} x1={yAxisX - 4} y1={py} x2={yAxisX + 4} y2={py} stroke={slate} strokeWidth="1" />;
            })}
            <text x={PAD_LEFT + PLOT_W - 2} y={xAxisY - 5} fontSize="10" fill={slate} textAnchor="end">
              x
            </text>
            <text x={yAxisX + 6} y={PAD_TOP + 9} fontSize="10" fill={slate}>
              y
            </text>
          </>
        )}

        {/* Graduations (nombres) */}
        {xTicks
          .filter((v) => v !== 0)
          .map((v, i) => {
            const { px } = toPx(v, 0);
            return (
              <text key={`xl${i}`} x={px} y={PAD_TOP + PLOT_H + 12} fontSize="9" fill={slate} textAnchor="middle">
                {niceNum(v)}
              </text>
            );
          })}
        {yTicks
          .filter((v) => v !== 0)
          .map((v, i) => {
            const { py } = toPx(0, v);
            return (
              <text key={`yl${i}`} x={PAD_LEFT - 6} y={py + 3} fontSize="9" fill={slate} textAnchor="end">
                {niceNum(v)}
              </text>
            );
          })}
        {originVisible && (
          <text x={yAxisX - 6} y={xAxisY + 11} fontSize="9" fill={slate} textAnchor="end">
            0
          </text>
        )}

        {/* Contenu du graphique, découpé au cadre du repère */}
        <g clipPath={`url(#${clipId})`}>
          {(spec.lines || []).map((l, i) => {
            const seg = clipAffineLine(l.a, l.b, xMin, xMax, yMin, yMax);
            if (!seg) return null;
            const p1 = toPx(seg[0].x, seg[0].y);
            const p2 = toPx(seg[1].x, seg[1].y);
            const color = l.color ?? [ink, gold, green, red][i % 4];
            return (
              <g key={`line${i}`}>
                <line
                  x1={p1.px}
                  y1={p1.py}
                  x2={p2.px}
                  y2={p2.py}
                  stroke={color}
                  strokeWidth="1.6"
                  strokeDasharray={l.dashed ? "5 4" : undefined}
                />
                {l.label && (
                  <text x={p2.px - 4} y={p2.py - 5} fontSize="10" fontWeight="600" fill={color} textAnchor="end">
                    {l.label}
                  </text>
                )}
              </g>
            );
          })}

          {(spec.curves || []).map((c, i) => {
            const domain = c.domain ?? [xMin, xMax];
            const steps = 120;
            const pts = [];
            for (let s = 0; s <= steps; s++) {
              const x = domain[0] + ((domain[1] - domain[0]) * s) / steps;
              const y = c.fn(x);
              if (Number.isFinite(y)) pts.push(toPx(x, y));
            }
            if (pts.length < 2) return null;
            const d = pts.map((p, i2) => `${i2 === 0 ? "M" : "L"} ${p.px},${p.py}`).join(" ");
            const color = c.color ?? ink;
            const last = pts[pts.length - 1];
            return (
              <g key={`curve${i}`}>
                <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeDasharray={c.dashed ? "5 4" : undefined} />
                {c.label && (
                  <text x={last.px - 4} y={last.py - 6} fontSize="10" fontWeight="600" fill={color} textAnchor="end">
                    {c.label}
                  </text>
                )}
              </g>
            );
          })}

          {(spec.points || []).map((p, i) => {
            const { px, py } = toPx(p.x, p.y);
            const color = p.color ?? ink;
            return (
              <g key={`pt${i}`}>
                {p.project && (
                  <>
                    <line x1={px} y1={py} x2={px} y2={PAD_TOP + PLOT_H} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
                    <line x1={px} y1={py} x2={PAD_LEFT} y2={py} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
                  </>
                )}
                <circle cx={px} cy={py} r="2.6" fill={color} />
                {p.label && (
                  <text x={px + 6} y={py - 6} fontSize="10" fontWeight="600" fill={color}>
                    {p.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

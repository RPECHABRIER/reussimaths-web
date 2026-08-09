// ---------------------------------------------------------------------------
// Rendu SVG déclaratif de figures géométriques simples (points, segments,
// droites, cercles, angles droits) — utilisé par les chapitres de géométrie
// pour afficher un dessin dans l'exercice (voir ChapterRunner.jsx /
// MiniDuel.jsx : <Figure spec={exercise.figure} />).
//
// Un générateur d'exercice fournit un `figure` calculé à partir des mêmes
// nombres aléatoires que l'énoncé, ex :
//
// const spec = {
//   points: [
//     { id: "A", x: 20, y: 20 },
//     { id: "B", x: 140, y: 20 },
//     { id: "C", x: 140, y: 100 },
//   ],
//   segments: [{ from: "A", to: "B" }, { from: "B", to: "C", ticks: 1 }],
//   rightAngles: [{ at: "B", from: "A", to: "C" }],
// };
//
// Champs supportés (tous optionnels sauf `points`) :
//   points       : [{ id, x, y, label?, dx?, dy?, hideDot?, hideLabel? }]
//   segments     : [{ from, to, ticks?: 0-3, dashed?: bool }]
//   lines        : [{ from, to, label?, extend?, arrowStart?, arrowEnd? }]
//                  — droite infinie (tracée au-delà des deux points), avec
//                  étiquette optionnelle ; arrowStart/arrowEnd (bool) ajoute
//                  une pointe de flèche à l'extrémité correspondante (ex :
//                  droite graduée orientée)
//   circles      : [{ center, radius? , through? }]  — radius calculé depuis
//                  `through` (point par lequel passe le cercle) si absent
//   rightAngles  : [{ at, from, to, size? }]         — petit carré d'angle droit
//   freeLabels   : [{ x, y, text, anchor? }]         — texte libre (ex : nom
//                  d'une droite, indication)
//   numberLine   : { from, to, tickCount, arrowStart?, arrowEnd?, tickSize? }
//                  — droite graduée : graduations et sens toujours visibles
//   hidePointLabels : bool — n'affiche pas les points/étiquettes de `points`
// ---------------------------------------------------------------------------

const ink = "#1B2A4A";
const slate = "#5C6B7A";

function dist(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function normalize(x, y) {
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
}

export default function Figure({ spec }) {
  if (!spec || !spec.points || spec.points.length === 0) return null;

  const byId = Object.fromEntries(spec.points.map((p) => [p.id, p]));
  const xs = spec.points.map((p) => p.x);
  const ys = spec.points.map((p) => p.y);
  const pad = 26;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const w = Math.max(...xs) - minX + pad;
  const h = Math.max(...ys) - minY + pad;

  return (
    <div className="w-full flex justify-center mb-4">
      <svg viewBox={`${minX} ${minY} ${w} ${h}`} style={{ width: "100%", maxWidth: 300, maxHeight: 220 }}>
        {spec.numberLine && (() => {
          const line = spec.numberLine;
          const a = byId[line.from];
          const b = byId[line.to];
          const count = Math.max(2, line.tickCount ?? 2);
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const length = Math.hypot(dx, dy) || 1;
          const ux = dx / length;
          const uy = dy / length;
          const nx = -uy;
          const ny = ux;
          const extension = line.extend ?? 7;
          const x1 = a.x - ux * extension;
          const y1 = a.y - uy * extension;
          const x2 = b.x + ux * extension;
          const y2 = b.y + uy * extension;
          const arrowSize = 8;
          const tickSize = line.tickSize ?? 7;
          const arrowPoints = (px, py, dirx, diry) => {
            const backx = px - dirx * arrowSize;
            const backy = py - diry * arrowSize;
            return `${px},${py} ${backx + nx * arrowSize * 0.55},${backy + ny * arrowSize * 0.55} ${backx - nx * arrowSize * 0.55},${backy - ny * arrowSize * 0.55}`;
          };
          return (
            <g aria-label="Droite graduée orientée">
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink} strokeWidth="1.8" />
              {Array.from({ length: count }).map((_, index) => {
                const ratio = index / (count - 1);
                const x = a.x + dx * ratio;
                const y = a.y + dy * ratio;
                return <line key={`nl-tick-${index}`} x1={x - nx * tickSize} y1={y - ny * tickSize} x2={x + nx * tickSize} y2={y + ny * tickSize} stroke={ink} strokeWidth="1.5" />;
              })}
              {line.arrowStart && <polygon points={arrowPoints(x1, y1, -ux, -uy)} fill={ink} />}
              {(line.arrowEnd ?? true) && <polygon points={arrowPoints(x2, y2, ux, uy)} fill={ink} />}
            </g>
          );
        })()}

        {(spec.circles || []).map((c, i) => {
          const center = byId[c.center];
          const r = c.radius ?? (c.through ? dist(center, byId[c.through]) : 30);
          return <circle key={`c${i}`} cx={center.x} cy={center.y} r={r} fill="none" stroke={slate} strokeWidth="1.4" />;
        })}

        {(spec.lines || []).map((l, i) => {
          const a = byId[l.from];
          const b = byId[l.to];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.hypot(dx, dy) || 1;
          const ext = l.extend ?? 34;
          const ux = dx / len;
          const uy = dy / len;
          const x1 = a.x - ux * ext;
          const y1 = a.y - uy * ext;
          const x2 = b.x + ux * ext;
          const y2 = b.y + uy * ext;
          const arrowSize = 7;
          const nx = -uy;
          const ny = ux;
          const arrowPoints = (px, py, dirx, diry) => {
            const backx = px - dirx * arrowSize;
            const backy = py - diry * arrowSize;
            return `${px},${py} ${backx + nx * arrowSize * 0.55},${backy + ny * arrowSize * 0.55} ${backx - nx * arrowSize * 0.55},${backy - ny * arrowSize * 0.55}`;
          };
          return (
            <g key={`l${i}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink} strokeWidth="1.4" />
              {l.arrowEnd && <polygon points={arrowPoints(x2, y2, ux, uy)} fill={ink} />}
              {l.arrowStart && <polygon points={arrowPoints(x1, y1, -ux, -uy)} fill={ink} />}
              {l.label && (
                <text x={x2 + ux * 12} y={y2 + uy * 12} fontSize="11" fill={ink} textAnchor="middle">
                  {l.label}
                </text>
              )}
            </g>
          );
        })}

        {(spec.segments || []).map((s, i) => {
          const a = byId[s.from];
          const b = byId[s.to];
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          const nx = -uy;
          const ny = ux;
          const ticks = s.ticks ?? 0;
          return (
            <g key={`s${i}`}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={ink}
                strokeWidth="1.4"
                strokeDasharray={s.dashed ? "4 3" : undefined}
              />
              {Array.from({ length: ticks }).map((_, t) => {
                const offset = (t - (ticks - 1) / 2) * 5;
                const px = mx + ux * offset;
                const py = my + uy * offset;
                return (
                  <line key={t} x1={px - nx * 5} y1={py - ny * 5} x2={px + nx * 5} y2={py + ny * 5} stroke={ink} strokeWidth="1.4" />
                );
              })}
            </g>
          );
        })}

        {(spec.rightAngles || []).map((r, i) => {
          const at = byId[r.at];
          const from = byId[r.from];
          const to = byId[r.to];
          const size = r.size ?? 9;
          const u1 = normalize(from.x - at.x, from.y - at.y);
          const u2 = normalize(to.x - at.x, to.y - at.y);
          const p1 = { x: at.x + u1.x * size, y: at.y + u1.y * size };
          const p2 = { x: at.x + u2.x * size, y: at.y + u2.y * size };
          const p3 = { x: p1.x + u2.x * size, y: p1.y + u2.y * size };
          return (
            <polyline
              key={`r${i}`}
              points={`${p1.x},${p1.y} ${p3.x},${p3.y} ${p2.x},${p2.y}`}
              fill="none"
              stroke={slate}
              strokeWidth="1.2"
            />
          );
        })}

        {!spec.hidePointLabels &&
          spec.points.map((p) => (
            <g key={p.id}>
              {!p.hideDot && <circle cx={p.x} cy={p.y} r={p.numberLinePoint ? "3.4" : "2.2"} fill={ink} />}
              {!p.hideLabel && (
                <text x={p.labelAbove ? p.x : p.x + (p.dx ?? 8)} y={p.labelAbove ? p.y - 16 : p.y + (p.dy ?? -8)} fontSize={p.labelAbove ? "13" : "12"} fontWeight="700" fill={ink} textAnchor={p.labelAbove ? "middle" : undefined}>
                  {p.label ?? p.id}
                </text>
              )}
            </g>
          ))}

        {(spec.freeLabels || []).map((l, i) => (
          <text key={`fl${i}`} x={l.x} y={l.y} fontSize="11" fill={slate} textAnchor={l.anchor ?? "middle"}>
            {l.text}
          </text>
        ))}
      </svg>
    </div>
  );
}

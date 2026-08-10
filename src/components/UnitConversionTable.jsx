import { colors } from "../theme";

const UNIT_CHAINS = {
  length: ["km", "hm", "dam", "m", "dm", "cm", "mm"],
  capacity: ["kL", "hL", "daL", "L", "dL", "cL", "mL"],
  area: ["km²", "hm²", "dam²", "m²", "dm²", "cm²", "mm²"],
  volume: ["km³", "hm³", "dam³", "m³", "dm³", "cm³", "mm³"],
};

const PLACE_LABELS = {
  1: ["unités"],
  2: ["dizaines", "unités"],
  3: ["centaines", "dizaines", "unités"],
};

function cleanUnit(unit, kind) {
  if (kind === "length" || kind === "capacity") return String(unit ?? "");
  const exponent = kind === "area" ? "²" : "³";
  return String(unit ?? "").replace(/\^?[23]/g, exponent);
}

function decimalCount(value) {
  const text = String(value);
  return text.includes(".") ? text.split(".")[1].length : text.includes(",") ? text.split(",")[1].length : 0;
}

export default function UnitConversionTable({ spec }) {
  if (!spec || !UNIT_CHAINS[spec.kind]) return null;
  const chain = UNIT_CHAINS[spec.kind];
  const places = spec.kind === "area" ? 2 : spec.kind === "volume" ? 3 : 1;
  const from = cleanUnit(spec.fromUnit, spec.kind);
  const to = cleanUnit(spec.toUnit, spec.kind);
  const fromIndex = chain.indexOf(from);
  const toIndex = chain.indexOf(to);
  if (fromIndex < 0 || toIndex < 0) return null;

  let start = Math.min(fromIndex, toIndex);
  let end = Math.max(fromIndex, toIndex);
  if (fromIndex > toIndex && decimalCount(spec.value) > 0 && end < chain.length - 1) end += 1;
  const groups = chain.slice(start, end + 1);
  const stepFactor = places === 3 ? 1000 : places === 2 ? 100 : 10;
  const smallestValue = fromIndex < toIndex ? Number(spec.answer) : Number(spec.value) * stepFactor ** (end - fromIndex);
  if (!Number.isFinite(smallestValue)) return null;

  const integerDigits = String(Math.round(smallestValue)).padStart(groups.length * places, "0").slice(-groups.length * places).split("");
  let firstNonZero = integerDigits.findIndex((digit) => digit !== "0");
  if (firstNonZero < 0) firstNonZero = integerDigits.length - 1;
  const digits = integerDigits.map((digit, index) => (index < firstNonZero ? "" : digit));

  return (
    <div className="mt-4">
      <p className="text-xs font-bold mb-2" style={{ color: colors.ink }}>
        Placement dans le tableau de conversion
      </p>
      <div className="overflow-x-auto pb-1">
        <table className="w-full border-collapse text-center text-xs" style={{ minWidth: groups.length * places * 88, color: colors.ink }}>
          <thead>
            <tr>
              {groups.map((unit) => (
                <th key={unit} colSpan={places} className="border-2 px-2 py-2 font-black" style={{ borderColor: colors.ink, backgroundColor: `${colors.gold}18` }}>
                  {unit}
                </th>
              ))}
            </tr>
            <tr>
              {groups.flatMap((unit) => PLACE_LABELS[places].map((place) => (
                <th key={`${unit}-${place}`} className="border-2 px-2 py-2 font-semibold" style={{ borderColor: colors.ink }}>
                  {place}
                </th>
              )))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {digits.map((digit, index) => (
                <td key={index} className="border-2 px-3 py-3 text-base font-black" style={{ borderColor: colors.ink, backgroundColor: digit ? "white" : `${colors.slate}08` }}>
                  {digit || "\u00a0"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs leading-relaxed" style={{ color: colors.slate }}>
        {places === 1
          ? "Chaque unité possède sa propre colonne, et le chiffre des unités est placé dans l’unité de départ."
          : `Chaque unité de ${spec.kind === "area" ? "surface" : "volume"} occupe ${places === 2 ? "deux" : "trois"} colonnes, et chaque chiffre possède sa propre case.`}
      </p>
    </div>
  );
}

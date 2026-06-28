import { cn } from "@/lib/utils";

export interface Point {
  label: string;
  value: number;
}

/* -------------------------------------------------------------------------- */
/* Graphique en aires (courbe) — SVG, sans dépendance                         */
/* -------------------------------------------------------------------------- */
export function LineChart({
  data,
  height = 200,
  prefix = "",
}: {
  data: Point[];
  height?: number;
  prefix?: string;
}) {
  const W = 600;
  const H = 200;
  const pad = 8;
  const max = Math.max(...data.map((d) => d.value), 1);
  const stepX = (W - pad * 2) / Math.max(data.length - 1, 1);
  const y = (v: number) => H - pad - (v / max) * (H - pad * 2);
  const pts = data.map((d, i) => [pad + i * stepX, y(d.value)] as const);
  const line = pts.map(([x, yy], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${yy.toFixed(1)}`).join(" ");
  const area = `${line} L${pad + (data.length - 1) * stepX},${H - pad} L${pad},${H - pad} Z`;
  const peak = data.reduce((a, b) => (b.value > a.value ? b : a), data[0]);

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        role="img"
        aria-label="Évolution sur la période"
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8590c" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#e8590c" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaFill)" />
        <path d={line} fill="none" stroke="#e8590c" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {pts.map(([x, yy], i) => (
          <circle key={i} cx={x} cy={yy} r="2.5" fill="#e8590c" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[0.65rem] text-slate-400">
        <span>{data[0]?.label}</span>
        <span className="font-medium text-slate-500">
          Pic : {prefix}{peak?.value} ({peak?.label})
        </span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Histogramme vertical — CSS, responsive                                     */
/* -------------------------------------------------------------------------- */
export function BarChart({
  data,
  height = 180,
  accentClass = "bg-terracotta-400",
}: {
  data: Point[];
  height?: number;
  accentClass?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => (
        <div key={`${d.label}-${i}`} className="flex flex-1 flex-col items-center justify-end gap-1.5">
          <div
            className={cn("w-full rounded-t-md transition-all", accentClass)}
            style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? 4 : 0 }}
            title={`${d.label} : ${d.value}`}
          />
          <span className="text-[0.6rem] text-slate-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Donut — SVG                                                                */
/* -------------------------------------------------------------------------- */
const DONUT_COLORS = ["#e8590c", "#6a9a3b", "#3b82f6", "#a855f7", "#f59e0b"];

export function DonutChart({ data }: { data: Point[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const R = 54;
  const C = 2 * Math.PI * R;
  const segments = data.map((d, i) => {
    const frac = d.value / total;
    const dash = frac * C;
    const offset = data
      .slice(0, i)
      .reduce((sum, item) => sum + (item.value / total) * C, 0);
    return { ...d, dash, offset };
  });

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 120 120" width="130" height="130" role="img" aria-label="Répartition">
        <g transform="rotate(-90 60 60)">
          {segments.map((d, i) => (
            <circle
              key={d.label}
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
              strokeWidth="12"
              strokeDasharray={`${d.dash} ${C - d.dash}`}
              strokeDashoffset={-d.offset}
            />
          ))}
        </g>
        <text x="60" y="58" textAnchor="middle" className="fill-slate-900" fontSize="20" fontWeight="700">
          {total}
        </text>
        <text x="60" y="74" textAnchor="middle" className="fill-slate-400" fontSize="9">
          total
        </text>
      </svg>
      <ul className="space-y-1.5">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
            />
            <span className="text-slate-600">{d.label}</span>
            <span className="ml-auto font-semibold text-slate-900">
              {Math.round((d.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Liste à barres horizontales (ex. top produits)                            */
/* -------------------------------------------------------------------------- */
export function HBarList({ data, suffix = "" }: { data: Point[]; suffix?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="space-y-3">
      {data.map((d) => (
        <li key={d.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-slate-600">{d.label}</span>
            <span className="font-semibold text-slate-900">
              {d.value}
              {suffix}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-terracotta-400"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

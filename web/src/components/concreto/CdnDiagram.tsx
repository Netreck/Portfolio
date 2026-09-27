import type { Language } from '../../data/projects'

export type CacheMode = 'hit' | 'miss'

interface Box {
  x: number
  y: number
  w: number
  h: number
  title: string
  sub: string
  group?: string
}

interface Layout {
  width: number
  height: number
  nodes: (language: Language) => Box[]
  links: string[]
  wireguard: { x: number; y: number; anchor: 'middle' | 'start' }
  traces: Record<CacheMode, { lines: string[]; markers: [number, number][] }>
}

const nodes = (language: Language, positions: [number, number, number, number][]): Box[] => {
  const br = language === 'br'
  const content = [
    { title: br ? 'Visitante' : 'Visitor', sub: br ? 'navegador' : 'browser' },
    { title: 'Cloudflare DNS', sub: 'gabriel-goncalves.com', group: 'Cloudflare' },
    { title: 'Amazon CloudFront', sub: br ? 'cache no edge · TLS · compressão' : 'edge cache · TLS · compression', group: 'AWS' },
    { title: 'Caddy', sub: 'cdn.gabriel-goncalves.com', group: 'VPS' },
    { title: br ? 'Portfólio PROD' : 'Portfolio PROD', sub: 'Proxmox', group: 'Homelab' },
  ]
  return content.map((c, i) => ({ ...c, x: positions[i][0], y: positions[i][1], w: positions[i][2], h: positions[i][3] }))
}

const WIDE: Layout = {
  width: 1000,
  height: 270,
  nodes: (language) =>
    nodes(language, [
      [20, 70, 150, 64],
      [200, 70, 170, 64],
      [400, 70, 200, 64],
      [630, 70, 170, 64],
      [840, 70, 140, 64],
    ]),
  links: ['170,102 200,102', '370,102 400,102', '600,102 630,102', '800,102 840,102'],
  wireguard: { x: 820, y: 164, anchor: 'middle' },
  traces: {
    hit: {
      lines: ['170,102 200,102', '370,102 400,102', '500,134 500,214 95,214 95,134'],
      markers: [
        [346, 62],
        [576, 62],
      ],
    },
    miss: {
      lines: ['170,102 200,102', '370,102 400,102', '600,102 630,102', '800,102 840,102', '500,134 500,214 95,214 95,134'],
      markers: [
        [346, 62],
        [576, 62],
        [776, 62],
        [808, 112],
        [956, 62],
      ],
    },
  },
}

const NARROW: Layout = {
  width: 400,
  height: 560,
  nodes: (language) =>
    nodes(language, [
      [40, 20, 290, 60],
      [40, 120, 290, 60],
      [40, 220, 290, 60],
      [40, 320, 290, 60],
      [40, 440, 290, 60],
    ]),
  links: ['185,80 185,120', '185,180 185,220', '185,280 185,320', '185,380 185,440'],
  wireguard: { x: 226, y: 415, anchor: 'start' },
  traces: {
    hit: {
      lines: ['185,80 185,120', '185,180 185,220', '330,250 370,250 370,50 330,50'],
      markers: [
        [306, 112],
        [306, 212],
      ],
    },
    miss: {
      lines: ['185,80 185,120', '185,180 185,220', '185,280 185,320', '185,380 185,440', '330,250 370,250 370,50 330,50'],
      markers: [
        [306, 112],
        [306, 212],
        [306, 312],
        [194, 398],
        [306, 432],
      ],
    },
  },
}

function Diagram({ layout, language, mode, label }: { layout: Layout; language: Language; mode: CacheMode; label: string }) {
  const trace = layout.traces[mode]
  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      role="img"
      aria-label={label}
      className="block h-auto w-full"
      style={{ fontFamily: 'var(--font-concrete)' }}
    >
      {layout.links.map((points) => (
        <polyline key={points} points={points} className="fill-none stroke-ink" strokeWidth={2} />
      ))}

      {layout.nodes(language).map((box) => (
        <g key={box.title}>
          {box.group && layout === WIDE && (
            <text x={box.x} y={box.y - 12} className="fill-ink-soft text-[12px] font-semibold">
              {box.group}
            </text>
          )}
          <rect x={box.x} y={box.y} width={box.w} height={box.h} className="fill-paper stroke-ink" strokeWidth={2} />
          <text x={box.x + 12} y={box.y + box.h / 2 - 4} className="fill-ink text-[14px] font-semibold">
            {box.title}
          </text>
          <text x={box.x + 12} y={box.y + box.h / 2 + 14} className="fill-ink-soft text-[12px]">
            {layout === NARROW && box.group ? `${box.group} · ${box.sub}` : box.sub}
          </text>
        </g>
      ))}

      <text
        x={layout.wireguard.x}
        y={layout.wireguard.y}
        textAnchor={layout.wireguard.anchor}
        className="fill-ink text-[12px] font-semibold"
      >
        WireGuard
      </text>

      {trace.lines.map((points) => (
        <polyline key={`c-${points}`} points={points} className="fill-none stroke-ink" strokeWidth={9} />
      ))}
      {trace.lines.map((points) => (
        <polyline key={`p-${points}`} points={points} className="fill-none stroke-signal" strokeWidth={4} />
      ))}
      {trace.markers.map(([x, y], index) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={24} height={24} className="fill-signal stroke-ink" strokeWidth={2} />
          <text x={x + 12} y={y + 17} textAnchor="middle" className="tnum fill-ink text-[13px] font-bold">
            {index + 1}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function CdnDiagram({ language, mode, label }: { language: Language; mode: CacheMode; label: string }) {
  return (
    <div className="border-2 border-ink bg-paper p-2 sm:p-4">
      <div className="hidden md:block">
        <Diagram layout={WIDE} language={language} mode={mode} label={label} />
      </div>
      <div className="mx-auto max-w-[420px] md:hidden">
        <Diagram layout={NARROW} language={language} mode={mode} label={label} />
      </div>
    </div>
  )
}

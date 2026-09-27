import type { Language } from '../../data/projects'
import { HOMELAB_COPY } from '../../data/homelab'

export type DiagramMode = 'public' | 'admin' | 'zones'

type Tone = 'paper' | 'tint' | 'cobalt' | 'ink'

interface Box {
  x: number
  y: number
  w: number
  h: number
  title: string
  sub: string
}

interface Zone {
  x: number
  y: number
  w: number
  h: number
  name: string
  subnet: string
  tone: Tone
}

interface Trace {
  lines: string[]
  markers: [number, number][]
}

interface Layout {
  width: number
  height: number
  frame: { x: number; y: number; w: number; h: number; labelX: number; labelY: number }
  spine: { x: number; y: number; w: number; h: number }
  spineLabel: { x: number; y: number; rotate: boolean }
  outside: (language: Language) => Box[]
  zones: Zone[]
  nodes: Box[]
  stubs: [number, number, number][]
  wireguardLabel: { x: number; y: number }
  traces: Record<DiagramMode, Trace>
}

const outsideLabels = (language: Language) => ({
  visitor: language === 'br' ? 'Visitante' : 'Visitor',
  dnsOnly: language === 'br' ? 'Só DNS' : 'DNS only',
  adminDevice: language === 'br' ? 'Dispositivo admin' : 'Admin device',
})

// Desktop: pfSense is a vertical spine between two columns of zones.
const WIDE: Layout = {
  width: 1000,
  height: 760,
  frame: { x: 20, y: 210, w: 960, h: 530, labelX: 36, labelY: 236 },
  spine: { x: 470, y: 250, w: 60, h: 470 },
  spineLabel: { x: 500, y: 272, rotate: false },
  outside: (language) => {
    const l = outsideLabels(language)
    return [
      { x: 40, y: 30, w: 170, h: 56, title: l.visitor, sub: 'gabriel-goncalves.com' },
      { x: 250, y: 30, w: 170, h: 56, title: 'Cloudflare DNS', sub: l.dnsOnly },
      { x: 250, y: 110, w: 220, h: 60, title: 'VPS · Caddy', sub: 'Docker :80 / :443' },
      { x: 640, y: 30, w: 150, h: 56, title: 'Mac', sub: l.adminDevice },
      { x: 820, y: 30, w: 150, h: 56, title: 'Tailscale', sub: '100.64.0.0/10' },
    ]
  },
  zones: [
    { x: 40, y: 250, w: 410, h: 90, name: 'EDGE', subnet: '10.10.40.0/24', tone: 'tint' },
    { x: 40, y: 360, w: 410, h: 100, name: 'DMZ', subnet: '10.10.10.0/24', tone: 'cobalt' },
    { x: 40, y: 480, w: 410, h: 240, name: 'MGMT', subnet: '10.10.30.0/24', tone: 'ink' },
    { x: 550, y: 250, w: 390, h: 220, name: 'SERVERS', subnet: '10.10.20.0/24', tone: 'paper' },
    { x: 550, y: 490, w: 390, h: 110, name: 'VPNADMIN', subnet: '10.10.50.0/24', tone: 'paper' },
  ],
  nodes: [
    { x: 200, y: 282, w: 220, h: 48, title: 'CT111 · wg-edge', sub: '10.10.40.2' },
    { x: 200, y: 392, w: 230, h: 52, title: 'CT103 · Nginx Proxy Mgr', sub: '10.10.10.11 · 80/443' },
    { x: 60, y: 548, w: 180, h: 48, title: 'CT101 · NetBox', sub: '10.10.30.10' },
    { x: 250, y: 548, w: 180, h: 48, title: 'VM107 · pfSense UI', sub: '10.10.30.1' },
    { x: 60, y: 614, w: 370, h: 48, title: 'Proxmox VE', sub: '10.10.30.2:8006' },
    { x: 570, y: 306, w: 170, h: 44, title: 'CT108 · Portfolio-Prod', sub: '10.10.20.15' },
    { x: 770, y: 306, w: 160, h: 44, title: 'CT109 · Portfolio-Prod-1', sub: '10.10.20.16' },
    { x: 570, y: 362, w: 170, h: 44, title: 'CT104 · Main-Monitor', sub: '10.10.20.12' },
    { x: 770, y: 362, w: 160, h: 44, title: 'CT100 · OpenClaw', sub: '10.10.20.17' },
    { x: 570, y: 418, w: 200, h: 44, title: 'CT112 · segment-pilot-web', sub: '10.10.20.10' },
    { x: 690, y: 525, w: 220, h: 48, title: 'CT113 · tailscale-vpn', sub: '10.10.50.1' },
  ],
  stubs: [
    [450, 470, 326],
    [450, 470, 448],
    [450, 470, 700],
    [530, 550, 450],
    [530, 550, 585],
  ],
  wireguardLabel: { x: 318, y: 196 },
  traces: {
    public: {
      lines: [
        '210,58 250,58',
        '335,86 335,110',
        '300,170 300,282',
        '420,306 484,306 484,418 430,418',
        '430,432 518,432 518,328 570,328',
      ],
      markers: [
        [396, 22],
        [446, 102],
        [312, 212],
        [396, 274],
        [472, 340],
        [406, 384],
        [506, 372],
        [728, 298],
      ],
    },
    admin: {
      lines: ['790,58 820,58', '955,86 955,549 910,549', '690,549 500,549 500,638 430,638'],
      markers: [
        [766, 22],
        [946, 22],
        [886, 517],
        [488, 574],
        [406, 606],
      ],
    },
    zones: {
      lines: ['450,326 488,326 488,440 450,440', '450,454 512,454 512,450 550,450', '550,585 500,585 500,700 450,700'],
      markers: [
        [476, 366],
        [500, 462],
        [488, 630],
      ],
    },
  },
}

// Narrow: zones stack down the page; pfSense becomes a spine on the left edge.
const NARROW: Layout = {
  width: 400,
  height: 1200,
  frame: { x: 8, y: 258, w: 384, h: 934, labelX: 80, labelY: 282 },
  spine: { x: 22, y: 296, w: 44, h: 880 },
  spineLabel: { x: 50, y: 760, rotate: true },
  outside: (language) => {
    const l = outsideLabels(language)
    return [
      { x: 10, y: 14, w: 180, h: 52, title: l.visitor, sub: 'gabriel-goncalves.com' },
      { x: 210, y: 14, w: 180, h: 52, title: 'Cloudflare DNS', sub: l.dnsOnly },
      { x: 210, y: 90, w: 180, h: 56, title: 'VPS · Caddy', sub: 'Docker :80 / :443' },
      { x: 10, y: 170, w: 150, h: 52, title: 'Mac', sub: l.adminDevice },
      { x: 180, y: 170, w: 170, h: 52, title: 'Tailscale', sub: '100.64.0.0/10' },
    ]
  },
  zones: [
    { x: 82, y: 296, w: 278, h: 106, name: 'EDGE', subnet: '10.10.40.0/24', tone: 'tint' },
    { x: 82, y: 416, w: 278, h: 106, name: 'DMZ', subnet: '10.10.10.0/24', tone: 'cobalt' },
    { x: 82, y: 536, w: 278, h: 310, name: 'SERVERS', subnet: '10.10.20.0/24', tone: 'paper' },
    { x: 82, y: 860, w: 278, h: 106, name: 'VPNADMIN', subnet: '10.10.50.0/24', tone: 'paper' },
    { x: 82, y: 980, w: 278, h: 200, name: 'MGMT', subnet: '10.10.30.0/24', tone: 'ink' },
  ],
  nodes: [
    { x: 98, y: 344, w: 246, h: 46, title: 'CT111 · wg-edge', sub: '10.10.40.2' },
    { x: 98, y: 464, w: 246, h: 46, title: 'CT103 · Nginx Proxy Mgr', sub: '10.10.10.11 · 80/443' },
    { x: 98, y: 584, w: 246, h: 46, title: 'CT108 · Portfolio-Prod', sub: '10.10.20.15' },
    { x: 98, y: 636, w: 246, h: 46, title: 'CT109 · Portfolio-Prod-1', sub: '10.10.20.16' },
    { x: 98, y: 688, w: 246, h: 46, title: 'CT104 · Main-Monitor', sub: '10.10.20.12' },
    { x: 98, y: 740, w: 246, h: 46, title: 'CT100 · OpenClaw', sub: '10.10.20.17' },
    { x: 98, y: 792, w: 246, h: 46, title: 'CT112 · segment-pilot-web', sub: '10.10.20.10' },
    { x: 98, y: 908, w: 246, h: 46, title: 'CT113 · tailscale-vpn', sub: '10.10.50.1' },
    { x: 98, y: 1028, w: 246, h: 46, title: 'CT101 · NetBox', sub: '10.10.30.10' },
    { x: 98, y: 1078, w: 246, h: 46, title: 'VM107 · pfSense UI', sub: '10.10.30.1' },
    { x: 98, y: 1128, w: 246, h: 46, title: 'Proxmox VE', sub: '10.10.30.2:8006' },
  ],
  stubs: [
    [66, 82, 386],
    [66, 82, 510],
    [66, 82, 560],
    [66, 82, 944],
    [66, 82, 1004],
  ],
  wireguardLabel: { x: 214, y: 250 },
  traces: {
    public: {
      lines: [
        '190,40 210,40',
        '300,66 300,90',
        '370,146 370,367 344,367',
        '98,367 34,367 34,487 98,487',
        '98,497 54,497 54,607 98,607',
      ],
      markers: [
        [366, 6],
        [366, 82],
        [358, 300],
        [308, 336],
        [22, 410],
        [320, 456],
        [42, 540],
        [320, 576],
      ],
    },
    admin: {
      lines: ['160,196 180,196', '350,196 376,196 376,931 344,931', '98,931 44,931 44,1151 98,1151'],
      markers: [
        [136, 162],
        [326, 162],
        [320, 900],
        [32, 1040],
        [320, 1120],
      ],
    },
    zones: {
      lines: ['82,386 34,386 34,500 82,500', '82,506 54,506 54,560 82,560', '82,944 44,944 44,1004 82,1004'],
      markers: [
        [22, 430],
        [42, 520],
        [32, 962],
      ],
    },
  },
}

const ZONE_FILL: Record<Tone, string> = {
  paper: 'fill-paper stroke-ink',
  tint: 'fill-cobalt-tint stroke-cobalt-tint',
  cobalt: 'fill-cobalt stroke-cobalt',
  ink: 'fill-ink stroke-ink',
}
const ZONE_TEXT: Record<Tone, string> = {
  paper: 'fill-ink',
  tint: 'fill-ink',
  cobalt: 'fill-paper',
  ink: 'fill-paper',
}

function Node({ box }: { box: Box }) {
  return (
    <g>
      <rect x={box.x} y={box.y} width={box.w} height={box.h} className="fill-paper stroke-ink" strokeWidth={2} />
      <text x={box.x + 10} y={box.y + box.h / 2 - 4} className="fill-ink text-[13px] font-semibold">
        {box.title}
      </text>
      <text x={box.x + 10} y={box.y + box.h / 2 + 13} className="tnum fill-ink-soft text-[12px]">
        {box.sub}
      </text>
    </g>
  )
}

interface DiagramProps {
  layout: Layout
  language: Language
  mode: DiagramMode
  label: string
}

function Diagram({ layout, language, mode, label }: DiagramProps) {
  const trace = layout.traces[mode]
  const { frame, spine, spineLabel } = layout

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      role="img"
      aria-label={label}
      className="block h-auto w-full"
      style={{ fontFamily: 'var(--font-concrete)' }}
    >
      <rect x={frame.x} y={frame.y} width={frame.w} height={frame.h} className="fill-none stroke-ink" strokeWidth={2} />
      <text x={frame.labelX} y={frame.labelY} className="fill-ink text-[13px] font-bold">
        {language === 'br' ? 'Proxmox VE · 1 host físico' : 'Proxmox VE · 1 physical host'}
      </text>

      {layout.zones.map((zone) => (
        <g key={zone.name}>
          <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} className={ZONE_FILL[zone.tone]} strokeWidth={2} />
          <text x={zone.x + 16} y={zone.y + 24} className={`${ZONE_TEXT[zone.tone]} text-[15px] font-bold`}>
            {zone.name}
          </text>
          <text x={zone.x + 16} y={zone.y + 42} className={`tnum ${ZONE_TEXT[zone.tone]} text-[12px]`}>
            {zone.subnet}
          </text>
        </g>
      ))}

      {layout.stubs.map(([x1, x2, y]) => (
        <line key={`${x1}-${y}`} x1={x1} x2={x2} y1={y} y2={y} className="stroke-ink" strokeWidth={2} />
      ))}

      {/* pfSense: every packet between zones crosses this spine */}
      <rect x={spine.x} y={spine.y} width={spine.w} height={spine.h} className="fill-ink" />
      {spineLabel.rotate ? (
        <text
          transform={`translate(${spineLabel.x} ${spineLabel.y}) rotate(-90)`}
          textAnchor="middle"
          className="fill-paper text-[13px] font-bold"
        >
          VM107 · pfSense
        </text>
      ) : (
        <>
          <text x={spineLabel.x} y={spineLabel.y} textAnchor="middle" className="tnum fill-paper text-[12px] font-bold">
            VM107
          </text>
          <text x={spineLabel.x} y={spineLabel.y + 18} textAnchor="middle" className="fill-paper text-[12px] font-bold">
            pfSense
          </text>
        </>
      )}

      {layout.outside(language).map((box) => (
        <Node key={box.title} box={box} />
      ))}
      {layout.nodes.map((box) => (
        <Node key={box.title} box={box} />
      ))}

      <g>
        {trace.lines.map((points) => (
          <polyline key={`c-${points}`} points={points} className="fill-none stroke-ink" strokeWidth={9} strokeLinejoin="miter" />
        ))}
        {trace.lines.map((points) => (
          <polyline key={`p-${points}`} points={points} className="fill-none stroke-signal" strokeWidth={4} strokeLinejoin="miter" />
        ))}
        {trace.markers.map(([x, y], index) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width={24} height={24} className="fill-signal stroke-ink" strokeWidth={2} />
            <text x={x + 12} y={y + 17} textAnchor="middle" className="tnum fill-ink text-[13px] font-bold">
              {index + 1}
            </text>
          </g>
        ))}
      </g>

      {mode === 'public' && (
        <text x={layout.wireguardLabel.x} y={layout.wireguardLabel.y} className="fill-ink text-[12px] font-semibold">
          WireGuard · UDP 51822
        </text>
      )}
    </svg>
  )
}

interface ArchitectureDiagramProps {
  language: Language
  mode: DiagramMode
}

export default function ArchitectureDiagram({ language, mode }: ArchitectureDiagramProps) {
  const t = HOMELAB_COPY[language]
  const state = mode === 'public' ? t.publicLabel : mode === 'admin' ? t.adminLabel : t.zonesLabel
  const label = `${t.diagramLabel}: ${state}`

  return (
    <figure className="border-2 border-ink bg-paper">
      <div className="hidden lg:block">
        <Diagram layout={WIDE} language={language} mode={mode} label={label} />
      </div>
      <div className="mx-auto max-w-[520px] lg:hidden">
        <Diagram layout={NARROW} language={language} mode={mode} label={label} />
      </div>
      <figcaption className="flex items-center gap-2 border-t-2 border-ink px-4 py-2.5 text-[14px] font-medium">
        <span aria-hidden="true" className="h-3 w-3 border-2 border-ink bg-signal" />
        {state}
      </figcaption>
    </figure>
  )
}

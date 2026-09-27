import type { Language } from './projects'

// Source of truth: github.com/Netreck/myHomeLab (README + homelab_flow_PT_10-09-2026.drawio,
// snapshot 17/09/2026). The public VPS address is intentionally left out.

export type ZoneId = 'edge' | 'dmz' | 'servers' | 'mgmt' | 'vpnadmin'

export interface Zone {
  id: ZoneId
  name: string
  bridge: string
  subnet: string
  gateway: string
  purpose: Record<Language, string>
}

export interface Machine {
  id: string
  name: string
  kind: 'VM' | 'LXC' | 'Host'
  zone: ZoneId
  address: string
  purpose: Record<Language, string>
}

export interface Hop {
  node: string
  where: string
  detail: Record<Language, string>
}

export const HOMELAB_REPO = 'https://github.com/Netreck/myHomeLab'
export const SNAPSHOT_DATE = { en: 'Sep 17, 2026', br: '17/09/2026' }

export const ZONES: Zone[] = [
  {
    id: 'edge',
    name: 'EDGE',
    bridge: 'edgenet',
    subnet: '10.10.40.0/24',
    gateway: '10.10.40.1',
    purpose: { en: 'WireGuard entry point from the public VPS', br: 'Entrada WireGuard vinda da VPS pública' },
  },
  {
    id: 'dmz',
    name: 'DMZ',
    bridge: 'dmznet',
    subnet: '10.10.10.0/24',
    gateway: '10.10.10.1',
    purpose: { en: 'Reverse proxy and public-facing internal services', br: 'Proxy reverso e serviços internos expostos' },
  },
  {
    id: 'servers',
    name: 'SERVERS',
    bridge: 'srvnet',
    subnet: '10.10.20.0/24',
    gateway: '10.10.20.1',
    purpose: { en: 'Applications, monitoring and internal workloads', br: 'Aplicações, monitoramento e cargas internas' },
  },
  {
    id: 'mgmt',
    name: 'MGMT',
    bridge: 'mgmtnet',
    subnet: '10.10.30.0/24',
    gateway: '10.10.30.1',
    purpose: { en: 'Proxmox and infrastructure management interfaces', br: 'Proxmox e interfaces de gerência da infraestrutura' },
  },
  {
    id: 'vpnadmin',
    name: 'VPNADMIN',
    bridge: 'vpnadmin',
    subnet: '10.10.50.0/24',
    gateway: '—*',
    purpose: { en: 'Administrative VPN entry (Tailscale)', br: 'Entrada da VPN administrativa (Tailscale)' },
  },
]

export const MACHINES: Machine[] = [
  { id: 'VM107', name: 'pfSense', kind: 'VM', zone: 'mgmt', address: '10.10.30.1', purpose: { en: 'Central L3/L4 router and firewall, NAT, six interfaces', br: 'Roteador e firewall central L3/L4, NAT, seis interfaces' } },
  { id: 'CT111', name: 'wg-edge', kind: 'LXC', zone: 'edge', address: '10.10.40.2', purpose: { en: 'WireGuard endpoint for the VPS tunnel (WG 10.255.255.2)', br: 'Ponta WireGuard do túnel da VPS (WG 10.255.255.2)' } },
  { id: 'CT103', name: 'Nginx Proxy Manager', kind: 'LXC', zone: 'dmz', address: '10.10.10.11', purpose: { en: 'Internal reverse proxy, 80/443; admin on 81 (private)', br: 'Proxy reverso interno, 80/443; admin na 81 (privado)' } },
  { id: 'CT100', name: 'OpenClaw', kind: 'LXC', zone: 'servers', address: '10.10.20.17', purpose: { en: 'Application workload', br: 'Aplicação' } },
  { id: 'CT104', name: 'Main-Monitor', kind: 'LXC', zone: 'servers', address: '10.10.20.12', purpose: { en: 'Grafana, Prometheus and Loki', br: 'Grafana, Prometheus e Loki' } },
  { id: 'CT108', name: 'Portfolio-Prod', kind: 'LXC', zone: 'servers', address: '10.10.20.15', purpose: { en: 'This portfolio, production', br: 'Este portfólio, produção' } },
  { id: 'CT109', name: 'Portfolio-Prod-1', kind: 'LXC', zone: 'servers', address: '10.10.20.16', purpose: { en: 'Additional portfolio production workload', br: 'Carga adicional de produção do portfólio' } },
  { id: 'CT112', name: 'segment-pilot-web', kind: 'LXC', zone: 'servers', address: '10.10.20.10', purpose: { en: 'Network segmentation pilot', br: 'Piloto de segmentação de rede' } },
  { id: 'CT101', name: 'NetBox', kind: 'LXC', zone: 'mgmt', address: '10.10.30.10', purpose: { en: 'Network source of truth and documentation', br: 'Fonte da verdade e documentação da rede' } },
  { id: 'CT113', name: 'tailscale-vpn', kind: 'LXC', zone: 'vpnadmin', address: '10.10.50.1', purpose: { en: 'Private administrative access through Tailscale', br: 'Acesso administrativo privado via Tailscale' } },
  { id: 'PVE', name: 'Proxmox VE', kind: 'Host', zone: 'mgmt', address: '10.10.30.2:8006', purpose: { en: 'Virtualization host; web UI only in MGMT', br: 'Host de virtualização; interface web só na MGMT' } },
]

export const PUBLIC_PATH: Hop[] = [
  { node: 'gabriel-goncalves.com', where: 'Cloudflare DNS', detail: { en: 'DNS only: resolves the domain and wildcard to the VPS.', br: 'Só DNS: resolve o domínio e o wildcard para a VPS.' } },
  { node: 'VPS · Caddy', where: 'Docker :80 / :443', detail: { en: 'Terminates TLS with a Cloudflare DNS-challenge wildcard certificate.', br: 'Termina o TLS com certificado wildcard via desafio DNS da Cloudflare.' } },
  { node: 'WireGuard', where: 'UDP 51822 · 10.255.255.0/30', detail: { en: 'Direct encrypted tunnel from the VPS into the lab.', br: 'Túnel criptografado direto da VPS para o lab.' } },
  { node: 'CT111 · wg-edge', where: 'EDGE · 10.10.40.2', detail: { en: 'Tunnel terminates in the isolated EDGE zone.', br: 'O túnel termina na zona EDGE, isolada.' } },
  { node: 'VM107 · pfSense', where: 'EDGE → DMZ', detail: { en: 'Only 80/443 to Nginx Proxy Manager is allowed.', br: 'Só 80/443 para o Nginx Proxy Manager é permitido.' } },
  { node: 'CT103 · Nginx Proxy Manager', where: 'DMZ · 10.10.10.11', detail: { en: 'Routes each subdomain to its backend.', br: 'Encaminha cada subdomínio para o seu backend.' } },
  { node: 'VM107 · pfSense', where: 'DMZ → SERVERS', detail: { en: 'Only the required backends and ports pass.', br: 'Só passam os backends e portas necessários.' } },
  { node: 'CT108 · Portfolio-Prod', where: 'SERVERS · 10.10.20.15', detail: { en: 'The application, for example this site.', br: 'A aplicação, por exemplo este site.' } },
]

export const ADMIN_PATH: Hop[] = [
  { node: 'Mac', where: 'Admin device', detail: { en: 'My laptop, anywhere.', br: 'Meu notebook, de qualquer lugar.' } },
  { node: 'Tailscale', where: '100.64.0.0/10', detail: { en: 'Private VPN overlay; nothing administrative is public.', br: 'Overlay VPN privado; nada administrativo é público.' } },
  { node: 'CT113 · tailscale-vpn', where: 'VPNADMIN · 10.10.50.1', detail: { en: 'Subnet router into the lab.', br: 'Roteador de sub-rede para dentro do lab.' } },
  { node: 'VM107 · pfSense', where: 'VPNADMIN → MGMT', detail: { en: 'Authorized administration only.', br: 'Somente administração autorizada.' } },
  { node: 'Proxmox VE', where: 'MGMT · 10.10.30.2:8006', detail: { en: 'The same path reaches the pfSense web UI (10.10.30.1) and NetBox (10.10.30.10).', br: 'O mesmo caminho alcança a interface web do pfSense (10.10.30.1) e o NetBox (10.10.30.10).' } },
]

export const POLICIES: { from: string; to: string; rule: Record<Language, string> }[] = [
  { from: 'EDGE', to: 'DMZ', rule: { en: 'Into Nginx Proxy Manager on 80/443 only', br: 'Só para o Nginx Proxy Manager em 80/443' } },
  { from: 'DMZ', to: 'SERVERS', rule: { en: 'Required backends and ports only', br: 'Só backends e portas necessários' } },
  { from: 'VPNADMIN', to: 'MGMT', rule: { en: 'Authorized administration', br: 'Administração autorizada' } },
  { from: '*', to: '*', rule: { en: 'Between subnets always through pfSense; bridges are L2 only and never route', br: 'Entre sub-redes sempre pelo pfSense; as bridges são só L2 e não roteiam' } },
]

export const HARDWARE: { part: Record<Language, string>; value: string }[] = [
  { part: { en: 'Motherboard', br: 'Placa-mãe' }, value: 'X99 D4 Atermiter' },
  { part: { en: 'CPU', br: 'CPU' }, value: 'Intel Xeon E5-2680 v4 · 14C / 28T' },
  { part: { en: 'Memory', br: 'Memória' }, value: '32 GB DDR4 ECC RDIMM · 2 × 16 GB' },
  { part: { en: 'Storage', br: 'Armazenamento' }, value: '512 GB NVMe M.2' },
  { part: { en: 'GPU', br: 'GPU' }, value: 'NVIDIA GeForce RTX 3070 Ti' },
  { part: { en: 'Power supply', br: 'Fonte' }, value: '750 W' },
]

export const HOMELAB_COPY: Record<
  Language,
  {
    back: string
    title: string
    thesis: string
    facts: { label: string; value: string }[]
    snapshot: string
    repo: string
    questionsLabel: string
    q: { id: string; title: string }[]
    ingressWhy: string[]
    adminWhy: string
    zonesTable: { zone: string; bridge: string; subnet: string; gateway: string; purpose: string }
    policiesTitle: string
    inventoryTitle: string
    inventoryTable: { id: string; name: string; zone: string; address: string; purpose: string }
    health: string[]
    healthCaption: string
    healthAlt: string
    hardwareNote: string
    limitsTitle: string
    limits: string[]
    nextTitle: string
    next: string[]
    diagramLabel: string
    zonesLabel: string
    gatewayNote: string
    publicLabel: string
    adminLabel: string
  }
> = {
  en: {
    back: 'Back to portfolio',
    title: 'Personal Homelab',
    thesis:
      'A segmented self-hosted platform behind CGNAT: a minimal public VPS edge, a WireGuard tunnel, and a virtual pfSense routing five zones on one Proxmox host.',
    facts: [
      { label: 'Host', value: 'Proxmox VE' },
      { label: 'Firewall', value: 'pfSense · VM107' },
      { label: 'Zones', value: '5' },
      { label: 'Workloads', value: '1 VM + 9 LXC' },
    ],
    snapshot: 'Architecture as of',
    repo: 'Repository on GitHub',
    questionsLabel: 'Questions',
    q: [
      { id: 'ingress', title: 'How does a request get in?' },
      { id: 'admin', title: 'How is it administered?' },
      { id: 'isolation', title: 'What is isolated from what?' },
      { id: 'health', title: 'How do I know it is healthy?' },
      { id: 'hardware', title: 'What does it run on?' },
      { id: 'limits', title: 'What breaks, and what is next?' },
    ],
    ingressWhy: [
      'My ISP uses CGNAT, so nothing at home can be reached directly. A small, inexpensive VPS provides the public IPv4 entry point and does nothing else; all compute stays in the lab.',
      'The residential connection exposes no application ports. Public traffic only ever enters through the EDGE zone, and pfSense decides every step after that.',
    ],
    adminWhy:
      'Administration never shares the public path. It arrives over Tailscale, lands in its own zone, and pfSense is the only way from there to the management network, where Proxmox listens on 10.10.30.2:8006 and nowhere else.',
    zonesTable: { zone: 'Zone', bridge: 'Bridge', subnet: 'Subnet', gateway: 'Gateway', purpose: 'Purpose' },
    policiesTitle: 'Inter-zone policy',
    inventoryTitle: 'Machines',
    inventoryTable: { id: 'ID', name: 'Name', zone: 'Zone', address: 'Address', purpose: 'Purpose' },
    health: [
      'CT104 (Main-Monitor) centralizes observability: Prometheus collects metrics, Promtail ships the reverse proxy logs to Loki, and Grafana reads both for traffic and error dashboards.',
      'For the host itself, ProxMenuX shows CPU, memory, temperature, storage and the state of every VM and container at a glance.',
    ],
    healthCaption: 'ProxMenuX on the Proxmox node, captured in February 2026, before the current segmentation: healthy, with CPU, load and memory history.',
    healthAlt: 'ProxMenuX dashboard showing the node healthy with CPU, memory and temperature readings',
    hardwareNote: 'One physical server does everything, which is both the point and the main limitation.',
    limitsTitle: 'Current limitations',
    limits: [
      'A single Proxmox host: no high availability.',
      'pfSense is virtualized on the same host it protects, a management dependency during failures.',
      'The public path has two reverse-proxy layers: Caddy on the VPS and Nginx Proxy Manager in the DMZ.',
      'The diagram and inventory are maintained by hand.',
    ],
    nextTitle: 'Planned',
    next: [
      'DDoS visibility: evaluate FastNetMon Community for L3/L4 detection and feed it to my machine-learning DDoS detection project.',
      'Hardware: another 32 GB of RAM and an RTX 3090 24 GB for local AI inference and training.',
      'Recovery: document and test recovery procedures for Proxmox and the virtualized pfSense.',
    ],
    diagramLabel: 'Homelab network architecture diagram',
    zonesLabel: 'Allowed crossings between zones',
    gatewayNote: '* CT113 holds 10.10.50.1 in VPNADMIN; the pfSense interface address on that zone is not documented yet.',
    publicLabel: 'Public path',
    adminLabel: 'Admin path',
  },
  br: {
    back: 'Voltar ao portfólio',
    title: 'Homelab Pessoal',
    thesis:
      'Uma plataforma self-hosted segmentada atrás de CGNAT: uma VPS pública mínima na borda, um túnel WireGuard e um pfSense virtual roteando cinco zonas em um único host Proxmox.',
    facts: [
      { label: 'Host', value: 'Proxmox VE' },
      { label: 'Firewall', value: 'pfSense · VM107' },
      { label: 'Zonas', value: '5' },
      { label: 'Cargas', value: '1 VM + 9 LXC' },
    ],
    snapshot: 'Arquitetura em',
    repo: 'Repositório no GitHub',
    questionsLabel: 'Perguntas',
    q: [
      { id: 'ingress', title: 'Como uma requisição entra?' },
      { id: 'admin', title: 'Como ele é administrado?' },
      { id: 'isolation', title: 'O que fica isolado de quê?' },
      { id: 'health', title: 'Como sei que está saudável?' },
      { id: 'hardware', title: 'Em que ele roda?' },
      { id: 'limits', title: 'O que pode quebrar, e o que vem depois?' },
    ],
    ingressWhy: [
      'Meu provedor usa CGNAT, então nada em casa é alcançável diretamente. Uma VPS pequena e barata fornece o IPv4 público e não faz mais nada; todo o processamento fica no lab.',
      'A conexão residencial não expõe nenhuma porta de aplicação. O tráfego público só entra pela zona EDGE, e o pfSense decide cada passo depois disso.',
    ],
    adminWhy:
      'A administração nunca usa o caminho público. Ela chega pelo Tailscale, cai na sua própria zona, e o pfSense é o único caminho dali até a rede de gerência, onde o Proxmox escuta em 10.10.30.2:8006 e em nenhum outro lugar.',
    zonesTable: { zone: 'Zona', bridge: 'Bridge', subnet: 'Sub-rede', gateway: 'Gateway', purpose: 'Função' },
    policiesTitle: 'Política entre zonas',
    inventoryTitle: 'Máquinas',
    inventoryTable: { id: 'ID', name: 'Nome', zone: 'Zona', address: 'Endereço', purpose: 'Função' },
    health: [
      'O CT104 (Main-Monitor) centraliza a observabilidade: o Prometheus coleta métricas, o Promtail envia os logs do proxy reverso para o Loki, e o Grafana lê os dois para painéis de tráfego e erros.',
      'Para o próprio host, o ProxMenuX mostra CPU, memória, temperatura, armazenamento e o estado de cada VM e contêiner de relance.',
    ],
    healthCaption: 'ProxMenuX no nó Proxmox, capturado em fevereiro de 2026, antes da segmentação atual: saudável, com histórico de CPU, carga e memória.',
    healthAlt: 'Painel do ProxMenuX mostrando o nó saudável com leituras de CPU, memória e temperatura',
    hardwareNote: 'Um único servidor físico faz tudo, o que é ao mesmo tempo o objetivo e a principal limitação.',
    limitsTitle: 'Limitações atuais',
    limits: [
      'Um único host Proxmox: sem alta disponibilidade.',
      'O pfSense é virtualizado no mesmo host que ele protege, uma dependência de gerência em caso de falha.',
      'O caminho público tem duas camadas de proxy reverso: Caddy na VPS e Nginx Proxy Manager na DMZ.',
      'O diagrama e o inventário são mantidos à mão.',
    ],
    nextTitle: 'Planejado',
    next: [
      'Visibilidade de DDoS: avaliar o FastNetMon Community para detecção L3/L4 e integrar ao meu projeto de detecção de DDoS com machine learning.',
      'Hardware: mais 32 GB de RAM e uma RTX 3090 24 GB para inferência e treino de IA local.',
      'Recuperação: documentar e testar procedimentos de recuperação do Proxmox e do pfSense virtualizado.',
    ],
    diagramLabel: 'Diagrama da arquitetura de rede do homelab',
    zonesLabel: 'Travessias permitidas entre zonas',
    gatewayNote: '* O CT113 usa 10.10.50.1 na VPNADMIN; o endereço da interface do pfSense nessa zona ainda não está documentado.',
    publicLabel: 'Caminho público',
    adminLabel: 'Caminho administrativo',
  },
}

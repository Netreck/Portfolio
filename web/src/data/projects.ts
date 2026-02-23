import homelabArchitectureImg from '../Assets/Home-lab/homelab-arquitetura.png'
import proxmoxMainMenuImg from '../Assets/Home-lab/proxmox-main-menu.png'
import proxmenuxExampleImg from '../Assets/Home-lab/proxmenux-example.png'
import grafanaDashboardImg from '../Assets/Home-lab/grafana-dashboard.png'

export interface ProjectStat {
  label: string
  value: string
  detail: string
}

export interface ProjectImage {
  src: string
  alt: string
  caption: string
}

export interface ProjectFlowStep {
  title: string
  detail: string
}

export interface ProjectStackGroup {
  group: string
  items: string[]
}

export interface ProjectStorySection {
  label: string
  title: string
  paragraphs: string[]
  images?: ProjectImage[]
}

export interface Project {
  slug: string
  title: string
  subtitle: string
  status: string
  description: string
  intro: string
  overview: string
  tags: string[]
  githubUrl: string
  highlights: string[]
  stats: ProjectStat[]
  flow: ProjectFlowStep[]
  stack: ProjectStackGroup[]
  story: ProjectStorySection[]
}

const homelabArchitecture: ProjectImage = {
  src: homelabArchitectureImg,
  alt: 'Homelab architecture diagram',
  caption: 'Traffic path from public edge to private services in the homelab.',
}

const proxmoxMainMenu: ProjectImage = {
  src: proxmoxMainMenuImg,
  alt: 'Proxmox control panel',
  caption: 'Proxmox interface where VMs and LXC containers are orchestrated.',
}

const proxmenuxPanel: ProjectImage = {
  src: proxmenuxExampleImg,
  alt: 'ProxMenuX monitoring panel',
  caption: 'Live operational panel with resource usage, logs, and system status.',
}

const grafanaPanel: ProjectImage = {
  src: grafanaDashboardImg,
  alt: 'Grafana dashboard',
  caption: 'Centralized observability view with metrics and service health.',
}

export const projects: Project[] = [
  {
    slug: 'homelab-pessoal',
    title: 'Personal Homelab',
    subtitle: 'A 24/7 self-hosted platform for practical software engineering',
    status: 'Active',
    description:
      'A production-like home infrastructure used to host personal services continuously while validating architecture, reliability, and operational workflows.',
    intro:
      'This project is my hands-on environment for platform engineering. It mixes a minimal public edge with private infrastructure at home, allowing controlled experiments with real constraints.',
    overview:
      'The design follows a strict constraint documented in the README: keep the VPS minimal and low-cost, using it mostly for public IPv4 exposure. Because of CGNAT, secure connectivity is established through WireGuard with Netmaker orchestration, then routed internally by Nginx Proxy Manager.',
    tags: ['Proxmox', 'WireGuard', 'CI/CD', 'Grafana', 'Self-hosting'],
    githubUrl: 'https://github.com/Netreck/myHomeLab',
    highlights: [
      'Virtualized service isolation with Proxmox, VMs, and LXC containers.',
      'Secure ingress using VPS edge, Caddy TLS termination, and WireGuard tunnels.',
      'Centralized monitoring stack with Grafana, Loki, and Prometheus.',
      'Roadmap includes WAF placement and DDoS detection enhancements.',
    ],
    stats: [
      {
        label: 'Availability',
        value: '24/7',
        detail: 'Always-on workloads for real hosting behavior and maintenance.',
      },
      {
        label: 'Edge Model',
        value: 'Minimal VPS',
        detail: 'Low-cost public entry point with minimal operational overhead.',
      },
      {
        label: 'Runtime',
        value: 'Proxmox VE',
        detail: 'Combined VM and LXC strategy on a single host environment.',
      },
      {
        label: 'Observability',
        value: 'Grafana Stack',
        detail: 'Metrics and logs aggregated for service-level visibility.',
      },
    ],
    flow: [
      {
        title: 'User Request',
        detail: 'A user tries to access a service exposed by the homelab.',
      },
      {
        title: 'Cloudflare DNS',
        detail: 'The domain is resolved by Cloudflare DNS before routing.',
      },
      {
        title: 'VPS Public IP',
        detail: 'Traffic reaches the public VPS that acts as the internet edge.',
      },
      {
        title: 'Caddy TLS Gateway',
        detail: 'Caddy terminates TLS and forwards requests through the secure tunnel.',
      },
      {
        title: 'Nginx Proxy Manager (Proxmox)',
        detail: 'Inside the home network, Nginx Proxy Manager routes traffic to internal services.',
      },
    ],
    stack: [
      {
        group: 'Edge and Networking',
        items: ['VPS', 'Caddy', 'Netmaker', 'WireGuard', 'Cloudflare DNS'],
      },
      {
        group: 'Virtualization',
        items: ['Proxmox VE', 'LXC', 'Virtual Machines', 'Nginx Proxy Manager'],
      },
      {
        group: 'Observability',
        items: ['Grafana', 'Prometheus', 'Loki', 'ProxMenuX'],
      },
      {
        group: 'Storage and LAN Services',
        items: ['TrueNAS', 'Pi-hole'],
      },
      {
        group: 'Host Hardware',
        items: ['Xeon E5-2680 v4', '32 GB ECC RAM', '512 GB NVMe SSD', 'RTX 3070 Ti'],
      },
    ],
    story: [
      {
        label: 'Overview',
        title: 'Designing around real-world constraints',
        paragraphs: [
          'The key architectural decision was driven by ISP limitations: CGNAT makes direct exposure difficult and expensive. Instead of overbuilding the edge, I kept the VPS intentionally minimal and used it as a public doorway.',
          'From there, traffic is securely relayed into the homelab over WireGuard, keeping private services off the public surface while preserving predictable access patterns.',
        ],
        images: [homelabArchitecture],
      },
      {
        label: 'Infrastructure',
        title: 'Virtualization as the operational core',
        paragraphs: [
          'Proxmox is the backbone of the environment, running both VMs and LXC containers according to workload needs. This keeps isolation clear while still allowing efficient resource usage.',
          'Core service blocks include reverse proxying, storage, DNS tooling, and workload containers for application hosting.',
        ],
        images: [proxmoxMainMenu],
      },
      {
        label: 'Operations',
        title: 'Monitoring-first workflow',
        paragraphs: [
          'I treat this homelab as a production-style platform, so visibility is mandatory. ProxMenuX gives fast host-level checks, while Grafana and related telemetry services provide deeper service-level tracking.',
          'This observability-first approach reduces guesswork during incidents and supports safer iterative changes.',
        ],
        images: [proxmenuxPanel, grafanaPanel],
      },
      {
        label: 'Roadmap',
        title: 'Security and resilience next',
        paragraphs: [
          'The next iterations focus on defensive improvements from the README roadmap: introducing a WAF layer before internal routing and extending network anomaly detection.',
          'The long-term goal is to evolve this into a robust self-hosted platform that remains cost-efficient without sacrificing reliability.',
        ],
      },
    ],
  },
  {
    slug: 'hirematch-ai',
    title: 'HireMatch AI',
    subtitle: 'ATS-style resume ranking and gap analysis with NLP + LLM',
    status: 'In Development',
    description:
      'An AI-assisted ATS simulator that evaluates resume-job fit, producing a score and concrete recommendations for profile improvement.',
    intro:
      'HireMatch AI is built to translate opaque ATS behavior into understandable signals. It supports both database-based vacancy matching and user-provided job descriptions.',
    overview:
      'The project originated as a cloud prototype and is planned for migration into the homelab environment. The focus is objective ranking plus human-readable reasoning, balancing quantitative scoring with practical guidance.',
    tags: ['Python', 'NLP', 'LLM', 'ATS', 'Resume Analysis'],
    githubUrl: 'https://github.com/Netreck/HireMatch-AI',
    highlights: [
      'Resume scoring against a job dataset to estimate role compatibility.',
      'Custom vacancy mode for direct comparison against user-defined requirements.',
      'Feedback output with strengths, missing signals, and improvement priorities.',
      'Clear explanatory layer instead of black-box ranking only.',
    ],
    stats: [
      {
        label: 'Core Goal',
        value: 'Fit Clarity',
        detail: 'Make ATS-like decisions understandable and actionable.',
      },
      {
        label: 'Input Modes',
        value: '2 Modes',
        detail: 'Job dataset matching and custom job description matching.',
      },
      {
        label: 'AI Core',
        value: 'NLP + LLM',
        detail: 'Semantic extraction with guided language feedback.',
      },
      {
        label: 'Deployment Plan',
        value: 'Cloud -> Homelab',
        detail: 'Transition from cloud prototype to self-hosted operation.',
      },
    ],
    flow: [
      {
        title: 'Input Collection',
        detail: 'Resume and target role details are submitted by the user.',
      },
      {
        title: 'Semantic Parsing',
        detail: 'Relevant skills and requirements are extracted into comparable signals.',
      },
      {
        title: 'Fit Estimation',
        detail: 'ATS-style scoring estimates profile alignment to the target role.',
      },
      {
        title: 'LLM Guidance',
        detail: 'Narrative recommendations explain gaps and possible improvements.',
      },
      {
        title: 'Final Report',
        detail: 'The user receives score, strengths, and prioritized next actions.',
      },
    ],
    stack: [
      {
        group: 'AI and Processing',
        items: ['Python', 'NLP pipelines', 'LLM reasoning'],
      },
      {
        group: 'Product Capabilities',
        items: ['Resume parsing', 'Job matching', 'Scoring', 'Feedback generation'],
      },
      {
        group: 'Architecture Direction',
        items: ['Cloud prototype on GCP', 'Planned homelab migration'],
      },
    ],
    story: [
      {
        label: 'Problem',
        title: 'Turning ATS uncertainty into actionable signals',
        paragraphs: [
          'Most candidates receive little feedback from automated screening systems. HireMatch AI addresses this by converting matching logic into transparent scoring and direct recommendations.',
          'The objective is not only to rank resumes, but to explain how and why a profile aligns or misses a role.',
        ],
      },
      {
        label: 'Approach',
        title: 'Two matching modes for practical usage',
        paragraphs: [
          'Users can evaluate against an existing job dataset or submit a custom vacancy. This enables both benchmark analysis and role-specific preparation for real applications.',
          'The scoring layer is paired with LLM-generated feedback to keep recommendations practical and readable.',
        ],
      },
      {
        label: 'Platform Direction',
        title: 'From cloud prototype to self-hosted integration',
        paragraphs: [
          'The project started as a cloud-hosted implementation and is planned to integrate with the homelab stack over time.',
          'This move supports tighter operational control, lower recurring costs, and better experimentation with infrastructure + AI workflows together.',
        ],
      },
    ],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

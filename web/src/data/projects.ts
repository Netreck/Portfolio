import homelabArchitectureImg from '../Assets/Home-lab/homelab-arquitetura.png'
import proxmoxMainMenuImg from '../Assets/Home-lab/proxmox-main-menu.png'
import proxmenuxExampleImg from '../Assets/Home-lab/proxmenux-example.png'
import grafanaDashboardImg from '../Assets/Home-lab/grafana-dashboard.png'

export type Language = 'en' | 'br'

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

export interface ProjectLocaleContent {
  title: string
  subtitle: string
  status: string
  description: string
  intro: string
  overview: string
  flow: ProjectFlowStep[]
  stats: ProjectStat[]
  story: ProjectStorySection[]
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
  pt?: ProjectLocaleContent
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
    subtitle: 'A 24/7 self-hosted platform for real-world practice and personal project deployment.',
    status: 'Active',
    description:
      'A production-style home infrastructure used to continuously host personal services while validating architecture, reliability, and operations.',
    intro:
      'This project is my hands-on lab for platform engineering and for publishing my personal projects. It combines a VPS with a public IP and private infrastructure (a real physical server) at home to experiment under real constraints. I started this challenge to better understand development and maintenance processes in the area I want to grow in.',
    overview:
      'This homelab is exposed to the internet through a VPS public IP. Inside it, I use Nginx Proxy Manager as a reverse proxy to map each subdomain to one of my Proxmox virtual machines. I also use the Grafana, Prometheus, and Loki stack for observability of logs and access across the homelab.',
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
        title: 'Caddy TLS Gateway (VPS)',
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
    pt: {
      title: 'Homelab Pessoal',
      subtitle: 'Uma plataforma self-hosted 24/7 para prática real e deploy dos meus projetos.',
      status: 'Ativo',
      description:
        'Uma infraestrutura residencial em padrão de produção para hospedar serviços pessoais continuamente, validando arquitetura, confiabilidade e operação.',
      intro:
        'Este projeto é meu laboratório prático de platform engineering e para disponibilizar meus projetos pessoais. Ele combina uma vps com ip público com infraestrutura privada (servidor fisico real) em casa para experimentar sob restrições reais. Inicei esse desafio para entender melhor os processos do desenvolvimento e manutenção de projetos na minha área de interesse',
      overview:
        'Esse homelab é exposto na internet por meio do ip publico de uma vps, dentro dele utilizo Nginx proxy manager como proxy reverso para ligar cada subdominio a uma das minhas maquinas virtuais do proxmox.Além disso também utilizo a stack grafana, prometheus e loki para observabilidade de logs e acessos ao meu homelab. ',
      flow: [
        {
          title: 'Requisição do Usuário',
          detail: 'Um usuário tenta acessar um serviço publicado pelo homelab.',
        },
        {
          title: 'Cloudflare DNS',
          detail: 'O domínio é resolvido pelo Cloudflare DNS antes do roteamento.',
        },
        {
          title: 'IP Público da VPS',
          detail: 'O tráfego chega na VPS pública que funciona como borda da internet.',
        },
        {
          title: 'Gateway TLS Caddy(VPS)',
          detail: 'O Caddy termina TLS e encaminha requisições pelo túnel seguro.',
        },
        {
          title: 'Nginx Proxy Manager (Proxmox)',
          detail: 'Na rede de casa, o Nginx Proxy Manager roteia para os serviços internos.',
        },
      ],
      stats: [
        {
          label: 'Disponibilidade',
          value: '24/7',
          detail: 'Workloads sempre ativos para operação e manutenção reais.',
        },
        {
          label: 'Modelo de Borda',
          value: 'VPS Minima',
          detail: 'Ponto de entrada público de baixo custo e baixa complexidade.',
        },
        {
          label: 'Runtime',
          value: 'Proxmox VE',
          detail: 'Estratégia combinada de VM e LXC em um único host.',
        },
        {
          label: 'Observabilidade',
          value: 'Stack Grafana',
          detail: 'Métricas e logs agregados para visibilidade de serviço.',
        },
      ],
      story: [
        {
          label: 'Visão Geral',
          title: 'Projetando com restrições reais',
          paragraphs: [
            'A principal decisão de arquitetura veio de uma limitação da ISP: o CGNAT dificulta e encarece a exposição direta. Em vez de superdimensionar a borda, mantive a VPS propositalmente mínima para atuar como porta pública.',
            'Dali, o tráfego é encaminhado com segurança para o homelab via WireGuard, mantendo os serviços privados fora da superfície pública com padrão previsível de acesso.',
          ],
          images: [homelabArchitecture],
        },
        {
          label: 'Infraestrutura',
          title: 'Virtualização como núcleo operacional',
          paragraphs: [
            'O Proxmox é a base do ambiente, executando VMs e containers LXC conforme a necessidade de cada workload. Isso garante isolamento claro com uso eficiente de recursos.',
            'Os blocos centrais incluem proxy reverso, armazenamento, DNS e workloads de aplicação.',
          ],
          images: [proxmoxMainMenu],
        },
        {
          label: 'Operação',
          title: 'Fluxo orientado por monitoramento',
          paragraphs: [
            'Eu trato o homelab como plataforma em padrão de produção, então visibilidade é obrigatória. O ProxMenuX acelera o diagnóstico no host, e o Grafana aprofunda a leitura de saúde dos serviços.',
            'Esse modelo observability-first reduz tentativa e erro em incidentes e permite iterações mais seguras.',
          ],
          images: [proxmenuxPanel, grafanaPanel],
        },
        {
          label: 'Roteiro',
          title: 'Próximos passos de segurança e resiliência',
          paragraphs: [
            'As próximas iterações seguem o roadmap do README: incluir uma camada WAF antes do roteamento interno e evoluir detecção de anomalias de rede.',
            'O objetivo de longo prazo é consolidar uma plataforma self-hosted robusta e custo-eficiente.',
          ],
        },
      ],
    },
  },
  {
    slug: 'hirematch-ai',
    title: 'HireMatch AI',
    subtitle: 'ATS-style resume ranking and gap analysis with NLP + LLM',
    status: 'Active',
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
    pt: {
      title: 'HireMatch AI',
      subtitle: 'Ranqueamento de currículo em estilo ATS com NLP + LLM',
      status: 'Ativo',
      description:
        'Um simulador de ATS com IA que avalia aderência entre currículo e vaga, gerando score e recomendações práticas de melhoria.',
      intro:
        'O HireMatch AI transforma a opacidade do ATS em sinais claros. O usuário pode comparar com base de vagas ou enviar uma descrição de vaga personalizada.',
      overview:
        'O projeto nasceu como protótipo em cloud e está planejado para migração para o homelab. O foco é combinar ranking objetivo com explicação legível para ação.',
      flow: [
        {
          title: 'Coleta de Entrada',
          detail: 'Currículo e dados da vaga alvo são enviados pelo usuário.',
        },
        {
          title: 'Parser Semântico',
          detail: 'Habilidades e requisitos relevantes são extraídos para comparação.',
        },
        {
          title: 'Estimativa de Fit',
          detail: 'Um score em estilo ATS estima a aderência do perfil à vaga.',
        },
        {
          title: 'Orientação por LLM',
          detail: 'Recomendações narrativas explicam gaps e melhorias possíveis.',
        },
        {
          title: 'Relatório Final',
          detail: 'O usuário recebe score, pontos fortes e próximos passos priorizados.',
        },
      ],
      stats: [
        {
          label: 'Objetivo Central',
          value: 'Clareza de Fit',
          detail: 'Tornar decisões ATS mais transparentes e acionáveis.',
        },
        {
          label: 'Modos de Entrada',
          value: '2 Modos',
          detail: 'Comparação por base de vagas e por vaga personalizada.',
        },
        {
          label: 'Núcleo de IA',
          value: 'NLP + LLM',
          detail: 'Extração semântica com feedback textual orientado.',
        },
        {
          label: 'Plano de Deploy',
          value: 'Cloud -> Homelab',
          detail: 'Transição do protótipo em cloud para operação self-hosted.',
        },
      ],
      story: [
        {
          label: 'Problema',
          title: 'Transformando incerteza de ATS em sinais acionáveis',
          paragraphs: [
            'A maior parte dos candidatos recebe pouco retorno de sistemas automatizados de triagem. O HireMatch AI converte essa lógica em score transparente e recomendações diretas.',
            'O objetivo não é apenas ranquear currículos, mas explicar como e por que um perfil se aproxima ou se afasta da vaga.',
          ],
        },
        {
          label: 'Abordagem',
          title: 'Dois modos de comparação para uso prático',
          paragraphs: [
            'O usuário pode comparar com uma base existente de vagas ou enviar uma vaga personalizada. Isso atende tanto benchmark quanto preparação direcionada para uma aplicação real.',
            'A camada de scoring é combinada com feedback via LLM para manter recomendações objetivas e legíveis.',
          ],
        },
        {
          label: 'Direção da Plataforma',
          title: 'De protótipo em cloud para integração self-hosted',
          paragraphs: [
            'O projeto começou como implementação hospedada em cloud e está planejado para integrar com a stack do homelab.',
            'Esse movimento melhora controle operacional, reduz custo recorrente e aumenta a capacidade de experimentação entre infra e IA.',
          ],
        },
      ],
    },
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

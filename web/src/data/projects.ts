export interface Project {
  slug: string
  title: string
  description: string
  intro: string
  highlights: string[]
  tags: string[]
  githubUrl: string
}

export const projects: Project[] = [
  {
    slug: 'homelab-pessoal',
    title: 'Homelab Pessoal',
    description:
      'Servidor pessoal 24/7 usado para hospedar projetos e aprofundar praticas de software engineering em ambiente real.',
    intro:
      'Este homelab e minha base de experimentacao continua. Uso o ambiente para testar arquitetura, operacao e automacao de ponta a ponta antes de levar ideias para producao em outros contextos.',
    highlights: [
      'Infraestrutura virtualizada com Proxmox, VMs e containers para workloads diferentes.',
      'Pipelines de CI/CD para deploy e manutencao recorrente dos servicos.',
      'Stack de observabilidade com Grafana, Prometheus e Loki para metricas e logs centralizados.',
    ],
    tags: ['CI/CD', 'Proxmox', 'Kubernetes', 'Grafana', 'Microservices'],
    githubUrl: 'https://github.com/Netreck/myHomeLab',
  },
  {
    slug: 'hirematch-ai',
    title: 'HireMatch AI',
    description:
      'ATS com IA que compara curriculos com vagas, gera score e feedback pratico para melhorar aderencia.',
    intro:
      'O HireMatch AI nasceu para simular o fluxo de triagem de curriculos com foco em clareza para o candidato. A plataforma cruza habilidades, requisitos e contexto da vaga para produzir uma avaliacao objetiva.',
    highlights: [
      'Ranking automatico de curriculo com base em um banco de vagas.',
      'Comparacao personalizada com uma vaga enviada pelo proprio usuario.',
      'Feedback com pontos fortes, lacunas e direcoes de melhoria.',
    ],
    tags: ['Python', 'NLP', 'LLM', 'ATS', 'Resume Ranking'],
    githubUrl: 'https://github.com/Netreck/HireMatch-AI',
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

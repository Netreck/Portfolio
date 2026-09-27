import type { Language } from './projects'

interface Experience {
  role: string
  organization: string
  period: string
  highlights: string[]
  technologies?: string[]
  current?: boolean
}

interface Profile {
  greeting: string
  role: string
  studies: string
  summary: string
  experienceTitle: string
  currentLabel: string
  communityTitle: string
  educationTitle: string
  skillsTitle: string
  experience: Experience[]
  community: Experience
  education: { degree: string; completion: string }[]
  university: string
  skills: { label: string; details: string }[]
  scrollToProjects: string
  chatTitle: string
  expandedChatTitle: string
}

export const PROFILE: Record<Language, Profile> = {
  en: {
    greeting: "Hi, I'm",
    role: 'Software Engineer I — Bank of America',
    studies: 'Computer Science — Federal University of ABC (UFABC)',
    summary: 'Software engineer interested in AI agents, cloud architecture, software development and architecture, and machine learning.',
    experienceTitle: 'Professional experience',
    currentLabel: 'Current role',
    communityTitle: 'University leadership',
    educationTitle: 'Education',
    skillsTitle: 'Technical skills',
    experience: [
      {
        role: 'Software Engineer I',
        organization: 'Bank of America',
        period: 'Jun 2026 — Present',
        current: true,
        highlights: [
          'Brazil AI Lead: AI adoption and agent governance in global forums.',
          'Backend services, reusable libraries and AI agents for Brazilian payment systems.',
          'Java monitoring library and an AI assistant supporting 8+ engineers and QA professionals.',
        ],
        technologies: ['Java', 'Python', 'AI agents', 'Selenium'],
      },
      {
        role: 'Software Engineer Intern — Tech Rotation',
        organization: 'Bank of America',
        period: 'Jul 2025 — Jun 2026',
        highlights: [
          'Java frameworks, APIs and automation for financial applications.',
          'Payment software architecture and tooling for production releases.',
          'Regression and smoke tests integrated with CI/CD.',
        ],
        technologies: ['Java', 'APIs', 'GitHub Actions', 'Jenkins'],
      },
      {
        role: 'Data / Machine Learning Engineering Intern',
        organization: 'Vivo (Telefônica Brasil)',
        period: 'Jan 2025 — Jun 2025',
        highlights: [
          'LLM and machine learning automations for engineering teams.',
          'Engineering data analysis, dashboards and reports to support decisions.',
          'Process optimization using data and AI.',
        ],
        technologies: ['Python', 'SQL', 'Power BI', 'Excel', 'Machine learning'],
      },
    ],
    community: {
      role: 'Data Lead',
      organization: 'Green Team Hacker Club, UFABC',
      period: 'Jan 2024 — Dec 2025',
      highlights: ['Led data and AI projects, architecture decisions and technical mentoring with Python, PostgreSQL, ETL and RAG.'],
    },
    education: [
      { degree: 'B.Sc. Computer Science', completion: 'Expected Jun 2027' },
      { degree: 'B.Sc. Science and Technology', completion: 'Expected Dec 2026' },
    ],
    university: 'Federal University of ABC (UFABC)',
    skills: [
      { label: 'Software engineering', details: 'Java, Python, REST APIs, SQL/NoSQL, MCP, concurrent programming, design patterns, Clean Code, Node.js, JavaScript, React, HTML/CSS' },
      { label: 'Cloud, DevOps & observability', details: 'Docker, Kubernetes, Git, GitHub Actions, CI/CD, Linux, Grafana, Prometheus, Loki, monitoring' },
    ],
    scrollToProjects: 'Explore projects',
    chatTitle: 'Chat about my experience',
    expandedChatTitle: 'Conversation',
  },
  br: {
    greeting: 'Olá, eu sou',
    role: 'Engenheiro de Software I — Bank of America',
    studies: 'Ciência da Computação — Universidade Federal do ABC (UFABC)',
    summary: 'Engenheiro de software com interesse em agentes de IA, arquitetura em nuvem, desenvolvimento e arquitetura de software e machine learning.',
    experienceTitle: 'Experiência profissional',
    currentLabel: 'Cargo atual',
    communityTitle: 'Liderança universitária',
    educationTitle: 'Formação acadêmica',
    skillsTitle: 'Habilidades técnicas',
    experience: [
      {
        role: 'Engenheiro de Software I',
        organization: 'Bank of America',
        period: 'Jun 2026 — Presente',
        current: true,
        highlights: [
          'Brazil AI Lead: adoção de IA e governança de agentes em fóruns globais.',
          'Serviços backend, bibliotecas reutilizáveis e agentes de IA para pagamentos brasileiros.',
          'Biblioteca Java de monitoramento e assistente de IA para 8 ou mais profissionais de engenharia e QA.',
        ],
        technologies: ['Java', 'Python', 'Agentes de IA', 'Selenium'],
      },
      {
        role: 'Estagiário de Engenharia de Software — Tech Rotation',
        organization: 'Bank of America',
        period: 'Jul 2025 — Jun 2026',
        highlights: [
          'Frameworks Java, APIs e automação para aplicações financeiras.',
          'Arquitetura de software de pagamentos e ferramentas para releases em produção.',
          'Testes de regressão e smoke integrados ao CI/CD.',
        ],
        technologies: ['Java', 'APIs', 'GitHub Actions', 'Jenkins'],
      },
      {
        role: 'Estagiário de Dados / Engenharia de Machine Learning',
        organization: 'Vivo (Telefônica Brasil)',
        period: 'Jan 2025 — Jun 2025',
        highlights: [
          'Automações com LLMs e machine learning para equipes de engenharia.',
          'Análise de dados de engenharia, dashboards e relatórios para apoiar decisões.',
          'Otimização de processos com dados e IA.',
        ],
        technologies: ['Python', 'SQL', 'Power BI', 'Excel', 'Machine learning'],
      },
    ],
    community: {
      role: 'Líder de Dados',
      organization: 'Green Team Hacker Club, UFABC',
      period: 'Jan 2024 — Dez 2025',
      highlights: ['Liderança de projetos de dados e IA, decisões de arquitetura e mentoria técnica com Python, PostgreSQL, ETL e RAG.'],
    },
    education: [
      { degree: 'Bacharelado em Ciência da Computação', completion: 'Conclusão prevista: jun 2027' },
      { degree: 'Bacharelado em Ciência e Tecnologia', completion: 'Conclusão prevista: dez 2026' },
    ],
    university: 'Universidade Federal do ABC (UFABC)',
    skills: [
      { label: 'Engenharia de software', details: 'Java, Python, APIs REST, SQL/NoSQL, MCP, programação concorrente, padrões de projeto, Clean Code, Node.js, JavaScript, React, HTML/CSS' },
      { label: 'Nuvem, DevOps e observabilidade', details: 'Docker, Kubernetes, Git, GitHub Actions, CI/CD, Linux, Grafana, Prometheus, Loki, monitoramento' },
    ],
    scrollToProjects: 'Explorar projetos',
    chatTitle: 'Converse sobre minha experiência',
    expandedChatTitle: 'Conversa',
  },
}

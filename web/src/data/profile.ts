import type { Language } from './projects'

interface Experience {
  role: string
  organization: string
  period: string
  highlights: string[]
}

interface Profile {
  greeting: string
  role: string
  studies: string
  summary: string
  experienceTitle: string
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
    summary: 'Software engineer working with backend development, platform engineering, test automation and AI agents. I build reusable frameworks and internal SDKs with Java, Python, REST APIs, CI/CD, observability and cloud infrastructure.',
    experienceTitle: 'Professional experience',
    communityTitle: 'University leadership',
    educationTitle: 'Education',
    skillsTitle: 'Technical skills',
    experience: [
      {
        role: 'Software Engineer I',
        organization: 'Bank of America',
        period: 'Jun 2026 — Present',
        highlights: [
          'Brazil AI Lead: representing Brazil Payments Technology in weekly global forums, contributing to the adoption of frontier AI models and tools and reviewing governance standards for AI agents.',
          'Building backend services, internal applications, reusable libraries and AI agents in the Global Payments Systems team for business-critical Brazilian payment systems.',
          'Designing scalable automation and platform solutions for QA, Release Management and engineering workflows, focusing on reliability, maintainability and performance.',
          'Architected a reusable Java monitoring library integrated with an enterprise Selenium framework to centralize execution telemetry.',
          'Built an AI engineering assistant combining technical documentation, system architecture and business workflows to support 8+ engineers and QA professionals.',
        ],
      },
      {
        role: 'Software Engineer Intern — Tech Rotation',
        organization: 'Bank of America',
        period: 'Jul 2025 — Jun 2026',
        highlights: [
          'Developed Java frameworks, APIs, internal platforms and end-to-end automation for enterprise financial applications.',
          'Contributed to payment software architecture, evaluating scalable designs and integrations for throughput, reliability and transaction performance.',
          'Automated regression and smoke tests with GitHub Actions and Jenkins CI/CD, and developed tooling for production release operations.',
        ],
      },
    ],
    community: {
      role: 'Data Lead',
      organization: 'Green Team Hacker Club, UFABC',
      period: 'Jan 2024 — Dec 2025',
      highlights: ['Led data and AI projects using Python, PostgreSQL, ETL, RAG, machine learning and backend services, including architecture decisions and technical mentoring.'],
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
    summary: 'Engenheiro de software com atuação em desenvolvimento backend, engenharia de plataforma, automação de testes e agentes de IA. Desenvolvo frameworks reutilizáveis e SDKs internos com Java, Python, APIs REST, CI/CD, observabilidade e infraestrutura em nuvem.',
    experienceTitle: 'Experiência profissional',
    communityTitle: 'Liderança universitária',
    educationTitle: 'Formação acadêmica',
    skillsTitle: 'Habilidades técnicas',
    experience: [
      {
        role: 'Engenheiro de Software I',
        organization: 'Bank of America',
        period: 'Jun 2026 — Presente',
        highlights: [
          'Brazil AI Lead: representante de Brazil Payments Technology em fóruns globais semanais, contribuindo para a adoção de modelos e ferramentas de IA de ponta e revisando padrões de governança para agentes de IA.',
          'Desenvolvimento de serviços backend, aplicações internas, bibliotecas reutilizáveis e agentes de IA na equipe Global Payments Systems para sistemas críticos de pagamentos brasileiros.',
          'Projeto de soluções escaláveis de automação e plataforma para QA, gestão de releases e fluxos de engenharia, com foco em confiabilidade, manutenibilidade e desempenho.',
          'Arquitetura de uma biblioteca Java reutilizável de monitoramento, integrada a um framework corporativo de Selenium para centralizar a telemetria de execução.',
          'Desenvolvimento de um assistente de engenharia com IA que combina documentação técnica, arquitetura de sistemas e fluxos de negócio para apoiar 8 ou mais profissionais de engenharia e QA.',
        ],
      },
      {
        role: 'Estagiário de Engenharia de Software — Tech Rotation',
        organization: 'Bank of America',
        period: 'Jul 2025 — Jun 2026',
        highlights: [
          'Desenvolvimento de frameworks Java, APIs, plataformas internas e automação de ponta a ponta para aplicações financeiras corporativas.',
          'Contribuição à arquitetura de software de pagamentos, avaliando projetos e integrações escaláveis com foco em capacidade de processamento, confiabilidade e desempenho das transações.',
          'Automação de testes de regressão e smoke com GitHub Actions e Jenkins CI/CD e desenvolvimento de ferramentas para operações de release em produção.',
        ],
      },
    ],
    community: {
      role: 'Líder de Dados',
      organization: 'Green Team Hacker Club, UFABC',
      period: 'Jan 2024 — Dez 2025',
      highlights: ['Liderança de projetos de dados e IA com Python, PostgreSQL, ETL, RAG, aprendizado de máquina e serviços backend, incluindo decisões de arquitetura e mentoria técnica.'],
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

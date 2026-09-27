import type { Language } from '../../data/projects'

interface LandingCopy {
  nav: { about: string; experience: string; projects: string; chat: string; contact: string }
  switchTo: { en: string; br: string }
  grounding: string
  suggestionsLabel: string
  send: string
  newQuestion: string
  sources: string
  today: string
  expected: string
  roles: string
  projectsTitle: string
  projectsIntro: string
  caseStudy: string
  code: string
  online: string
  offline: string
  closeTitle: string
  closeLead: string
  proof: string
  proofLink: string
  askAgain: string
}

export const LANDING: Record<Language, LandingCopy> = {
  en: {
    nav: { about: 'About', experience: 'Experience', projects: 'Projects', chat: 'Chat', contact: 'Contact' },
    switchTo: { en: 'Switch language to English', br: 'Mudar idioma para Português' },
    grounding: 'A RAG chatbot that answers from my resume and project write-ups.',
    suggestionsLabel: 'Suggested questions',
    send: 'Send question',
    newQuestion: 'Ask another question',
    sources: 'Sources',
    today: 'Today',
    expected: 'expected',
    roles: 'Roles on a timeline',
    projectsTitle: 'Real projects focused on infrastructure reliability and practical AI applications',
    projectsIntro:
      'These case studies document how I design systems end-to-end, from platform architecture and observability to model-driven product decisions.',
    caseStudy: 'Explore case study',
    code: 'Code on GitHub',
    online: 'Online',
    offline: 'Offline',
    closeTitle: "Let's talk",
    closeLead: 'Email is the fastest way to reach me.',
    proof:
      'This site runs on my homelab: a Proxmox server at home behind a small VPS edge, deployed through GitHub Actions.',
    proofLink: 'See how it is built',
    askAgain: 'Or ask the chatbot',
  },
  br: {
    nav: { about: 'Sobre', experience: 'Experiência', projects: 'Projetos', chat: 'Chat', contact: 'Contato' },
    switchTo: { en: 'Switch language to English', br: 'Mudar idioma para Português' },
    grounding: 'Um chatbot RAG que responde a partir do meu currículo e dos meus projetos.',
    suggestionsLabel: 'Perguntas sugeridas',
    send: 'Enviar pergunta',
    newQuestion: 'Fazer outra pergunta',
    sources: 'Fontes',
    today: 'Hoje',
    expected: 'previsto',
    roles: 'Cargos na linha do tempo',
    projectsTitle: 'Projetos reais focados em confiabilidade, arquitetura e aplicações práticas de IA',
    projectsIntro:
      'Esses projetos demonstram minha capacidade de atuar de ponta a ponta no design de sistemas, incluindo arquitetura de plataformas, observabilidade e desenvolvimento de aplicações em Data Engineering e Machine Learning.',
    caseStudy: 'Explorar case study',
    code: 'Código no GitHub',
    online: 'Online',
    offline: 'Offline',
    closeTitle: 'Vamos conversar',
    closeLead: 'E-mail é o jeito mais rápido de falar comigo.',
    proof:
      'Este site roda no meu homelab: um servidor Proxmox em casa, atrás de uma VPS de borda, com deploy via GitHub Actions.',
    proofLink: 'Veja como foi construído',
    askAgain: 'Ou pergunte ao chatbot',
  },
}

export const CONTACT = {
  email: 'gabrielvgonc@gmail.com',
  github: 'https://github.com/Netreck',
  linkedin: 'https://www.linkedin.com/in/gabriel-victor-71187b223',
}

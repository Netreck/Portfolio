import type { Language } from './projects'

// Source of truth: github.com/Netreck/HireMatch-AI (src/api/services, support/, data/, notebook).

export const HIREMATCH_REPO = 'https://github.com/Netreck/HireMatch-AI'
export const HIREMATCH_APP = 'https://hirematch-ai-prod-820168498062.southamerica-east1.run.app'

export interface ScoreSegment {
  weight: number
  tone: 'cobalt' | 'ink' | 'tint'
  label: Record<Language, string>
}

export interface ScoreMode {
  id: 'dataset' | 'custom'
  title: Record<Language, string>
  endpoint: string
  segments: ScoreSegment[]
  note: Record<Language, string>
}

export const SCORE_MODES: ScoreMode[] = [
  {
    id: 'dataset',
    title: { en: 'Against the job dataset', br: 'Contra a base de vagas' },
    endpoint: 'POST /api/match',
    segments: [
      { weight: 70, tone: 'cobalt', label: { en: 'Semantic similarity', br: 'Similaridade semântica' } },
      { weight: 10, tone: 'ink', label: { en: 'Tech stack coverage', br: 'Cobertura de tech stack' } },
      { weight: 20, tone: 'tint', label: { en: 'Soft skill coverage', br: 'Cobertura de soft skills' } },
    ],
    note: {
      en: 'Cosine similarity between the resume and job embeddings, min-max normalized across the top 50 matches, then blended with the two coverage ratios.',
      br: 'Similaridade de cosseno entre os embeddings do currículo e da vaga, normalizada (min-max) entre os 50 melhores resultados e combinada com as duas coberturas.',
    },
  },
  {
    id: 'custom',
    title: { en: 'Against a pasted job', br: 'Contra uma vaga colada' },
    endpoint: 'POST /api/parse-job',
    segments: [
      { weight: 60, tone: 'ink', label: { en: 'Tech stack coverage', br: 'Cobertura de tech stack' } },
      { weight: 40, tone: 'tint', label: { en: 'Soft skill coverage', br: 'Cobertura de soft skills' } },
    ],
    note: {
      en: 'No embedding here: a single pasted job has no neighbours to normalize against, so the score is the weighted share of the job’s required categories found in the resume.',
      br: 'Sem embedding aqui: uma vaga colada sozinha não tem vizinhas para normalizar, então a nota é a fração ponderada das categorias exigidas pela vaga encontradas no currículo.',
    },
  },
]

export interface FeatureStep {
  title: string
  detail: Record<Language, string>
}

export interface Feature {
  id: string
  online: boolean
  endpoint: string
  question: Record<Language, string>
  technique: Record<Language, string>
  summary: Record<Language, string>
  steps: FeatureStep[]
}

export const FEATURES: Feature[] = [
  {
    id: 'matching',
    online: false,
    endpoint: 'POST /api/match',
    question: { en: 'How does it find matching jobs?', br: 'Como ele encontra vagas compatíveis?' },
    technique: { en: 'Dense retrieval with embeddings', br: 'Busca densa com embeddings' },
    summary: {
      en: 'Jobs were pulled from the Remotive API, filtered to tech roles and embedded once. A resume is embedded with the same model and the nearest jobs are retrieved by cosine similarity. The dataset is frozen, so this flow is off.',
      br: 'As vagas vieram da Remotive API, filtradas para áreas tech, e foram vetorizadas uma vez. O currículo é vetorizado com o mesmo modelo e as vagas mais próximas são buscadas por similaridade de cosseno. A base está congelada, então esse fluxo está desligado.',
    },
    steps: [
      { title: 'Remotive API', detail: { en: '347 remote tech jobs, cleaned and tagged', br: '347 vagas remotas de tecnologia, limpas e marcadas' } },
      { title: 'text-embedding-3-large', detail: { en: '3072-dimension vectors (OpenAI)', br: 'Vetores de 3072 dimensões (OpenAI)' } },
      { title: 'Pinecone', detail: { en: 'Serverless index, cosine metric, top 50', br: 'Índice serverless, métrica cosseno, top 50' } },
      { title: 'Supabase', detail: { en: 'Job details fetched by the returned IDs', br: 'Detalhes das vagas buscados pelos IDs retornados' } },
      { title: 'Score', detail: { en: '70 / 10 / 20 blend per job', br: 'Combinação 70 / 10 / 20 por vaga' } },
    ],
  },
  {
    id: 'custom',
    online: true,
    endpoint: 'POST /api/parse-job',
    question: { en: 'How does it score a job I paste?', br: 'Como ele dá nota para uma vaga que eu colo?' },
    technique: { en: 'Lexicon-based skill extraction', br: 'Extração de skills por léxico' },
    summary: {
      en: 'Both texts are scanned against two curated lexicons that map surface variations to canonical categories, so “k8s” and “Kubernetes” count as the same thing. Coverage is the share of the job’s categories the resume also contains.',
      br: 'Os dois textos são varridos com dois léxicos curados que mapeiam variações para categorias canônicas, então “k8s” e “Kubernetes” contam como a mesma coisa. A cobertura é a fração das categorias da vaga que o currículo também contém.',
    },
    steps: [
      { title: 'Tech lexicon', detail: { en: '20 categories, 389 variations', br: '20 categorias, 389 variações' } },
      { title: 'Soft skill lexicon', detail: { en: '19 categories, 117 variations', br: '19 categorias, 117 variações' } },
      { title: 'Coverage', detail: { en: 'Job categories found in the resume', br: 'Categorias da vaga encontradas no currículo' } },
      { title: 'Score', detail: { en: '60 / 40 blend', br: 'Combinação 60 / 40' } },
    ],
  },
  {
    id: 'feedback',
    online: true,
    endpoint: 'POST /api/analysis',
    question: { en: 'How does it explain the score?', br: 'Como ele explica a nota?' },
    technique: { en: 'LLM with a structured output schema', br: 'LLM com saída estruturada' },
    summary: {
      en: 'A LangChain chain sends the resume and the job to the LLM at temperature 0 and parses the reply into a fixed Pydantic schema. The prompt forbids inferring anything the resume does not literally say.',
      br: 'Uma chain do LangChain envia currículo e vaga ao LLM com temperatura 0 e converte a resposta em um schema Pydantic fixo. O prompt proíbe deduzir qualquer coisa que o currículo não diga literalmente.',
    },
    steps: [
      { title: 'Grounded prompt', detail: { en: 'Literal resume + job; inference is forbidden', br: 'Currículo + vaga literais; dedução é proibida' } },
      { title: 'gpt-4.1-nano', detail: { en: 'Temperature 0 through LangChain', br: 'Temperatura 0 via LangChain' } },
      { title: 'Pydantic parser', detail: { en: 'Reply validated against a fixed schema', br: 'Resposta validada contra um schema fixo' } },
      { title: 'Feedback', detail: { en: 'Strengths, gaps, suggestions', br: 'Pontos fortes, lacunas, sugestões' } },
    ],
  },
  {
    id: 'adapt',
    online: true,
    endpoint: 'POST /api/adapt',
    question: { en: 'How does it rewrite the resume?', br: 'Como ele reescreve o currículo?' },
    technique: { en: 'Constrained generation into LaTeX', br: 'Geração restrita em LaTeX' },
    summary: {
      en: 'The LLM rewrites the resume for the job inside a fixed LaTeX template, in English, keeping every command and section and adding no experience that was not in the original.',
      br: 'O LLM reescreve o currículo para a vaga dentro de um template LaTeX fixo, em inglês, mantendo todos os comandos e seções e sem acrescentar experiências que não estavam no original.',
    },
    steps: [
      { title: 'gpt-4.1', detail: { en: 'Resume + job description in', br: 'Entra currículo + descrição da vaga' } },
      { title: 'resume.cls template', detail: { en: 'Structure preserved, content optimized', br: 'Estrutura preservada, conteúdo otimizado' } },
      { title: '.tex out', detail: { en: 'Downloaded as .tex, or PDF when compiled', br: 'Baixado como .tex, ou PDF quando compilado' } },
    ],
  },
]

export const RUNTIME: { part: Record<Language, string>; value: Record<Language, string> }[] = [
  { part: { en: 'Hosting', br: 'Hospedagem' }, value: { en: 'Google Cloud Run, southamerica-east1', br: 'Google Cloud Run, southamerica-east1' } },
  { part: { en: 'Scaling', br: 'Escala' }, value: { en: 'Scales to zero; the container sleeps until a request arrives', br: 'Escala a zero; o container dorme até chegar uma requisição' } },
  { part: { en: 'Container', br: 'Container' }, value: { en: 'One image: FastAPI serves the API and the built React app', br: 'Uma imagem: o FastAPI serve a API e o app React compilado' } },
  { part: { en: 'Vector store', br: 'Banco vetorial' }, value: { en: 'Pinecone serverless on AWS us-east-1 (hirematch-jobs, cosine, 3072 d); used only by the offline dataset flow', br: 'Pinecone serverless na AWS us-east-1 (hirematch-jobs, cosseno, 3072 d); usado só pelo fluxo offline da base' } },
  { part: { en: 'Job store', br: 'Banco de vagas' }, value: { en: 'Supabase (Postgres); used only by the offline dataset flow', br: 'Supabase (Postgres); usado só pelo fluxo offline da base' } },
  { part: { en: 'Models', br: 'Modelos' }, value: { en: 'OpenAI text-embedding-3-large, gpt-4.1, gpt-4.1-nano', br: 'OpenAI text-embedding-3-large, gpt-4.1, gpt-4.1-nano' } },
]

export const HIREMATCH_COPY: Record<
  Language,
  {
    back: string
    title: string
    thesis: string
    facts: { label: string; value: string }[]
    repo: string
    openApp: string
    coldStart: string
    archivedTitle: string
    archived: string
    questionsLabel: string
    scoreQuestion: string
    scoreIntro: string
    scaleNote: string
    example: string
    runtimeQuestion: string
    online: string
    offline: string
    feedbackCaption: string
    feedbackAlt: string
    statusQuestion: string
    statusText: string
  }
> = {
  en: {
    back: 'Back to portfolio',
    title: 'HireMatch AI',
    thesis:
      'An ATS-style resume matcher: it scores a resume against a job, explains the score with an LLM and rewrites the resume for that job.',
    facts: [
      { label: 'Status', value: 'Offline' },
      { label: 'Runtime', value: 'Cloud Run, scale to zero' },
      { label: 'Job dataset', value: '347 jobs, frozen' },
      { label: 'Built for', value: 'NLP course, UFABC' },
    ],
    repo: 'Repository on GitHub',
    openApp: 'Open the app',
    coldStart: 'The container sleeps when idle, so the first request takes a few seconds.',
    archivedTitle: 'Archived project',
    archived:
      'The job dataset is no longer refreshed, so matching against it is off. The only flow that still works is scoring a job description you paste in, with its feedback and the adapted resume.',
    questionsLabel: 'Questions',
    scoreQuestion: 'How is a resume scored?',
    scoreIntro:
      'Every score is a weighted sum out of 100. Each square below is one point.',
    scaleNote: 'Coverage terms read 1 when the job lists no categories of that kind.',
    example:
      'Example for a pasted job: it asks for 5 tech categories and 3 soft ones; the resume covers 4 and 2. Score = 60 × 4/5 + 40 × 2/3 = 48 + 26.7 = 74.7.',
    runtimeQuestion: 'Where does it run?',
    online: 'Online',
    offline: 'Offline',
    feedbackCaption: 'Result screen (the app UI is in Portuguese): the 64% compatibility score with the LLM’s strengths, gaps and suggestions.',
    feedbackAlt: 'HireMatch result screen showing a 64% compatibility score, strengths, gaps and suggestions',
    statusQuestion: 'What is its status?',
    statusText:
      'HireMatch was the final project of the Natural Language Processing course at UFABC (2025, Q3). It is finished: there are no further plans for it. It stays deployed on Cloud Run, asleep until someone opens it.',
  },
  br: {
    back: 'Voltar ao portfólio',
    title: 'HireMatch AI',
    thesis:
      'Um avaliador de currículos no estilo ATS: dá nota a um currículo contra uma vaga, explica a nota com um LLM e reescreve o currículo para essa vaga.',
    facts: [
      { label: 'Status', value: 'Offline' },
      { label: 'Execução', value: 'Cloud Run, escala a zero' },
      { label: 'Base de vagas', value: '347 vagas, congelada' },
      { label: 'Feito para', value: 'Disciplina de PLN, UFABC' },
    ],
    repo: 'Repositório no GitHub',
    openApp: 'Abrir o app',
    coldStart: 'O container dorme quando ocioso, então o primeiro acesso leva alguns segundos.',
    archivedTitle: 'Projeto arquivado',
    archived:
      'A base de vagas não é mais atualizada, então o matching contra ela está desligado. O único fluxo que ainda funciona é dar nota a uma vaga que você cola, com o feedback e o currículo adaptado.',
    questionsLabel: 'Perguntas',
    scoreQuestion: 'Como o currículo recebe a nota?',
    scoreIntro:
      'Toda nota é uma soma ponderada de 0 a 100. Cada quadrado abaixo vale um ponto.',
    scaleNote: 'As coberturas valem 1 quando a vaga não lista nenhuma categoria daquele tipo.',
    example:
      'Exemplo com vaga colada: ela pede 5 categorias técnicas e 3 comportamentais; o currículo cobre 4 e 2. Nota = 60 × 4/5 + 40 × 2/3 = 48 + 26,7 = 74,7.',
    runtimeQuestion: 'Onde ele roda?',
    online: 'Online',
    offline: 'Offline',
    feedbackCaption: 'Tela de resultado: nota de compatibilidade de 64% com pontos fortes, lacunas e sugestões do LLM.',
    feedbackAlt: 'Tela de resultado do HireMatch com nota de 64%, pontos fortes, lacunas e sugestões',
    statusQuestion: 'Qual é o status dele?',
    statusText:
      'O HireMatch foi o projeto final da disciplina de Processamento de Linguagem Natural da UFABC (2025, Q3). Ele está concluído: não há planos futuros. Continua publicado no Cloud Run, dormindo até alguém abri-lo.',
  },
}

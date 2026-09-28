import type { Language } from './projects'

// Source: CI/CD.md (operational guide, updated 2026-09-27) and .github/workflows/*.yml.
// Runner service names, users and disk paths are intentionally left out.

export type Env = 'dev' | 'prod'

type T = Record<Language, string>

export interface EnvRoute {
  env: Env
  branch: string
  workflow: string
  label: string
  machine: string
  address: string
  role: T
}

export const ROUTES: EnvRoute[] = [
  {
    env: 'dev',
    branch: 'Dev',
    workflow: 'Dev CI/CD',
    label: 'dev',
    machine: 'CT109',
    address: '10.10.20.16',
    role: { en: 'Development', br: 'Desenvolvimento' },
  },
  {
    env: 'prod',
    branch: 'main',
    workflow: 'Prod CI/CD',
    label: 'prod',
    machine: 'CT108',
    address: '10.10.20.15',
    role: { en: 'Production', br: 'Produção' },
  },
]

export type SiteState = 'up' | 'down'

export interface PipelineStep {
  title: T
  command?: string
  site: SiteState
}

// The exact order both workflows run, one job: rebuild-and-ingest.
export const STEPS: PipelineStep[] = [
  { title: { en: 'Check out the commit', br: 'Checkout do commit' }, command: 'actions/checkout@v4', site: 'up' },
  { title: { en: 'Write .env from a secret', br: 'Gerar .env a partir de um secret' }, command: 'secrets.ENV_FILE → .env', site: 'up' },
  { title: { en: 'Check Docker and Compose', br: 'Validar Docker e Compose' }, command: 'docker --version · docker compose version', site: 'up' },
  { title: { en: 'Stop the current stack', br: 'Derrubar a stack atual' }, command: 'docker compose down', site: 'down' },
  { title: { en: 'Clear build cache and images', br: 'Limpar cache e imagens' }, command: 'docker builder prune -af · docker image prune -af', site: 'down' },
  { title: { en: 'Build the RAG API, no cache', br: 'Build da API RAG, sem cache' }, command: 'docker compose build --no-cache rag-api', site: 'down' },
  { title: { en: 'Build the web app, no cache', br: 'Build do app web, sem cache' }, command: 'docker compose build --no-cache web', site: 'down' },
  { title: { en: 'Start the new stack', br: 'Subir a stack nova' }, command: 'docker compose up -d', site: 'up' },
  { title: { en: 'Wait for the services', br: 'Aguardar os serviços' }, command: 'sleep 15', site: 'up' },
  { title: { en: 'Copy the RAG documents in', br: 'Copiar os documentos do RAG' }, command: 'docker compose cp rag/data/uploads/. rag-api:…', site: 'up' },
  { title: { en: 'Reindex the vector collection', br: 'Reindexar a coleção vetorial' }, command: 'ingest_uploads_to_vector_db(reset_collection=True)', site: 'up' },
]

export interface YamlLine {
  text: (env: EnvRoute) => string
  marker?: number
}

export const YAML: YamlLine[] = [
  { text: () => 'on:' },
  { text: () => '  push:' },
  { text: (r) => `    branches: [${r.branch}]`, marker: 1 },
  { text: () => '  workflow_dispatch:', marker: 2 },
  { text: () => '' },
  { text: () => 'concurrency:' },
  { text: (r) => `  group: ${r.env}-cicd-\${{ github.ref }}` },
  { text: () => '  cancel-in-progress: true', marker: 3 },
  { text: () => '' },
  { text: () => 'jobs:' },
  { text: () => '  rebuild-and-ingest:' },
  { text: (r) => `    runs-on: [self-hosted, linux, ${r.label}]`, marker: 4 },
]

export const BRANCH_NOTE: Record<Env, T> = {
  dev: { en: 'A push to Dev starts the DEV deploy. The branch is Dev with a capital D; dev is a different branch in Git.', br: 'Um push em Dev inicia o deploy de DEV. A branch é Dev com D maiúsculo; dev é outra branch no Git.' },
  prod: { en: 'A push or merge to main starts the production deploy.', br: 'Um push ou merge em main inicia o deploy de produção.' },
}

// Notes 2–4; note 1 is BRANCH_NOTE for the selected environment.
export const YAML_NOTES: T[] = [
  { en: 'The same workflow can be started by hand from the Actions tab, on the ref I choose.', br: 'O mesmo workflow pode ser iniciado à mão pela aba Actions, na ref que eu escolher.' },
  { en: 'Two deploys of the same ref never overlap: a newer push cancels the one in progress.', br: 'Dois deploys da mesma ref nunca se sobrepõem: um push mais novo cancela o que está em andamento.' },
  { en: 'The label, not the runner’s name, picks the machine that runs the job.', br: 'É a label, e não o nome do runner, que escolhe a máquina que executa o job.' },
]

export interface Tradeoff {
  title: T
  why: T
  cost: T
}

export const TRADEOFFS: Tradeoff[] = [
  {
    title: { en: 'Stop, then start', br: 'Derrubar e depois subir' },
    why: { en: 'The job stops the running stack, clears it and only then starts the freshly built one, always in that order.', br: 'O job derruba a stack em execução, limpa tudo e só então sobe a recém-construída, sempre nessa ordem.' },
    cost: { en: 'A short window where the environment being deployed is offline.', br: 'Uma janela curta em que o ambiente publicado fica fora do ar.' },
  },
  {
    title: { en: 'Every build from scratch', br: 'Todo build do zero' },
    why: { en: 'No cached layers and no leftover images: what runs is exactly what the commit describes.', br: 'Sem camadas em cache e sem imagens antigas: o que roda é exatamente o que o commit descreve.' },
    cost: { en: 'Slower deploys; it is never an incremental update.', br: 'Deploys mais lentos; nunca é uma atualização incremental.' },
  },
  {
    title: { en: 'The chatbot’s knowledge is rebuilt', br: 'O conhecimento do chatbot é recriado' },
    why: { en: 'The vector collection is reset and re-ingested from the documents in the repo, so answers always match the committed files.', br: 'A coleção vetorial é zerada e reindexada a partir dos documentos do repositório, então as respostas sempre batem com os arquivos versionados.' },
    cost: { en: 'A failure right after the reset can leave the RAG empty until the next deploy.', br: 'Uma falha logo após o reset pode deixar o RAG vazio até o próximo deploy.' },
  },
  {
    title: { en: 'A green job is not a health check', br: 'Job verde não é health check' },
    why: { en: 'The workflow proves the commands finished. I verify the UI, the proxy and a real RAG answer myself after each deploy.', br: 'O workflow prova que os comandos terminaram. Eu verifico a UI, o proxy e uma resposta real do RAG depois de cada deploy.' },
    cost: { en: 'No tests, HTTP smoke test or automatic rollback in the pipeline yet.', br: 'Ainda não há testes, smoke test HTTP nem rollback automático no pipeline.' },
  },
  {
    title: { en: 'One secret for configuration', br: 'Um secret para a configuração' },
    why: { en: 'The .env is always written from a GitHub secret, so no configuration lives in the repo or is edited by hand on the machine.', br: 'O .env sempre é gerado a partir de um secret do GitHub, então nenhuma configuração fica no repositório nem é editada à mão na máquina.' },
    cost: { en: 'DEV and PROD read the same secret; nothing in the workflow keeps their configuration apart. Next step: GitHub Environments with a protected secret per environment.', br: 'DEV e PROD leem o mesmo secret; nada no workflow separa a configuração dos dois. Próximo passo: GitHub Environments com um secret protegido por ambiente.' },
  },
]

export const PROMOTION: T[] = [
  { en: 'Work and test on the Dev branch', br: 'Trabalhar e testar na branch Dev' },
  { en: 'Push to Dev: Dev CI/CD rebuilds CT109', br: 'Push em Dev: o Dev CI/CD reconstrói o CT109' },
  { en: 'Test the UI, the RAG endpoint and the reindexed documents on DEV', br: 'Testar a UI, o endpoint do RAG e os documentos reindexados no DEV' },
  { en: 'Open and merge a PR into main, with the PROD runner online', br: 'Abrir e mesclar o PR para main, com o runner de PROD online' },
  { en: 'The push to main runs Prod CI/CD on CT108', br: 'O push em main roda o Prod CI/CD no CT108' },
  { en: 'Test the published URL, the UI and a real RAG question', br: 'Testar a URL publicada, a UI e uma pergunta real ao RAG' },
]

export const CHECKS: { command: string; expect: T }[] = [
  { command: 'systemctl is-active <runner service>', expect: { en: 'active', br: 'active' } },
  { command: "journalctl -u <runner service> --since '15 minutes ago'", expect: { en: 'Connected to GitHub · Listening for Jobs', br: 'Connected to GitHub · Listening for Jobs' } },
  { command: "docker ps --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}'", expect: { en: 'portfolio-web on 8080 and portfolio-rag-api on 8000, both Up', br: 'portfolio-web na 8080 e portfolio-rag-api na 8000, ambos Up' } },
  { command: 'curl -sSIL https://cdn.gabriel-goncalves.com', expect: { en: 'HTTP 200', br: 'HTTP 200' } },
]

export const CICD_COPY: Record<
  Language,
  {
    back: string
    title: string
    thesis: string
    facts: { label: string; value: string }[]
    routingTitle: string
    routingText: string
    routingHead: { branch: string; workflow: string; label: string; machine: string }
    envToggle: string
    pipelineTitle: string
    pipelineText: string
    replay: string
    play: string
    pause: string
    siteLabel: string
    siteUp: string
    siteDown: string
    stepsNote: string
    concurrencyTitle: string
    concurrencyText: string
    runA: string
    runB: string
    running: string
    cancelled: string
    succeeded: string
    yamlTitle: string
    promoteTitle: string
    tradeoffsTitle: string
    tradeoffWhy: string
    tradeoffCost: string
    checksTitle: string
    checksText: string
  }
> = {
  en: {
    back: 'Back to portfolio',
    title: 'How I ship this portfolio with CI/CD',
    thesis:
      'A push rebuilds the whole stack inside the target machine in my homelab: GitHub Actions hands the job to a self-hosted runner, which builds the Docker images locally and brings them up with Compose. No registry in between.',
    facts: [
      { label: 'Stack', value: 'GitHub Actions · self-hosted runners · Docker Compose · Proxmox LXC' },
      { label: 'Environments', value: 'DEV on CT109 · PROD on CT108' },
      { label: 'Result', value: 'git push → rebuilt and live' },
    ],
    routingTitle: 'The branch picks the workflow, the label picks the machine',
    routingText: 'Each environment has its own runner inside its own container. The job lands on whichever runner carries the matching label.',
    routingHead: { branch: 'Branch', workflow: 'Workflow', label: 'runs-on label', machine: 'Machine' },
    envToggle: 'Environment',
    pipelineTitle: 'A deploy, step by step',
    pipelineText: 'The job’s route lights up above; here are its eleven steps. The Site indicator shows when the environment is reachable.',
    replay: 'Replay',
    play: 'Play',
    pause: 'Pause',
    siteLabel: 'Site',
    siteUp: 'Up',
    siteDown: 'Down',
    stepsNote: 'The order is exact; the pace is illustrative, not measured.',
    concurrencyTitle: 'Two pushes, one deploy',
    concurrencyText: 'If I push again while a deploy is running, the newer commit wins and the older run is cancelled.',
    runA: 'Push A',
    runB: 'Push B',
    running: 'Running',
    cancelled: 'Cancelled',
    succeeded: 'Deployed',
    yamlTitle: 'The four lines that decide everything',
    promoteTitle: 'From Dev to production',
    tradeoffsTitle: 'What I traded, and why',
    tradeoffWhy: 'Why',
    tradeoffCost: 'Cost',
    checksTitle: 'How I check a deploy',
    checksText: 'A runner only counts as ready when it is active, connected and listening; a deploy only counts when the public URL answers.',
  },
  br: {
    back: 'Voltar ao portfólio',
    title: 'Como faço o CI/CD deste portfólio',
    thesis:
      'Um push reconstrói a stack inteira dentro da máquina de destino no meu homelab: o GitHub Actions entrega o job a um runner self-hosted, que faz o build das imagens Docker localmente e sobe tudo com o Compose. Sem registry no meio.',
    facts: [
      { label: 'Stack', value: 'GitHub Actions · runners self-hosted · Docker Compose · LXC no Proxmox' },
      { label: 'Ambientes', value: 'DEV no CT109 · PROD no CT108' },
      { label: 'Resultado', value: 'git push → reconstruído e no ar' },
    ],
    routingTitle: 'A branch escolhe o workflow, a label escolhe a máquina',
    routingText: 'Cada ambiente tem o seu runner dentro do seu próprio container. O job cai no runner que tem a label correspondente.',
    routingHead: { branch: 'Branch', workflow: 'Workflow', label: 'Label runs-on', machine: 'Máquina' },
    envToggle: 'Ambiente',
    pipelineTitle: 'Um deploy, passo a passo',
    pipelineText: 'A rota do job acende acima; aqui estão as suas onze etapas. O indicador Site mostra quando o ambiente está acessível.',
    replay: 'Repetir',
    play: 'Rodar',
    pause: 'Pausar',
    siteLabel: 'Site',
    siteUp: 'No ar',
    siteDown: 'Fora',
    stepsNote: 'A ordem é exata; o ritmo é ilustrativo, não medido.',
    concurrencyTitle: 'Dois pushes, um deploy',
    concurrencyText: 'Se eu fizer outro push com um deploy rodando, o commit mais novo vence e a execução antiga é cancelada.',
    runA: 'Push A',
    runB: 'Push B',
    running: 'Rodando',
    cancelled: 'Cancelado',
    succeeded: 'Publicado',
    yamlTitle: 'As quatro linhas que decidem tudo',
    promoteTitle: 'Do Dev para a produção',
    tradeoffsTitle: 'O que eu troquei, e por quê',
    tradeoffWhy: 'Por quê',
    tradeoffCost: 'Custo',
    checksTitle: 'Como eu confiro um deploy',
    checksText: 'Um runner só conta como pronto quando está ativo, conectado e ouvindo; um deploy só conta quando a URL pública responde.',
  },
}

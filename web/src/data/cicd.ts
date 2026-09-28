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

export type Job = 'test' | 'deploy'

export interface PipelineStep {
  title: T
  command?: string
  site: SiteState
  job: Job
}

// The exact order both workflows run: the reusable test job (ci.yml), then
// rebuild-and-ingest, which declares needs: test and only starts if it passed.
export const STEPS: PipelineStep[] = [
  { job: 'test', title: { en: 'Check out and set up Node 20', br: 'Checkout e setup do Node 20' }, command: 'actions/setup-node@v4 · cache: npm', site: 'up' },
  { job: 'test', title: { en: 'Install dependencies', br: 'Instalar dependências' }, command: 'npm ci', site: 'up' },
  { job: 'test', title: { en: 'Run the unit tests', br: 'Rodar os testes unitários' }, command: 'npm test', site: 'up' },
  { job: 'test', title: { en: 'Typecheck and build', br: 'Typecheck e build' }, command: 'npm run build', site: 'up' },
  { job: 'deploy', title: { en: 'Check out the commit', br: 'Checkout do commit' }, command: 'actions/checkout@v4', site: 'up' },
  { job: 'deploy', title: { en: 'Write .env from a secret', br: 'Gerar .env a partir de um secret' }, command: 'secrets.ENV_FILE → .env', site: 'up' },
  { job: 'deploy', title: { en: 'Check Docker and Compose', br: 'Validar Docker e Compose' }, command: 'docker --version · docker compose version', site: 'up' },
  { job: 'deploy', title: { en: 'Stop the current stack', br: 'Derrubar a stack atual' }, command: 'docker compose down', site: 'down' },
  { job: 'deploy', title: { en: 'Clear build cache and images', br: 'Limpar cache e imagens' }, command: 'docker builder prune -af · docker image prune -af', site: 'down' },
  { job: 'deploy', title: { en: 'Build the RAG API, no cache', br: 'Build da API RAG, sem cache' }, command: 'docker compose build --no-cache rag-api', site: 'down' },
  { job: 'deploy', title: { en: 'Build the web app, no cache', br: 'Build do app web, sem cache' }, command: 'docker compose build --no-cache web', site: 'down' },
  { job: 'deploy', title: { en: 'Start the new stack', br: 'Subir a stack nova' }, command: 'docker compose up -d', site: 'up' },
  { job: 'deploy', title: { en: 'Wait for the services', br: 'Aguardar os serviços' }, command: 'sleep 15', site: 'up' },
  { job: 'deploy', title: { en: 'Copy the RAG documents in', br: 'Copiar os documentos do RAG' }, command: 'docker compose cp rag/data/uploads/. rag-api:…', site: 'up' },
  { job: 'deploy', title: { en: 'Reindex the vector collection', br: 'Reindexar a coleção vetorial' }, command: 'ingest_uploads_to_vector_db(reset_collection=True)', site: 'up' },
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
    title: { en: 'Tests before anything goes down', br: 'Testes antes de qualquer coisa cair' },
    why: { en: 'The tests run first, on a GitHub-hosted machine. If a link, the posts or the chat form breaks, the deploy never starts and the live site is left untouched. Pull requests run the same tests before a merge.', br: 'Os testes rodam primeiro, numa máquina hospedada pelo GitHub. Se um link, os posts ou o formulário do chat quebrarem, o deploy nem começa e o site no ar fica intacto. Pull requests rodam os mesmos testes antes do merge.' },
    cost: { en: 'Each deploy takes a little longer while the tests run.', br: 'Cada deploy leva um pouco mais enquanto os testes rodam.' },
  },
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
    title: { en: 'One secret for configuration', br: 'Um secret para a configuração' },
    why: { en: 'The .env is always written from a GitHub secret, so no configuration lives in the repo or is edited by hand on the machine.', br: 'O .env sempre é gerado a partir de um secret do GitHub, então nenhuma configuração fica no repositório nem é editada à mão na máquina.' },
    cost: { en: 'DEV and PROD are isolated, each with its own runner and its own secret, but both run with the same configuration.', br: 'DEV e PROD são isolados, cada um com o seu runner e o seu secret, mas os dois rodam com a mesma configuração.' },
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
    jobs: Record<Job, { name: string; where: string; note: string }>
    testsStage: string
  }
> = {
  en: {
    back: 'Back to portfolio',
    title: 'How I ship this portfolio with CI/CD',
    thesis:
      'A push first runs the unit tests on a GitHub-hosted machine. Only if they pass does GitHub Actions hand the deploy to a self-hosted runner in my homelab, which rebuilds the Docker images inside the target machine and brings them up with Compose. No registry in between.',
    facts: [
      { label: 'Stack', value: 'GitHub Actions · Vitest · self-hosted runners · Docker Compose · Proxmox LXC' },
      { label: 'Environments', value: 'DEV on CT109 · PROD on CT108' },
      { label: 'Result', value: 'git push → tested, rebuilt and live' },
    ],
    routingTitle: 'The branch picks the workflow, the label picks the machine',
    routingText: 'Each workflow runs two jobs. The tests run on a machine GitHub provides; the deploy lands on my runner that carries the matching label, inside the environment’s own container.',
    routingHead: { branch: 'Branch', workflow: 'Workflow', label: 'runs-on label', machine: 'Machine' },
    envToggle: 'Environment',
    pipelineTitle: 'A deploy, step by step',
    pipelineText: 'The route lights up above; here are the two jobs and their fifteen steps. The Site indicator shows when the environment is reachable: a failing test stops the run while it is still up.',
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
    jobs: {
      test: { name: 'test', where: 'GitHub-hosted · ubuntu-latest', note: 'Links, the posts and a short chat question, with the chatbot’s backend faked.' },
      deploy: { name: 'rebuild-and-ingest', where: 'self-hosted', note: 'needs: test. Starts only if every test passed.' },
    },
    testsStage: 'Unit tests',
  },
  br: {
    back: 'Voltar ao portfólio',
    title: 'Como faço o CI/CD deste portfólio',
    thesis:
      'Um push primeiro roda os testes unitários numa máquina hospedada pelo GitHub. Só se eles passarem o GitHub Actions entrega o deploy a um runner self-hosted no meu homelab, que refaz as imagens Docker dentro da máquina de destino e sobe tudo com o Compose. Sem registry no meio.',
    facts: [
      { label: 'Stack', value: 'GitHub Actions · Vitest · runners self-hosted · Docker Compose · LXC no Proxmox' },
      { label: 'Ambientes', value: 'DEV no CT109 · PROD no CT108' },
      { label: 'Resultado', value: 'git push → testado, reconstruído e no ar' },
    ],
    routingTitle: 'A branch escolhe o workflow, a label escolhe a máquina',
    routingText: 'Cada workflow roda dois jobs. Os testes rodam numa máquina fornecida pelo GitHub; o deploy cai no meu runner que tem a label correspondente, dentro do container do próprio ambiente.',
    routingHead: { branch: 'Branch', workflow: 'Workflow', label: 'Label runs-on', machine: 'Máquina' },
    envToggle: 'Ambiente',
    pipelineTitle: 'Um deploy, passo a passo',
    pipelineText: 'A rota acende acima; aqui estão os dois jobs e as suas quinze etapas. O indicador Site mostra quando o ambiente está acessível: um teste falhando para a execução enquanto ele ainda está no ar.',
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
    jobs: {
      test: { name: 'test', where: 'hospedado pelo GitHub · ubuntu-latest', note: 'Links, os posts e uma pergunta curta ao chat, com o backend do chatbot simulado.' },
      deploy: { name: 'rebuild-and-ingest', where: 'self-hosted', note: 'needs: test. Só começa se todos os testes passaram.' },
    },
    testsStage: 'Testes unitários',
  },
}

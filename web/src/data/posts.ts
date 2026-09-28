import type { Language } from './projects'

// Small write-ups: things worth showing that are too small for a full case study.

export interface EvidenceRow {
  request: Record<Language, string>
  asset: Record<Language, string>
  result: string
  cacheControl: Record<Language, string>
}

export interface Measurement {
  label: Record<Language, string>
  ms: number
  detail: Record<Language, string>
  lit: boolean
}

export interface Benefit {
  title: Record<Language, string>
  text: Record<Language, string>
  measuredTitle: Record<Language, string>
  measurements: Measurement[]
  speedup: Record<Language, string>
  size: Record<Language, string>
  note: Record<Language, string>
}

export interface Post {
  slug: string
  title: Record<Language, string>
  teaser: Record<Language, string>
  thesis: Record<Language, string>
  stack: string[]
  benefit: Benefit
  hitSteps: Record<Language, string>[]
  missSteps: Record<Language, string>[]
  evidence: EvidenceRow[]
  expiry: Record<Language, string>
  summary: Record<Language, string[]>
}

export const POSTS: Post[] = [
  {
    slug: 'cdn-cloudfront',
    title: {
      en: 'How I use AWS CDN to improve user performance on this portfolio',
      br: 'Como uso a CDN da AWS para melhorar a performance deste portfólio para os usuários',
    },
    teaser: {
      en: 'Cloudflare DNS → CloudFront → Caddy → WireGuard → homelab',
      br: 'Cloudflare DNS → CloudFront → Caddy → WireGuard → homelab',
    },
    thesis: {
      en: 'JavaScript and CSS are served from the CloudFront edge closest to the visitor; only cache misses travel back through the VPS and the tunnel to the homelab.',
      br: 'JavaScript e CSS são entregues pelo ponto de presença do CloudFront mais próximo do visitante; só os cache misses voltam pela VPS e pelo túnel até o homelab.',
    },
    stack: ['Cloudflare DNS', 'Amazon CloudFront', 'Caddy', 'WireGuard', 'Proxmox'],
    benefit: {
      title: { en: 'Fast from anywhere, not only near my server', br: 'Rápido de qualquer lugar, não só perto do meu servidor' },
      text: {
        en: 'The frontend, JavaScript and CSS, is cached at CloudFront edge locations around the world. A visitor in another country downloads it from the edge closest to them instead of crossing all the way to a server in my home in Brazil, and the files arrive gzip-compressed.',
        br: 'O frontend, JavaScript e CSS, fica em cache nos pontos de presença do CloudFront pelo mundo. Um visitante em outro país baixa os arquivos do edge mais próximo dele, em vez de atravessar até um servidor na minha casa no Brasil, e os arquivos chegam comprimidos em gzip.',
      },
      measuredTitle: { en: 'Measured on the same file, index-DShmamVo.js', br: 'Medido no mesmo arquivo, index-DShmamVo.js' },
      measurements: [
        {
          label: { en: 'Cache hit, served by the edge', br: 'Cache hit, entregue pelo edge' },
          ms: 60,
          detail: { en: 'median of 11 requests · time to first byte 38 ms', br: 'mediana de 11 requisições · primeiro byte em 38 ms' },
          lit: true,
        },
        {
          label: { en: 'Cache miss, through the VPS and the tunnel', br: 'Cache miss, pela VPS e pelo túnel' },
          ms: 517,
          detail: { en: '1 real miss · time to first byte 309 ms', br: '1 miss real · primeiro byte em 309 ms' },
          lit: false,
        },
      ],
      speedup: { en: '≈ 8.6× faster on a hit', br: '≈ 8,6× mais rápido no hit' },
      size: {
        en: '173 KB gzip from the edge, against 530 KB uncompressed straight from the origin.',
        br: '173 KB em gzip pelo edge, contra 530 KB sem compressão direto do origin.',
      },
      note: {
        en: 'Measured with curl on Sep 27, 2026, from Brazil, served by the São Paulo edge (GRU). The query string is not part of the cache key, so only one real miss could be sampled; six direct requests to the origin, the path a miss takes, had a median of 232 ms. Not yet measured from other countries.',
        br: 'Medido com curl em 27/09/2026, do Brasil, atendido pelo edge de São Paulo (GRU). A query string não faz parte da chave de cache, então só foi possível amostrar um miss real; seis requisições diretas ao origin, o caminho que um miss percorre, tiveram mediana de 232 ms. Ainda não medido a partir de outros países.',
      },
    },
    hitSteps: [
      {
        en: 'Cloudflare DNS resolves the main domain, gabriel-goncalves.com, to the CloudFront distribution.',
        br: 'O Cloudflare DNS resolve o domínio principal, gabriel-goncalves.com, para a distribuição do CloudFront.',
      },
      {
        en: 'The edge already holds the file, so CloudFront answers directly: x-cache “Hit from cloudfront”.',
        br: 'O edge já tem o arquivo, então o CloudFront responde direto: x-cache “Hit from cloudfront”.',
      },
    ],
    missSteps: [
      {
        en: 'Cloudflare DNS resolves the main domain, gabriel-goncalves.com, to the CloudFront distribution.',
        br: 'O Cloudflare DNS resolve o domínio principal, gabriel-goncalves.com, para a distribuição do CloudFront.',
      },
      {
        en: 'The edge does not have the file: x-cache “Miss from cloudfront”.',
        br: 'O edge não tem o arquivo: x-cache “Miss from cloudfront”.',
      },
      {
        en: 'CloudFront requests it from the origin, cdn.gabriel-goncalves.com, served by Caddy on the VPS.',
        br: 'O CloudFront pede ao origin, cdn.gabriel-goncalves.com, atendido pelo Caddy na VPS.',
      },
      {
        en: 'Caddy forwards the request through the WireGuard tunnel into the homelab.',
        br: 'O Caddy encaminha a requisição pelo túnel WireGuard até o homelab.',
      },
      {
        en: 'The portfolio production machine answers; CloudFront keeps JS and CSS at the edge for the next visitor.',
        br: 'A máquina de produção do portfólio responde; o CloudFront guarda JS e CSS no edge para o próximo visitante.',
      },
    ],
    evidence: [
      {
        request: { en: '1st request', br: '1ª requisição' },
        asset: { en: 'JS and CSS (e.g. index-DShmamVo.js)', br: 'JS e CSS (ex.: index-DShmamVo.js)' },
        result: 'Miss from cloudfront',
        cacheControl: { en: 'max-age=14334 (≈ 4 h)', br: 'max-age=14334 (≈ 4 h)' },
      },
      {
        request: { en: '2nd request', br: '2ª requisição' },
        asset: { en: 'JS and CSS (same files)', br: 'JS e CSS (mesmos arquivos)' },
        result: 'Hit from cloudfront',
        cacheControl: { en: 'max-age=14334 (≈ 4 h)', br: 'max-age=14334 (≈ 4 h)' },
      },
    ],
    expiry: {
      en: 'CloudFront follows the Cache-Control max-age the origin sends, so JS and CSS stay at the edge for about 4 hours. File names carry a content hash, so a new release produces new names and the edge never serves an old bundle.',
      br: 'O CloudFront segue o max-age do Cache-Control enviado pelo origin, então JS e CSS ficam no edge por cerca de 4 horas. Os nomes dos arquivos carregam um hash do conteúdo, então uma nova versão gera nomes novos e o edge nunca entrega um bundle antigo.',
    },
    summary: {
      en: [
        'The public domain is resolved by Cloudflare DNS and pointed at an Amazon CloudFront distribution. CloudFront acts as the CDN, providing TLS, automatic compression and distributed caching of the static files.',
        'On a cache hit, files such as JavaScript and CSS are delivered straight from the point of presence closest to the visitor. On a cache miss, the request goes to the origin cdn.gabriel-goncalves.com, through Caddy on the VPS and across the WireGuard tunnel into the homelab infrastructure.',
        'This reduces latency, tunnel bandwidth and load on the internal servers, while the origin stays protected behind the VPS and the firewall.',
      ],
      br: [
        'O domínio público é resolvido pelo Cloudflare DNS e direcionado para uma distribuição Amazon CloudFront. O CloudFront atua como CDN, oferecendo TLS, compressão automática e cache distribuído dos arquivos estáticos.',
        'Em um cache hit, arquivos como JavaScript e CSS são entregues diretamente pelo ponto de presença mais próximo do visitante. Em um cache miss, a requisição segue para o origin cdn.gabriel-goncalves.com, passa pelo Caddy na VPS e atravessa o túnel WireGuard até a infraestrutura do homelab.',
        'Essa arquitetura reduz a latência, o consumo de banda do túnel e a carga sobre os servidores internos, mantendo o ambiente de origem protegido atrás da VPS e do firewall.',
      ],
    },
  },
]

export const getPostBySlug = (slug: string) => POSTS.find((post) => post.slug === slug)

// Everything the posts band lists, newest first. Each slug maps to its own page.
export const POST_LIST: { slug: string; title: Record<Language, string>; teaser: Record<Language, string> }[] = [
  {
    slug: 'cicd-portfolio',
    title: { en: 'How I ship this portfolio with CI/CD', br: 'Como faço o CI/CD deste portfólio' },
    teaser: {
      en: 'git push → self-hosted runner → Docker Compose → live',
      br: 'git push → runner self-hosted → Docker Compose → no ar',
    },
  },
  ...POSTS.map(({ slug, title, teaser }) => ({ slug, title, teaser })),
]

export const POSTS_COPY: Record<
  Language,
  {
    label: string
    read: string
    pause: string
    play: string
    back: string
    kind: string
    stack: string
    result: string
    resultValue: string
    pathTitle: string
    hit: string
    miss: string
    proofTitle: string
    proofTable: { request: string; asset: string; result: string; cacheControl: string }
    expiryTitle: string
    whyTitle: string
    diagramLabel: string
  }
> = {
  en: {
    label: 'Posts',
    read: 'Read',
    pause: 'Pause posts',
    play: 'Play posts',
    back: 'Back to portfolio',
    kind: 'Post',
    stack: 'Stack',
    result: 'Result',
    resultValue: 'JS and CSS cached ≈ 4 h at the edge',
    pathTitle: 'The path of a request',
    hit: 'Cache hit',
    miss: 'Cache miss',
    proofTitle: 'Proof in practice',
    proofTable: { request: 'Request', asset: 'Asset', result: 'x-cache', cacheControl: 'Cache-Control' },
    expiryTitle: 'How expiry works',
    whyTitle: 'Why it is built this way',
    diagramLabel: 'Request path through the CDN',
  },
  br: {
    label: 'Posts',
    read: 'Ler',
    pause: 'Pausar posts',
    play: 'Retomar posts',
    back: 'Voltar ao portfólio',
    kind: 'Post',
    stack: 'Stack',
    result: 'Resultado',
    resultValue: 'JS e CSS em cache ≈ 4 h no edge',
    pathTitle: 'O caminho de uma requisição',
    hit: 'Cache hit',
    miss: 'Cache miss',
    proofTitle: 'Prova na prática',
    proofTable: { request: 'Requisição', asset: 'Arquivo', result: 'x-cache', cacheControl: 'Cache-Control' },
    expiryTitle: 'Como a expiração funciona',
    whyTitle: 'Por que foi feito assim',
    diagramLabel: 'Caminho da requisição pela CDN',
  },
}

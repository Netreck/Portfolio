// An answer "lights" the parts of the page it talks about.
// Matching runs on the answer text and the retrieved source names only:
// excerpts would mention everything in the resume and light the whole page.

export type LitKey = 'bofa' | 'vivo' | 'greenteam' | 'ufabc' | 'skills' | 'homelab' | 'hirematch'

const MATCHERS: Record<LitKey, RegExp> = {
  bofa: /bank of america|\bbofa\b/i,
  vivo: /\bvivo\b|telef[oô]nica/i,
  greenteam: /green team|hacker club/i,
  ufabc: /ufabc|federal (university )?of abc|universidade federal do abc/i,
  skills: /\b(java|python|docker|kubernetes|grafana|prometheus|react|sql)\b/i,
  homelab: /home ?lab|proxmox|wireguard/i,
  hirematch: /hire ?match/i,
}

export function findLit(text: string): Set<LitKey> {
  const lit = new Set<LitKey>()
  for (const key of Object.keys(MATCHERS) as LitKey[]) {
    if (MATCHERS[key].test(text)) lit.add(key)
  }
  return lit
}

export const SECTION_KEYS: Record<'experience' | 'projects', LitKey[]> = {
  experience: ['bofa', 'vivo', 'greenteam', 'ufabc', 'skills'],
  projects: ['homelab', 'hirematch'],
}

export function orgKey(organization: string): LitKey | null {
  if (MATCHERS.bofa.test(organization)) return 'bofa'
  if (MATCHERS.vivo.test(organization)) return 'vivo'
  if (MATCHERS.greenteam.test(organization)) return 'greenteam'
  return null
}

export const projectKey = (slug: string): LitKey | null =>
  slug.startsWith('homelab') ? 'homelab' : slug.startsWith('hirematch') ? 'hirematch' : null

// Stepped easing: every movement lands in whole grid steps.
export const stepEase = (steps: number) => (t: number) => Math.min(1, Math.ceil(t * steps) / steps)

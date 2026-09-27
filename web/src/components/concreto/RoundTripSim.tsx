import { Globe, Server, User } from 'lucide-react'
import type { Language } from '../../data/projects'

// Replays the measured round trips 10× slower: the ball is the request leaving the
// user and coming back with the file. Hit: user → CDN → user (60 ms). Miss: user →
// CDN → server → CDN → user (517 ms). Leg times are estimated from those totals.
export default function RoundTripSim({ language }: { language: Language }) {
  const br = language === 'br'

  return (
    <section
      className="cz-rt"
      aria-label={br ? 'Simulação de ida e volta: cache hit e cache miss' : 'Round-trip simulation: cache hit and cache miss'}
    >
      <div className="cz-rt-inner">
        <h2 className="cz-rt-title">{br ? 'A ida e a volta de cada requisição' : 'Each request, there and back'}</h2>
        {(['hit', 'miss'] as const).map((lane) => (
          <div key={lane} className={`cz-rt-lane is-${lane}`}>
            <div className="cz-rt-head">
              <span className="cz-rt-name">
                {lane === 'hit'
                  ? br
                    ? 'Cache hit: a CDN já tem o arquivo'
                    : 'Cache hit: the CDN already has the file'
                  : br
                    ? 'Cache miss: a CDN busca no servidor'
                    : 'Cache miss: the CDN fetches from the server'}
              </span>
              <span className={`cz-rt-done is-${lane}`}>
                {br ? 'Voltou em' : 'Back in'} {lane === 'hit' ? '60' : '517'} ms
              </span>
            </div>
            <div className="cz-rt-stage">
              <div className="cz-rt-track">
                <div className="cz-rt-node is-user" style={{ left: '0%' }}>
                  <User size={20} aria-hidden="true" />
                  <span className="cz-rt-label">
                    {br ? 'Usuário' : 'User'}
                    <span className="cz-rt-sub">{br ? 'navegador' : 'browser'}</span>
                  </span>
                </div>
                <div className="cz-rt-node is-cdn" style={{ left: 'var(--cdn)' }}>
                  <Globe size={20} aria-hidden="true" />
                  <span className="cz-rt-label">
                    CDN
                    <span className="cz-rt-sub">CloudFront</span>
                  </span>
                </div>
                <div className={`cz-rt-node ${lane === 'hit' ? 'is-idle' : 'is-server'}`} style={{ left: '100%' }}>
                  <Server size={20} aria-hidden="true" />
                  <span className="cz-rt-label">
                    {br ? 'Servidor' : 'Server'}
                    <span className="cz-rt-sub">
                      {lane === 'hit' ? (br ? 'não contatado' : 'not contacted') : 'VPS → homelab'}
                    </span>
                  </span>
                </div>
                <span className="cz-rt-ball" aria-hidden="true" />
              </div>
            </div>
          </div>
        ))}
        <p className="cz-rt-note">
          {br
            ? 'Reproduzido 10× mais devagar a partir das medições acima. A bolinha é a requisição: sai do usuário e volta com o arquivo.'
            : 'Replayed 10× slower from the measurements above. The ball is the request: it leaves the user and comes back with the file.'}
        </p>
      </div>
    </section>
  )
}

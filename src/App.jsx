import { useState, useEffect } from 'react'
import Card from './Card.jsx'
import { SkeletonList } from './Skeleton.jsx'
import PrivacyModal from './PrivacyModal.jsx'
import TermsModal from './TermsModal.jsx'
import { supabase } from './lib/supabase.js'

const topLinks = [
  { label: 'Lei de Acesso à Informação', href: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm' },
  { label: 'Portal Transparência',       href: 'https://transparencia.parintins.am.gov.br/' },
  { label: 'E-SIC',                      href: 'https://transparencia.parintins.am.gov.br/?q=517-lista-8317-servico-de-informacao-ao-cidadao-e-sic' },
  { label: 'Ouvidoria',                  href: 'https://transparencia.parintins.am.gov.br/?q=517-lista-8546-ouvidoria' },
]

const navItems = [
  { label: 'Prefeitura de Parintins',    href: 'https://parintins.am.gov.br/' },
  { label: 'Portal Transparência',       href: 'https://transparencia.parintins.am.gov.br/' },
  { label: 'Serviço de Informação',      href: 'https://transparencia.parintins.am.gov.br/?q=517-lista-8317-servico-de-informacao-ao-cidadao-e-sic' },
  { label: 'Ouvidoria',                  href: 'https://transparencia.parintins.am.gov.br/?q=517-lista-8546-ouvidoria' },
  { label: 'Contato',                    href: 'https://transparencia.parintins.am.gov.br/?q=517-lista-8134-fale-conosco' },
]

function App() {
  const [expandedCard, setExpandedCard] = useState(null)
  const [navOpen, setNavOpen]           = useState(false)
  const [categories, setCategories]     = useState([])
  const [loading, setLoading]           = useState(true)
  const [privacyOpen, setPrivacyOpen]   = useState(false)
  const [termsOpen, setTermsOpen]       = useState(false)

  useEffect(() => {
    async function loadData() {
      const [catResult, respResult] = await Promise.all([
        supabase.from('categories').select('*, criteria(*, subitems(*))'),
        supabase.from('responses').select('subitem_id, status'),
      ])

      if (catResult.error || !catResult.data) {
        setLoading(false)
        return
      }

      // Build responses map
      const respMap = {}
      ;(respResult.data ?? []).forEach(r => { respMap[r.subitem_id] = r.status })

      // Sort and shape data to match Card's expected format
      const sorted = catResult.data
        .sort((a, b) => a.order - b.order)
        .map(cat => ({
          id:          cat.id,
          title:       cat.name,
          description: cat.description ?? '',
          icon:        cat.icon,
          tone:        cat.tone,
          features: (cat.criteria ?? [])
            .sort((a, b) => a.order - b.order)
            .map(crit => ({
              criterion: crit.text,
              subitems: (crit.subitems ?? [])
                .sort((a, b) => a.order - b.order)
                .map(sub => ({
                  text:   sub.label,
                  status: respMap[sub.id] ?? null,
                })),
            })),
        }))

      setCategories(sorted)
      setLoading(false)
    }

    loadData()
  }, [])

  return (
    <div className="app-shell">
      {navOpen && (
        <div
          className="nav-overlay"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <header className="site-header">
        <div className="topbar">
          <div className="container topbar__inner">
            <div className="topbar__links">
              {topLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
              ))}
            </div>
            <div className="topbar__social social">
              <a href="https://www.instagram.com/prefeituradeparintins?igsh=MTh1cjZheW52cmJw" target="_blank" rel="noreferrer"><i className="bi bi-instagram"></i></a>
              <a href="https://www.facebook.com/PrefeituraOficialParintins/" target="_blank" rel="noreferrer"><i className="bi bi-facebook"></i></a>
              <a href="https://www.youtube.com/@prefeituradeparintins" target="_blank" rel="noreferrer"><i className="bi bi-youtube"></i></a>
              <a href="https://wa.me/5592982530066" target="_blank" rel="noreferrer"><i className="bi bi-whatsapp"></i></a>
            </div>
          </div>
        </div>

        <div className="masthead">
          <div className="container masthead__inner">
            <div className="brand-cluster">
              <a href="#top">
                <img
                  className="brand-cluster__logo"
                  src="https://acheitudo.com.br/images/logo.png"
                  alt="Logo da Prefeitura de Parintins"
                />
              </a>
            </div>
            <div className="masthead__badges">
              <a className="info-badge" href="https://transparencia.parintins.am.gov.br/" target="_blank" rel="noreferrer">
                <i className="bi bi-shield-check"></i>
                <span>Portal da Transparência</span>
              </a>
            </div>
          </div>
        </div>

        <nav className="navbar navbar-portal" aria-label="Navegação principal">
          <div className="container navbar-inner">
            <button
              className="hamburger"
              aria-label={navOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={navOpen}
              onClick={() => setNavOpen(v => !v)}
            >
              <i className={`bi ${navOpen ? 'bi-x-lg' : 'bi-list'}`} />
            </button>
            <div className={`navbar-nav${navOpen ? ' open' : ''}`}>
              {navItems.map((item) => (
                <a key={item.href} className="nav-link" href={item.href} target="_blank" rel="noreferrer" onClick={() => setNavOpen(false)}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section className="cards-section">
          <div className={`cards-grid container${loading ? ' cards-grid--loading' : ' cards-grid--loaded'}`}>
            {loading ? (
              <SkeletonList count={7} />
            ) : (
              categories.map((cat, index) => (
                <Card
                  key={cat.id}
                  title={cat.title}
                  description={cat.description}
                  icon={cat.icon}
                  tone={cat.tone}
                  features={cat.features}
                  isExpanded={expandedCard === index}
                  onToggle={() => setExpandedCard(expandedCard === index ? null : index)}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
      {termsOpen   && <TermsModal   onClose={() => setTermsOpen(false)}   />}

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <h2>Radar Parintins</h2>
            <p>Aviso Importante: Este painel não constitui meio oficial de divulgação institucional. Seu conteúdo possui natureza meramente informativa, preliminar e não vinculante, razão pela qual não gera direitos, obrigações, efeitos legais ou presunção de veracidade oficial. Para fins formais, legais ou administrativos, deverão ser observados exclusivamente os canais oficiais de publicação do Município.</p>
          </div>
          <div className="footer-links">
            <button className="footer-link-btn" onClick={() => setPrivacyOpen(true)} type="button">Política de privacidade</button>
            <button className="footer-link-btn" onClick={() => setTermsOpen(true)} type="button">Termos de uso</button>
          </div>
          <div className="footer-copy">
            © 2026 <a href="https://asmdeveloper.com.br/" target="_blank" rel="noreferrer">ASMDEVELOPER</a>. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

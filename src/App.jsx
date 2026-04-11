import { useState, useEffect } from 'react'
import Card from './Card.jsx'
import { supabase } from './lib/supabase.js'

const topLinks = [
  'Mapa do site',
  'Lei de Acesso à Informação',
  'Portal transparência',
  'E-SIC',
  'Ouvidoria'
]

const navItems = ['Prefeitura', 'Portal da Transparência', 'Serviço de Informação', 'Ouvidoria', 'Contatos']

function App() {
  const [expandedCard, setExpandedCard] = useState(null)
  const [navOpen, setNavOpen]           = useState(false)
  const [categories, setCategories]     = useState([])
  const [loading, setLoading]           = useState(true)

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
                <a key={link} href="#">{link}</a>
              ))}
            </div>
            <div className="topbar__social social">
              <a href="#"><i className="bi bi-instagram"></i></a>
              <a href="#"><i className="bi bi-facebook"></i></a>
              <a href="#"><i className="bi bi-youtube"></i></a>
              <a href="#"><i className="bi bi-twitter"></i></a>
              <a href="#"><i className="bi bi-whatsapp"></i></a>
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
                <a key={item} className="nav-link" href="#" onClick={() => setNavOpen(false)}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section className="cards-section">
          <div className="cards-grid container">
            {loading ? (
              <div className="public-loading">
                <i className="bi bi-arrow-repeat public-loading__spin" />
                <span>Carregando dados...</span>
              </div>
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

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <h2>AcheiTudo</h2>
            <p>Portal inspirado no visual institucional do site com cores, gradações e posicionamento semelhantes.</p>
          </div>
          <div className="footer-links">
            <a href="#">Política de privacidade</a>
            <a href="#">Termos de uso</a>
            <a href="#">Fale conosco</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

import { useState, useEffect, useRef } from 'react'
import { Outlet, Link } from 'react-router-dom'
import PrivacyModal from '../PrivacyModal.jsx'
import TermsModal from '../TermsModal.jsx'
import AvisoModal from '../AvisoModal.jsx'

const topLinks = [
  { label: 'Lei de Acesso à Informação', href: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm' },
  { label: 'Portal Transparência',       href: 'https://transparencia.parintins.am.gov.br/' },
  { label: 'Ouvidoria',                  href: 'https://transparencia.parintins.am.gov.br/?q=517-lista-8546-ouvidoria' },
]

const navItems = [
  { label: 'Portal Transparência', to:   '/',              external: false },
  { label: 'Dashboard',            to:   '/dashboard',    external: false },
  { label: 'Informações',          to:   '/informacoes',  external: false },
]

function getCookie(name) {
  return document.cookie.split('; ').find(r => r.startsWith(name + '='))?.split('=')[1] ?? null
}
function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

export default function Layout() {
  const [navOpen, setNavOpen]         = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [termsOpen, setTermsOpen]     = useState(false)
  const [avisoOpen, setAvisoOpen]     = useState(false)
  const navRef                        = useRef(null)

  const [theme, setTheme] = useState(() => {
    const saved = getCookie('preferred_theme') ?? 'light'
    document.documentElement.dataset.theme = saved
    return saved
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    setCookie('preferred_theme', theme)
  }, [theme])

  useEffect(() => {
    if (!navOpen) return
    function handleOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setNavOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [navOpen])

  return (
    <div className="app-shell">
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
              <button
                className="theme-toggle"
                onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
                title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
                type="button"
              >
                <i className={`bi ${theme === 'light' ? 'bi-moon-stars-fill' : 'bi-sun-fill'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="masthead">
          <div className="container masthead__inner">
            <div className="brand-cluster">
              <Link to="/">
                <img
                  className="brand-cluster__logo"
                  src="https://acheitudo.com.br/images/logo.png"
                  alt="Logo da Prefeitura de Parintins"
                />
              </Link>
            </div>
            <div className="masthead__badges">
              <a className="info-badge" href="https://transparencia.parintins.am.gov.br/" target="_blank" rel="noreferrer">
                <i className="bi bi-shield-check"></i>
                <span>Portal da Transparência</span>
              </a>
            </div>
          </div>
        </div>

        <nav className="navbar navbar-portal" aria-label="Navegação principal" ref={navRef}>
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
              {navItems.map((item) =>
                item.external ? (
                  <a key={item.href} className="nav-link" href={item.href} target="_blank" rel="noreferrer" onClick={() => setNavOpen(false)}>
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.to} className="nav-link" to={item.to} onClick={() => setNavOpen(false)}>
                    {item.label}
                  </Link>
                )
              )}
              <button className="nav-link nav-link--aviso" onClick={() => { setAvisoOpen(true); setNavOpen(false) }} type="button">
                Aviso
              </button>
            </div>
          </div>
        </nav>
      </header>

      <Outlet />

      {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
      {termsOpen   && <TermsModal   onClose={() => setTermsOpen(false)}   />}
      {avisoOpen   && <AvisoModal   onClose={() => setAvisoOpen(false)}   />}

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

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../styles.css'
import '../admin.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const err = await signIn(email, password)
    if (err) {
      setError('E-mail ou senha inválidos. Tente novamente.')
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Cabeçalho com identidade do portal */}
        <div className="login-card__brand">
          <img
            src="https://acheitudo.com.br/images/logo.png"
            alt="Logo da Prefeitura de Parintins"
            className="login-card__logo"
          />
          <div className="login-card__brand-text">
            <span className="login-card__portal-name">Radar Parintins</span>
            <span className="login-card__portal-sub">Município de Parintins / AM</span>
          </div>
        </div>

        {/* Área do formulário */}
        <div className="login-card__body">
          <div className="login-card__heading">
            <div className="login-card__icon">
              <i className="bi bi-shield-lock-fill" />
            </div>
            <div>
              <h1 className="login-card__title">Acesso Administrativo</h1>
              <p className="login-card__subtitle">Painel de gestão do Radar da Transparência</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="email">E-mail</label>
              <div className="login-field__input-wrap">
                <i className="bi bi-envelope login-field__icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Senha</label>
              <div className="login-field__input-wrap">
                <i className="bi bi-lock login-field__icon" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="login-error">
                <i className="bi bi-exclamation-circle" /> {error}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading
                ? <><i className="bi bi-arrow-repeat login-spin" /> Entrando...</>
                : <><i className="bi bi-box-arrow-in-right" /> Entrar</>
              }
            </button>
          </form>

          <a href="/" className="login-back">
            <i className="bi bi-arrow-left" /> Voltar ao portal
          </a>
        </div>

      </div>
    </div>
  )
}

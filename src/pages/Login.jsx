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
        <div className="login-card__icon">
          <i className="bi bi-shield-lock-fill" />
        </div>
        <h1 className="login-card__title">Acesso Administrativo</h1>
        <p className="login-card__subtitle">Portal de Avaliação de Transparência</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="email">E-mail</label>
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

          <div className="login-field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
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
      </div>
    </div>
  )
}

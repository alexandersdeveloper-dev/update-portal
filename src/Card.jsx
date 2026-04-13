// Status → icon + color
function statusIcon(status) {
  if (status === 'atendido')      return { icon: 'bi-check-circle-fill', color: '#16a34a' }
  if (status === 'parcial')       return { icon: 'bi-dash-circle-fill',  color: '#d97706' }
  if (status === 'nao_atendido')  return { icon: 'bi-x-circle-fill',     color: '#dc2626' }
  if (status === 'nao_aplicavel') return { icon: 'bi-slash-circle',      color: '#94a3b8' }
  return { icon: 'bi-circle',                                            color: '#cbd5e1' }
}

// Calculate progress percentage from all subitems across all features
// atendido=1.0, parcial=0.5, nao_atendido=0.0; nao_aplicavel and null are excluded
function calcProgress(features) {
  let sum = 0, total = 0
  for (const f of features ?? []) {
    for (const sub of f.subitems ?? []) {
      if (!sub.status || sub.status === 'nao_aplicavel') continue
      if (sub.status === 'atendido') sum += 1
      else if (sub.status === 'parcial') sum += 0.5
      total++
    }
  }
  if (total === 0) return null
  return Math.round((sum / total) * 100)
}

function progressColor(pct) {
  if (pct >= 80) return 'green'
  if (pct >= 50) return 'yellow'
  return 'red'
}

function ProgressBar({ features }) {
  const pct = calcProgress(features)
  if (pct === null) return null

  const color = progressColor(pct)

  return (
    <div className="card-progress">
      <div className="card-progress__track">
        <div
          className={`card-progress__fill card-progress__fill--${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`card-progress__label card-progress__label--${color}`}>
        {pct}% atendido
      </span>
    </div>
  )
}

function Card({ title, description, icon, tone, features, isExpanded, onToggle }) {
  return (
    <article className="priority-card" style={{ '--tone': tone }}>
      <div className="priority-card__header">
        <div className="priority-card__top">
          <div className="priority-card__marker" />
          <div className="priority-card__icon">
            <i className={`bi ${icon}`} />
          </div>
        </div>
        <button className="priority-card__toggle" onClick={onToggle}>
          <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
        </button>
      </div>
      <h3>{title}</h3>
      <ProgressBar features={features} />
      <div className={`priority-card__content ${isExpanded ? 'expanded' : ''}`}>
        <p>{description}</p>
        {features && (
          <ul className="priority-card__features">
            {features.map((feature, index) => (
              <li key={index}>
                {typeof feature === 'string' ? (
                  <>
                    <i className="bi bi-check-circle" /> {feature}
                  </>
                ) : (
                  <div className="feature-group">
                    <div className="feature-criterion">
                      {feature.criterion}
                      {feature.importance && (
                        <span className={`importance-chip importance-chip--${feature.importance}`}>
                          {feature.importance === 'essencial' ? 'Essencial' : feature.importance === 'obrigatoria' ? 'Obrigatória' : 'Recomendada'}
                        </span>
                      )}
                    </div>
                    <ul className="feature-subitems">
                      {(feature.subitems ?? []).map((subitem, subIndex) => {
                        const { icon: ic, color } = statusIcon(subitem.status)
                        return (
                          <li key={subIndex}>
                            <i className={`bi ${ic}`} style={{ color }} /> {subitem.text}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

export default Card

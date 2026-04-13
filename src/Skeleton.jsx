// ─── Bloco base ───────────────────────────────────────────────────────────────
function Skel({ w = '100%', h = '1rem', r = '6px', style }) {
  return (
    <span
      className="skel"
      style={{ width: w, height: h, borderRadius: r, display: 'block', ...style }}
    />
  )
}

// ─── Skeleton de um card (imita priority-card colapsado) ───────────────────────
function SkeletonCard() {
  return (
    <article className="priority-card skel-card" aria-hidden="true">

      {/* Cabeçalho: marcador + ícone + botão chevron */}
      <div className="priority-card__header">
        <div className="priority-card__top">
          <div className="priority-card__marker skel" style={{ opacity: 0.4 }} />
          <div className="priority-card__icon">
            <Skel w="2rem" h="2rem" r="50%" />
          </div>
        </div>
        <Skel w="1.75rem" h="1.75rem" r="50%" />
      </div>

      {/* Título */}
      <Skel w="55%" h="1.15rem" style={{ marginBottom: '0.6rem' }} />

      {/* Barra de progresso */}
      <div className="card-progress" style={{ pointerEvents: 'none' }}>
        <div className="card-progress__track">
          <Skel w="100%" h="7px" r="999px" />
        </div>
        <Skel w="4.5rem" h="0.65rem" r="4px" style={{ marginTop: '0.1rem' }} />
      </div>

    </article>
  )
}

// Renderiza N placeholders
export function SkeletonList({ count = 7 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  )
}

// ─── Skeleton do Dashboard ─────────────────────────────────────────────────────
export function SkeletonDashboard() {
  return (
    <div className="dash-section" aria-hidden="true">
      <div className="container">

        {/* Header */}
        <div className="dash-header" style={{ marginBottom: '2rem' }}>
          <Skel w="160px" h="2rem" r="8px" style={{ marginBottom: '0.6rem' }} />
          <Skel w="340px" h="0.9rem" r="6px" />
        </div>

        {/* Stat cards */}
        <div className="dash-stats" style={{ marginBottom: '2rem' }}>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="dash-stat">
              <Skel w="70px" h="2rem" r="6px" />
              <Skel w="90px" h="0.75rem" r="4px" style={{ marginTop: '0.3rem' }} />
            </div>
          ))}
        </div>

        {/* Por importância */}
        <Skel w="120px" h="0.75rem" r="4px" style={{ marginBottom: '0.9rem' }} />
        <div className="dash-imp-list" style={{ marginBottom: '1.75rem' }}>
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="dash-imp-card">
              <div className="dash-imp-card__top">
                <Skel w="90px" h="0.75rem" r="4px" />
                <Skel w="50px" h="1.4rem" r="6px" />
              </div>
              <Skel w="100%" h="6px" r="999px" style={{ marginTop: '0.65rem' }} />
            </div>
          ))}
        </div>

        {/* Por dimensão */}
        <Skel w="100px" h="0.75rem" r="4px" style={{ marginBottom: '0.9rem' }} />
        <div className="dash-dim-list">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="dash-dim-item--clickable" style={{ pointerEvents: 'none' }}>
              <div className="dash-dim-item__header" style={{ marginBottom: '0.6rem' }}>
                <div className="dash-dim-item__info">
                  <Skel w="2.9rem" h="2.9rem" r="0.85rem" style={{ flexShrink: 0 }} />
                  <Skel w={`${120 + i * 20}px`} h="0.9rem" r="6px" />
                </div>
                <Skel w="40px" h="0.9rem" r="4px" />
              </div>
              <Skel w="100%" h="6px" r="999px" />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

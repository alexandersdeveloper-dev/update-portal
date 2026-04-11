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

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { SkeletonDashboard } from '../Skeleton.jsx'
import Card from '../Card.jsx'
import { useScrollReveal } from '../hooks/useScrollReveal.js'

const IMPORTANCE_WEIGHT = { essencial: 2, obrigatoria: 1.5, recomendada: 1 }

const IMPORTANCE_INFO = {
  essencial:   { label: 'Essencial',   color: 'green'  },
  obrigatoria: { label: 'Obrigatória', color: 'blue'   },
  recomendada: { label: 'Recomendada', color: 'yellow' },
}

function statusValue(status) {
  if (status === 'atendido') return 1.0
  if (status === 'parcial')  return 0.5
  return 0.0
}

function calcCategoryScore(category, responses) {
  let weightedSum = 0, totalWeight = 0
  for (const crit of category.criteria ?? []) {
    const weight = IMPORTANCE_WEIGHT[crit.importance] ?? 1
    let critSum = 0, critCount = 0
    for (const sub of crit.subitems ?? []) {
      const status = responses[sub.id]
      if (status === 'nao_aplicavel') continue
      critSum += statusValue(status)
      critCount++
    }
    if (critCount === 0) continue
    weightedSum += (critSum / critCount) * weight
    totalWeight += weight
  }
  if (totalWeight === 0) return null
  return Math.round((weightedSum / totalWeight) * 100)
}

function calcOverallScore(categories, responses) {
  const scores = categories.map(c => calcCategoryScore(c, responses)).filter(s => s !== null)
  if (scores.length === 0) return null
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

function calcImportanceScore(importance, categories, responses) {
  let sum = 0, total = 0
  for (const cat of categories) {
    for (const crit of cat.criteria ?? []) {
      if ((crit.importance ?? 'recomendada') !== importance) continue
      let critSum = 0, critCount = 0
      for (const sub of crit.subitems ?? []) {
        const status = responses[sub.id]
        if (status === 'nao_aplicavel') continue
        critSum += statusValue(status)
        critCount++
      }
      if (critCount === 0) continue
      sum += critSum / critCount
      total++
    }
  }
  if (total === 0) return null
  return Math.round((sum / total) * 100)
}


function scoreColor(score) {
  if (score === null) return 'gray'
  if (score >= 80)   return 'green'
  if (score >= 50)   return 'yellow'
  return 'red'
}

const VERIFICATION_ITEMS = [
  { key: 'disponibilidade',    label: 'Disponibilidade',       icon: 'bi-eye'              },
  { key: 'atualidade',         label: 'Atualidade',            icon: 'bi-calendar-check'   },
  { key: 'serie_historica',    label: 'Série Histórica',       icon: 'bi-clock-history'    },
  { key: 'gravacao',           label: 'Gravação de Relatórios',icon: 'bi-download'         },
  { key: 'filtro',             label: 'Filtro de Pesquisa',    icon: 'bi-funnel'           },
]

const VERIFICATION_MATCH = {
  disponibilidade: ['disponibilidade'],
  atualidade:      ['atualidade'],
  serie_historica: ['série histórica', 'serie historica', 'série historica', 'serie histórica'],
  gravacao:        ['gravação', 'gravacao', 'relatório', 'relatorio'],
  filtro:          ['filtro'],
}

function countVerificationItems(categories, responses) {
  const result = {}
  for (const item of VERIFICATION_ITEMS) {
    result[item.key] = { atendido: 0, parcial: 0, nao_atendido: 0, total: 0 }
  }
  for (const cat of categories) {
    for (const crit of cat.criteria ?? []) {
      for (const sub of crit.subitems ?? []) {
        const label = (sub.label ?? '').toLowerCase()
        for (const item of VERIFICATION_ITEMS) {
          const matches = VERIFICATION_MATCH[item.key]
          if (matches.some(m => label.includes(m))) {
            const s = responses[sub.id]
            if (s === 'nao_aplicavel' || !s) continue
            result[item.key].total++
            if (s === 'atendido')     result[item.key].atendido++
            else if (s === 'parcial') result[item.key].parcial++
            else                      result[item.key].nao_atendido++
          }
        }
      }
    }
  }
  return result
}

function countStatuses(categories, responses) {
  let atendido = 0, parcial = 0, nao_atendido = 0
  for (const cat of categories) {
    for (const crit of cat.criteria ?? []) {
      for (const sub of crit.subitems ?? []) {
        const s = responses[sub.id]
        if (s === 'atendido')      atendido++
        else if (s === 'parcial')  parcial++
        else if (s === 'nao_atendido') nao_atendido++
      }
    }
  }
  return { atendido, parcial, nao_atendido }
}

function formatDate(iso) {
  if (!iso) return null
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

function toCatCardProps(cat, responses) {
  return {
    title:       cat.name,
    description: cat.description ?? '',
    icon:        cat.icon,
    tone:        cat.tone,
    features: (cat.criteria ?? []).map(crit => ({
      criterion:  crit.text,
      importance: crit.importance ?? null,
      subitems:   (crit.subitems ?? []).map(sub => ({
        text:   sub.label,
        status: responses[sub.id] ?? null,
      })),
    })),
  }
}

function CatModal({ cat, responses, onClose }) {
  const props = toCatCardProps(cat, responses)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box modal-box--card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{props.title}</h2>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Fechar">
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="modal-body modal-body--card">
          <Card {...props} isExpanded={true} onToggle={() => {}} />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [categories, setCategories] = useState([])
  const [responses, setResponses]   = useState({})
  const [lastUpdate, setLastUpdate] = useState(null)
  const [loading, setLoading]       = useState(true)
  const [selectedCat, setSelectedCat] = useState(null)
  useScrollReveal(!loading)

  useEffect(() => {
    async function load() {
      const [catResult, respResult, lastResult] = await Promise.all([
        supabase.from('categories').select('*, criteria(*, subitems(*))'),
        supabase.from('responses').select('subitem_id, status'),
        supabase.from('responses').select('updated_at').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
      ])
      if (catResult.error || !catResult.data) { setLoading(false); return }

      const sorted = (catResult.data ?? [])
        .sort((a, b) => a.order - b.order)
        .map(cat => ({
          ...cat,
          criteria: (cat.criteria ?? [])
            .sort((a, b) => a.order - b.order)
            .map(crit => ({ ...crit, subitems: (crit.subitems ?? []).sort((a, b) => a.order - b.order) })),
        }))

      setCategories(sorted)

      const map = {}
      ;(respResult.data ?? []).forEach(r => { map[r.subitem_id] = r.status })
      setResponses(map)

      if (lastResult.data?.updated_at) setLastUpdate(lastResult.data.updated_at)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <main><SkeletonDashboard /></main>
  }

  const overall      = calcOverallScore(categories, responses)
  const overallColor = scoreColor(overall)
  const counts       = countStatuses(categories, responses)
  const verifCounts  = countVerificationItems(categories, responses)

  const worst3 = [...categories]
    .map(cat => ({ cat, score: calcCategoryScore(cat, responses) }))
    .filter(({ score }) => score !== null && score < 80)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)

  return (
    <main>
      <section className="dash-section">
        <div className="container">

          {/* ── Header ── */}
          <div className="dash-header" data-reveal>
            <h1 className="dash-title">Dashboard</h1>
            <div className="dash-header__meta">
              <p className="dash-subtitle">Visão geral do índice de transparência do Município de Parintins.</p>
              {lastUpdate && (
                <span className="dash-last-update">
                  <i className="bi bi-clock" /> Atualizado em {formatDate(lastUpdate)}
                </span>
              )}
            </div>
          </div>

          {/* ── Stat cards ── */}
          <div className="dash-stats" data-reveal data-reveal-delay="100">
            <div className={`dash-stat dash-stat--overall dash-stat--${overallColor}`}>
              <span className="dash-stat__number">{overall === null ? '—' : `${overall}%`}</span>
              <span className="dash-stat__label">Índice Geral</span>
            </div>
            <div className="dash-stat dash-stat--green">
              <span className="dash-stat__number">{counts.atendido}</span>
              <span className="dash-stat__label">Atendidos</span>
            </div>
            <div className="dash-stat dash-stat--yellow">
              <span className="dash-stat__number">{counts.parcial}</span>
              <span className="dash-stat__label">Parciais</span>
            </div>
            <div className="dash-stat dash-stat--red">
              <span className="dash-stat__number">{counts.nao_atendido}</span>
              <span className="dash-stat__label">Não atendidos</span>
            </div>
          </div>

          {/* ── Por importância ── */}
          <div className="dash-importance" data-reveal data-reveal-delay="150">
            <h2 className="dash-section-title">Por Importância</h2>
            <div className="dash-imp-list">
              {['essencial', 'obrigatoria', 'recomendada'].map(imp => {
                const score = calcImportanceScore(imp, categories, responses)
                const { label } = IMPORTANCE_INFO[imp]
                const color = scoreColor(score)
                return (
                  <div key={imp} className="dash-imp-card">
                    <div className="dash-imp-card__top">
                      <span className="dash-imp-card__label">{label}</span>
                      <span className={`dash-imp-card__score dash-imp-card__score--${color}`}>
                        {score === null ? '—' : `${score}%`}
                      </span>
                    </div>
                    <div className="dash-dim-item__track">
                      <div
                        className={`dash-dim-item__fill dash-dim-item__fill--${color}`}
                        style={{ width: score === null ? '0%' : `${score}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Bem avaliado ── */}
          {(() => {
            const top3 = [...categories]
              .map(cat => ({ cat, score: calcCategoryScore(cat, responses) }))
              .filter(({ score }) => score !== null)
              .sort((a, b) => b.score - a.score)
              .slice(0, 3)
            if (top3.length === 0) return null
            return (
              <div className="dash-importance" data-reveal data-reveal-delay="150">
                <h2 className="dash-section-title">Bem Avaliado</h2>
                <div className="dash-imp-list">
                  {top3.map(({ cat, score }) => {
                    const color = scoreColor(score)
                    return (
                      <button
                        key={cat.id}
                        className="dash-imp-card"
                        onClick={() => setSelectedCat(cat)}
                        type="button"
                        style={{ cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%' }}
                      >
                        <div className="dash-imp-card__top">
                          <span className="dash-imp-card__label">{cat.name}</span>
                          <span className={`dash-imp-card__score dash-imp-card__score--${color}`}>
                            {score}%
                          </span>
                        </div>
                        <div className="dash-dim-item__track">
                          <div
                            className={`dash-dim-item__fill dash-dim-item__fill--${color}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })()}

          {/* ── Piores dimensões ── */}
          {worst3.length > 0 && (
            <div className="dash-worst" data-reveal data-reveal-delay="150">
              <h2 className="dash-section-title">Dimensões que precisam de atenção</h2>
              <div className="dash-worst__list">
                {worst3.map(({ cat, score }) => (
                  <button
                    key={cat.id}
                    className="dash-worst__card"
                    onClick={() => setSelectedCat(cat)}
                    type="button"
                  >
                    <div className="dash-imp-card__top">
                      <span className="dash-imp-card__label">{cat.name}</span>
                      <span className={`dash-imp-card__score dash-imp-card__score--${scoreColor(score)}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="dash-dim-item__track">
                      <div
                        className={`dash-dim-item__fill dash-dim-item__fill--${scoreColor(score)}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Itens de verificação ── */}
          <div className="dash-importance" data-reveal data-reveal-delay="150">
            <h2 className="dash-section-title">Itens de Verificação</h2>
            <div className="dash-verif-list">
              {VERIFICATION_ITEMS.map(item => {
                const c   = verifCounts[item.key]
                const pct = c.total > 0 ? Math.round((c.atendido / c.total) * 100) : null
                const color = scoreColor(pct)
                return (
                  <div key={item.key} className="dash-imp-card">
                    <div className="dash-imp-card__top">
                      <span className="dash-imp-card__label">{item.label}</span>
                      <span className={`dash-imp-card__score dash-imp-card__score--${color}`}>
                        {pct === null ? '—' : `${pct}%`}
                      </span>
                    </div>
                    <div className="dash-verif-counts">
                      <span className="dash-verif-count dash-verif-count--green">
                        <i className="bi bi-check-circle-fill" /> {c.atendido}
                      </span>
                      <span className="dash-verif-count dash-verif-count--yellow">
                        <i className="bi bi-dash-circle-fill" /> {c.parcial}
                      </span>
                      <span className="dash-verif-count dash-verif-count--red">
                        <i className="bi bi-x-circle-fill" /> {c.nao_atendido}
                      </span>
                    </div>
                    <div className="dash-dim-item__track" style={{ marginTop: '0.5rem' }}>
                      <div
                        className={`dash-dim-item__fill dash-dim-item__fill--${color}`}
                        style={{ width: pct === null ? '0%' : `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>


        </div>
      </section>

      {selectedCat && (
        <CatModal
          cat={selectedCat}
          responses={responses}
          onClose={() => setSelectedCat(null)}
        />
      )}
    </main>
  )
}

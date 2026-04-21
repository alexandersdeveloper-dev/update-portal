import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Card from './Card.jsx'
import { SkeletonList } from './Skeleton.jsx'
import { supabase } from './lib/supabase.js'

const IMPORTANCE_LABELS = { essencial: 'essencial', obrigatoria: 'obrigatória', recomendada: 'recomendada' }

function matchesQuery(cat, q) {
  if (!q) return true
  const lower = q.toLowerCase()
  if (cat.title.toLowerCase().includes(lower)) return true
  for (const f of cat.features ?? []) {
    if (f.criterion?.toLowerCase().includes(lower)) return true
    const impLabel = IMPORTANCE_LABELS[f.importance] ?? ''
    if (impLabel.includes(lower)) return true
    for (const sub of f.subitems ?? []) {
      if (sub.text?.toLowerCase().includes(lower)) return true
    }
  }
  return false
}

const PLACEHOLDER_TERMS = ['Despesa…', 'Receita…', 'Essencial…', 'Licitação…', 'Contrato…', 'Obrigatória…']
const TYPE_SPEED   = 60   // ms por caractere ao digitar
const ERASE_SPEED  = 35   // ms por caractere ao apagar
const PAUSE_FULL   = 2000 // pausa quando palavra completa
const PAUSE_EMPTY  = 400  // pausa quando apagou tudo

function SearchBar({ value, onChange, total, visible }) {
  const inputRef      = useRef(null)
  const [focused, setFocused]       = useState(false)
  const [placeholder, setPlaceholder] = useState('')
  const termIndex  = useRef(0)
  const charIndex  = useRef(0)
  const erasing    = useRef(false)
  const timer      = useRef(null)

  useEffect(() => {
    function tick() {
      const term = PLACEHOLDER_TERMS[termIndex.current]

      if (!erasing.current) {
        // digitando
        charIndex.current++
        setPlaceholder(term.slice(0, charIndex.current))
        if (charIndex.current === term.length) {
          erasing.current = true
          timer.current = setTimeout(tick, PAUSE_FULL)
          return
        }
        timer.current = setTimeout(tick, TYPE_SPEED)
      } else {
        // apagando
        charIndex.current--
        setPlaceholder(term.slice(0, charIndex.current))
        if (charIndex.current === 0) {
          erasing.current = false
          termIndex.current = (termIndex.current + 1) % PLACEHOLDER_TERMS.length
          timer.current = setTimeout(tick, PAUSE_EMPTY)
          return
        }
        timer.current = setTimeout(tick, ERASE_SPEED)
      }
    }

    timer.current = setTimeout(tick, PAUSE_EMPTY)
    return () => clearTimeout(timer.current)
  }, [])

  return (
    <div className="search-bar">
      <i className="bi bi-search search-bar__icon" />
      <input
        ref={inputRef}
        className="search-bar__input"
        type="text"
        placeholder={focused || value ? '' : placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label="Buscar"
      />
      {value && (
        <button
          className="search-bar__clear"
          type="button"
          aria-label="Limpar busca"
          onClick={() => { onChange(''); inputRef.current?.focus() }}
        >
          <i className="bi bi-x-lg" />
        </button>
      )}
      {value && (
        <span className="search-bar__count">
          {visible} de {total}
        </span>
      )}
    </div>
  )
}


function App() {
  const location                        = useLocation()
  const [expandedCard, setExpandedCard] = useState(null)
  const [categories, setCategories]     = useState([])
  const [loading, setLoading]           = useState(true)
  const [query, setQuery]               = useState('')

  useEffect(() => {
    async function loadData() {
      const [catResult, respResult] = await Promise.all([
        supabase.from('categories').select('*, criteria(*, subitems(*))'),
        supabase.from('responses').select('subitem_id, status, updated_at'),
      ])

      if (catResult.error || !catResult.data) {
        setLoading(false)
        return
      }

      const respMap = {}
      const updatedAtMap = {}
      ;(respResult.data ?? []).forEach(r => {
        respMap[r.subitem_id] = r.status
        if (r.updated_at) updatedAtMap[r.subitem_id] = r.updated_at
      })


      const sorted = catResult.data
        .sort((a, b) => a.order - b.order)
        .map(cat => {
          const allSubIds = (cat.criteria ?? []).flatMap(c => (c.subitems ?? []).map(s => s.id))
          const catDates  = allSubIds.map(id => updatedAtMap[id]).filter(Boolean)
          const lastUpdate = catDates.length > 0 ? catDates.reduce((a, b) => a > b ? a : b) : null

          return {
            id:          cat.id,
            title:       cat.name,
            description: cat.description ?? '',
            icon:        cat.icon,
            tone:        cat.tone,
            observation: cat.observation ?? null,
            lastUpdate,
            features: (cat.criteria ?? [])
              .sort((a, b) => a.order - b.order)
              .map(crit => ({
                criterion: crit.text,
                importance: crit.importance ?? null,
                subitems: (crit.subitems ?? [])
                  .sort((a, b) => a.order - b.order)
                  .map(sub => ({
                    text:   sub.label,
                    status: respMap[sub.id] ?? null,
                  })),
              })),
          }
        })

      setCategories(sorted)
      setLoading(false)

      // Expandir card vindo do Dashboard
      const expandId = location.state?.expandCategoryId
      if (expandId) {
        const idx = sorted.findIndex(c => c.id === expandId)
        if (idx !== -1) {
          setExpandedCard(idx)
          setTimeout(() => {
            document.getElementById(`cat-${expandId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 150)
        }
      }
    }

    loadData()
  }, [])

  const filtered = categories.filter(cat => matchesQuery(cat, query))
  const hasQuery = query.trim().length > 0

  return (
    <main>
      <section className="cards-section">
        <div className={`cards-grid container${loading ? ' cards-grid--loading' : ' cards-grid--loaded'}`}>
          {loading ? (
            <SkeletonList count={7} />
          ) : (
            <>
              <SearchBar
                value={query}
                onChange={setQuery}
                total={categories.length}
                visible={filtered.length}
              />
              {filtered.length === 0 && (
                <p className="search-bar__empty">Nenhum resultado para "{query}".</p>
              )}
              {filtered.map((cat, index) => (
                <div key={cat.id} id={`cat-${cat.id}`} className="card-wrapper">
                  <Card
                    title={cat.title}
                    description={cat.description}
                    icon={cat.icon}
                    tone={cat.tone}
                    features={cat.features}
                    lastUpdate={cat.lastUpdate}
                    observation={cat.observation}
                    isExpanded={hasQuery || expandedCard === index}
                    onToggle={() => setExpandedCard(expandedCard === index ? null : index)}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default App

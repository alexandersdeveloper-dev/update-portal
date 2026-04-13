import { useState, useEffect } from 'react'
import Card from './Card.jsx'
import { SkeletonList } from './Skeleton.jsx'
import { supabase } from './lib/supabase.js'

function App() {
  const [expandedCard, setExpandedCard] = useState(null)
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

      const respMap = {}
      ;(respResult.data ?? []).forEach(r => { respMap[r.subitem_id] = r.status })

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
              importance: crit.importance ?? null,
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
  )
}

export default App

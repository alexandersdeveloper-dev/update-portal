import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { useNavigate, useLocation, NavLink, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { FullReportPDFDocument, pdf } from '../CategoryPDF.jsx'
import '../styles.css'
import '../admin.css'

// ─── Constantes ───────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: 'atendido',      label: 'Atendido',    icon: 'bi-check-circle-fill', color: 'green'  },
  { value: 'parcial',       label: 'Parcial',      icon: 'bi-dash-circle-fill',  color: 'yellow' },
  { value: 'nao_atendido',  label: 'Não atendido', icon: 'bi-x-circle-fill',     color: 'red'    },
  { value: 'nao_aplicavel', label: 'N/A',          icon: 'bi-slash-circle',      color: 'gray'   },
]

const IMPORTANCE_OPTIONS = [
  { value: 'essencial',   label: 'Essencial'   },
  { value: 'obrigatoria', label: 'Obrigatória' },
  { value: 'recomendada', label: 'Recomendada' },
]

const IMPORTANCE_LABEL = {
  essencial:    { label: 'Essencial',    weight: 3 },
  obrigatoria:  { label: 'Obrigatória',  weight: 2 },
  recomendada:  { label: 'Recomendada',  weight: 1 },
}

const NAV_ITEMS = [
  { to: '/admin',           label: 'Dashboard',  icon: 'bi-speedometer2',     end: true },
  { to: '/admin/avaliacao', label: 'Avaliação',  icon: 'bi-clipboard-check',  end: false },
]

const PAGE_TITLES = {
  '/admin':           'Dashboard',
  '/admin/avaliacao': 'Avaliação',
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AdminContext = createContext(null)
function useAdmin() { return useContext(AdminContext) }

// ─── Helpers de score ─────────────────────────────────────────────────────────

function statusValue(status) {
  if (status === 'atendido') return 1.0
  if (status === 'parcial')  return 0.5
  return 0.0
}

function calcCategoryScore(category, responses) {
  let weightedSum = 0, totalWeight = 0
  for (const crit of category.criteria ?? []) {
    const weight = IMPORTANCE_LABEL[crit.importance]?.weight ?? 1
    let critSum = 0, critCount = 0
    for (const sub of crit.subitems ?? []) {
      if (!sub.counts_for_score) continue
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

function scoreColor(score) {
  if (score === null) return 'gray'
  if (score >= 80)   return 'green'
  if (score >= 50)   return 'yellow'
  return 'red'
}

// ─── Score components ─────────────────────────────────────────────────────────

function ScoreBadge({ score }) {
  const color = scoreColor(score)
  return (
    <span className={`score-badge score-badge--${color}`}>
      {score === null ? '—' : `${score}%`}
    </span>
  )
}

function ScorePanel({ categories, responses }) {
  const overall = calcOverallScore(categories, responses)
  const color = scoreColor(overall)

  const byImportance = ['essencial', 'obrigatoria', 'recomendada'].map(imp => {
    let weightedSum = 0, totalWeight = 0, count = 0
    for (const cat of categories) {
      for (const crit of cat.criteria ?? []) {
        if ((crit.importance ?? 'recomendada') !== imp) continue
        count++
        let critSum = 0, critCount = 0
        for (const sub of crit.subitems ?? []) {
          if (!sub.counts_for_score) continue
          const status = responses[sub.id]
          if (status === 'nao_aplicavel') continue
          critSum += statusValue(status)
          critCount++
        }
        if (critCount === 0) continue
        weightedSum += critSum / critCount
        totalWeight++
      }
    }
    const avg = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) : null
    return { imp, label: IMPORTANCE_LABEL[imp].label, score: avg, count }
  })

  return (
    <div className="score-panel">
      <div className={`score-panel__overall score-panel__overall--${color}`}>
        <span className="score-panel__number">{overall === null ? '—' : `${overall}%`}</span>
        <span className="score-panel__label">Resultado Geral</span>
      </div>
      <div className="score-panel__breakdown">
        {byImportance.map(({ imp, label, score, count }) => (
          <div key={imp} className={`score-panel__item score-panel__item--${imp}`}>
            <span className="score-panel__item-label">{label}</span>
            <span className={`score-panel__item-score score-panel__item-score--${scoreColor(score)}`}>
              {score === null ? '—' : `${score}%`}
            </span>
            <span className="score-panel__item-count">{count} {count === 1 ? 'critério' : 'critérios'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Status selector ──────────────────────────────────────────────────────────

function StatusSelector({ subitemId, current, onSave, saving }) {
  return (
    <div className="status-selector" role="group">
      {STATUS_OPTIONS.map(opt => (
        <button
          key={opt.value}
          className={`status-btn status-btn--${opt.color}${current === opt.value ? ' active' : ''}`}
          onClick={() => onSave(subitemId, opt.value)}
          disabled={saving}
          title={opt.label}
          type="button"
        >
          <i className={`bi ${opt.icon}`} />
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  )
}

// ─── Subitem Row ──────────────────────────────────────────────────────────────

function SubitemRow({ subitem, responses, onSave, saving, editMode, onRefresh }) {
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(subitem.label)
  const [countsForScore, setCountsForScore] = useState(subitem.counts_for_score)
  const [busy, setBusy] = useState(false)

  const status = responses[subitem.id] ?? null

  async function handleSave() {
    setBusy(true)
    const { error } = await supabase
      .from('subitems')
      .update({ label, counts_for_score: countsForScore })
      .eq('id', subitem.id)
    setBusy(false)
    if (!error) { setEditing(false); onRefresh() }
    else alert('Erro ao salvar: ' + error.message)
  }

  function handleCancel() {
    setEditing(false)
    setLabel(subitem.label)
    setCountsForScore(subitem.counts_for_score)
  }

  async function handleDelete() {
    if (!confirm(`Excluir subitem?\n"${subitem.label}"`)) return
    setBusy(true)
    await supabase.from('responses').delete().eq('subitem_id', subitem.id)
    const { error } = await supabase.from('subitems').delete().eq('id', subitem.id)
    setBusy(false)
    if (!error) onRefresh()
    else alert('Erro ao excluir: ' + error.message)
  }

  if (editMode && editing) {
    return (
      <div className="subitem-row subitem-row--editing">
        <div className="edit-form-inline">
          <input
            className="edit-input"
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Texto do subitem"
            autoFocus
          />
          <label className="edit-checkbox-label">
            <input
              type="checkbox"
              checked={countsForScore}
              onChange={e => setCountsForScore(e.target.checked)}
            />
            Conta no score
          </label>
          <div className="edit-actions">
            <button className="edit-btn edit-btn--save" onClick={handleSave} disabled={busy} type="button">
              {busy ? <i className="bi bi-arrow-repeat admin-spin" /> : <i className="bi bi-check-lg" />}
              Salvar
            </button>
            <button className="edit-btn edit-btn--cancel" onClick={handleCancel} type="button">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`subitem-row${status && !editMode ? ` subitem-row--${status}` : ''}`}>
      <div className="subitem-row__label">
        <i className="bi bi-dot" />
        {subitem.label}
        {!subitem.counts_for_score && <span className="badge-no-score">não conta</span>}
      </div>
      {editMode ? (
        <div className="inline-edit-actions">
          <button className="icon-btn icon-btn--edit" onClick={() => setEditing(true)} title="Editar subitem" type="button">
            <i className="bi bi-pencil" />
          </button>
          <button className="icon-btn icon-btn--delete" onClick={handleDelete} disabled={busy} title="Excluir subitem" type="button">
            {busy ? <i className="bi bi-arrow-repeat admin-spin" /> : <i className="bi bi-trash" />}
          </button>
        </div>
      ) : (
        <>
          <StatusSelector
            subitemId={subitem.id}
            current={status}
            onSave={onSave}
            saving={saving === subitem.id}
          />
          {saving === subitem.id && (
            <span className="subitem-saving"><i className="bi bi-arrow-repeat admin-spin" /></span>
          )}
        </>
      )}
    </div>
  )
}

// ─── Criterion Block ──────────────────────────────────────────────────────────

function CriterionBlock({ criterion, responses, onSave, saving, editMode, onRefresh }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(criterion.text)
  const [importance, setImportance] = useState(criterion.importance ?? 'recomendada')
  const [busy, setBusy] = useState(false)

  async function handleSave() {
    setBusy(true)
    const { error } = await supabase
      .from('criteria')
      .update({ text, importance })
      .eq('id', criterion.id)
    setBusy(false)
    if (!error) { setEditing(false); onRefresh() }
    else alert('Erro ao salvar: ' + error.message)
  }

  function handleCancel() {
    setEditing(false)
    setText(criterion.text)
    setImportance(criterion.importance ?? 'recomendada')
  }

  async function handleDelete() {
    if (!confirm(`Excluir critério "${criterion.code}"?\nTodos os subitens e respostas serão removidos.`)) return
    setBusy(true)
    const subIds = (criterion.subitems ?? []).map(s => s.id)
    if (subIds.length) await supabase.from('responses').delete().in('subitem_id', subIds)
    await supabase.from('subitems').delete().eq('criterion_id', criterion.id)
    const { error } = await supabase.from('criteria').delete().eq('id', criterion.id)
    setBusy(false)
    if (!error) onRefresh()
    else alert('Erro ao excluir: ' + error.message)
  }

  async function handleAddSubitem() {
    const maxOrder = Math.max(0, ...(criterion.subitems ?? []).map(s => s.order ?? 0))
    const { error } = await supabase.from('subitems').insert({
      criterion_id: criterion.id,
      label: 'Novo subitem',
      order: maxOrder + 1,
      counts_for_score: true,
    })
    if (!error) onRefresh()
    else alert('Erro ao adicionar subitem: ' + error.message)
  }

  return (
    <div className="criterion-block">
      <div className="criterion-block__title">
        <span className="criterion-block__code">{criterion.code}</span>
        {editing ? (
          <div className="edit-form-inline edit-form-inline--criterion">
            <textarea
              className="edit-input edit-textarea"
              value={text}
              onChange={e => setText(e.target.value)}
              rows={3}
              autoFocus
            />
            <select className="edit-select" value={importance} onChange={e => setImportance(e.target.value)}>
              {IMPORTANCE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div className="edit-actions">
              <button className="edit-btn edit-btn--save" onClick={handleSave} disabled={busy} type="button">
                {busy ? <i className="bi bi-arrow-repeat admin-spin" /> : <i className="bi bi-check-lg" />}
                Salvar
              </button>
              <button className="edit-btn edit-btn--cancel" onClick={handleCancel} type="button">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <span>{criterion.text.replace(/^\d+\.\d+\s*/, '')}</span>
            <span className={`importance-chip importance-chip--${criterion.importance ?? 'recomendada'}`}>
              {IMPORTANCE_LABEL[criterion.importance ?? 'recomendada']?.label}
            </span>
            {editMode && (
              <span className="inline-edit-actions inline-edit-actions--inline">
                <button className="icon-btn icon-btn--edit" onClick={() => setEditing(true)} title="Editar critério" type="button">
                  <i className="bi bi-pencil" />
                </button>
                <button className="icon-btn icon-btn--delete" onClick={handleDelete} disabled={busy} title="Excluir critério" type="button">
                  {busy ? <i className="bi bi-arrow-repeat admin-spin" /> : <i className="bi bi-trash" />}
                </button>
              </span>
            )}
          </>
        )}
      </div>
      <div className="criterion-block__subitems">
        {(criterion.subitems ?? []).map(sub => (
          <SubitemRow
            key={sub.id}
            subitem={sub}
            responses={responses}
            onSave={onSave}
            saving={saving}
            editMode={editMode}
            onRefresh={onRefresh}
          />
        ))}
        {editMode && (
          <button className="add-btn add-btn--subitem" onClick={handleAddSubitem} type="button">
            <i className="bi bi-plus-circle" /> Adicionar subitem
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Category Card ────────────────────────────────────────────────────────────

function AdminCategoryCard({ category, responses, onSave, saving, isExpanded, onToggle, editMode, onRefresh, onToast }) {
  const [editingMeta, setEditingMeta] = useState(false)
  const [name, setName] = useState(category.name)
  const [icon, setIcon] = useState(category.icon)
  const [observation, setObservation] = useState(category.observation ?? '')
  const [savingObs, setSavingObs] = useState(false)
  const [busy, setBusy] = useState(false)

  const score = calcCategoryScore(category, responses)

  async function handleSaveMeta() {
    setBusy(true)
    const { error } = await supabase
      .from('categories')
      .update({ name, icon })
      .eq('id', category.id)
    setBusy(false)
    if (!error) { setEditingMeta(false); onRefresh() }
    else alert('Erro ao salvar: ' + error.message)
  }

  function handleCancelMeta() {
    setEditingMeta(false)
    setName(category.name)
    setIcon(category.icon)
    setObservation(category.observation ?? '')
  }

  async function handleDeleteCategory() {
    if (!confirm(`Excluir a categoria "${category.name}"?\n\nTODOS os critérios, subitems e respostas serão permanentemente removidos.`)) return
    setBusy(true)
    const subIds = (category.criteria ?? []).flatMap(c => (c.subitems ?? []).map(s => s.id))
    if (subIds.length) await supabase.from('responses').delete().in('subitem_id', subIds)
    for (const crit of category.criteria ?? []) {
      await supabase.from('subitems').delete().eq('criterion_id', crit.id)
    }
    await supabase.from('criteria').delete().eq('category_id', category.id)
    const { error } = await supabase.from('categories').delete().eq('id', category.id)
    setBusy(false)
    if (!error) onRefresh()
    else alert('Erro ao excluir: ' + error.message)
  }

  async function handleSaveObservation() {
    setSavingObs(true)
    const { error } = await supabase
      .from('categories')
      .update({ observation: observation || null })
      .eq('id', category.id)
    setSavingObs(false)
    if (!error) onToast('Observação salva com sucesso.')
    else onToast('Erro ao salvar observação.', 'error')
  }

  async function handleAddCriterion() {
    const maxOrder = Math.max(0, ...(category.criteria ?? []).map(c => c.order ?? 0))
    const nextNum = (category.criteria ?? []).length + 1
    const code = `${category.order ?? 1}.${nextNum}`
    const { error } = await supabase.from('criteria').insert({
      category_id: category.id,
      code,
      text: `${code} Novo critério`,
      importance: 'recomendada',
      order: maxOrder + 1,
    })
    if (!error) onRefresh()
    else alert('Erro ao adicionar critério: ' + error.message)
  }

  return (
    <article className={`admin-card${editMode ? ' admin-card--edit-mode' : ''}`} style={{ '--tone': category.tone }}>
      {editMode && editingMeta ? (
        <div className="admin-card__edit-header">
          <div className="edit-form-meta">
            <div className="edit-form-row">
              <label className="edit-label">Nome da categoria</label>
              <input className="edit-input" value={name} onChange={e => setName(e.target.value)} autoFocus />
            </div>
            <div className="edit-form-row">
              <label className="edit-label">Ícone Bootstrap</label>
              <div className="edit-icon-row">
                <i className={`bi ${icon} edit-icon-preview`} />
                <input className="edit-input" value={icon} onChange={e => setIcon(e.target.value)} placeholder="ex: bi-building" />
              </div>
            </div>
            <div className="edit-form-row">
              <label className="edit-label">Observação</label>
              <textarea
                className="edit-input edit-textarea"
                value={observation}
                onChange={e => setObservation(e.target.value)}
                rows={3}
                placeholder="Texto interno visível no painel público como aviso..."
              />
            </div>
            <div className="edit-actions">
              <button className="edit-btn edit-btn--save" onClick={handleSaveMeta} disabled={busy} type="button">
                {busy ? <i className="bi bi-arrow-repeat admin-spin" /> : <i className="bi bi-check-lg" />}
                Salvar
              </button>
              <button className="edit-btn edit-btn--cancel" onClick={handleCancelMeta} type="button">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="admin-card__header-wrap">
          <button className="admin-card__header" onClick={onToggle} type="button">
            <div className="admin-card__header-left">
              <div className="priority-card__marker" />
              <div className="priority-card__icon">
                <i className={`bi ${category.icon}`} />
              </div>
              <div className="admin-card__titles">
                <h3 className="admin-card__name">{category.name}</h3>
              </div>
            </div>
            <div className="admin-card__header-right">
              <ScoreBadge score={score} />
              <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'} admin-card__chevron`} />
            </div>
          </button>
          {editMode && (
            <div className="card-edit-actions">
              <button className="icon-btn icon-btn--edit" onClick={() => setEditingMeta(true)} title="Editar categoria" type="button">
                <i className="bi bi-pencil" />
              </button>
              <button className="icon-btn icon-btn--delete" onClick={handleDeleteCategory} disabled={busy} title="Excluir categoria" type="button">
                {busy ? <i className="bi bi-arrow-repeat admin-spin" /> : <i className="bi bi-trash" />}
              </button>
            </div>
          )}
        </div>
      )}

      {isExpanded && (
        <div className="admin-card__content">
          <div className="obs-field">
            <label className="obs-field__label">
              <i className="bi bi-info-circle" /> Observação interna
            </label>
            <textarea
              className="obs-field__input"
              value={observation}
              onChange={e => setObservation(e.target.value)}
              rows={3}
              placeholder="Descreva a situação desta categoria para o chefe..."
            />
            <button className="obs-field__save" type="button" onClick={handleSaveObservation} disabled={savingObs}>
              {savingObs
                ? <><i className="bi bi-arrow-repeat admin-spin" /> Salvando...</>
                : <><i className="bi bi-check-lg" /> Salvar observação</>}
            </button>
          </div>
          {(category.criteria ?? []).map(crit => (
            <CriterionBlock
              key={crit.id}
              criterion={crit}
              responses={responses}
              onSave={onSave}
              saving={saving}
              editMode={editMode}
              onRefresh={onRefresh}
            />
          ))}
          {editMode && (
            <div className="add-item-wrap">
              <button className="add-btn add-btn--criterion" onClick={handleAddCriterion} type="button">
                <i className="bi bi-plus-circle" /> Adicionar critério
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function AdminSidebar({ session, onSignOut, open, onClose }) {
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`admin-sidebar${open ? ' admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__brand-icon">
            <i className="bi bi-shield-fill-check" />
          </div>
          <div className="admin-sidebar__brand-text">
            <span className="admin-sidebar__brand-name">Radar Admin</span>
            <span className="admin-sidebar__brand-sub">Parintins</span>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          <span className="admin-sidebar__section-label">Menu</span>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-sidebar__nav-item${isActive ? ' admin-sidebar__nav-item--active' : ''}`
              }
              onClick={onClose}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">
              <i className="bi bi-person-fill" />
            </div>
            <div className="admin-sidebar__user-info">
              <span className="admin-sidebar__user-label">Administrador</span>
              <span className="admin-sidebar__user-email">{session?.user?.email}</span>
            </div>
          </div>
          <button className="admin-sidebar__signout" onClick={onSignOut} type="button">
            <i className="bi bi-box-arrow-right" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}

// ─── Content topbar ───────────────────────────────────────────────────────────

function AdminContentTopbar({ onMenuOpen }) {
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] ?? 'Admin'

  return (
    <header className="admin-content-topbar">
      <div className="admin-content-topbar__left">
        <button className="admin-hamburger" type="button" aria-label="Abrir menu" onClick={onMenuOpen}>
          <i className="bi bi-list" />
        </button>
        <h1 className="admin-content-topbar__title">{title}</h1>
      </div>
      <div className="admin-content-topbar__right">
        <a href="/" className="admin-topbar-link" target="_blank" rel="noreferrer">
          <i className="bi bi-eye" />
          <span>Ver portal</span>
        </a>
      </div>
    </header>
  )
}

// ─── Página: Dashboard ────────────────────────────────────────────────────────

export function AdminDashboard() {
  const { categories, responses } = useAdmin()

  const totalCriteria = categories.reduce((s, c) => s + (c.criteria?.length ?? 0), 0)
  const totalSubitems = categories.reduce((s, c) =>
    s + (c.criteria ?? []).reduce((cs, cr) => cs + (cr.subitems?.length ?? 0), 0), 0)
  const answered = Object.values(responses).filter(v => v && v !== 'nao_aplicavel').length

  const stats = [
    { icon: 'bi-grid-1x2-fill',       label: 'Categorias',         value: categories.length,  color: 'blue'   },
    { icon: 'bi-list-check',           label: 'Critérios',          value: totalCriteria,       color: 'purple' },
    { icon: 'bi-check2-circle',        label: 'Itens respondidos',  value: `${answered} / ${totalSubitems}`, color: 'green' },
  ]

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h2 className="admin-page__title">Visão Geral</h2>
        <p className="admin-page__subtitle">Resumo do índice de transparência do município.</p>
      </div>

      <div className="admin-dash-stats">
        {stats.map(s => (
          <div key={s.label} className={`admin-dash-stat admin-dash-stat--${s.color}`}>
            <div className="admin-dash-stat__icon"><i className={`bi ${s.icon}`} /></div>
            <div className="admin-dash-stat__body">
              <span className="admin-dash-stat__value">{s.value}</span>
              <span className="admin-dash-stat__label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <ScorePanel categories={categories} responses={responses} />
    </div>
  )
}

// ─── Página: Avaliação ────────────────────────────────────────────────────────

export function AdminAvaliacao() {
  const { categories, responses, fetchData, saveResponse, saving, showToast } = useAdmin()
  const [expandedCard, setExpandedCard] = useState(null)
  const [editMode, setEditMode]         = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)

  async function handleExportAll() {
    if (downloadingPdf) return
    setDownloadingPdf(true)
    try {
      const cats = categories.map(cat => ({
        title:       cat.name,
        description: cat.description ?? '',
        tone:        cat.tone,
        features: (cat.criteria ?? []).map(crit => ({
          criterion:  crit.text,
          importance: crit.importance ?? null,
          subitems:   (crit.subitems ?? []).map(sub => ({
            text:   sub.label,
            status: responses[sub.id] ?? null,
          })),
        })),
      }))
      const blob = await pdf(<FullReportPDFDocument categories={cats} />).toBlob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = 'relatorio-transparencia-parintins.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloadingPdf(false)
    }
  }

  async function handleAddCategory() {
    const maxOrder = Math.max(0, ...categories.map(c => c.order ?? 0))
    const { error } = await supabase.from('categories').insert({
      name: 'Nova categoria',
      icon: 'bi-folder',
      tone: '#2f86de',
      order: maxOrder + 1,
    })
    if (!error) fetchData()
    else alert('Erro ao adicionar categoria: ' + error.message)
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header admin-page__header--row">
        <div>
          <h2 className="admin-page__title">Avaliação</h2>
          <p className="admin-page__subtitle">Gerencie as categorias, critérios e respostas.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="admin-pdf-btn"
            onClick={handleExportAll}
            disabled={downloadingPdf}
            type="button"
          >
            <i className={`bi ${downloadingPdf ? 'bi-hourglass-split' : 'bi-file-earmark-pdf'}`} />
            {downloadingPdf ? 'Gerando...' : 'PDF'}
          </button>
          <button
            className={`admin-edit-toggle${editMode ? ' admin-edit-toggle--active' : ''}`}
            onClick={() => setEditMode(v => !v)}
            type="button"
          >
            <i className={`bi ${editMode ? 'bi-pencil-fill' : 'bi-pencil'}`} />
            {editMode ? 'Edição ativa' : 'Editar estrutura'}
          </button>
        </div>
      </div>

      {editMode && (
        <div className="edit-mode-banner">
          <i className="bi bi-pencil-fill" />
          <span>Modo de edição ativo — use <strong>✏️</strong> para editar e <strong>🗑</strong> para excluir.</span>
        </div>
      )}

      <div className="admin-cards-list">
        {categories.map((cat, i) => (
          <AdminCategoryCard
            key={cat.id}
            category={cat}
            responses={responses}
            onSave={saveResponse}
            saving={saving}
            isExpanded={expandedCard === i}
            onToggle={() => setExpandedCard(expandedCard === i ? null : i)}
            editMode={editMode}
            onRefresh={fetchData}
            onToast={showToast}
          />
        ))}
      </div>

      {editMode && (
        <div className="add-item-wrap add-item-wrap--category">
          <button className="add-btn add-btn--category" onClick={handleAddCategory} type="button">
            <i className="bi bi-plus-circle-fill" /> Adicionar nova categoria
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Layout principal (AdminLayout) ──────────────────────────────────────────

export default function Admin() {
  const { session, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()

  const [categories, setCategories]   = useState([])
  const [responses, setResponses]     = useState({})
  const [loadingData, setLoadingData] = useState(true)
  const [loadError, setLoadError]     = useState(null)
  const [saving, setSaving]           = useState(null)
  const [toast, setToast]             = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    if (!authLoading && !session) navigate('/login')
  }, [session, authLoading, navigate])

  const fetchData = useCallback(async () => {
    const [catResult, respResult] = await Promise.all([
      supabase.from('categories').select('*, criteria(*, subitems(*))'),
      supabase.from('responses').select('subitem_id, status'),
    ])

    if (catResult.error) {
      setLoadError(catResult.error.message)
      setLoadingData(false)
      return
    }

    const sorted = (catResult.data ?? [])
      .sort((a, b) => a.order - b.order)
      .map(cat => ({
        ...cat,
        criteria: (cat.criteria ?? [])
          .sort((a, b) => a.order - b.order)
          .map(crit => ({
            ...crit,
            subitems: (crit.subitems ?? []).sort((a, b) => a.order - b.order),
          })),
      }))

    setCategories(sorted)

    if (!respResult.error) {
      const map = {}
      ;(respResult.data ?? []).forEach(r => { map[r.subitem_id] = r.status })
      setResponses(map)
    }

    setLoadingData(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const saveResponse = useCallback(async (subitemId, status) => {
    setSaving(subitemId)
    setResponses(prev => ({ ...prev, [subitemId]: status }))
    const { error } = await supabase
      .from('responses')
      .upsert({ subitem_id: subitemId, status }, { onConflict: 'subitem_id' })
    if (error) console.error('Erro ao salvar:', error.message)
    setSaving(null)
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  if (authLoading) return null

  if (loadingData) {
    return (
      <div className="admin-loading">
        <i className="bi bi-arrow-repeat admin-spin" />
        <span>Carregando avaliação...</span>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="admin-loading">
        <i className="bi bi-exclamation-triangle" style={{ color: '#dc3545' }} />
        <span style={{ color: '#dc3545' }}>Erro ao carregar dados</span>
        <small style={{ color: 'var(--color-muted)', maxWidth: '400px', textAlign: 'center' }}>{loadError}</small>
      </div>
    )
  }

  return (
    <AdminContext.Provider value={{ categories, responses, fetchData, saveResponse, saving, showToast }}>
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>
          <i className={`bi ${toast.type === 'error' ? 'bi-x-circle-fill' : 'bi-check-circle-fill'}`} />
          {toast.message}
        </div>
      )}
      <div className="admin-shell">
        <AdminSidebar
          session={session}
          onSignOut={handleSignOut}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="admin-content-area">
          <AdminContentTopbar onMenuOpen={() => setSidebarOpen(true)} />
          <main className="admin-content-main">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminContext.Provider>
  )
}

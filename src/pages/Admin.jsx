import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { useNavigate, useLocation, NavLink, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { FullReportPDFDocument, pdf } from '../CategoryPDF.jsx'
import { calcCategoryScore, calcOverallScore, scoreColor, statusValue } from '../lib/scoring.js'
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
  essencial:   { label: 'Essencial'   },
  obrigatoria: { label: 'Obrigatória' },
  recomendada: { label: 'Recomendada' },
}

const ICON_RE = /^bi-[a-z0-9-]+$/

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

// ─── ConfirmDialog ────────────────────────────────────────────────────────────

function ConfirmDialog({ title, description, confirmLabel = 'Excluir', onConfirm, onCancel }) {
  return (
    <div className="confirm-dialog__overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="cdlg-title">
        <h3 className="confirm-dialog__title" id="cdlg-title">{title}</h3>
        {description && <p className="confirm-dialog__desc">{description}</p>}
        <div className="confirm-dialog__actions">
          <button className="confirm-dialog__cancel" onClick={onCancel} type="button">Cancelar</button>
          <button className="confirm-dialog__confirm" onClick={onConfirm} type="button">{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton screens ─────────────────────────────────────────────────────────

function AdminDashboardSkeleton() {
  return (
    <div className="admin-page">
      <div className="admin-page__header admin-page__header--row">
        <div>
          <div className="skel skel--title" />
          <div className="skel skel--subtitle" />
        </div>
        <div className="skel skel--btn" />
      </div>
      <div className="skel" style={{ height: 96, borderRadius: 16, marginBottom: 24 }} />
      <div className="admin-kpis">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="admin-kpi">
            <div className="admin-kpi__top">
              <div className="skel" style={{ height: 11, width: 72 }} />
              <div className="skel skel--icon-sm" />
            </div>
            <div className="skel skel--num" />
            <div className="skel" style={{ height: 10, width: 90, marginTop: 6 }} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 28 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '0 2px' }}>
            <div className="skel" style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0 }} />
            <div className="skel" style={{ height: 12, width: `${70 + (i % 5) * 30}px`, flexShrink: 0 }} />
            <div className="skel" style={{ flex: 1, height: 6, borderRadius: 4 }} />
            <div className="skel" style={{ width: 34, height: 12, flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminAvaliacaoSkeleton() {
  return (
    <div className="admin-page">
      <div className="admin-page__header admin-page__header--row">
        <div>
          <div className="skel skel--title" />
          <div className="skel skel--subtitle" />
        </div>
        <div className="skel skel--btn" />
      </div>
      <div className="admin-cards-list">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px' }}>
              <div className="skel skel--card-icon" />
              <div style={{ flex: 1 }}>
                <div className="skel" style={{ height: 14, width: `${90 + (i % 5) * 35}px` }} />
                <div className="skel" style={{ height: 3, width: '100%', marginTop: 7, borderRadius: 2 }} />
              </div>
              <div className="skel skel--badge" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Helpers locais ───────────────────────────────────────────────────────────

function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000)
  if (s < 60)    return 'agora há pouco'
  if (s < 3600)  return `há ${Math.floor(s / 60)} min`
  if (s < 86400) return `há ${Math.floor(s / 3600)} h`
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(iso))
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
  const [fieldError, setFieldError] = useState(null)
  const { showToast, showDialog } = useAdmin()

  const status = responses[subitem.id] ?? null

  async function handleSave() {
    const trimmed = label.trim()
    if (!trimmed) { setFieldError('O texto do subitem não pode estar vazio.'); return }
    if (trimmed.length > 200) { setFieldError('O texto do subitem deve ter no máximo 200 caracteres.'); return }
    setFieldError(null)
    setBusy(true)
    const { error } = await supabase
      .from('subitems')
      .update({ label: trimmed, counts_for_score: countsForScore })
      .eq('id', subitem.id)
    setBusy(false)
    if (!error) { setLabel(trimmed); setEditing(false); onRefresh() }
    else showToast('Erro ao salvar: ' + error.message, 'error')
  }

  function handleCancel() {
    setEditing(false)
    setLabel(subitem.label)
    setCountsForScore(subitem.counts_for_score)
    setFieldError(null)
  }

  async function handleDelete() {
    showDialog({
      title: 'Excluir subitem',
      description: `Excluir "${subitem.label}"? Esta ação não pode ser desfeita.`,
      confirmLabel: 'Excluir',
      onConfirm: async () => {
        setBusy(true)
        await supabase.from('responses').delete().eq('subitem_id', subitem.id)
        const { error } = await supabase.from('subitems').delete().eq('id', subitem.id)
        setBusy(false)
        if (!error) { onRefresh(); showToast('Subitem excluído.') }
        else showToast('Erro ao excluir: ' + error.message, 'error')
      },
    })
  }

  if (editMode && editing) {
    return (
      <div className="subitem-row subitem-row--editing">
        <div className="edit-form-inline">
          <input
            className="edit-input"
            value={label}
            onChange={e => { setLabel(e.target.value); if (fieldError) setFieldError(null) }}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); handleSave() }
              if (e.key === 'Escape') handleCancel()
            }}
            placeholder="Texto do subitem"
            autoFocus
          />
          {fieldError && <p className="field-error">{fieldError}</p>}
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
  const [fieldError, setFieldError] = useState(null)
  const { showToast, showDialog } = useAdmin()

  async function handleSave() {
    const trimmed = text.trim()
    if (!trimmed) { setFieldError('O texto do critério não pode estar vazio.'); return }
    if (trimmed.length > 400) { setFieldError('O texto do critério deve ter no máximo 400 caracteres.'); return }
    setFieldError(null)
    setBusy(true)
    const { error } = await supabase
      .from('criteria')
      .update({ text: trimmed, importance })
      .eq('id', criterion.id)
    setBusy(false)
    if (!error) { setText(trimmed); setEditing(false); onRefresh() }
    else showToast('Erro ao salvar: ' + error.message, 'error')
  }

  function handleCancel() {
    setEditing(false)
    setText(criterion.text)
    setImportance(criterion.importance ?? 'recomendada')
    setFieldError(null)
  }

  async function handleDelete() {
    showDialog({
      title: 'Excluir critério',
      description: `Excluir critério "${criterion.code}"? Todos os subitens e respostas serão removidos.`,
      confirmLabel: 'Excluir',
      onConfirm: async () => {
        setBusy(true)
        const subIds = (criterion.subitems ?? []).map(s => s.id)
        if (subIds.length) await supabase.from('responses').delete().in('subitem_id', subIds)
        await supabase.from('subitems').delete().eq('criterion_id', criterion.id)
        const { error } = await supabase.from('criteria').delete().eq('id', criterion.id)
        setBusy(false)
        if (!error) { onRefresh(); showToast('Critério excluído.') }
        else showToast('Erro ao excluir: ' + error.message, 'error')
      },
    })
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
    else showToast('Erro ao adicionar subitem: ' + error.message, 'error')
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
              onChange={e => { setText(e.target.value); if (fieldError) setFieldError(null) }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave() }
                if (e.key === 'Escape') handleCancel()
              }}
              rows={3}
              autoFocus
            />
            {fieldError && <p className="field-error">{fieldError}</p>}
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

function AdminCategoryCard({ category, responses, onSave, saving, isExpanded, onToggle, editMode, onRefresh }) {
  const [editingMeta, setEditingMeta] = useState(false)
  const [name, setName] = useState(category.name)
  const [icon, setIcon] = useState(category.icon)
  const [observation, setObservation] = useState(category.observation ?? '')
  const [savingObs, setSavingObs] = useState(false)
  const [busy, setBusy] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const { showToast, showDialog } = useAdmin()

  const score = calcCategoryScore(category, responses)

  async function handleSaveMeta() {
    const trimmedName = name.trim()
    const trimmedIcon = icon.trim()
    const errs = {}
    if (!trimmedName) errs.name = 'O nome não pode estar vazio.'
    else if (trimmedName.length > 120) errs.name = 'Máximo 120 caracteres.'
    if (!ICON_RE.test(trimmedIcon)) errs.icon = 'Formato inválido. Use: bi-nome-do-icone'
    if (Object.keys(errs).length) { setFieldErrors(errs); return }
    setFieldErrors({})
    setBusy(true)
    const { error } = await supabase
      .from('categories')
      .update({ name: trimmedName, icon: trimmedIcon })
      .eq('id', category.id)
    setBusy(false)
    if (!error) { setName(trimmedName); setIcon(trimmedIcon); setEditingMeta(false); onRefresh() }
    else showToast('Erro ao salvar: ' + error.message, 'error')
  }

  function handleCancelMeta() {
    setEditingMeta(false)
    setName(category.name)
    setIcon(category.icon)
    setObservation(category.observation ?? '')
    setFieldErrors({})
  }

  async function handleDeleteCategory() {
    showDialog({
      title: 'Excluir categoria',
      description: `Excluir "${category.name}"? TODOS os critérios, subitens e respostas serão removidos permanentemente.`,
      confirmLabel: 'Excluir tudo',
      onConfirm: async () => {
        setBusy(true)
        const subIds = (category.criteria ?? []).flatMap(c => (c.subitems ?? []).map(s => s.id))
        if (subIds.length) await supabase.from('responses').delete().in('subitem_id', subIds)
        for (const crit of category.criteria ?? []) {
          await supabase.from('subitems').delete().eq('criterion_id', crit.id)
        }
        await supabase.from('criteria').delete().eq('category_id', category.id)
        const { error } = await supabase.from('categories').delete().eq('id', category.id)
        setBusy(false)
        if (!error) { onRefresh(); showToast('Categoria excluída.') }
        else showToast('Erro ao excluir: ' + error.message, 'error')
      },
    })
  }

  async function handleSaveObservation() {
    if (observation.length > 1000) { showToast('A observação deve ter no máximo 1000 caracteres.', 'error'); return }
    setSavingObs(true)
    const { error } = await supabase
      .from('categories')
      .update({ observation: observation.trim() || null })
      .eq('id', category.id)
    setSavingObs(false)
    if (!error) showToast('Observação salva com sucesso.')
    else showToast('Erro ao salvar observação.', 'error')
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
    else showToast('Erro ao adicionar critério: ' + error.message, 'error')
  }

  return (
    <article className={`admin-card${editMode ? ' admin-card--edit-mode' : ''}`} style={{ '--tone': category.tone }}>
      {editMode && editingMeta ? (
        <div className="admin-card__edit-header">
          <div className="edit-form-meta">
            <div className="edit-form-row">
              <label className="edit-label">Nome da categoria</label>
              <input className="edit-input" value={name} onChange={e => { setName(e.target.value); if (fieldErrors.name) setFieldErrors(p => ({ ...p, name: null })) }} autoFocus />
              {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
            </div>
            <div className="edit-form-row">
              <label className="edit-label">Ícone Bootstrap</label>
              <div className="edit-icon-row">
                <i className={`bi ${icon} edit-icon-preview`} />
                <input className="edit-input" value={icon} onChange={e => { setIcon(e.target.value); if (fieldErrors.icon) setFieldErrors(p => ({ ...p, icon: null })) }} placeholder="ex: bi-building" />
              </div>
              {fieldErrors.icon && <p className="field-error">{fieldErrors.icon}</p>}
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
                {score !== null && (
                  <div className="admin-card__progress">
                    <div
                      className="admin-card__progress-bar"
                      style={{ width: `${score}%`, background: score >= 80 ? 'var(--a-blue)' : score >= 50 ? 'var(--a-yellow)' : 'var(--a-red)' }}
                    />
                  </div>
                )}
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
            <span className="obs-field__count">{observation.length} / 1000</span>
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
  const email = session?.user?.email ?? ''
  const initials = email.slice(0, 2).toUpperCase()

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`admin-sidebar${open ? ' admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__stripe"><i /><i /><i /><i /></div>

        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__brand-icon">
            <i className="bi bi-shield-fill-check" />
          </div>
          <div className="admin-sidebar__brand-text">
            <span className="admin-sidebar__brand-e">Portal</span>
            <span className="admin-sidebar__brand-t">Painel Admin</span>
          </div>
        </div>

        <div className="admin-sidebar__section">
          <span className="admin-sidebar__section-label">Menu</span>
        </div>
        <nav className="admin-sidebar__nav">
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

        <div className="admin-sidebar__user">
          <div className="admin-sidebar__avatar">{initials}</div>
          <div className="admin-sidebar__user-info">
            <span className="admin-sidebar__user-label">Administrador</span>
            <span className="admin-sidebar__user-email">{email}</span>
          </div>
          <button className="admin-sidebar__lo" onClick={onSignOut} title="Sair" type="button">
            <i className="bi bi-box-arrow-right" />
          </button>
        </div>
      </aside>
    </>
  )
}

// ─── Content topbar ───────────────────────────────────────────────────────────

function AdminContentTopbar({ onMenuOpen }) {
  const location = useLocation()
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Admin'

  return (
    <header className="admin-content-topbar">
      <div className="admin-content-topbar__left">
        <button className="admin-hamburger" type="button" aria-label="Abrir menu" onClick={onMenuOpen}>
          <i className="bi bi-list" />
        </button>
        <div className="admin-breadcrumb">
          <span>Transparência</span>
          <span className="admin-breadcrumb__sep">/</span>
          <span className="admin-breadcrumb__now">{pageTitle}</span>
        </div>
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
  const { categories, responses, loadingData, lastUpdate } = useAdmin()
  const navigate = useNavigate()
  if (loadingData) return <AdminDashboardSkeleton />

  const overall     = calcOverallScore(categories, responses)
  const heroAccent  = overall === null ? 'r' : overall >= 80 ? 'b' : overall >= 50 ? 'y' : 'r'

  const totalCriteria = categories.reduce((s, c) => s + (c.criteria?.length ?? 0), 0)
  const totalSubitems = categories.reduce((s, c) =>
    s + (c.criteria ?? []).reduce((cs, cr) => cs + (cr.subitems?.length ?? 0), 0), 0)

  const totalResponded  = Object.keys(responses).length
  const naoAplicavel    = Object.values(responses).filter(v => v === 'nao_aplicavel').length
  const unanswered      = totalSubitems - totalResponded
  const completude      = totalSubitems > 0 ? Math.round((totalResponded / totalSubitems) * 100) : 0

  const catScores = categories
    .map(c => ({ ...c, score: calcCategoryScore(c, responses) }))
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1))

  const alertas = catScores.filter(c => c.score !== null && c.score < 50)

  const goToAvaliacao = (categoryId) =>
    navigate('/admin/avaliacao', categoryId ? { state: { expandCategoryId: categoryId } } : undefined)

  return (
    <div className="admin-page">
      <div className="admin-page__header admin-page__header--row">
        <div>
          <h2 className="admin-page__title">Dashboard</h2>
          <p className="admin-page__subtitle">Centro operacional do índice de transparência.</p>
        </div>
        <button className="admin-dash-cta" onClick={() => goToAvaliacao()} type="button">
          <i className="bi bi-clipboard-check" /> Ir para Avaliação
        </button>
      </div>

      {/* ── Score Hero ── */}
      <div className={`admin-dash-hero admin-dash-hero--${heroAccent}`}>
        <div className="admin-dash-hero__main">
          <span className="admin-dash-hero__num">
            {overall === null ? '—' : `${overall}%`}
          </span>
          <div className="admin-dash-hero__info">
            <span className="admin-dash-hero__label">Índice de Transparência</span>
            {lastUpdate && (
              <span className="admin-dash-hero__ts">
                <i className="bi bi-clock" /> {timeAgo(lastUpdate)}
              </span>
            )}
          </div>
        </div>
        {overall !== null && (
          <div className="admin-dash-hero__bar">
            <div
              className={`admin-dash-hero__bar-fill admin-dash-hero__bar-fill--${heroAccent}`}
              style={{ width: `${overall}%` }}
            />
          </div>
        )}
      </div>

      {/* ── KPIs secundários ── */}
      <div className="admin-kpis">
        <div className="admin-kpi admin-kpi--b">
          <div className="admin-kpi__top">
            <span className="admin-kpi__label">Completude</span>
            <span className="admin-kpi__icon"><i className="bi bi-check2-all" /></span>
          </div>
          <div className="admin-kpi__num">{completude}%</div>
          <div className="admin-kpi__sub">{totalResponded} de {totalSubitems} itens</div>
        </div>
        <div className={`admin-kpi admin-kpi--${unanswered > 0 ? 'r' : 'b'}`}>
          <div className="admin-kpi__top">
            <span className="admin-kpi__label">Sem resposta</span>
            <span className="admin-kpi__icon"><i className="bi bi-hourglass" /></span>
          </div>
          <div className="admin-kpi__num">{unanswered}</div>
          <div className="admin-kpi__sub">aguardando avaliação</div>
        </div>
        <div className="admin-kpi admin-kpi--o">
          <div className="admin-kpi__top">
            <span className="admin-kpi__label">N/A</span>
            <span className="admin-kpi__icon"><i className="bi bi-slash-circle" /></span>
          </div>
          <div className="admin-kpi__num">{naoAplicavel}</div>
          <div className="admin-kpi__sub">excluídos do cálculo</div>
        </div>
        <div className="admin-kpi admin-kpi--y">
          <div className="admin-kpi__top">
            <span className="admin-kpi__label">Critérios</span>
            <span className="admin-kpi__icon"><i className="bi bi-list-check" /></span>
          </div>
          <div className="admin-kpi__num">{totalCriteria}</div>
          <div className="admin-kpi__sub">{categories.length} categorias</div>
        </div>
      </div>

      {/* ── Alertas ── */}
      {alertas.length > 0 && (
        <div className="admin-dash-section">
          <div className="admin-dash-section__hd">
            <h3 className="admin-dash-section__title">
              <i className="bi bi-exclamation-triangle-fill" /> Requer atenção
            </h3>
            <span className="admin-dash-section__count">
              {alertas.length} {alertas.length === 1 ? 'categoria' : 'categorias'} abaixo de 50%
            </span>
          </div>
          <div className="admin-dash-alerts">
            {alertas.map(cat => (
              <button
                key={cat.id}
                className="admin-dash-alert"
                onClick={() => goToAvaliacao(cat.id)}
                type="button"
              >
                <div className="admin-dash-alert__left">
                  <i className={`bi ${cat.icon}`} />
                  <span>{cat.name}</span>
                </div>
                <div className="admin-dash-alert__right">
                  <span className={`score-badge score-badge--${scoreColor(cat.score)}`}>
                    {cat.score}%
                  </span>
                  <i className="bi bi-arrow-right admin-dash-alert__arrow" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Mapa de categorias ── */}
      <div className="admin-dash-section">
        <div className="admin-dash-section__hd">
          <h3 className="admin-dash-section__title">Todas as categorias</h3>
        </div>
        <div className="admin-dash-catmap">
          {catScores.map(cat => {
            const color = scoreColor(cat.score)
            return (
              <button
                key={cat.id}
                className="admin-dash-catmap__item"
                onClick={() => goToAvaliacao(cat.id)}
                type="button"
              >
                <i className={`bi ${cat.icon} admin-dash-catmap__icon`} />
                <span className="admin-dash-catmap__name">{cat.name}</span>
                <div className="admin-dash-catmap__track">
                  <div
                    className={`admin-dash-catmap__fill admin-dash-catmap__fill--${color}`}
                    style={{ width: cat.score !== null ? `${cat.score}%` : '0%' }}
                  />
                </div>
                <span className={`admin-dash-catmap__pct admin-dash-catmap__pct--${color}`}>
                  {cat.score !== null ? `${cat.score}%` : '—'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Por importância ── */}
      <ScorePanel categories={categories} responses={responses} />
    </div>
  )
}

// ─── Página: Avaliação ────────────────────────────────────────────────────────

export function AdminAvaliacao() {
  const { categories, responses, fetchData, saveResponse, saving, showToast, loadingData } = useAdmin()
  const location = useLocation()
  const [expandedCard, setExpandedCard] = useState(null)
  const [editMode, setEditMode]         = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (location.state?.expandCategoryId && categories.length > 0) {
      const idx = categories.findIndex(c => c.id === location.state.expandCategoryId)
      if (idx !== -1) setExpandedCard(idx)
    }
  }, [categories, location.state?.expandCategoryId])

  const filtered = search.trim()
    ? categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.criteria ?? []).some(cr => cr.text.toLowerCase().includes(search.toLowerCase()))
      )
    : categories

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
    else showToast('Erro ao adicionar categoria: ' + error.message, 'error')
  }

  if (loadingData) return <AdminAvaliacaoSkeleton />

  return (
    <div className="admin-page">
      <div className="admin-page__header admin-page__header--row">
        <div>
          <div className="admin-page__title-row">
            <h2 className="admin-page__title">Avaliação</h2>
            {editMode && (
              <span className="edit-mode-pill">
                <i className="bi bi-pencil-fill" />
                Modo edição
              </span>
            )}
          </div>
          <p className="admin-page__subtitle">Gerencie as categorias, critérios e respostas.</p>
        </div>
        <div className="admin-page__header-actions">
          <div className="admin-search" role="search">
            <i className="bi bi-search admin-search__icon" aria-hidden="true" />
            <input
              className="admin-search__input"
              type="search"
              placeholder="Pesquisar..."
              aria-label="Pesquisar categorias e critérios"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            {search && (
              <button
                className="admin-search__clear"
                onClick={() => setSearch('')}
                type="button"
                aria-label="Limpar busca"
                tabIndex={-1}
              >
                <i className="bi bi-x-lg" />
              </button>
            )}
          </div>
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

      {search.trim() && filtered.length === 0 && (
        <p className="admin-empty-search">
          <i className="bi bi-search" />
          Nenhum resultado para "<strong>{search}</strong>".
        </p>
      )}
      <div className="admin-cards-list">
        {filtered.map((cat, i) => (
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
  const [dialog, setDialog]           = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [lastUpdate, setLastUpdate]   = useState(null)

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), type === 'error' ? 6000 : 3000)
  }

  function showDialog(opts) {
    setDialog(opts)
  }

  useEffect(() => {
    if (!authLoading && !session) navigate('/login')
  }, [session, authLoading, navigate])

  const fetchData = useCallback(async () => {
    const [catResult, respResult, lastResult] = await Promise.all([
      supabase.from('categories').select('*, criteria(*, subitems(*))'),
      supabase.from('responses').select('subitem_id, status'),
      supabase.from('responses').select('updated_at').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
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

    if (lastResult?.data?.updated_at) setLastUpdate(lastResult.data.updated_at)

    setLoadingData(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const saveResponse = useCallback(async (subitemId, status) => {
    const prevStatus = responses[subitemId]
    setSaving(subitemId)
    setResponses(prev => ({ ...prev, [subitemId]: status }))
    const { error } = await supabase
      .from('responses')
      .upsert({ subitem_id: subitemId, status }, { onConflict: 'subitem_id' })
    setSaving(null)
    if (error) {
      setResponses(prev => ({ ...prev, [subitemId]: prevStatus }))
      showToast('Erro ao salvar resposta. Tente novamente.', 'error')
    }
  }, [responses])

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  if (authLoading) return null

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
    <AdminContext.Provider value={{ categories, responses, fetchData, saveResponse, saving, showToast, showDialog, loadingData, lastUpdate }}>
      {dialog && (
        <ConfirmDialog
          title={dialog.title}
          description={dialog.description}
          confirmLabel={dialog.confirmLabel}
          onConfirm={() => { setDialog(null); dialog.onConfirm() }}
          onCancel={() => setDialog(null)}
        />
      )}
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`} role="alert" aria-live="assertive">
          <i className={`bi ${toast.type === 'error' ? 'bi-x-circle-fill' : 'bi-check-circle-fill'}`} />
          <span>{toast.message}</span>
          <button className="admin-toast__close" onClick={() => setToast(null)} type="button" aria-label="Fechar">
            <i className="bi bi-x-lg" />
          </button>
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

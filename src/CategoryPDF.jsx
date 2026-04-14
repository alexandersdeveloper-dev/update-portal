import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const STATUS_LABEL = {
  atendido:      { label: 'Atendido',      color: '#16a34a' },
  parcial:       { label: 'Parcial',       color: '#d97706' },
  nao_atendido:  { label: 'Não atendido',  color: '#dc2626' },
  nao_aplicavel: { label: 'Não aplicável', color: '#94a3b8' },
}

const IMPORTANCE_LABEL = {
  essencial:   { label: 'Essencial',   color: '#16a34a' },
  obrigatoria: { label: 'Obrigatória', color: '#2f86de' },
  recomendada: { label: 'Recomendada', color: '#d97706' },
}

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
  if (pct >= 80) return '#16a34a'
  if (pct >= 50) return '#d97706'
  return '#dc2626'
}

function formatDate(iso) {
  if (!iso) return null
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#0f172a',
    paddingTop: 44,
    paddingBottom: 52,
    paddingHorizontal: 44,
    backgroundColor: '#ffffff',
  },

  // ── Header ──
  headerWrap: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerAccent: {
    width: 4,
    borderRadius: 99,
    marginRight: 14,
    flexShrink: 0,
  },
  headerLeft: { flex: 1, flexDirection: 'column', gap: 4 },
  portalName: { fontSize: 7.5, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },
  catName: { fontSize: 17, fontFamily: 'Helvetica-Bold', color: '#0f172a' },
  catDesc: { fontSize: 9, color: '#475569', marginTop: 2 },
  headerRight: { alignItems: 'flex-end', justifyContent: 'center', paddingLeft: 16 },
  scoreBadge: { fontSize: 24, fontFamily: 'Helvetica-Bold' },
  scoreLabel: { fontSize: 7.5, color: '#64748b', textAlign: 'right' },

  // ── Progress bar ──
  progressWrap: { marginBottom: 22 },
  progressTrack: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 99, marginBottom: 4 },
  progressFill: { height: 6, borderRadius: 99 },
  progressText: { fontSize: 8, color: '#64748b' },

  // ── Criterion (sem card, só separador) ──
  critBlock: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  critHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  critAccent: { width: 3, height: '100%', borderRadius: 99, flexShrink: 0 },
  critText: { fontFamily: 'Helvetica-Bold', fontSize: 10, flex: 1, color: '#1e293b' },
  impChip: {
    fontSize: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 99,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── Subitem ──
  subItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginBottom: 5, paddingLeft: 9 },
  subDot: { width: 5, height: 5, borderRadius: 99, marginTop: 2.5, flexShrink: 0 },
  subText: { fontSize: 9, color: '#334155', flex: 1, lineHeight: 1.4 },
  subStatus: { fontSize: 8, fontFamily: 'Helvetica-Bold', flexShrink: 0 },

  // ── Top accent bar ──
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: 4,
  },
  topBarSegment: { flex: 1, height: 4 },

  // ── Footer ──
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
  footerLeft: { fontSize: 7, color: '#94a3b8', flex: 1, lineHeight: 1.5 },
  footerRight: { fontSize: 7, color: '#94a3b8', textAlign: 'right' },
})

export function CategoryPDFDocument({ title, description, features, lastUpdate, tone }) {
  const pct      = calcProgress(features)
  const scoreClr = pct !== null ? progressColor(pct) : '#94a3b8'
  const accentClr = tone ?? '#2f86de'
  const now      = formatDate(new Date().toISOString())
  const updatedAt = lastUpdate ? formatDate(lastUpdate) : null

  return (
    <Document title={title} author="Radar Parintins">
      <Page size="A4" style={s.page}>

        {/* ── Top accent bar ── */}
        <View style={s.topBar} fixed>
          <View style={[s.topBarSegment, { backgroundColor: '#2f86de' }]} />
          <View style={[s.topBarSegment, { backgroundColor: '#c47b36' }]} />
          <View style={[s.topBarSegment, { backgroundColor: '#ffbf3f' }]} />
          <View style={[s.topBarSegment, { backgroundColor: '#ef6a4c' }]} />
        </View>

        {/* ── Header ── */}
        <View style={s.headerWrap}>
          <View style={[s.headerAccent, { backgroundColor: accentClr }]} />
          <View style={s.headerLeft}>
            <Text style={s.portalName}>Radar Parintins — Portal da Transparência</Text>
            <Text style={s.catName}>{title}</Text>
            {description ? <Text style={s.catDesc}>{description}</Text> : null}
          </View>
          {pct !== null && (
            <View style={s.headerRight}>
              <Text style={[s.scoreBadge, { color: scoreClr }]}>{pct}%</Text>
              <Text style={s.scoreLabel}>atendido</Text>
            </View>
          )}
        </View>

        {/* ── Progress bar ── */}
        {pct !== null && (
          <View style={s.progressWrap}>
            <View style={s.progressTrack}>
              <View style={[s.progressFill, { width: `${pct}%`, backgroundColor: scoreClr }]} />
            </View>
            <Text style={s.progressText}>{pct}% dos critérios atendidos</Text>
          </View>
        )}

        {/* ── Criteria ── */}
        {(features ?? []).map((f, fi) => {
          const imp = IMPORTANCE_LABEL[f.importance]
          return (
            <View key={fi} style={s.critBlock} wrap={false}>
              <View style={s.critHeader}>
                <View style={[s.critAccent, { backgroundColor: imp?.color ?? accentClr, minHeight: 12 }]} />
                <Text style={s.critText}>{f.criterion}</Text>
                {imp && (
                  <Text style={[s.impChip, { backgroundColor: imp.color }]}>{imp.label}</Text>
                )}
              </View>
              {(f.subitems ?? []).map((sub, si) => {
                const st = STATUS_LABEL[sub.status] ?? { label: 'Sem resposta', color: '#cbd5e1' }
                return (
                  <View key={si} style={s.subItem}>
                    <View style={[s.subDot, { backgroundColor: st.color }]} />
                    <Text style={s.subText}>{sub.text}</Text>
                    <Text style={[s.subStatus, { color: st.color }]}>{st.label}</Text>
                  </View>
                )
              })}
            </View>
          )
        })}

        {/* ── Footer ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerLeft}>
            {updatedAt ? `Atualizado em ${updatedAt}` : 'Radar Parintins'}
            {'\n'}Este documento não possui caráter oficial. Consulte os canais oficiais do Município para fins formais.
          </Text>
          <Text style={s.footerRight}>Gerado em {now}</Text>
        </View>

      </Page>
    </Document>
  )
}

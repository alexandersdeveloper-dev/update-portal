import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
export { pdf }

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

const IMPORTANCE_WEIGHT = { essencial: 2, obrigatoria: 1.5, recomendada: 1 }

function calcWeightedScore(features) {
  let weightedSum = 0, totalWeight = 0
  for (const f of features ?? []) {
    const weight = IMPORTANCE_WEIGHT[f.importance] ?? 1
    let sum = 0, count = 0
    for (const sub of f.subitems ?? []) {
      if (!sub.status || sub.status === 'nao_aplicavel') continue
      if (sub.status === 'atendido') sum += 1
      else if (sub.status === 'parcial') sum += 0.5
      count++
    }
    if (count === 0) continue
    weightedSum += (sum / count) * weight
    totalWeight += weight
  }
  if (totalWeight === 0) return null
  return Math.round((weightedSum / totalWeight) * 100)
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

const rs = StyleSheet.create({
  // Cover page
  cover: {
    fontFamily: 'Helvetica',
    backgroundColor: '#031d44',
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  coverTopBar: { flexDirection: 'row', height: 6 },
  coverTopSeg: { flex: 1, height: 6 },
  coverBody: { flex: 1, padding: 52, justifyContent: 'center' },
  coverEyebrow: { fontSize: 8, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14 },
  coverTitle: { fontSize: 30, fontFamily: 'Helvetica-Bold', color: '#fff', marginBottom: 8, lineHeight: 1.2 },
  coverSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 40 },
  coverScoreWrap: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 6 },
  coverScoreNum: { fontSize: 56, fontFamily: 'Helvetica-Bold' },
  coverScoreLabel: { fontSize: 13, color: 'rgba(255,255,255,0.55)', paddingBottom: 6 },
  coverMeta: { fontSize: 8, color: 'rgba(255,255,255,0.35)', marginTop: 48 },

  // Category section divider
  catDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  catAccent: { width: 4, borderRadius: 99, marginRight: 12, flexShrink: 0 },
  catTitleBlock: { flex: 1 },
  catTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#0f172a' },
  catDesc: { fontSize: 8.5, color: '#64748b', marginTop: 2 },
  catScoreBadge: { fontSize: 20, fontFamily: 'Helvetica-Bold' },
  catScoreLabel: { fontSize: 7, color: '#94a3b8', textAlign: 'right' },
})

export function FullReportPDFDocument({ categories, generatedAt }) {
  const now = formatDate(generatedAt ?? new Date().toISOString())

  const catScores = categories.map(cat => {
    const score = calcWeightedScore(cat.features)
    return { ...cat, score }
  })

  const scores = catScores.map(c => c.score).filter(s => s !== null)
  const overall = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
  const overallColor = overall !== null ? progressColor(overall) : '#94a3b8'

  return (
    <Document title="Relatório Completo de Transparência" author="Radar Parintins">

      {/* ── Capa ── */}
      <Page size="A4" style={rs.cover}>
        <View style={rs.coverTopBar}>
          {['#2f86de', '#c47b36', '#ffbf3f', '#ef6a4c'].map((c, i) => (
            <View key={i} style={[rs.coverTopSeg, { backgroundColor: c }]} />
          ))}
        </View>
        <View style={rs.coverBody}>
          <Text style={rs.coverEyebrow}>Município de Parintins — AM</Text>
          <Text style={rs.coverTitle}>Relatório de{'\n'}Transparência</Text>
          <Text style={rs.coverSub}>Avaliação completa de todos os critérios do Portal da Transparência</Text>
          {overall !== null && (
            <View style={rs.coverScoreWrap}>
              <Text style={[rs.coverScoreNum, { color: overallColor }]}>{overall}%</Text>
              <Text style={rs.coverScoreLabel}>índice geral</Text>
            </View>
          )}
          <Text style={rs.coverMeta}>Gerado em {now} · Radar Parintins · Este documento não possui caráter oficial.</Text>
        </View>
      </Page>

      {/* ── Uma página por categoria ── */}
      {catScores.map((cat, ci) => {
        const pct      = cat.score
        const scoreClr = pct !== null ? progressColor(pct) : '#94a3b8'
        const accent   = cat.tone ?? '#2f86de'

        return (
          <Page key={ci} size="A4" style={s.page}>
            <View style={s.topBar} fixed>
              {['#2f86de', '#c47b36', '#ffbf3f', '#ef6a4c'].map((c, i) => (
                <View key={i} style={[s.topBarSegment, { backgroundColor: c }]} />
              ))}
            </View>

            {/* Header da categoria */}
            <View style={rs.catDivider}>
              <View style={[rs.catAccent, { backgroundColor: accent, minHeight: 36 }]} />
              <View style={rs.catTitleBlock}>
                <Text style={rs.catTitle}>{cat.title}</Text>
                {cat.description ? <Text style={rs.catDesc}>{cat.description}</Text> : null}
              </View>
              {pct !== null && (
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[rs.catScoreBadge, { color: scoreClr }]}>{pct}%</Text>
                  <Text style={rs.catScoreLabel}>atendido</Text>
                </View>
              )}
            </View>

            {/* Barra de progresso */}
            {pct !== null && (
              <View style={s.progressWrap}>
                <View style={s.progressTrack}>
                  <View style={[s.progressFill, { width: `${pct}%`, backgroundColor: scoreClr }]} />
                </View>
                <Text style={s.progressText}>{pct}% dos critérios atendidos</Text>
              </View>
            )}

            {/* Critérios */}
            {(cat.features ?? []).map((f, fi) => {
              const imp = IMPORTANCE_LABEL[f.importance]
              return (
                <View key={fi} style={s.critBlock} wrap={false}>
                  <View style={s.critHeader}>
                    <View style={[s.critAccent, { backgroundColor: imp?.color ?? accent, minHeight: 12 }]} />
                    <Text style={s.critText}>{f.criterion}</Text>
                    {imp && <Text style={[s.impChip, { backgroundColor: imp.color }]}>{imp.label}</Text>}
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

            {/* Footer */}
            <View style={s.footer} fixed>
              <Text style={s.footerLeft}>
                {`${ci + 1} de ${categories.length} — ${cat.title}`}
                {'\n'}Este documento não possui caráter oficial.
              </Text>
              <Text style={s.footerRight}>Gerado em {now}</Text>
            </View>
          </Page>
        )
      })}
    </Document>
  )
}

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

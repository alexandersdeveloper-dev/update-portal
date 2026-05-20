// Pesos canônicos de importância — usados em Admin e no portal público
export const IMPORTANCE_WEIGHT = {
  essencial:   3,
  obrigatoria: 2,
  recomendada: 1,
}

export function statusValue(status) {
  if (status === 'atendido') return 1.0
  if (status === 'parcial')  return 0.5
  return 0.0
}

export function calcCategoryScore(category, responses) {
  let weightedSum = 0, totalWeight = 0
  for (const crit of category.criteria ?? []) {
    const weight = IMPORTANCE_WEIGHT[crit.importance] ?? 1
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

export function calcOverallScore(categories, responses) {
  const scores = categories.map(c => calcCategoryScore(c, responses)).filter(s => s !== null)
  if (scores.length === 0) return null
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

export function calcImportanceScore(importance, categories, responses) {
  let sum = 0, total = 0
  for (const cat of categories) {
    for (const crit of cat.criteria ?? []) {
      if ((crit.importance ?? 'recomendada') !== importance) continue
      let critSum = 0, critCount = 0
      for (const sub of crit.subitems ?? []) {
        if (!sub.counts_for_score) continue
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

export function scoreColor(score) {
  if (score === null) return 'gray'
  if (score >= 80)   return 'green'
  if (score >= 50)   return 'yellow'
  return 'red'
}

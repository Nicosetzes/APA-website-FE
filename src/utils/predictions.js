// Helpers de la "Prob. de éxito" (Rating APA 2.0) de un duelo de playoff. El BE
// manda `prediction` con `p1`/`p2` entre 0 y 1; en pantalla se muestran enteros.

// `{ p1Pct, p2Pct }` en enteros entre 1 y 99, o `null` si no hay predicción
// válida. Solo usa `p1`: `p2Pct` es el complemento, así que siempre suman 100.
export const formatPrediction = (prediction) => {
  const p1 = prediction?.p1
  if (typeof p1 !== 'number' || !Number.isFinite(p1) || p1 < 0 || p1 > 1) {
    return null
  }
  const p1Pct = Math.min(99, Math.max(1, Math.round(p1 * 100)))
  return { p1Pct, p2Pct: 100 - p1Pct }
}

const sameId = (a, b) => a != null && b != null && String(a) === String(b)

// Lado que avanzó (`'p1'`, `'p2'` o `null`). Se decide con `outcome` y no con el
// marcador: en un cruce definido por penales los goles quedan empatados.
export const getAdvancingSide = ({
  outcome,
  teamP1,
  teamP2,
  playerP1,
  playerP2,
}) => {
  const winnerTeamId = outcome?.teamThatWon?.id
  if (winnerTeamId != null) {
    if (sameId(winnerTeamId, teamP1?.id)) return 'p1'
    if (sameId(winnerTeamId, teamP2?.id)) return 'p2'
    return null
  }

  const winnerPlayerId = outcome?.playerThatWon?.id
  if (sameId(winnerPlayerId, playerP1?.id)) return 'p1'
  if (sameId(winnerPlayerId, playerP2?.id)) return 'p2'
  return null
}

// Lado que le ganó a las odds: avanzó quien tenía menos del 50 % mostrado. Solo
// aplica a partidos jugados y válidos con predicción; un 50/50 no es batacazo.
export const getUpsetSide = ({
  prediction,
  played,
  valid,
  outcome,
  teamP1,
  teamP2,
  playerP1,
  playerP2,
}) => {
  if (!played || valid === false) return null
  const pct = formatPrediction(prediction)
  if (!pct) return null

  const side = getAdvancingSide({ outcome, teamP1, teamP2, playerP1, playerP2 })
  if (side === 'p1') return pct.p1Pct < 50 ? 'p1' : null
  if (side === 'p2') return pct.p2Pct < 50 ? 'p2' : null
  return null
}

const isProbability = (value) =>
  typeof value === 'number' &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= 1

export const formatOutcomesPrediction = (prediction) => {
  if (prediction?.kind !== 'outcomes') return null
  const { p1Win, draw, p2Win } = prediction
  if (![p1Win, draw, p2Win].every(isProbability)) return null
  const total = p1Win + draw + p2Win
  if (Math.abs(total - 1) > 0.01) return null
  // Mayor resto: se redondea para abajo y los puntos que faltan para llegar a
  // 100 van a los restos más grandes (empates en orden p1, empate, p2).
  const raw = [p1Win, draw, p2Win].map((value) => (value / total) * 100)
  const pcts = raw.map(Math.floor)
  const byRemainder = raw
    .map((value, index) => ({ index, remainder: value - pcts[index] }))
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index)
  let missing = 100 - pcts.reduce((sum, value) => sum + value, 0)
  for (const { index } of byRemainder) {
    if (missing <= 0) break
    pcts[index] += 1
    missing -= 1
  }
  // Una probabilidad mayor a 0 nunca se muestra como 0 %: sube a 1 y el punto
  // se le saca al segmento más grande en ese momento.
  raw.forEach((value, index) => {
    if (value > 0 && pcts[index] === 0) {
      pcts[index] = 1
      pcts[pcts.indexOf(Math.max(...pcts))] -= 1
    }
  })
  // 100 % en un segmento es degenerado y el motor no lo produce.
  if (pcts.some((value) => value === 100)) return null
  const [p1Pct, drawPct, p2Pct] = pcts
  return { p1Pct, drawPct, p2Pct }
}

export const getOutcomesUpsetSide = ({
  prediction,
  played,
  valid,
  scoreP1,
  scoreP2,
}) => {
  if (!played || valid === false) return null
  if (!Number.isInteger(scoreP1) || !Number.isInteger(scoreP2)) return null
  if (scoreP1 === scoreP2) return null
  const pct = formatOutcomesPrediction(prediction)
  if (!pct) return null
  if (scoreP1 > scoreP2) return pct.p1Pct < pct.p2Pct ? 'p1' : null
  return pct.p2Pct < pct.p1Pct ? 'p2' : null
}

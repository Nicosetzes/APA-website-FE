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

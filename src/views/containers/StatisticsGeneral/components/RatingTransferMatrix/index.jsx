import { buildRatingTransferMatrix } from 'utils/ratingHistory'
import { describeRatingChange } from 'utils/ratings'
import {
  Caption,
  CellMatches,
  CellValue,
  ColorDot,
  CornerHeader,
  Intro,
  MatrixCard,
  MatrixTable,
  NoMatches,
  PlayerHeader,
  StateMessage,
  TableScroll,
  Title,
} from './styled'

const matchCount = (matches) =>
  `${matches} ${matches === 1 ? 'partido' : 'partidos'}`

const RatingTransferMatrix = ({
  players,
  transfers,
  selectedIds,
  colors,
  mode = 'period',
}) => {
  // Un BE anterior no trae el agregado: se omite solo esta sección.
  if (!Array.isArray(transfers)) return null

  const matrix = buildRatingTransferMatrix({
    players,
    transfers,
    selectedIds,
  })
  const scopeLabel = mode === 'tournament' ? 'torneo' : 'período'
  const titleId = 'rating-transfer-title'

  return (
    <MatrixCard as="section" aria-labelledby={titleId}>
      <Title id={titleId}>Matriz de transferencia de rating</Title>
      <Intro>
        Cada celda muestra el saldo neto que el jugador de la fila obtuvo del
        jugador de la columna.
      </Intro>

      {matrix.players.length < 2 ? (
        <StateMessage role="status">
          Elegí al menos dos jugadores para comparar sus transferencias.
        </StateMessage>
      ) : !matrix.hasCrossings ? (
        <StateMessage role="status">
          No hay cruces rateables entre los jugadores seleccionados en este{' '}
          {scopeLabel}.
        </StateMessage>
      ) : (
        <TableScroll
          role="region"
          aria-label="Matriz de transferencia de rating desplazable"
          tabIndex={0}
          data-testid="rating-transfer-scroll"
        >
          <MatrixTable>
            <Caption>Saldo neto de rating por cruce en el {scopeLabel}</Caption>
            <thead>
              <tr>
                <CornerHeader scope="col">Jugador</CornerHeader>
                {matrix.players.map((player) => (
                  <PlayerHeader scope="col" key={player.id}>
                    <ColorDot
                      $color={colors.get(player.id)}
                      aria-hidden="true"
                    />
                    {player.name}
                  </PlayerHeader>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.rows.map(({ player, cells }) => (
                <tr key={player.id}>
                  <PlayerHeader as="th" scope="row">
                    <ColorDot
                      $color={colors.get(player.id)}
                      aria-hidden="true"
                    />
                    {player.name}
                  </PlayerHeader>
                  {cells.map((cell, columnIndex) => {
                    const opponent = matrix.players[columnIndex]
                    if (cell === null) {
                      return (
                        <td key={opponent.id}>
                          <NoMatches aria-label="No aplica">—</NoMatches>
                        </td>
                      )
                    }
                    if (cell === undefined) {
                      return (
                        <td key={opponent.id}>
                          <NoMatches>
                            —<small>Sin partidos</small>
                          </NoMatches>
                        </td>
                      )
                    }
                    const change = describeRatingChange(cell.points)
                    const matches = matchCount(cell.matches)
                    return (
                      <td
                        key={opponent.id}
                        aria-label={`${player.name}: saldo ${change.text} frente a ${opponent.name}, ${matches}`}
                      >
                        <CellValue $trend={change.trend}>
                          {change.text}
                        </CellValue>
                        <CellMatches>{matches}</CellMatches>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </MatrixTable>
        </TableScroll>
      )}
    </MatrixCard>
  )
}

export default RatingTransferMatrix

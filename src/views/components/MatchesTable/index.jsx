import { database } from 'api'
import { formatPlayedAt } from 'utils/playedAt'
import {
  CustomTable,
  DateText,
  PenaltyScore,
  PlayerTag,
  Scoreboard,
  ScoreBadge,
  TableWrapper,
  TeamBlock,
  TournamentLink,
  TypeBadge,
} from './styled'
import { formatDate, formatTime } from 'utils/dates'

const TYPE_LABELS = {
  regular: 'Reg',
  playin: 'P-In',
  playoff: 'P-Off',
}

const getPenaltyScores = (outcome, teamP1) => {
  if (!outcome?.penalties || !outcome.teamThatWon) return null

  const p1Won = outcome.teamThatWon.id === teamP1?.id
  return {
    p1: p1Won ? outcome.scoreFromTeamThatWon : outcome.scoreFromTeamThatLost,
    p2: p1Won ? outcome.scoreFromTeamThatLost : outcome.scoreFromTeamThatWon,
  }
}

const MatchesTable = ({ matches }) => {
  // Sin fecha (partido no jugado) o fecha inválida: '-' sin hora.
  const getDateParts = (playedAt) => {
    const date = formatDate(playedAt)
    return date
      ? { date, time: formatTime(playedAt) }
      : { date: '-', time: null }
  }

  return (
    <TableWrapper>
      <CustomTable>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Torneo</th>
            <th>Tipo</th>
            <th>Partido</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => {
            const {
              _id,
              tournament,
              playerP1,
              teamP1,
              scoreP1,
              playerP2,
              teamP2,
              scoreP2,
              type,
              outcome,
              group,
              playedAt,
              playedAtPrecision,
            } = match

            // Fecha no exacta: sólo la etiqueta, sin hora.
            const inexactDate = formatPlayedAt(playedAt, playedAtPrecision)
            const { date, time } = inexactDate
              ? { date: inexactDate, time: null }
              : getDateParts(playedAt)
            const isP1Winner =
              teamP1?.id != null &&
              outcome?.teamThatWon?.id === teamP1.id &&
              !outcome?.draw
            const isP2Winner =
              teamP2?.id != null &&
              outcome?.teamThatWon?.id === teamP2.id &&
              !outcome?.draw
            const penalties = getPenaltyScores(outcome, teamP1)

            return (
              <tr key={_id}>
                <td>
                  <DateText>
                    {date}
                    {time !== null && <span>{time} hs</span>}
                  </DateText>
                </td>
                <td>
                  {/* Partido sin torneo: no hay a dónde linkear. */}
                  {tournament?.id ? (
                    <TournamentLink href={`/tournaments/${tournament.id}`}>
                      {tournament.name || '-'}
                    </TournamentLink>
                  ) : (
                    '-'
                  )}
                  {group && (
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                      }}
                    >
                      Grupo {group}
                    </span>
                  )}
                </td>
                <td>
                  <TypeBadge type={type}>{TYPE_LABELS[type] || type}</TypeBadge>
                </td>
                <td>
                  <Scoreboard>
                    <TeamBlock align="right" isWinner={isP1Winner}>
                      <span>
                        {teamP1?.name
                          ? teamP1.name.substring(0, 3).toUpperCase()
                          : 'P1'}{' '}
                        <PlayerTag>
                          {playerP1?.name?.substring(0, 3).toUpperCase()}
                        </PlayerTag>
                      </span>
                      {teamP1?.id && (
                        <img
                          src={`${database}/logos/${teamP1.id}`}
                          alt={teamP1.name}
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      )}
                    </TeamBlock>
                    <ScoreBadge
                      title={
                        penalties
                          ? `Penales: ${penalties.p1} - ${penalties.p2}`
                          : undefined
                      }
                    >
                      {scoreP1}
                      {penalties && (
                        <PenaltyScore>({penalties.p1})</PenaltyScore>
                      )}
                      -
                      {penalties && (
                        <PenaltyScore>({penalties.p2})</PenaltyScore>
                      )}
                      {scoreP2}
                    </ScoreBadge>
                    <TeamBlock align="left" isWinner={isP2Winner}>
                      {teamP2?.id && (
                        <img
                          src={`${database}/logos/${teamP2.id}`}
                          alt={teamP2.name}
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      )}
                      <span>
                        <PlayerTag>
                          {playerP2?.name?.substring(0, 3).toUpperCase()}
                        </PlayerTag>{' '}
                        {teamP2?.name
                          ? teamP2.name.substring(0, 3).toUpperCase()
                          : 'P2'}
                      </span>
                    </TeamBlock>
                  </Scoreboard>
                </td>
              </tr>
            )
          })}
        </tbody>
      </CustomTable>
    </TableWrapper>
  )
}

export default MatchesTable

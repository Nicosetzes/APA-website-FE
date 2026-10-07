import { database } from 'api'
import { es } from 'date-fns/locale'
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
import { format, parseISO } from 'date-fns'
import {
  formatPlayedAt,
  getPlayedAt,
  getPlayedAtPrecision,
} from 'utils/playedAt'
import { sameTeamId } from 'utils/teamRef'

const TYPE_LABELS = {
  regular: 'Reg',
  playin: 'P-In',
  playoff: 'P-Off',
}

const getPenaltyScores = (outcome, teamP1) => {
  if (!outcome?.penalties || !outcome.teamThatWon) return null

  const p1Won = String(outcome.teamThatWon.id) === String(teamP1?.id)
  return {
    p1: p1Won ? outcome.scoreFromTeamThatWon : outcome.scoreFromTeamThatLost,
    p2: p1Won ? outcome.scoreFromTeamThatLost : outcome.scoreFromTeamThatWon,
  }
}

const MatchesTable = ({ matches }) => {
  const formatDate = (dateString, id) => {
    try {
      const isBadDate =
        !dateString ||
        dateString === '2023-03-30T23:22:00.005Z' ||
        dateString === '2023-03-30T23:21:44.961Z' ||
        dateString === '2023-03-30T22:51:17.806Z'

      const dateObj = isBadDate
        ? new Date(parseInt(id.substring(0, 8), 16) * 1000)
        : parseISO(dateString)

      return {
        date: format(dateObj, 'dd MMM yyyy', { locale: es }),
        time: format(dateObj, 'HH:mm'),
      }
    } catch {
      return { date: '-', time: '' }
    }
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
            } = match

            // Fecha no exacta: sólo la etiqueta, sin hora.
            const inexactDate = formatPlayedAt(
              getPlayedAt(match),
              getPlayedAtPrecision(match),
            )
            const { date, time } = inexactDate
              ? { date: inexactDate, time: null }
              : formatDate(getPlayedAt(match), _id)
            const isP1Winner =
              sameTeamId(outcome?.teamThatWon?.id, teamP1?.id) && !outcome?.draw
            const isP2Winner =
              sameTeamId(outcome?.teamThatWon?.id, teamP2?.id) && !outcome?.draw
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

import { database } from 'api'
import { es } from 'date-fns/locale'
import {
  CustomTable,
  DateText,
  PlayerTag,
  Scoreboard,
  ScoreBadge,
  TableWrapper,
  TeamBlock,
  TournamentLink,
  TypeBadge,
} from './styled'
import { format, parseISO } from 'date-fns'

const TYPE_LABELS = {
  regular: 'Reg',
  playin: 'P-In',
  playoff: 'P-Off',
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
              updatedAt,
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

            const { date, time } = formatDate(updatedAt, _id)
            const isP1Winner =
              outcome?.teamThatWon?.id === teamP1?.id && !outcome?.draw
            const isP2Winner =
              outcome?.teamThatWon?.id === teamP2?.id && !outcome?.draw

            return (
              <tr key={_id}>
                <td>
                  <DateText>
                    {date}
                    <span>{time} hs</span>
                  </DateText>
                </td>
                <td>
                  <TournamentLink href={`/tournaments/${tournament?.id}`}>
                    {tournament?.name || '-'}
                  </TournamentLink>
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
                    <ScoreBadge>
                      {scoreP1} - {scoreP2}
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

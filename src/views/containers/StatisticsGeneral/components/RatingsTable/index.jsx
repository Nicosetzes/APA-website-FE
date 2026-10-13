import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Rank } from '../../styled'
import { Tooltip } from 'views/components'
import {
  ChangeValue,
  MatchesNote,
  PeakValue,
  PlayerCell,
  PlayerNameText,
  ProvisionalTag,
  RatingValue,
  RatingsCard,
  RatingsTable as Table,
  RatingsTitle,
  TableScroll,
} from './styled'
import { describeRatingChange, formatRating } from 'utils/ratings'

const HELP_TEXT =
  'ELO inicial = 1500. Ganar suma puntos y perder resta; cuanto más fuerte es el rival, más suma quien gana. ' +
  'Máx: el rating más alto que alcanzó. Último cambio: lo que sumó o restó en su último partido.'

const TREND_ICONS = {
  up: <ArrowDropUpIcon aria-hidden="true" />,
  down: <ArrowDropDownIcon aria-hidden="true" />,
  flat: null,
}

const RatingsTable = ({ ratings }) => {
  if (!ratings?.length) return null

  return (
    <RatingsCard>
      <RatingsTitle>
        Ranking Elo
        <Tooltip title={HELP_TEXT}>
          <HelpOutlineIcon
            aria-label="Cómo se calcula el Elo"
            sx={{
              cursor: 'pointer',
              fontSize: '1rem',
              marginLeft: '0.5rem',
              opacity: 0.7,
              verticalAlign: 'middle',
            }}
          />
        </Tooltip>
      </RatingsTitle>
      <TableScroll>
        <Table aria-label="Ranking Elo de los jugadores">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col" style={{ textAlign: 'left' }}>
                Jugador
              </th>
              <th scope="col">Elo</th>
              <th scope="col">Máx.</th>
              <th scope="col">Último cambio</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((row) => {
              const change = describeRatingChange(row.lastChange)

              return (
                <tr key={row.player.id}>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Rank $rank={row.position}>{row.position}</Rank>
                    </div>
                  </td>
                  <PlayerCell scope="row">
                    <PlayerNameText>{row.player.name}</PlayerNameText>
                    {row.provisional && (
                      <Tooltip title="Pocos partidos jugados: el rating todavía no es confiable">
                        <ProvisionalTag>Provisorio</ProvisionalTag>
                      </Tooltip>
                    )}
                    <MatchesNote>
                      {row.matches} {row.matches === 1 ? 'partido' : 'partidos'}
                    </MatchesNote>
                  </PlayerCell>
                  <td>
                    <RatingValue>{formatRating(row.rating)}</RatingValue>
                  </td>
                  <td>
                    <PeakValue>{formatRating(row.peak)}</PeakValue>
                  </td>
                  <td>
                    <ChangeValue $trend={change.trend}>
                      {TREND_ICONS[change.trend]}
                      {change.text}
                    </ChangeValue>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </TableScroll>
    </RatingsCard>
  )
}

export default RatingsTable

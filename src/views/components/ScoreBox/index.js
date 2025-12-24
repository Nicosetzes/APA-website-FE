import { StyledScoreBox } from './styled'
import DoneIcon from '@mui/icons-material/Done'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import CloseIcon from '@mui/icons-material/Close'
import Tooltip from '../Tooltip'

const ScoreBox = ({
  result,
  playerP1,
  teamP1,
  scoreP1,
  playerP2,
  teamP2,
  scoreP2,
  date,
}) => {
  if (result == 'w')
    return (
      <Tooltip
        title={
          <>
            <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>
              <span>
                {teamP1.name} ({playerP1.name[0].toUpperCase()}
                {playerP1.name[1].toUpperCase()})
              </span>{' '}
              <span>{scoreP1}</span>
              {'-'}
              <span>{scoreP2}</span> ({playerP2.name[0].toUpperCase()}
              {playerP2.name[1].toUpperCase()}) <span>{teamP2.name}</span>
            </div>
            <div style={{ margin: '0.25rem 0', textAlign: 'right' }}>
              {date}
            </div>
          </>
        }
      >
        <StyledScoreBox color="#2cad2c">
          <DoneIcon sx={{ fontSize: '0.5rem' }} />
        </StyledScoreBox>
      </Tooltip>
    )
  if (result == 'd')
    return (
      <Tooltip
        title={
          <>
            <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>
              <span>
                {teamP1.name} ({playerP1.name[0]}
                {playerP1.name[1].toUpperCase()})
              </span>{' '}
              <span>{scoreP1}</span>
              {'-'}
              <span>{scoreP2}</span> ({playerP2.name[0]}
              {playerP2.name[1].toUpperCase()}) <span>{teamP2.name}</span>
            </div>
            <div style={{ margin: '0.25rem 0', textAlign: 'right' }}>
              {date}
            </div>
          </>
        }
      >
        <StyledScoreBox color="#8e8e8f">
          <HorizontalRuleIcon sx={{ fontSize: '0.5rem' }} />
        </StyledScoreBox>
      </Tooltip>
    )
  if (result == 'l')
    return (
      <Tooltip
        title={
          <>
            <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>
              <span>
                {teamP1.name} ({playerP1.name[0].toUpperCase()}
                {playerP1.name[1].toUpperCase()})
              </span>{' '}
              <span>{scoreP1}</span>
              {'-'}
              <span>{scoreP2}</span> ({playerP2.name[0].toUpperCase()}
              {playerP2.name[1].toUpperCase()}) <span>{teamP2.name}</span>
            </div>
            <div style={{ margin: '0.25rem 0', textAlign: 'right' }}>
              {date}
            </div>
          </>
        }
      >
        <StyledScoreBox color="#af1111">
          <CloseIcon sx={{ fontSize: '0.5rem' }} />
        </StyledScoreBox>
      </Tooltip>
    )
}

export default ScoreBox

import { StyledScoreBox } from './styled'
import DoneIcon from '@mui/icons-material/Done'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    border: '1px solid #dadde9',
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: theme.typography.pxToRem(12),
    maxWidth: 275,
    padding: '0.75 1rem',
  },
}))

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
      <HtmlTooltip
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
      </HtmlTooltip>
    )
  if (result == 'd')
    return (
      <HtmlTooltip
        title={
          <>
            <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>
              <span>
                {teamP1.name} ({playerP1.name[0]}
                {playerP1.name[1]})
              </span>{' '}
              <span>{scoreP1}</span>
              {'-'}
              <span>{scoreP2}</span> ({playerP2.name[0]}
              {playerP2.name[1]}) <span>{teamP2.name}</span>
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
      </HtmlTooltip>
    )
  if (result == 'l')
    return (
      <HtmlTooltip
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
      </HtmlTooltip>
    )
}

export default ScoreBox

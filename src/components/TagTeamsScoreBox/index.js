import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { StyledTagTeamsScoreBox } from './styled'
import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import { styled } from '@mui/material/styles'
import { database } from './../../api'

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

const TagTeamsScoreBox = ({
  result,
  playerP1,
  playerP2,
  playerP3,
  playerP4,
  teamP1,
  teamP2,
  scoreP1,
  scoreP2,
  date,
}) => {
  if (result == 'w')
    return (
      <HtmlTooltip
        title={
          <>
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                fontSize: '0.75rem',
                fontWeight: 700,
                gap: '0.25rem',
              }}
            >
              <span>
                {teamP1.name[0].toUpperCase()}
                {teamP1.name[1].toUpperCase()}
                {teamP1.name[2].toUpperCase()}{' '}
              </span>
              <img
                src={`${database}/logos/${teamP1.id}`}
                alt={teamP1.name}
                style={{ maxWidth: '20px' }}
              />{' '}
              <span>
                ({playerP1.name[0].toUpperCase()}
                {playerP1.name[1].toUpperCase()} <span>{' + '}</span>
                {playerP2.name[0].toUpperCase()}
                {playerP2.name[1].toUpperCase()})
              </span>{' '}
              <span>{scoreP1}</span>
              {'-'}
              <span>{scoreP2}</span>
              <span>
                ({playerP3.name[0].toUpperCase()}
                {playerP3.name[1].toUpperCase()}
                {playerP4 && <span>{' + '}</span>}
                {playerP4 && <span>{playerP4.name[0].toUpperCase()}</span>}
                {playerP4 && <span>{playerP4.name[1].toUpperCase()}</span>})
              </span>
              <img
                src={`${database}/logos/${teamP2.id}`}
                alt={teamP2.name}
                style={{ maxWidth: '20px' }}
              />{' '}
              <span>
                {teamP2.name[0].toUpperCase()}
                {teamP2.name[1].toUpperCase()}
                {teamP2.name[2].toUpperCase()}{' '}
              </span>
            </div>
            <div style={{ margin: '0.25rem 0', textAlign: 'right' }}>
              {date}
            </div>
          </>
        }
      >
        <StyledTagTeamsScoreBox color="#2cad2c">
          <DoneIcon sx={{ fontSize: '0.5rem' }} />
        </StyledTagTeamsScoreBox>
      </HtmlTooltip>
    )
  if (result == 'd')
    return (
      <HtmlTooltip
        title={
          <>
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                fontSize: '0.75rem',
                fontWeight: 700,
                gap: '0.25rem',
              }}
            >
              <span>
                {teamP1.name[0].toUpperCase()}
                {teamP1.name[1].toUpperCase()}
                {teamP1.name[2].toUpperCase()}{' '}
              </span>
              <img
                src={`${database}/logos/${teamP1.id}`}
                alt={teamP1.name}
                style={{ maxWidth: '20px' }}
              />{' '}
              <span>
                ({playerP1.name[0].toUpperCase()}
                {playerP1.name[1].toUpperCase()} <span>{' + '}</span>
                {playerP2.name[0].toUpperCase()}
                {playerP2.name[1].toUpperCase()})
              </span>{' '}
              <span>{scoreP1}</span>
              {'-'}
              <span>{scoreP2}</span>
              <span>
                ({playerP3.name[0].toUpperCase()}
                {playerP3.name[1].toUpperCase()}
                {playerP4 && <span>{' + '}</span>}
                {playerP4 && <span>{playerP4.name[0].toUpperCase()}</span>}
                {playerP4 && <span>{playerP4.name[1].toUpperCase()}</span>})
              </span>
              <img
                src={`${database}/logos/${teamP2.id}`}
                alt={teamP2.name}
                style={{ maxWidth: '20px' }}
              />{' '}
              <span>
                {teamP2.name[0].toUpperCase()}
                {teamP2.name[1].toUpperCase()}
                {teamP2.name[2].toUpperCase()}{' '}
              </span>
            </div>
          </>
        }
      >
        <StyledTagTeamsScoreBox color="#8e8e8f">
          <HorizontalRuleIcon sx={{ fontSize: '0.5rem' }} />
        </StyledTagTeamsScoreBox>
      </HtmlTooltip>
    )
  if (result == 'l')
    return (
      <HtmlTooltip
        title={
          <>
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                fontSize: '0.75rem',
                fontWeight: 700,
                gap: '0.25rem',
              }}
            >
              <span>
                {teamP1.name[0].toUpperCase()}
                {teamP1.name[1].toUpperCase()}
                {teamP1.name[2].toUpperCase()}{' '}
              </span>
              <img
                src={`${database}/logos/${teamP1.id}`}
                alt={teamP1.name}
                style={{ maxWidth: '20px' }}
              />{' '}
              <span>
                ({playerP1.name[0].toUpperCase()}
                {playerP1.name[1].toUpperCase()} <span>{' + '}</span>
                {playerP2.name[0].toUpperCase()}
                {playerP2.name[1].toUpperCase()})
              </span>{' '}
              <span>{scoreP1}</span>
              {'-'}
              <span>{scoreP2}</span>
              <span>
                ({playerP3.name[0].toUpperCase()}
                {playerP3.name[1].toUpperCase()}
                {playerP4 && <span>{' + '}</span>}
                {playerP4 && <span>{playerP4.name[0].toUpperCase()}</span>}
                {playerP4 && <span>{playerP4.name[1].toUpperCase()}</span>})
              </span>
              <img
                src={`${database}/logos/${teamP2.id}`}
                alt={teamP2.name}
                style={{ maxWidth: '20px' }}
              />{' '}
              <span>
                {teamP2.name[0].toUpperCase()}
                {teamP2.name[1].toUpperCase()}
                {teamP2.name[2].toUpperCase()}{' '}
              </span>
            </div>
            <div style={{ margin: '0.25rem 0', textAlign: 'right' }}>
              {date}
            </div>
          </>
        }
      >
        <StyledTagTeamsScoreBox color="#af1111">
          <CloseIcon sx={{ fontSize: '0.5rem' }} />
        </StyledTagTeamsScoreBox>
      </HtmlTooltip>
    )
}

export default TagTeamsScoreBox

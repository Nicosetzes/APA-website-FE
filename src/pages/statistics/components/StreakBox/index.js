import { StyledStreakBox } from './styled'
import * as React from 'react'
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

const StreakBox = ({
  result,
  playerP1,
  teamP1,
  scoreP1,
  playerP2,
  teamP2,
  scoreP2,
  date,
  tournament,
}) => {
  if (result === 'w') {
    return (
      <HtmlTooltip
        title={
          <>
            <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>
              <span>
                {teamP1.name ? teamP1.name : teamP1} ({playerP1.name})
              </span>{' '}
              <span>{scoreP1}</span>
              {'-'}
              <span>{scoreP2}</span> ({playerP2.name}){' '}
              <span>{teamP2.name ? teamP2.name : teamP2}</span>
            </div>
            <div style={{ margin: '0.25rem 0', textAlign: 'right' }}>
              {date}
            </div>
            <div style={{ textAlign: 'right' }}>{tournament}</div>
          </>
        }
      >
        <StyledStreakBox color="var(--green-900)">V</StyledStreakBox>
      </HtmlTooltip>
    )
  } else if (result === 'd') {
    return (
      <HtmlTooltip
        title={
          <>
            <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>
              <span>
                {teamP1.name ? teamP1.name : teamP1} ({playerP1.name})
              </span>{' '}
              <span>{scoreP1}</span>
              {'-'}
              <span>{scoreP2}</span>
              <span>
                {' '}
                ({playerP2.name}) {teamP2.name ? teamP2.name : teamP2}
              </span>
            </div>
            <div style={{ margin: '0.25rem 0', textAlign: 'right' }}>
              {date}
            </div>
            <div style={{ textAlign: 'right' }}>{tournament}</div>
          </>
        }
      >
        <StyledStreakBox color="gold">E</StyledStreakBox>
      </HtmlTooltip>
    )
  } else
    return (
      <HtmlTooltip
        title={
          <>
            <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>
              <span>
                {teamP1.name ? teamP1.name : teamP1} ({playerP1.name})
              </span>{' '}
              <span>{scoreP1}</span>
              {'-'}
              <span>{scoreP2}</span> ({playerP2.name}){' '}
              <span>{teamP2.name ? teamP2.name : teamP2}</span>
            </div>
            <div style={{ margin: '0.25rem 0', textAlign: 'right' }}>
              {date}
            </div>
            <div style={{ textAlign: 'right' }}>{tournament}</div>
          </>
        }
      >
        <StyledStreakBox color="red">D</StyledStreakBox>
      </HtmlTooltip>
    )
}

export default StreakBox

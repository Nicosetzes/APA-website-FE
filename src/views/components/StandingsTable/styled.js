import Table from '@mui/material/Table'
import styled, { css } from 'styled-components'

const COLORS = {
  blue: {
    base: '#004a79',
    hover: '#306485',
  },
  green: {
    base: '#007058',
    hover: '#237c69',
  },
  gold: {
    base: '#8d7b12',
    hover: '#a29139',
  },
  burgundy: {
    base: '#6b2034',
    hover: '#874058',
  },
}

const FORMAT_RULES = {
  champions_league: [{ from: 1, to: 2, color: 'green' }],
  league_playin_playoff: [
    { from: 1, to: 6, color: 'green' },
    { from: 7, to: 8, color: 'gold' },
    { from: 9, to: 10, color: 'burgundy' },
  ],
  super_cup: [
    { from: 1, to: 2, color: 'green' },
    { from: 3, to: 3, color: 'gold' },
  ],
  super_cup_best_thirds: [{ from: 1, to: 4, color: 'green' }],
  world_cup: [{ from: 1, to: 2, color: 'green' }],
  world_cup_2026: [
    { from: 1, to: 2, color: 'green' },
    { from: 3, to: 3, color: 'gold' },
  ],
  world_cup_2026_best_thirds: [{ from: 1, to: 8, color: 'green' }],
}

const DEFAULT_COLOR = 'blue'

const getRules = (format) => {
  if (!format) return []

  if (FORMAT_RULES[format]) {
    return FORMAT_RULES[format]
  }

  const key = Object.keys(FORMAT_RULES).find((rule) => format.includes(rule))

  return key ? FORMAT_RULES[key] : []
}

const getRowColor = (format, row) => {
  const rules = getRules(format)

  const rule = rules.find(({ from, to }) => row >= from && row <= to)

  return COLORS[rule?.color ?? DEFAULT_COLOR]
}

const rowStyles = Array.from(
  { length: 15 },
  (_, i) => css`
    &:nth-of-type(${i + 1}) {
      background-color: ${({ format }) => getRowColor(format, i + 1).base};

      &:hover {
        background-color: ${({ format }) => getRowColor(format, i + 1).hover};
      }
    }
  `,
)

export const TableTitle = styled.h2`
  align-self: center;
  color: var(--blue-900);
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  margin: 1.25rem auto 0.75rem;
  max-width: fit-content;
  text-transform: uppercase;
`

export const StyledTable = styled(Table)`
  background-color: rgba(0, 74, 121, 1);
  border: var(--yellow-900) 3px solid;
  .MuiTableBody-root {
    .MuiTableRow-root {
      ${rowStyles}
    }
      .MuiTableCell-root {
        color: #fff;
        font-family: 'Fira Sans', sans-serif;
        font-weight: 800;
        padding: 0.5rem 0;
        text-align: center;
        &:nth-child(2) {
          .teamAndLogoWrapper {
            align-items: center;
            cursor: pointer;
            display: flex;
            height: 100%;
            min-width: ${(props) =>
              props.format.includes('best_thirds') ? '80px' : '160px'};
            img {
              height: 25px;
              margin-right: 0.5rem;
              width: 25px;
            }
            a {
              align-items: center;
              display: flex;
              color: #fff;
              text-decoration: none;
            }
          }
        }
      }
      .streak {
        align-items: center;
        display: flex;
        justify-content: center;
        margin: 0 0.5rem;
      }
    }
  }
`

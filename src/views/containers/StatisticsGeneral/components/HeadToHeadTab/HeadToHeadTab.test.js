/* eslint-env jest */
jest.mock('api/axiosConfig', () => ({
  apiClient: { get: jest.fn() },
  getApiErrorMessage: (_error, fallback) => fallback,
}))
jest.mock('views/components', () => ({ Loader: () => <div>Cargando</div> }))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import { apiClient } from 'api/axiosConfig'
import HeadToHeadTab from '.'

const summary = {
  players: [
    { id: '1', name: 'Nico' },
    { id: '2', name: 'Santi' },
  ],
  pairs: [
    {
      playerA: { id: '1', name: 'Nico' },
      playerB: { id: '2', name: 'Santi' },
      matches: 4,
      playerAWins: 2,
      draws: 1,
      playerBWins: 1,
      playerAGoals: 8,
      playerBGoals: 6,
      playerAGoalDifference: 2,
      playerBGoalDifference: -2,
      bestWin: {
        playerA: {
          score: '3-0',
          winnerTeam: { id: 1, name: 'Racing' },
          loserTeam: { id: 2, name: 'Boca' },
        },
        playerB: null,
      },
    },
  ],
}

const detail = {
  players: {
    playerA: { id: '1', name: 'Nico' },
    playerB: { id: '2', name: 'Santi' },
  },
  record: {
    matches: 4,
    playerAWins: 2,
    draws: 1,
    playerBWins: 1,
    playerAGoals: 8,
    playerBGoals: 6,
    shootouts: { total: 0, playerAWon: 0, playerBWon: 0 },
  },
  streak: { result: 'win', player: 'Nico', count: 2 },
  bestWin: {
    playerA: { score: '3-0', winnerTeam: 'Racing' },
    playerB: null,
  },
  firstMatchOn: '2020-01-01',
  lastMatchOn: '2025-01-01',
  ratingComparison: {
    playerA: {
      matches: 2,
      actualPercentage: 75,
      expectedPercentage: 60,
      differencePercentagePoints: 15,
    },
    playerB: {
      matches: 2,
      actualPercentage: 25,
      expectedPercentage: 40,
      differencePercentagePoints: -15,
    },
  },
  lastMatches: [],
}

let container

const flush = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)))

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  apiClient.get.mockImplementation((url) => {
    if (url === '/statistics/head-to-head')
      return Promise.resolve({ data: summary })
    if (url === '/tournaments') return Promise.resolve({ data: [] })
    if (url === '/statistics/head-to-head/1/2')
      return Promise.resolve({ data: detail })
    return Promise.reject(new Error(`unexpected ${url}`))
  })
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
  apiClient.get.mockReset()
})

test('opens a rivalry card and renders its detailed record', async () => {
  await act(async () => {
    ReactDOM.render(
      <MemoryRouter initialEntries={['/statistics?tab=head-to-head']}>
        <HeadToHeadTab />
      </MemoryRouter>,
      container,
    )
  })
  await flush()

  expect(container.textContent).toContain('4partidos')
  expect(container.textContent).toContain('8 GF · DIF +2')
  expect(container.textContent).toContain('Mayor victoria de Nico')

  const pair = [...container.querySelectorAll('button')].find((button) =>
    button.textContent.includes('Nico'),
  )
  act(() => {
    pair.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  await flush()

  expect(apiClient.get).toHaveBeenCalledWith(
    '/statistics/head-to-head/1/2',
    expect.objectContaining({
      params: expect.objectContaining({ limit: 10 }),
    }),
  )
  expect(container.textContent).toContain('2victorias')
  expect(container.textContent).toContain('Nico: 2 victorias')
  expect(container.textContent).toContain('01-01-2020 / 01-01-2025')
  expect(container.textContent).toContain('Mayor victoria de Nico')
  const expectedSection = container.querySelector(
    '[aria-labelledby="head-to-head-expected-title"]',
  )
  expect(expectedSection).not.toBeNull()
  expect(
    expectedSection.querySelector(
      '[aria-label="Esperado contra real de Nico"]',
    ),
  ).not.toBeNull()
  expect(expectedSection.textContent).toContain('2 de 4')
  expect(expectedSection.textContent).toContain('75,0 %')
  expect(expectedSection.textContent).toContain('60,0 %')
  expect(expectedSection.textContent).toContain('+15,0 pp')
  expect(expectedSection.textContent).toContain('-15,0 pp')
  const periodSelect = [...container.querySelectorAll('select')].find(
    (select) => select.parentElement.textContent.includes('Período'),
  )
  expect(periodSelect.options[0].textContent).toBe('Todo el historial')
})

test('keeps the rivalry detail usable when rating data is absent', async () => {
  apiClient.get.mockImplementation((url) => {
    if (url === '/statistics/head-to-head')
      return Promise.resolve({ data: summary })
    if (url === '/tournaments') return Promise.resolve({ data: [] })
    if (url === '/statistics/head-to-head/1/2') {
      return Promise.resolve({
        data: { ...detail, ratingComparison: undefined },
      })
    }
    return Promise.reject(new Error(`unexpected ${url}`))
  })

  await act(async () => {
    ReactDOM.render(
      <MemoryRouter initialEntries={['/statistics?tab=head-to-head']}>
        <HeadToHeadTab />
      </MemoryRouter>,
      container,
    )
  })
  await flush()

  const pair = [...container.querySelectorAll('button')].find((button) =>
    button.textContent.includes('Nico'),
  )
  act(() => {
    pair.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  await flush()

  expect(container.textContent).toContain('2victorias')
  expect(
    container.querySelector('[aria-labelledby="head-to-head-expected-title"]'),
  ).toBeNull()
})

/* eslint-env jest */
jest.mock('framer-motion', () => ({
  motion: { div: ({ children }) => <div>{children}</div> },
}))
jest.mock('react-responsive', () => ({ useMediaQuery: () => true }))
jest.mock('api', () => ({ api: 'http://api', database: 'http://db' }))
jest.mock('views/components', () => ({
  MatchesTable: ({ matches }) => <div>{`${matches.length} partidos`}</div>,
  PageLoader: () => <div>loading</div>,
}))
jest.mock('api/axiosConfig', () => ({
  apiClient: { get: jest.fn() },
  getApiErrorMessage: jest.fn(() => 'error'),
}))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import { apiClient } from 'api/axiosConfig'
import MatchListing from '.'

const PLAYERS = [
  { id: 'p1', name: 'Nico' },
  { id: 'p2', name: 'Santi' },
]

const respond = (url) => {
  if (url === 'http://api/users') return { data: PLAYERS }
  if (url.startsWith('http://api/tournaments')) return { data: [] }
  if (url === 'http://api/matches/teams') return { data: [] }
  return { data: { matches: [], totalMatches: 0, totalPages: 0 } }
}

let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  apiClient.get.mockReset()
  apiClient.get.mockImplementation((url) => Promise.resolve(respond(url)))
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
})

const flush = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

// Navega desde otra ruta, como el link del rango de una racha.
const navigateTo = async (target) => {
  act(() => {
    ReactDOM.render(
      <MemoryRouter initialEntries={['/statistics']}>
        <Routes>
          <Route path="/statistics" element={<Link to={target}>rango</Link>} />
          <Route path="/matches" element={<MatchListing />} />
        </Routes>
      </MemoryRouter>,
      container,
    )
  })
  act(() => {
    container
      .querySelector('a')
      .dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }),
      )
  })
  await flush()
}

const field = (id) => document.getElementById(id)
const matchesRequests = () =>
  apiClient.get.mock.calls
    .map(([url]) => url)
    .filter((url) => url.startsWith('http://api/matches?'))

test('los filtros de la URL se reflejan en la UI y en el pedido al llegar desde otra ruta', async () => {
  await navigateTo(
    '/matches?player1=p1&type=knockout&dateFrom=2024-07-08&dateTo=2024-10-22',
  )

  expect(field('player1').value).toBe('p1')
  expect(field('player1').selectedOptions[0].textContent).toBe('Nico')
  expect(field('typeFilter').value).toBe('knockout')
  expect(field('typeFilter').selectedOptions[0].textContent).toBe(
    'Eliminatoria',
  )
  expect(field('dateFrom').value).toBe('2024-07-08')
  expect(field('dateTo').value).toBe('2024-10-22')
  expect(field('outcomeFilter').value).toBe('all')
  expect(field('outcomeFilter').disabled).toBe(false)

  expect(matchesRequests()).toEqual([
    'http://api/matches?player1=p1&type=knockout&dateFrom=2024-07-08&dateTo=2024-10-22&page=1',
  ])
})

test('penales y playoff: resultado y tipo precargados, sin dateTo', async () => {
  await navigateTo('/matches?player1=p2&outcome=penalties&dateFrom=2024-07-08')

  expect(field('player1').value).toBe('p2')
  expect(field('outcomeFilter').value).toBe('penalties')
  expect(field('outcomeFilter').selectedOptions[0].textContent).toBe('Penales')
  expect(field('dateFrom').value).toBe('2024-07-08')
  expect(field('dateTo').value).toBe('')
  expect(matchesRequests()).toEqual([
    'http://api/matches?player1=p2&outcome=penalties&dateFrom=2024-07-08&page=1',
  ])

  ReactDOM.unmountComponentAtNode(container)
  apiClient.get.mockClear()
  await navigateTo('/matches?player1=p1&type=playoff&dateFrom=2019-07-01')

  expect(field('typeFilter').value).toBe('playoff')
  expect(field('playoffRoundFilter').disabled).toBe(false)
  expect(field('playoffRoundFilter').value).toBe('all')
  expect(matchesRequests()).toEqual([
    'http://api/matches?player1=p1&type=playoff&dateFrom=2019-07-01&page=1',
  ])
})

test.each([
  ['semifinal', 'Semifinal'],
  ['final', 'Final'],
])(
  'type=playoff + playoffRound=%s: tipo y ronda precargados y la ronda habilitada',
  async (round, label) => {
    await navigateTo(
      `/matches?player1=p1&type=playoff&playoffRound=${round}&dateFrom=2019-07-10&dateTo=2022-06-25`,
    )

    expect(field('typeFilter').value).toBe('playoff')
    expect(field('playoffRoundFilter').disabled).toBe(false)
    expect(field('playoffRoundFilter').value).toBe(round)
    expect(field('playoffRoundFilter').selectedOptions[0].textContent).toBe(
      label,
    )
    expect(field('dateFrom').value).toBe('2019-07-10')
    expect(field('dateTo').value).toBe('2022-06-25')
    expect(matchesRequests()).toEqual([
      `http://api/matches?player1=p1&type=playoff&playoffRound=${round}&dateFrom=2019-07-10&dateTo=2022-06-25&page=1`,
    ])
  },
)

// Links de /statistics por familia: los controles muestran los filtros y el
// primer pedido los manda todos, sin que el montaje los borre.
const criterion = (label) =>
  container.querySelector(`select[aria-label="${label}: criterio"]`)

describe('links de rachas: filtros precargados', () => {
  test('victorias: outcome=win', async () => {
    const query = 'player1=p1&outcome=win&dateFrom=2024-07-08&dateTo=2024-10-22'
    await navigateTo(`/matches?${query}`)

    expect(field('outcomeFilter').value).toBe('win')
    expect(field('outcomeFilter').selectedOptions[0].textContent).toBe(
      'Victoria',
    )
    expect(field('outcomeFilter').disabled).toBe(false)
    expect(matchesRequests()).toEqual([`http://api/matches?${query}&page=1`])
  })

  test('3+ goles: operador y valor de goles a favor', async () => {
    const query =
      'player1=p1&player1GoalsOp=gte&player1GoalsVal=3&dateFrom=2024-07-08&dateTo=2024-10-22'
    await navigateTo(`/matches?${query}`)

    expect(criterion('Goles a favor').value).toBe('gte')
    expect(field('player1GoalsVal').value).toBe('3')
    expect(field('player1GoalsVal').disabled).toBe(false)

    // Pasado el debounce, el input no reescribe la URL.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
    })
    expect(field('player1GoalsVal').value).toBe('3')
    expect(matchesRequests()).toEqual([`http://api/matches?${query}&page=1`])
  })

  test('valla invicta: goles en contra = 0', async () => {
    const query =
      'player1=p1&player1ConcededOp=eq&player1ConcededVal=0&dateFrom=2024-07-08&dateTo=2024-10-22'
    await navigateTo(`/matches?${query}`)

    expect(criterion('Goles en contra').value).toBe('eq')
    expect(field('player1ConcededVal').value).toBe('0')

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
    })
    expect(field('player1ConcededVal').value).toBe('0')
    expect(matchesRequests()).toEqual([`http://api/matches?${query}&page=1`])
  })

  test('victorias en eliminación: knockout + victoria incl. penales', async () => {
    const query =
      'player1=p1&type=knockout&outcome=winIncludingPenalties&dateFrom=2024-07-08&dateTo=2024-10-22'
    await navigateTo(`/matches?${query}`)

    expect(field('typeFilter').value).toBe('knockout')
    expect(field('outcomeFilter').value).toBe('winIncludingPenalties')
    expect(field('outcomeFilter').selectedOptions[0].textContent).toBe(
      'Victoria (incl. penales)',
    )
    expect(matchesRequests()).toEqual([`http://api/matches?${query}&page=1`])
  })

  test('semis consecutivas: playoff + semifinal', async () => {
    const query =
      'player1=p1&type=playoff&playoffRound=semifinal&dateFrom=2019-07-10&dateTo=2022-06-25'
    await navigateTo(`/matches?${query}`)

    expect(field('typeFilter').value).toBe('playoff')
    expect(field('playoffRoundFilter').disabled).toBe(false)
    expect(field('playoffRoundFilter').value).toBe('semifinal')
    expect(field('outcomeFilter').value).toBe('all')
    expect(matchesRequests()).toEqual([`http://api/matches?${query}&page=1`])
  })

  test('campeonatos: playoff + final + victoria incl. penales', async () => {
    const query =
      'player1=p1&type=playoff&playoffRound=final&outcome=winIncludingPenalties&dateFrom=2019-07-20&dateTo=2022-07-03'
    await navigateTo(`/matches?${query}`)

    expect(field('typeFilter').value).toBe('playoff')
    expect(field('playoffRoundFilter').disabled).toBe(false)
    expect(field('playoffRoundFilter').value).toBe('final')
    expect(field('outcomeFilter').value).toBe('winIncludingPenalties')
    expect(field('dateFrom').value).toBe('2019-07-20')
    expect(field('dateTo').value).toBe('2022-07-03')
    expect(matchesRequests()).toEqual([`http://api/matches?${query}&page=1`])
  })
})

test('"Victoria (incl. penales)" va justo después de "Victoria"', async () => {
  await navigateTo('/matches?player1=p1')

  expect(
    Array.from(field('outcomeFilter').options).map((option) => option.value),
  ).toEqual([
    'all',
    'win',
    'winIncludingPenalties',
    'draw',
    'loss',
    'penalties',
  ])
})

test('cambiar de jugador sí limpia sus filtros dependientes', async () => {
  await navigateTo(
    '/matches?player1=p1&outcome=win&player1GoalsOp=gte&player1GoalsVal=3&dateFrom=2024-07-08',
  )

  act(() => {
    const select = field('player1')
    select.value = 'all'
    select.dispatchEvent(new Event('change', { bubbles: true }))
  })
  await flush()

  expect(field('outcomeFilter').value).toBe('all')
  expect(field('player1GoalsVal').value).toBe('')
  expect(matchesRequests().pop()).toBe(
    'http://api/matches?dateFrom=2024-07-08&page=1',
  )
})

test('"Limpiar Filtros" vuelve a la lista completa', async () => {
  await navigateTo('/matches?player1=p1&type=knockout&dateFrom=2024-07-08')

  const clear = Array.from(container.querySelectorAll('button')).find(
    (node) => node.textContent === 'Limpiar Filtros',
  )
  act(() => {
    clear.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  await flush()

  expect(field('player1').value).toBe('all')
  expect(field('typeFilter').value).toBe('all')
  expect(field('dateFrom').value).toBe('')
  expect(matchesRequests().pop()).toBe('http://api/matches?page=1')
})

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
  // Los pickers muestran DD/MM/YYYY; la URL y el pedido siguen en YYYY-MM-DD.
  expect(field('dateFrom').value).toBe('08/07/2024')
  expect(field('dateTo').value).toBe('22/10/2024')
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
  expect(field('dateFrom').value).toBe('08/07/2024')
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
    expect(field('dateFrom').value).toBe('10/07/2019')
    expect(field('dateTo').value).toBe('25/06/2022')
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
    expect(field('dateFrom').value).toBe('20/07/2019')
    expect(field('dateTo').value).toBe('03/07/2022')
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
  expect(field('dateTo').value).toBe('')
  expect(matchesRequests().pop()).toBe('http://api/matches?page=1')
})

describe('pickers de fecha (DD/MM/YYYY en pantalla, YYYY-MM-DD en la URL)', () => {
  // Cambia el texto completo del input como lo hace React (pegar/autocompletar).
  const typeInto = (input, value) => {
    const setValue = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    ).set
    act(() => {
      setValue.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }
  const lastRequest = () => matchesRequests().pop()
  const wait = (ms) =>
    act(async () => {
      await new Promise((resolve) => setTimeout(resolve, ms))
    })
  const clearButtonOf = (id) =>
    field(id)
      .closest('.MuiInputBase-root')
      .querySelector('button[title="Limpiar valor"]')

  test('labels accesibles "Desde" y "Hasta" asociados a los inputs', async () => {
    await navigateTo('/matches')

    expect(container.querySelector('label[for="dateFrom"]').textContent).toBe(
      'Desde',
    )
    expect(container.querySelector('label[for="dateTo"]').textContent).toBe(
      'Hasta',
    )
    expect(field('dateFrom').tagName).toBe('INPUT')
    expect(field('dateTo').tagName).toBe('INPUT')
  })

  test('tipear una fecha DD/MM/YYYY setea dateFrom=YYYY-MM-DD', async () => {
    await navigateTo('/matches?player1=p1')

    typeInto(field('dateFrom'), '15/08/2024')
    await flush()

    expect(field('dateFrom').value).toBe('15/08/2024')
    expect(lastRequest()).toBe(
      'http://api/matches?player1=p1&page=1&dateFrom=2024-08-15',
    )

    typeInto(field('dateTo'), '01/09/2024')
    await flush()
    expect(lastRequest()).toBe(
      'http://api/matches?player1=p1&page=1&dateFrom=2024-08-15&dateTo=2024-09-01',
    )
  })

  test('una fecha incompleta tipeada no cambia la URL', async () => {
    await navigateTo('/matches?dateFrom=2024-07-08')
    const before = matchesRequests().length

    // Selecciona el mes y lo borra con el teclado: queda "08/MM/2024".
    const input = field('dateFrom')
    act(() => {
      input.focus()
      input.setSelectionRange(3, 5)
    })
    await wait(10)
    act(() => {
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }),
      )
    })
    await flush()

    expect(input.value).toBe('08/MM/2024')
    expect(matchesRequests()).toHaveLength(before)
    expect(lastRequest()).toBe('http://api/matches?dateFrom=2024-07-08&page=1')
  })

  test('borrar el picker quita el param', async () => {
    await navigateTo(
      '/matches?player1=p1&dateFrom=2024-07-08&dateTo=2024-10-22',
    )

    act(() => {
      clearButtonOf('dateFrom').dispatchEvent(
        new MouseEvent('click', { bubbles: true }),
      )
    })
    await flush()
    // El botón deja el foco en el input: muestra el placeholder en español.
    expect(field('dateFrom').value).toBe('DD/MM/AAAA')
    expect(lastRequest()).toBe(
      'http://api/matches?player1=p1&dateTo=2024-10-22&page=1',
    )

    // Vaciar el texto también lo quita.
    typeInto(field('dateTo'), '')
    await flush()
    expect(field('dateTo').value).toBe('')
    expect(lastRequest()).toBe('http://api/matches?player1=p1&page=1')
  })

  test('elegir un día en el calendario setea el param', async () => {
    await navigateTo('/matches?dateFrom=2024-07-08')

    const openButton = field('dateFrom')
      .closest('.MuiInputBase-root')
      .querySelector('button[aria-label^="Elige fecha"]')
    act(() => {
      openButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    await flush()

    const dialog = document.querySelector('[role="dialog"]')
    // Calendario en español, semana desde el lunes.
    expect(dialog.textContent).toMatch(/julio 2024/i)
    const day15 = Array.from(
      dialog.querySelectorAll('button[role="gridcell"]'),
    ).find((node) => node.textContent === '15')
    act(() => {
      day15.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    await flush()
    // En mobile (jsdom no tiene `pointer: fine`) hay que confirmar con OK.
    const ok = Array.from(document.querySelectorAll('button')).find(
      (node) => node.textContent === 'OK',
    )
    if (ok) {
      act(() => {
        ok.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      })
      await flush()
    }

    expect(field('dateFrom').value).toBe('15/07/2024')
    expect(lastRequest()).toBe('http://api/matches?dateFrom=2024-07-15&page=1')
  })

  test('"Limpiar Filtros" descarta también lo tipeado a medias', async () => {
    await navigateTo('/matches?player1=p1')

    const input = field('dateTo')
    act(() => {
      input.focus()
    })
    await wait(10)
    expect(input.value).toBe('DD/MM/AAAA')
    act(() => {
      input.setSelectionRange(0, 2)
      input.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    })
    // Sólo el día ("1" sobre "DD" seleccionado): fecha inválida, no llega a la URL.
    typeInto(input, '1/MM/AAAA')
    await flush()
    expect(lastRequest()).toBe('http://api/matches?player1=p1&page=1')
    act(() => {
      input.blur()
    })
    expect(field('dateTo').value).toBe('01/MM/AAAA')

    const clear = Array.from(container.querySelectorAll('button')).find(
      (node) => node.textContent === 'Limpiar Filtros',
    )
    act(() => {
      clear.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    await flush()

    expect(field('dateTo').value).toBe('')
    expect(lastRequest()).toBe('http://api/matches?page=1')
  })
})

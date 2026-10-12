/* eslint-env jest */
jest.mock('api', () => ({
  api: 'http://api',
  cloudName: 'cloud',
  database: 'http://db',
}))
jest.mock('axios', () => ({ get: jest.fn(), isCancel: jest.fn(() => false) }))
jest.mock('cloudinary-react', () => ({ Image: () => null }))
jest.mock('views/components', () => ({ Loader: () => null }))

import axios from 'axios'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import Home from '.'

// Hora local para que el test no dependa de la zona horaria.
const local = (...args) => new Date(...args).toISOString()

const finalized = [
  {
    _id: 'older',
    name: 'Copa Vieja',
    closedAt: local(2024, 4, 1, 20, 0),
    closedAtPrecision: 'exact',
    // Editado después del cierre: no tiene que pesar.
    updatedAt: local(2025, 0, 1, 12, 0),
    outcome: { champion: { player: { name: 'Nico' }, team: { id: 1 } } },
  },
  {
    _id: 'latest',
    name: 'Copa Nueva',
    closedAt: local(2024, 7, 1, 20, 0),
    closedAtPrecision: 'exact',
    updatedAt: local(2024, 7, 1, 20, 0),
    outcome: { champion: { player: { name: 'Santi' }, team: { id: 2 } } },
  },
  {
    _id: 'no-closed-at',
    name: 'Copa Sin Cierre',
    updatedAt: local(2026, 0, 1, 12, 0),
    outcome: { champion: { player: { name: 'Lucho' }, team: { id: 3 } } },
  },
]

const recaps = {
  '2026-10-11': {
    date: '2026-10-11',
    matchCount: 3,
    recap: 'Resumen del 11',
  },
  '2026-10-10': {
    date: '2026-10-10',
    matchCount: 1,
    recap: 'Resumen del 10',
  },
}

const recapNotFound = () =>
  Promise.reject({ response: { status: 404, data: { success: false } } })

let container

beforeEach(() => {
  axios.get.mockImplementation((url, config) => {
    if (url === 'http://api/recaps/dates') {
      return Promise.resolve({
        data: { success: true, data: Object.keys(recaps) },
      })
    }
    if (url === 'http://api/recaps/latest') {
      return Promise.resolve({
        data: { success: true, data: recaps['2026-10-11'] },
      })
    }
    if (url.startsWith('http://api/recaps/')) {
      const recap = recaps[url.split('/').pop()]
      return recap
        ? Promise.resolve({ data: { success: true, data: recap } })
        : recapNotFound()
    }
    return Promise.resolve({
      data: config.params.status === 'finalized' ? finalized : [],
    })
  })
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
  jest.clearAllMocks()
})

const renderHome = () =>
  act(async () => {
    ReactDOM.render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      container,
    )
  })

test('el campeón vigente sale del torneo con el closedAt más reciente, ignorando updatedAt', async () => {
  await renderHome()

  expect(container.querySelector('.champion-tournament').textContent).toBe(
    'Copa Nueva',
  )
  expect(container.querySelector('.champion-player').textContent).toBe(
    'Santi - 01/08/2024',
  )
})

test('muestra por defecto el recap más reciente y lista las fechas disponibles', async () => {
  await renderHome()

  expect(axios.get).toHaveBeenCalledWith('http://api/recaps/latest')
  expect(container.querySelector('.recap-text').textContent).toBe(
    'Resumen del 11',
  )
  expect(container.querySelector('.recap-meta').textContent).toBe(
    '11/10/2026 · 3 partidos',
  )
  const select = container.querySelector('.recap-select')
  expect(select.value).toBe('2026-10-11')
  expect(Array.from(select.options).map((o) => o.value)).toEqual([
    '2026-10-11',
    '2026-10-10',
  ])
})

test('al elegir una fecha pide el recap de ese día', async () => {
  await renderHome()

  const select = container.querySelector('.recap-select')
  await act(async () => {
    select.value = '2026-10-10'
    select.dispatchEvent(new Event('change', { bubbles: true }))
  })

  expect(axios.get).toHaveBeenCalledWith('http://api/recaps/2026-10-10')
  expect(container.querySelector('.recap-text').textContent).toBe(
    'Resumen del 10',
  )
  expect(container.querySelector('.recap-meta').textContent).toBe(
    '10/10/2026 · 1 partido',
  )
})

test('renderiza el recap como markdown', async () => {
  const base = axios.get.getMockImplementation()
  axios.get.mockImplementation((url, config) =>
    url === 'http://api/recaps/latest'
      ? Promise.resolve({
          data: {
            success: true,
            data: {
              date: '2026-10-11',
              matchCount: 10,
              recap:
                '# Día de goleadas\n\nAyer se jugaron **10 partidos**.\n\n---\n\n## Copa del Mundo 2026\n**Etapa: playoff**\n\n<script>alert(1)</script>',
            },
          },
        })
      : base(url, config),
  )

  await renderHome()

  const text = container.querySelector('.recap-text')
  expect(text.querySelector('h1').textContent).toBe('Día de goleadas')
  expect(text.querySelector('h2').textContent).toBe('Copa del Mundo 2026')
  expect(text.querySelector('hr')).not.toBeNull()
  expect(
    Array.from(text.querySelectorAll('strong')).map((n) => n.textContent),
  ).toEqual(['10 partidos', 'Etapa: playoff'])
  expect(text.textContent).not.toContain('**')
  expect(text.querySelector('script')).toBeNull()
})

test('sin recaps guardados muestra un mensaje y no un error', async () => {
  const base = axios.get.getMockImplementation()
  axios.get.mockImplementation((url, config) => {
    if (url === 'http://api/recaps/latest') return recapNotFound()
    if (url === 'http://api/recaps/dates') {
      return Promise.resolve({ data: { success: true, data: [] } })
    }
    return base(url, config)
  })

  await renderHome()

  expect(container.querySelector('.recap-select')).toBeNull()
  expect(container.querySelector('.recap-status').textContent).toBe(
    'No hay resúmenes disponibles',
  )
})

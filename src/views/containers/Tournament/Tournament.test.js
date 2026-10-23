/* eslint-env jest */
jest.mock('api', () => ({
  api: 'http://api',
  cloudName: 'cloud',
  database: 'http://db',
}))
jest.mock('api/axiosConfig', () => ({
  apiClient: { get: jest.fn(), put: jest.fn() },
  getApiErrorMessage: (error, fallback) => fallback,
}))
jest.mock('cloudinary-react', () => ({ Image: () => null }))
jest.mock('utils/notifications', () => ({
  confirmDialog: jest.fn(),
  toast: { success: jest.fn(), apiError: jest.fn() },
}))
jest.mock('views/components', () => ({
  PageLoader: () => null,
  PrimaryLink: () => null,
}))
import { Outlet, Route, MemoryRouter, Routes } from 'react-router-dom'
import ReactDOM from 'react-dom'
import Tournament from '.'
import { act } from 'react-dom/test-utils'
import { apiClient } from 'api/axiosConfig'

const recapDocument = {
  tournamentId: 't1',
  tournament: 'Superliga 12',
  headline: 'Nico levanta su quinta Superliga',
  summary: 'Resumen corto',
  recap:
    '## Así se jugó\n\nNico ganó **la final**.\n\n<script>alert(1)</script>',
  language: 'es-AR',
  revision: 1,
  image: null,
  createdAt: '2026-10-12T10:00:00.000Z',
  updatedAt: '2026-10-12T10:00:00.000Z',
}

const recapUrl = '/tournaments/t1/recap'
const requestedUrls = () => apiClient.get.mock.calls.map(([url]) => url)

let container
let consoleError

beforeEach(() => {
  consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
  consoleError.mockRestore()
  jest.resetAllMocks()
})

const mockApi = (recapResult) => {
  apiClient.get.mockImplementation((url) => {
    if (url === '/tournaments/t1/summary') {
      return Promise.resolve({
        data: { matches: { totalPlayed: 0, recent: [] }, participants: [] },
      })
    }
    return recapResult()
  })
}

const renderTournament = (tournamentData) =>
  act(async () => {
    ReactDOM.render(
      <MemoryRouter initialEntries={['/tournaments/t1']}>
        <Routes>
          <Route
            element={
              <Outlet
                context={{
                  canMutate: false,
                  refreshTournament: jest.fn(),
                  tournamentData,
                }}
              />
            }
          >
            <Route path="/tournaments/:tournament" element={<Tournament />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      container,
    )
  })

const finishedTournament = {
  format: 'league_playin_playoff',
  legacy: false,
  name: 'Superliga 12',
  ongoing: false,
  teams: [],
}

test('200: un torneo terminado con recap muestra la crónica con markdown', async () => {
  mockApi(() =>
    Promise.resolve({ data: { success: true, data: recapDocument } }),
  )
  await renderTournament(finishedTournament)

  expect(requestedUrls()).toContain(recapUrl)
  const section = container.querySelector('section[aria-label]')
  expect(section.querySelector('h2').textContent).toBe('Crónica del torneo')
  expect(section.textContent).toContain('Nico levanta su quinta Superliga')
  expect(section.querySelectorAll('h2')[1].textContent).toBe('Así se jugó')
  expect(section.querySelector('strong').textContent).toBe('la final')
  expect(section.textContent).not.toContain('**')
  expect(section.querySelector('script')).toBeNull()
})

test('404: sin recap no hay tarjeta ni error', async () => {
  mockApi(() =>
    Promise.reject({
      response: {
        status: 404,
        data: { success: false, error: { code: 'TOURNAMENT_RECAP_NOT_FOUND' } },
      },
    }),
  )
  await renderTournament(finishedTournament)

  expect(requestedUrls()).toContain(recapUrl)
  expect(container.textContent).not.toContain('Crónica del torneo')
  expect(container.textContent).not.toContain('No se pudo cargar la crónica')
  expect(consoleError).not.toHaveBeenCalled()
})

test('error: una falla distinta de 404 muestra un aviso sin romper la vista', async () => {
  mockApi(() => Promise.reject({ response: { status: 500 } }))
  await renderTournament(finishedTournament)

  expect(container.textContent).toContain('No se pudo cargar la crónica')
  expect(container.textContent).toContain('Información del Torneo')
})

test('error de red (sin response) también muestra el aviso', async () => {
  mockApi(() => Promise.reject(new Error('Network Error')))
  await renderTournament(finishedTournament)

  expect(container.textContent).toContain('No se pudo cargar la crónica')
})

test('un torneo en curso no pide ni muestra la crónica', async () => {
  mockApi(() =>
    Promise.resolve({ data: { success: true, data: recapDocument } }),
  )
  await renderTournament({ ...finishedTournament, ongoing: true })

  expect(requestedUrls()).not.toContain(recapUrl)
  expect(container.textContent).not.toContain('Crónica del torneo')
})

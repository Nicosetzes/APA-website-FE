/* eslint-env jest */
let mockAssistantUrl = 'http://n8n/webhook/apa-assistant'

jest.mock('api', () => ({
  api: 'http://api',
  database: 'http://db',
  cloudName: 'cloud',
  get assistantUrl() {
    return mockAssistantUrl
  },
}))
jest.mock('context/AuthContext', () => ({ useAuth: jest.fn() }))
jest.mock('api/assistantClient', () => ({
  ...jest.requireActual('api/assistantClient'),
  sendAssistantMessage: jest.fn(),
}))

import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import {
  Link,
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { sendAssistantMessage } from 'api/assistantClient'
import { AssistantProvider } from 'context/AssistantContext'
import { useAuth } from 'context/AuthContext'
import { AssistantLauncher } from 'views/components'
import AssistantPage from '.'

const NICO = { id: 'u-nico', nickname: 'Nico' }

let container

const Location = () => (
  <>
    <span data-testid="path">{useLocation().pathname}</span>
    <Link to="/">volver al inicio</Link>
  </>
)

// Igual que la app: las rutas por un lado y el botón flotante afuera.
const render = (initialPath = '/') =>
  act(async () => {
    ReactDOM.render(
      <MemoryRouter initialEntries={[initialPath]}>
        <AssistantProvider>
          <Routes>
            <Route path="/asistente" element={<AssistantPage />} />
            <Route path="*" element={<main>Otra vista</main>} />
          </Routes>
          <AssistantLauncher />
          <Location />
        </AssistantProvider>
      </MemoryRouter>,
      container,
    )
  })

const $ = (selector) => container.querySelector(selector)
const $$ = (selector) => Array.from(container.querySelectorAll(selector))
const bubbles = () => $$('[role="log"] > div').map((node) => node.textContent)

const click = (element) =>
  act(async () => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

const type = (text) =>
  act(async () => {
    const textarea = $('textarea')
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value',
    ).set
    setter.call(textarea, text)
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  })

const FAB = 'button[aria-label="Abrir el asistente"]'
const DIALOG = '[role="dialog"]'

// AnimatePresence monta y desmonta los nodos al terminar cada animación.
const waitFor = async (condition, attempts = 60) => {
  for (let i = 0; i < attempts && !condition(); i += 1) {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 25))
    })
  }
}

const openPanel = async () => {
  await waitFor(() => $(FAB))
  await click($(FAB))
  await waitFor(() => $(DIALOG))
}

beforeEach(() => {
  mockAssistantUrl = 'http://n8n/webhook/apa-assistant'
  window.sessionStorage.clear()
  useAuth.mockReturnValue({
    isAuthenticated: true,
    isUnauthenticated: false,
    token: 'token-u-nico',
    user: NICO,
  })
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
  jest.clearAllMocks()
})

test('la página muestra el chat y no el botón flotante', async () => {
  await render('/asistente')

  expect($('h1').textContent).toBe('Asistente APA')
  expect($('textarea')).not.toBeNull()
  expect($('button[aria-label="Abrir el asistente"]')).toBeNull()
  expect($('[role="dialog"]')).toBeNull()
})

test('se puede conversar desde la página', async () => {
  sendAssistantMessage.mockResolvedValue('Tenés **2** pendientes')
  await render('/asistente')

  await type('¿Qué tengo pendiente?')
  await click($('button[aria-label="Enviar"]'))

  expect(sendAssistantMessage).toHaveBeenCalledWith(
    expect.objectContaining({
      message: '¿Qué tengo pendiente?',
      token: 'token-u-nico',
    }),
  )
  expect(bubbles()).toContain('¿Qué tengo pendiente?')
  expect($('strong').textContent).toBe('2')
})

test('"Abrir en una página" lleva a /asistente con la misma conversación', async () => {
  sendAssistantMessage.mockResolvedValue('Respuesta del panel')
  await render('/')
  await openPanel()
  await type('hola desde el panel')
  await click($('button[aria-label="Enviar"]'))
  const panelSession = sendAssistantMessage.mock.calls[0][0].sessionId

  await click($('button[title="Abrir en una página"]'))

  expect($('[data-testid="path"]').textContent).toBe('/asistente')
  // El panel sale con su animación (inerte) mientras la página ya está.
  expect($(DIALOG).getAttribute('aria-hidden')).toBe('true')
  expect($('h1').textContent).toBe('Asistente APA')

  // El panel se cierra, el botón no vuelve y la charla sigue ahí.
  await waitFor(() => !$(DIALOG))
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 300))
  })
  expect($(DIALOG)).toBeNull()
  expect($(FAB)).toBeNull()
  expect(bubbles()).toEqual(
    expect.arrayContaining(['hola desde el panel', 'Respuesta del panel']),
  )

  sendAssistantMessage.mockResolvedValue('Y desde la página')
  await type('seguimos')
  await click($('button[aria-label="Enviar"]'))

  expect(sendAssistantMessage.mock.calls[1][0].sessionId).toBe(panelSession)
})

test('al volver a otra vista el botón flotante reaparece con la charla', async () => {
  sendAssistantMessage.mockResolvedValue('Respuesta')
  await render('/asistente')
  await type('hola')
  await click($('button[aria-label="Enviar"]'))

  // Navegación a otra vista con un enlace, sin recargar: el estado se conserva.
  await click($('a[href="/"]'))

  expect($('[data-testid="path"]').textContent).toBe('/')
  await openPanel()

  expect(bubbles()).toEqual(expect.arrayContaining(['hola', 'Respuesta']))
})

test('"Nueva conversación" de la página vacía la charla', async () => {
  sendAssistantMessage.mockResolvedValue('Respuesta previa')
  await render('/asistente')
  await type('hola')
  await click($('button[aria-label="Enviar"]'))
  expect(bubbles()).toContain('Respuesta previa')

  await click(
    $$('button').find((button) =>
      button.textContent.includes('Nueva conversación'),
    ),
  )

  expect(bubbles().join(' ')).not.toContain('Respuesta previa')
})

test('sin webhook configurado la página lo dice y no muestra el chat', async () => {
  mockAssistantUrl = ''

  await render('/asistente')

  expect($('[role="status"]').textContent).toBe(
    'El asistente no está disponible por ahora.',
  )
  expect($('textarea')).toBeNull()
})

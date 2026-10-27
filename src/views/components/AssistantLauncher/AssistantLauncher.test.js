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
import { MemoryRouter } from 'react-router-dom'
import { sendAssistantMessage } from 'api/assistantClient'
import { AssistantProvider } from 'context/AssistantContext'
import { useAuth } from 'context/AuthContext'
import { ASSISTANT_STORAGE_KEY, MAX_MESSAGE_LENGTH } from 'utils/assistant'
import { SUGGESTIONS } from '../AssistantChat'
import AssistantLauncher from '.'

const NICO = { id: 'u-nico', nickname: 'Nico' }
const MAX = { id: 'u-max', nickname: 'Max' }

const authenticated = (user = NICO) => ({
  isAuthenticated: true,
  isUnauthenticated: false,
  token: `token-${user.id}`,
  user,
})
const loading = {
  isAuthenticated: false,
  isUnauthenticated: false,
  token: null,
  user: null,
}
const loggedOut = {
  isAuthenticated: false,
  isUnauthenticated: true,
  token: null,
  user: null,
}

let container

const render = () =>
  act(async () => {
    ReactDOM.render(
      <MemoryRouter>
        <AssistantProvider>
          <AssistantLauncher />
        </AssistantProvider>
      </MemoryRouter>,
      container,
    )
  })

const unmount = () =>
  act(async () => ReactDOM.unmountComponentAtNode(container))

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

const pressEnter = (options = {}) =>
  act(async () => {
    $('textarea').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, ...options }),
    )
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
const sendButton = () => $('button[aria-label="Enviar"]')

const deferred = () => {
  let resolve
  let reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

beforeEach(() => {
  mockAssistantUrl = 'http://n8n/webhook/apa-assistant'
  window.sessionStorage.clear()
  useAuth.mockReturnValue(authenticated())
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
  jest.clearAllMocks()
})

describe('visibilidad', () => {
  test('sin sesión no muestra nada', async () => {
    useAuth.mockReturnValue(loggedOut)

    await render()

    expect(container.innerHTML).toBe('')
  })

  test('sin webhook configurado no muestra nada', async () => {
    mockAssistantUrl = ''

    await render()

    expect(container.innerHTML).toBe('')
  })

  test('con sesión muestra el botón y el panel está cerrado', async () => {
    await render()

    expect($('button[aria-label="Abrir el asistente"]')).not.toBeNull()
    expect($('[role="dialog"]')).toBeNull()
  })

  test('abre el panel con un saludo con el nombre y las sugerencias', async () => {
    await render()
    await openPanel()

    expect($('[role="dialog"]').getAttribute('aria-label')).toBe(
      'Asistente de APA',
    )
    expect($('[data-testid="assistant-welcome"]').textContent).toContain(
      'Hola Nico!',
    )
    expect($$('button').map((b) => b.textContent)).toEqual(
      expect.arrayContaining([SUGGESTIONS[0]]),
    )
  })

  test('se cierra con el botón de cerrar y con Escape', async () => {
    await render()
    await openPanel()
    await click($('button[title="Cerrar"]'))
    await waitFor(() => !$(DIALOG))
    expect($(DIALOG)).toBeNull()
    await waitFor(() => $(FAB))
    expect($(FAB)).not.toBeNull()

    await openPanel()
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })
    await waitFor(() => !$(DIALOG))
    expect($(DIALOG)).toBeNull()
    await waitFor(() => $(FAB))
    expect($(FAB)).not.toBeNull()
  })
})

describe('animación y reemplazo del botón', () => {
  test('el panel reemplaza al botón y nunca se ven juntos', async () => {
    await render()
    await waitFor(() => $(FAB))
    await click($(FAB))

    // El botón sale (inerte) antes de que entre el panel.
    expect($(FAB).getAttribute('aria-hidden')).toBe('true')
    expect($(DIALOG)).toBeNull()

    for (let i = 0; i < 60 && !$(DIALOG); i += 1) {
      const visibleFab = $(`${FAB}:not([aria-hidden="true"])`)
      expect(visibleFab && $(DIALOG)).toBeFalsy()
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      })
    }

    expect($(DIALOG)).not.toBeNull()
    expect($(FAB)).toBeNull()
  })

  test('al cerrar, el panel sale inerte y después vuelve el botón', async () => {
    await render()
    await openPanel()
    await click($('button[title="Cerrar"]'))

    expect($(DIALOG).getAttribute('aria-hidden')).toBe('true')
    expect($(DIALOG).style.pointerEvents).toBe('none')
    expect($(FAB)).toBeNull()

    await waitFor(() => !$(DIALOG))
    await waitFor(() => $(FAB))

    expect($(DIALOG)).toBeNull()
    expect($(FAB)).not.toBeNull()
    expect($(FAB).getAttribute('aria-hidden')).toBeNull()
  })

  test('se puede abrir, cerrar y volver a abrir', async () => {
    await render()
    await openPanel()
    await click($('button[title="Cerrar"]'))
    await waitFor(() => !$(DIALOG) && $(FAB))

    await openPanel()

    expect($(DIALOG)).not.toBeNull()
    expect($('textarea')).not.toBeNull()
  })

  test('el foco va al campo de texto al abrir y vuelve al botón al cerrar', async () => {
    await render()
    await openPanel()

    expect(document.activeElement).toBe($('textarea'))

    await click($('button[title="Cerrar"]'))
    await waitFor(() => !$(DIALOG) && $(FAB))
    expect(document.activeElement).toBe($(FAB))

    await openPanel()
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })
    await waitFor(() => !$(DIALOG) && $(FAB))
    expect(document.activeElement).toBe($(FAB))
  })

  test('mantiene los atributos de accesibilidad del botón y del panel', async () => {
    await render()
    await waitFor(() => $(FAB))

    expect($(FAB).getAttribute('aria-haspopup')).toBe('dialog')
    expect($(FAB).getAttribute('aria-expanded')).toBeNull()

    await openPanel()

    expect($(DIALOG).tagName).toBe('SECTION')
    expect($(DIALOG).getAttribute('aria-label')).toBe('Asistente de APA')
  })
})

describe('conversación', () => {
  test('envía la pregunta con el token y la sesión, y muestra la respuesta', async () => {
    const pending = deferred()
    sendAssistantMessage.mockReturnValue(pending.promise)
    await render()
    await openPanel()

    await type('¿Qué tengo pendiente?')
    await click(sendButton())

    expect(sendAssistantMessage).toHaveBeenCalledWith({
      message: '¿Qué tengo pendiente?',
      sessionId: expect.stringMatching(/^[A-Za-z0-9_-]{8,64}$/),
      token: 'token-u-nico',
      signal: expect.anything(),
    })
    // Mientras espera: la pregunta se ve, hay indicador y no se puede reenviar.
    expect(bubbles()).toContain('¿Qué tengo pendiente?')
    expect($('[role="status"]')).not.toBeNull()
    expect($('textarea').value).toBe('')
    await type('otra')
    expect(sendButton().disabled).toBe(true)

    await act(async () => pending.resolve('Tenés **2** pendientes.'))

    expect($('[role="status"]')).toBeNull()
    expect($('strong').textContent).toBe('2')
    expect(bubbles()).toContain('Tenés 2 pendientes.')
  })

  test('Enter envía y Shift+Enter no', async () => {
    sendAssistantMessage.mockResolvedValue('Listo')
    await render()
    await openPanel()

    await type('hola')
    await pressEnter({ shiftKey: true })
    expect(sendAssistantMessage).not.toHaveBeenCalled()

    await pressEnter()
    expect(sendAssistantMessage).toHaveBeenCalledTimes(1)
    expect(bubbles()).toContain('Listo')
  })

  test('no envía mensajes vacíos o de solo espacios', async () => {
    await render()
    await openPanel()

    expect(sendButton().disabled).toBe(true)
    await type('    ')
    expect(sendButton().disabled).toBe(true)
    await pressEnter()

    expect(sendAssistantMessage).not.toHaveBeenCalled()
  })

  test('limita el largo del mensaje y avisa cuando se acerca', async () => {
    await render()
    await openPanel()

    expect($('textarea').maxLength).toBe(MAX_MESSAGE_LENGTH)
    expect($('form + div')).toBeNull()

    await type('x'.repeat(850))
    expect($('form + div').textContent).toBe(`850/${MAX_MESSAGE_LENGTH}`)
  })

  test('una sugerencia envía la pregunta sin tocar lo que se está escribiendo', async () => {
    sendAssistantMessage.mockResolvedValue('Hay 3 torneos activos')
    await render()
    await openPanel()
    await type('mi borrador')

    await click($$('button').find((b) => b.textContent === SUGGESTIONS[1]))

    expect(sendAssistantMessage).toHaveBeenCalledWith(
      expect.objectContaining({ message: SUGGESTIONS[1] }),
    )
    expect($('textarea').value).toBe('mi borrador')
    // Las sugerencias desaparecen cuando la charla empieza.
    expect($$('button').some((b) => b.textContent === SUGGESTIONS[1])).toBe(
      false,
    )
  })

  test('un 401 muestra un mensaje claro y no deja la charla trabada', async () => {
    sendAssistantMessage
      .mockRejectedValueOnce({ response: { status: 401, data: {} } })
      .mockResolvedValueOnce('Ahora sí')
    await render()
    await openPanel()

    await type('hola')
    await click(sendButton())

    expect($('[role="alert"]').textContent).toMatch(/iniciar sesión/)
    expect($('[role="status"]')).toBeNull()

    await type('de nuevo')
    await click(sendButton())
    expect(bubbles()).toContain('Ahora sí')
  })

  test('muestra el mensaje del servidor cuando es un pedido inválido', async () => {
    sendAssistantMessage.mockRejectedValue({
      response: {
        status: 400,
        data: { error: { message: 'El mensaje es demasiado largo' } },
      },
    })
    await render()
    await openPanel()

    await type('hola')
    await click(sendButton())

    expect($('[role="alert"]').textContent).toBe(
      'El mensaje es demasiado largo',
    )
  })
})

describe('render de las respuestas', () => {
  const reply = async (text) => {
    sendAssistantMessage.mockResolvedValue(text)
    await render()
    await openPanel()
    await type('hola')
    await click(sendButton())
  }

  test('los enlaces del sitio van por el router y los externos se abren aparte', async () => {
    await reply(
      'Podés verlo en [Fixture de la Liga](/tournaments/abc/fixture) o en [APA](https://sitioapa.com.ar).',
    )

    const [internal, external] = $$('[role="log"] a')

    expect(internal.getAttribute('href')).toBe('/tournaments/abc/fixture')
    expect(internal.getAttribute('target')).toBeNull()
    expect(external.getAttribute('href')).toBe('https://sitioapa.com.ar')
    expect(external.getAttribute('target')).toBe('_blank')
    expect(external.getAttribute('rel')).toBe('noopener noreferrer')
  })

  test('los enlaces con otro protocolo o a otro dominio sin http quedan como texto', async () => {
    await reply(
      '[uno](javascript:alert(1)) [dos](data:text/html,x) [tres](//evil.com/x)',
    )

    expect($$('[role="log"] a')).toHaveLength(0)
    expect(bubbles().join(' ')).toContain('uno')
  })

  test('no carga imágenes ni interpreta HTML crudo', async () => {
    await reply(
      'Mirá ![pixel](https://evil.example/p.png) <script>alert(1)</script> <b>negrita</b>',
    )

    expect($('[role="log"] img')).toBeNull()
    expect($('[role="log"] script')).toBeNull()
    expect($('[role="log"] b')).toBeNull()
  })

  test('renderiza listas y negritas', async () => {
    await reply('- **Liga APA**: 3\n- **Copa APA**: 1')

    expect($$('[role="log"] li').map((li) => li.textContent)).toEqual([
      'Liga APA: 3',
      'Copa APA: 1',
    ])
  })

  test('el texto del usuario no se interpreta como Markdown', async () => {
    sendAssistantMessage.mockResolvedValue('ok')
    await render()
    await openPanel()
    await type('**hola** <b>x</b>')
    await click(sendButton())

    expect(bubbles()).toContain('**hola** <b>x</b>')
    expect($('[role="log"] b')).toBeNull()
  })
})

describe('persistencia y cambio de sesión', () => {
  const chat = async (text, answer) => {
    sendAssistantMessage.mockResolvedValueOnce(answer)
    await type(text)
    await click(sendButton())
  }

  test('retoma la charla al recargar la pestaña con la misma sesión', async () => {
    await render()
    await openPanel()
    await chat('hola', 'Hola Nico')
    const firstSession = sendAssistantMessage.mock.calls[0][0].sessionId

    await unmount()
    await render()
    await openPanel()

    expect(bubbles()).toEqual(expect.arrayContaining(['hola', 'Hola Nico']))

    await chat('seguimos', 'Dale')
    expect(sendAssistantMessage.mock.calls[1][0].sessionId).toBe(firstSession)
  })

  test('mientras se valida la sesión al recargar no se pierde la charla', async () => {
    await render()
    await openPanel()
    await chat('hola', 'Hola Nico')
    await unmount()

    useAuth.mockReturnValue(loading)
    await render()
    expect(window.sessionStorage.getItem(ASSISTANT_STORAGE_KEY)).not.toBeNull()

    useAuth.mockReturnValue(authenticated())
    await render()
    await openPanel()
    expect(bubbles()).toContain('Hola Nico')
  })

  test('otro usuario en el mismo navegador no ve la charla anterior', async () => {
    await render()
    await openPanel()
    await chat('hola', 'Hola Nico')
    await unmount()

    useAuth.mockReturnValue(authenticated(MAX))
    await render()
    await openPanel()

    expect(bubbles().join(' ')).not.toContain('Hola Nico')
    expect($('[data-testid="assistant-welcome"]').textContent).toContain('Max')
  })

  test('al cerrar sesión se descarta la charla y desaparece el botón', async () => {
    await render()
    await openPanel()
    await chat('hola', 'Hola Nico')

    useAuth.mockReturnValue(loggedOut)
    await render()
    await waitFor(() => container.innerHTML === '')

    expect(container.innerHTML).toBe('')
    expect(window.sessionStorage.getItem(ASSISTANT_STORAGE_KEY)).toBeNull()
  })

  test('"Nueva conversación" vacía la charla y cambia la sesión', async () => {
    await render()
    await openPanel()
    await chat('hola', 'Respuesta previa')
    const firstSession = sendAssistantMessage.mock.calls[0][0].sessionId
    expect(bubbles()).toContain('Respuesta previa')

    await click($('button[title="Nueva conversación"]'))

    expect(bubbles().join(' ')).not.toContain('Respuesta previa')

    await chat('empezamos', 'Dale')
    expect(sendAssistantMessage.mock.calls[1][0].sessionId).not.toBe(
      firstSession,
    )
  })

  test('una respuesta que llega después de empezar una charla nueva se ignora', async () => {
    const pending = deferred()
    sendAssistantMessage.mockReturnValueOnce(pending.promise)
    await render()
    await openPanel()
    await type('hola')
    await click(sendButton())

    await click($('button[title="Nueva conversación"]'))
    await act(async () => pending.resolve('Respuesta vieja'))

    expect(bubbles().join(' ')).not.toContain('Respuesta vieja')
    expect($('[role="status"]')).toBeNull()
    // Se puede escribir de nuevo enseguida.
    expect(sendButton().disabled).toBe(true)
    await type('nueva')
    expect(sendButton().disabled).toBe(false)
  })

  test('los mensajes de error no sobreviven a una recarga', async () => {
    sendAssistantMessage.mockRejectedValueOnce({ response: { status: 500 } })
    await render()
    await openPanel()
    await type('hola')
    await click(sendButton())
    expect($('[role="alert"]')).not.toBeNull()

    await unmount()
    await render()
    await openPanel()

    expect($('[role="alert"]')).toBeNull()
    expect(bubbles()).toContain('hola')
  })
})

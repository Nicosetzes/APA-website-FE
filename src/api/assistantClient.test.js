/* eslint-env jest */
let mockAssistantUrl = 'http://n8n/webhook/apa-assistant'

jest.mock('api', () => ({
  get assistantUrl() {
    return mockAssistantUrl
  },
}))
jest.mock('axios', () => ({ post: jest.fn() }))

import axios from 'axios'
import {
  ASSISTANT_TIMEOUT_MS,
  AssistantInvalidResponseError,
  AssistantNotConfiguredError,
  getAssistantErrorMessage,
  sendAssistantMessage,
} from './assistantClient'

beforeEach(() => {
  mockAssistantUrl = 'http://n8n/webhook/apa-assistant'
  axios.post.mockReset()
})

test('envía el mensaje y la sesión al webhook con el token del usuario', async () => {
  const controller = new AbortController()
  axios.post.mockResolvedValue({ data: { reply: 'Tenés 2 pendientes' } })

  const reply = await sendAssistantMessage({
    message: '¿Qué tengo pendiente?',
    sessionId: 's-abc12345',
    token: 'jwt-token',
    signal: controller.signal,
  })

  expect(reply).toBe('Tenés 2 pendientes')
  expect(axios.post).toHaveBeenCalledWith(
    'http://n8n/webhook/apa-assistant',
    { message: '¿Qué tengo pendiente?', sessionId: 's-abc12345' },
    {
      headers: { Authorization: 'Bearer jwt-token' },
      timeout: ASSISTANT_TIMEOUT_MS,
      signal: controller.signal,
    },
  )
})

test('sin webhook configurado no hace ningún pedido', async () => {
  mockAssistantUrl = ''

  await expect(
    sendAssistantMessage({ message: 'hola', sessionId: 's', token: 't' }),
  ).rejects.toBeInstanceOf(AssistantNotConfiguredError)
  expect(axios.post).not.toHaveBeenCalled()
})

test('rechaza una respuesta sin texto', async () => {
  for (const data of [
    {},
    { reply: '' },
    { reply: '   ' },
    { reply: 5 },
    null,
  ]) {
    axios.post.mockResolvedValue({ data })

    await expect(
      sendAssistantMessage({ message: 'hola', sessionId: 's', token: 't' }),
    ).rejects.toBeInstanceOf(AssistantInvalidResponseError)
  }
})

describe('getAssistantErrorMessage', () => {
  const http = (status, message) => ({
    response: { status, data: message ? { error: { message } } : {} },
  })

  test('401 pide volver a iniciar sesión', () => {
    expect(getAssistantErrorMessage(http(401))).toMatch(/iniciar sesión/)
  })

  test('429 pide esperar', () => {
    expect(getAssistantErrorMessage(http(429))).toMatch(/Esperá/)
  })

  test('usa el mensaje que manda el servidor para el usuario', () => {
    expect(getAssistantErrorMessage(http(400, 'Falta el mensaje'))).toBe(
      'Falta el mensaje',
    )
    expect(
      getAssistantErrorMessage(http(503, 'No pude verificar tu sesión')),
    ).toBe('No pude verificar tu sesión')
  })

  test('un error de servidor sin mensaje usa uno genérico', () => {
    expect(getAssistantErrorMessage(http(500))).toMatch(/Probá de nuevo/)
  })

  test('distingue timeout, falta de conexión y configuración', () => {
    expect(getAssistantErrorMessage({ code: 'ECONNABORTED' })).toMatch(
      /Tardé demasiado/,
    )
    expect(getAssistantErrorMessage(new Error('Network Error'))).toMatch(
      /conectarme/,
    )
    expect(getAssistantErrorMessage(new AssistantNotConfiguredError())).toMatch(
      /no está disponible/,
    )
    expect(
      getAssistantErrorMessage(new AssistantInvalidResponseError()),
    ).toMatch(/Probá de nuevo/)
  })

  test('no muestra detalles técnicos del error', () => {
    const message = getAssistantErrorMessage({
      response: { status: 500, data: { stack: 'Error: boom at line 1' } },
    })

    expect(message).not.toMatch(/boom|stack/)
  })
})

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

test('una respuesta sin texto guarda el status HTTP', async () => {
  axios.post.mockResolvedValue({ status: 200, data: {} })

  await expect(
    sendAssistantMessage({ message: 'hola', sessionId: 's', token: 't' }),
  ).rejects.toMatchObject({ status: 200 })
})

describe('getAssistantErrorMessage', () => {
  const http = (status, message, code) => ({
    response: {
      status,
      data: message || code ? { error: { message, code } } : {},
    },
  })

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    console.error.mockRestore()
  })

  test('agrega al final el código del error', () => {
    expect(getAssistantErrorMessage(http(403))).toBe(
      'No pude responder en este momento. Probá de nuevo. (HTTP 403)',
    )
    expect(
      getAssistantErrorMessage(
        http(500, 'No pude responder en este momento.', 'ASSISTANT_ERROR'),
      ),
    ).toBe('No pude responder en este momento. (HTTP 500 · ASSISTANT_ERROR)')
    expect(
      getAssistantErrorMessage(new AssistantInvalidResponseError(200)),
    ).toBe(
      'No pude responder en este momento. Probá de nuevo. (HTTP 200 · EMPTY_REPLY)',
    )
    expect(
      getAssistantErrorMessage({ code: 'ERR_NETWORK', message: 'x' }),
    ).toMatch(/conectarme.*\(ERR_NETWORK\)$/)
    expect(getAssistantErrorMessage(new Error('Network Error'))).toMatch(
      /\(NO_RESPONSE\)$/,
    )
  })

  test('registra el detalle en la consola', () => {
    getAssistantErrorMessage({ response: { status: 502, data: '<html>' } })

    expect(console.error).toHaveBeenCalledWith(
      'assistant_error',
      expect.objectContaining({
        code: 'HTTP 502',
        status: 502,
        body: '<html>',
      }),
    )
  })

  test('sin webhook configurado no agrega código', () => {
    expect(getAssistantErrorMessage(new AssistantNotConfiguredError())).toBe(
      'El asistente no está disponible por ahora.',
    )
  })

  test('401 pide volver a iniciar sesión', () => {
    expect(getAssistantErrorMessage(http(401))).toMatch(/iniciar sesión/)
  })

  test('429 pide esperar', () => {
    expect(getAssistantErrorMessage(http(429))).toMatch(/Esperá/)
  })

  test('usa el mensaje que manda el servidor para el usuario', () => {
    expect(getAssistantErrorMessage(http(400, 'Falta el mensaje'))).toBe(
      'Falta el mensaje (HTTP 400)',
    )
    expect(
      getAssistantErrorMessage(http(503, 'No pude verificar tu sesión')),
    ).toBe('No pude verificar tu sesión (HTTP 503)')
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

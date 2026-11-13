import { assistantUrl } from 'api'
import axios from 'axios'

export const ASSISTANT_TIMEOUT_MS = 60000

export class AssistantNotConfiguredError extends Error {
  constructor() {
    super('El asistente no está configurado')
    this.name = 'AssistantNotConfiguredError'
  }
}

export class AssistantInvalidResponseError extends Error {
  constructor(status) {
    super('La respuesta del asistente no es válida')
    this.name = 'AssistantInvalidResponseError'
    this.status = status
  }
}

// Habla directo con el webhook de n8n, que valida el token contra el BE.
// No usa `apiClient`: un 401 de n8n no tiene que cerrar la sesión del sitio.
export const sendAssistantMessage = async ({
  message,
  sessionId,
  token,
  signal,
}) => {
  if (!assistantUrl) throw new AssistantNotConfiguredError()

  const { data, status } = await axios.post(
    assistantUrl,
    { message, sessionId },
    {
      headers: { Authorization: `Bearer ${token}` },
      timeout: ASSISTANT_TIMEOUT_MS,
      signal,
    },
  )

  if (typeof data?.reply !== 'string' || !data.reply.trim()) {
    throw new AssistantInvalidResponseError(status)
  }

  return data.reply
}

const GENERIC_ERROR = 'No pude responder en este momento. Probá de nuevo.'

// Código corto para saber de dónde viene el error (el status HTTP y el código
// de n8n, o el código de red de axios). Sirve para diagnosticar desde el
// celular, donde no hay consola a mano.
export const getAssistantErrorCode = (error) => {
  if (error instanceof AssistantInvalidResponseError) {
    return [error.status && `HTTP ${error.status}`, 'EMPTY_REPLY']
      .filter(Boolean)
      .join(' · ')
  }

  const status = error?.response?.status
  if (status) {
    const serverCode = error.response.data?.error?.code
    return [`HTTP ${status}`, typeof serverCode === 'string' && serverCode]
      .filter(Boolean)
      .join(' · ')
  }

  return typeof error?.code === 'string' && error.code
    ? error.code
    : 'NO_RESPONSE'
}

// Mensaje para el usuario, sin el código. Los 4xx/5xx de n8n traen un mensaje
// ya pensado para el usuario en `error.message`; para el resto se usa uno
// propio.
const getUserMessage = (error) => {
  if (error instanceof AssistantInvalidResponseError) return GENERIC_ERROR

  const status = error?.response?.status
  const serverMessage = error?.response?.data?.error?.message

  if (status === 401) {
    return 'Tu sesión venció o no es válida. Volvé a iniciar sesión para usar el asistente.'
  }

  if (status === 429) {
    return 'Mandaste muchos mensajes seguidos. Esperá un momento y probá de nuevo.'
  }

  if (typeof serverMessage === 'string' && serverMessage) return serverMessage

  if (error?.code === 'ECONNABORTED') {
    return 'Tardé demasiado en responder. Probá de nuevo.'
  }

  if (!error?.response) {
    return 'No pude conectarme con el asistente. Revisá tu conexión y probá de nuevo.'
  }

  return GENERIC_ERROR
}

// Mensaje para mostrar en el chat, con el código del error al final.
export const getAssistantErrorMessage = (error) => {
  if (error instanceof AssistantNotConfiguredError) {
    return 'El asistente no está disponible por ahora.'
  }

  const code = getAssistantErrorCode(error)

  // eslint-disable-next-line no-console
  console.error('assistant_error', {
    code,
    status: error?.response?.status,
    axiosCode: error?.code,
    body: String(
      typeof error?.response?.data === 'string'
        ? error.response.data
        : JSON.stringify(error?.response?.data ?? null),
    ).slice(0, 300),
  })

  return `${getUserMessage(error)} (${code})`
}

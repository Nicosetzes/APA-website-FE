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
  constructor() {
    super('La respuesta del asistente no es válida')
    this.name = 'AssistantInvalidResponseError'
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

  const { data } = await axios.post(
    assistantUrl,
    { message, sessionId },
    {
      headers: { Authorization: `Bearer ${token}` },
      timeout: ASSISTANT_TIMEOUT_MS,
      signal,
    },
  )

  if (typeof data?.reply !== 'string' || !data.reply.trim()) {
    throw new AssistantInvalidResponseError()
  }

  return data.reply
}

const GENERIC_ERROR = 'No pude responder en este momento. Probá de nuevo.'

// Mensaje para mostrar en el chat. Los 4xx/5xx de n8n traen un mensaje ya
// pensado para el usuario en `error.message`; para el resto se usa uno propio.
export const getAssistantErrorMessage = (error) => {
  if (error instanceof AssistantNotConfiguredError) {
    return 'El asistente no está disponible por ahora.'
  }

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

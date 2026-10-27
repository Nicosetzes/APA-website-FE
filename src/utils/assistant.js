export const MAX_MESSAGE_LENGTH = 1000
export const ASSISTANT_STORAGE_KEY = 'apa.assistant.v1'

const STORAGE_VERSION = 1
const MAX_STORED_MESSAGES = 40
// El mismo formato que valida n8n.
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/
const STORED_ROLES = ['user', 'assistant']

const randomHex = (length) => {
  const cryptoApi = typeof window !== 'undefined' ? window.crypto : undefined

  if (cryptoApi?.getRandomValues) {
    const bytes = new Uint8Array(Math.ceil(length / 2))
    cryptoApi.getRandomValues(bytes)
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, length)
  }

  // Sin Web Crypto (entornos viejos o de test). El id no es un secreto: la
  // identidad sale del token, y la memoria del agente se indexa también por
  // usuario.
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('')
}

export const createSessionId = () => `s-${randomHex(32)}`

export const isValidSessionId = (value) =>
  typeof value === 'string' && SESSION_ID_PATTERN.test(value)

const isStoredMessage = (message) =>
  message !== null &&
  typeof message === 'object' &&
  typeof message.id === 'string' &&
  STORED_ROLES.includes(message.role) &&
  typeof message.text === 'string'

const getStorage = () => {
  try {
    return window.sessionStorage
  } catch (error) {
    return null
  }
}

export const readConversation = (userId) => {
  const storage = getStorage()
  if (!storage || !userId) return null

  try {
    const stored = JSON.parse(storage.getItem(ASSISTANT_STORAGE_KEY))

    if (
      stored?.version !== STORAGE_VERSION ||
      stored.userId !== String(userId) ||
      !isValidSessionId(stored.sessionId) ||
      !Array.isArray(stored.messages)
    ) {
      return null
    }

    return {
      sessionId: stored.sessionId,
      messages: stored.messages.filter(isStoredMessage),
    }
  } catch (error) {
    return null
  }
}

export const writeConversation = (userId, { sessionId, messages }) => {
  const storage = getStorage()
  if (!storage || !userId || !isValidSessionId(sessionId)) return

  try {
    storage.setItem(
      ASSISTANT_STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        userId: String(userId),
        sessionId,
        messages: messages
          .filter(isStoredMessage)
          .slice(-MAX_STORED_MESSAGES)
          .map(({ id, role, text }) => ({ id, role, text })),
      }),
    )
  } catch (error) {
    // Almacenamiento lleno o bloqueado: la charla sigue en memoria.
  }
}

export const clearConversation = () => {
  try {
    getStorage()?.removeItem(ASSISTANT_STORAGE_KEY)
  } catch (error) {
    // Nada que limpiar.
  }
}

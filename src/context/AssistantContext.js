import axios from 'axios'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useAuth } from 'context/AuthContext'
import {
  getAssistantErrorMessage,
  sendAssistantMessage,
} from 'api/assistantClient'
import {
  MAX_MESSAGE_LENGTH,
  clearConversation,
  createSessionId,
  readConversation,
  writeConversation,
} from 'utils/assistant'

const AssistantContext = createContext(null)

const EMPTY_CONVERSATION = { userId: null, sessionId: null, messages: [] }

export const useAssistant = () => {
  const assistant = useContext(AssistantContext)

  if (!assistant) {
    throw new Error('useAssistant must be used within an AssistantProvider')
  }
  return assistant
}

export const AssistantProvider = ({ children }) => {
  const { isAuthenticated, isUnauthenticated, token, user } = useAuth()
  const userId = isAuthenticated && user?.id ? String(user.id) : null

  const [conversation, setConversation] = useState(EMPTY_CONVERSATION)
  const [isSending, setIsSending] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const sendingRef = useRef(false)
  const controllerRef = useRef(null)
  // Cambia cuando se descarta la charla: invalida las respuestas en vuelo.
  const generationRef = useRef(0)
  const messageCounterRef = useRef(0)

  const discardInFlight = useCallback(() => {
    generationRef.current += 1
    controllerRef.current?.abort()
    controllerRef.current = null
    sendingRef.current = false
    setIsSending(false)
  }, [])

  // Al entrar (o cambiar de usuario) se retoma la charla de la pestaña. Solo se
  // descarta cuando la sesión terminó de verdad: mientras el sitio valida la
  // sesión al recargar, la charla guardada tiene que sobrevivir.
  useEffect(() => {
    discardInFlight()

    if (userId) {
      setConversation({
        userId,
        ...(readConversation(userId) || {
          sessionId: createSessionId(),
          messages: [],
        }),
      })
      return
    }

    if (isUnauthenticated) {
      clearConversation()
      setConversation(EMPTY_CONVERSATION)
      setIsOpen(false)
    }
  }, [userId, isUnauthenticated, discardInFlight])

  useEffect(() => {
    if (userId && conversation.userId === userId && conversation.sessionId) {
      writeConversation(userId, conversation)
    }
  }, [userId, conversation])

  useEffect(() => () => controllerRef.current?.abort(), [])

  const appendMessage = useCallback((role, text) => {
    messageCounterRef.current += 1
    const message = {
      id: `m${Date.now().toString(36)}-${messageCounterRef.current}`,
      role,
      text,
    }

    setConversation((current) => ({
      ...current,
      messages: [...current.messages, message],
    }))
  }, [])

  const isCurrentUserConversation = Boolean(
    userId && conversation.userId === userId,
  )
  const { sessionId } = conversation

  const send = useCallback(
    async (rawText) => {
      const text = String(rawText ?? '').trim()

      if (
        !text ||
        text.length > MAX_MESSAGE_LENGTH ||
        sendingRef.current ||
        !isCurrentUserConversation ||
        !sessionId
      ) {
        return false
      }

      sendingRef.current = true
      setIsSending(true)
      appendMessage('user', text)

      const generation = generationRef.current
      const controller = new AbortController()
      controllerRef.current = controller

      try {
        const reply = await sendAssistantMessage({
          message: text,
          sessionId,
          token,
          signal: controller.signal,
        })

        if (generation === generationRef.current) {
          appendMessage('assistant', reply)
        }
      } catch (error) {
        if (generation === generationRef.current && !axios.isCancel(error)) {
          appendMessage('error', getAssistantErrorMessage(error))
        }
      } finally {
        if (generation === generationRef.current) {
          sendingRef.current = false
          controllerRef.current = null
          setIsSending(false)
        }
      }

      return true
    },
    [appendMessage, isCurrentUserConversation, sessionId, token],
  )

  // Empieza una charla nueva: otra sesión, así el agente también olvida la
  // anterior.
  const reset = useCallback(() => {
    if (!userId) return

    discardInFlight()
    setConversation({
      userId,
      sessionId: createSessionId(),
      messages: [],
    })
  }, [discardInFlight, userId])

  const value = useMemo(
    () => ({
      messages: isCurrentUserConversation ? conversation.messages : [],
      isSending,
      isOpen,
      isAvailable: isCurrentUserConversation,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((current) => !current),
      send,
      reset,
    }),
    [
      conversation.messages,
      isCurrentUserConversation,
      isSending,
      isOpen,
      send,
      reset,
    ],
  )

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  )
}

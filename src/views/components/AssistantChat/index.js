import Markdown from 'markdown-to-jsx'
import SendIcon from '@mui/icons-material/Send'
import { Link } from 'react-router-dom'
import { MAX_MESSAGE_LENGTH } from 'utils/assistant'
import { motion, useReducedMotion } from 'framer-motion'
import { useAssistant } from 'context/AssistantContext'
import { useAuth } from 'context/AuthContext'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  getMessageVariants,
  getSuggestionVariants,
  getSuggestionsVariants,
} from './animations'
import {
  Bubble,
  Composer,
  Counter,
  Messages,
  StyledAssistantChat,
  Suggestions,
  Typing,
} from './styled'

export const SUGGESTIONS = [
  'Qué partidos tengo para jugar?',
  'Cuántos partidos gané de los últimos 10?',
  'Dónde veo el Rating APA de cada jugador?',
]

const COUNTER_THRESHOLD = Math.floor(MAX_MESSAGE_LENGTH * 0.8)

const isInternalPath = (href) =>
  typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')

const isWebUrl = (href) =>
  typeof href === 'string' && /^https?:\/\//i.test(href)

const ChatLink = ({ href, children, onNavigate }) => {
  if (isInternalPath(href)) {
    return (
      <Link to={href} onClick={onNavigate}>
        {children}
      </Link>
    )
  }

  if (isWebUrl(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return <span>{children}</span>
}

// Sin imágenes: una URL de imagen escrita por el modelo se cargaría sola.
const NoImage = () => null

const AssistantMessage = ({ text, onNavigate }) => (
  <Markdown
    options={{
      disableParsingRawHTML: true,
      forceBlock: true,
      overrides: {
        a: { component: ChatLink, props: { onNavigate } },
        img: { component: NoImage },
      },
    }}
  >
    {text}
  </Markdown>
)

const AssistantChat = ({ onNavigate }) => {
  const { user } = useAuth()
  const { messages, isSending, send } = useAssistant()
  const [draft, setDraft] = useState('')
  const messagesRef = useRef(null)
  const reducedMotion = Boolean(useReducedMotion())

  const initialIds = useRef(null)
  if (initialIds.current === null) {
    initialIds.current = new Set(messages.map((message) => message.id))
  }

  const messageVariants = useMemo(
    () => getMessageVariants({ reducedMotion }),
    [reducedMotion],
  )
  const welcomeVariants = useMemo(
    () => getMessageVariants({ reducedMotion, delay: 0.12 }),
    [reducedMotion],
  )
  const suggestionsVariants = useMemo(
    () => getSuggestionsVariants({ reducedMotion }),
    [reducedMotion],
  )
  const suggestionVariants = useMemo(
    () => getSuggestionVariants({ reducedMotion }),
    [reducedMotion],
  )

  useEffect(() => {
    const element = messagesRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [messages.length, isSending])

  const submit = async (text, { fromDraft = false } = {}) => {
    if (!text.trim() || isSending) return

    if (fromDraft) setDraft('')
    await send(text)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    submit(draft, { fromDraft: true })
  }

  const handleKeyDown = (event) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent?.isComposing
    ) {
      event.preventDefault()
      submit(draft, { fromDraft: true })
    }
  }

  const canSend = draft.trim().length > 0 && !isSending

  return (
    <StyledAssistantChat>
      <Messages
        ref={messagesRef}
        role="log"
        aria-live="polite"
        aria-label="Conversación con el asistente"
      >
        <Bubble
          $role="assistant"
          data-testid="assistant-welcome"
          variants={welcomeVariants}
          initial="hidden"
          animate="visible"
        >
          <p>
            Hola{user?.nickname ? ` ${user.nickname}` : ''}! Soy el asistente de
            APA.
          </p>
          <p>
            Estoy entrenado por Nico (el capi) para contestar de todo un poco.
            Vos preguntá!
          </p>
        </Bubble>
        {messages.length === 0 && (
          <Suggestions
            variants={suggestionsVariants}
            initial="hidden"
            animate="visible"
          >
            {SUGGESTIONS.map((suggestion) => (
              <motion.button
                key={suggestion}
                type="button"
                variants={suggestionVariants}
                disabled={isSending}
                onClick={() => submit(suggestion)}
              >
                {suggestion}
              </motion.button>
            ))}
          </Suggestions>
        )}
        {messages.map((message) => (
          <Bubble
            key={message.id}
            $role={message.role}
            role={message.role === 'error' ? 'alert' : undefined}
            variants={messageVariants}
            initial={initialIds.current.has(message.id) ? false : 'hidden'}
            animate="visible"
          >
            {message.role === 'assistant' ? (
              <AssistantMessage text={message.text} onNavigate={onNavigate} />
            ) : (
              message.text
            )}
          </Bubble>
        ))}
        {isSending && (
          <Typing
            role="status"
            aria-label="El asistente está escribiendo"
            variants={messageVariants}
            initial="hidden"
            animate="visible"
          >
            <span />
            <span />
            <span />
          </Typing>
        )}
      </Messages>
      <Composer onSubmit={handleSubmit}>
        <textarea
          aria-label="Escribí tu pregunta"
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder="Preguntame por partidos, torneos, etc."
          rows={3}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" aria-label="Enviar" disabled={!canSend}>
          <SendIcon fontSize="small" />
        </button>
      </Composer>
      {draft.length >= COUNTER_THRESHOLD && (
        <Counter $over={draft.length >= MAX_MESSAGE_LENGTH}>
          {draft.length}/{MAX_MESSAGE_LENGTH}
        </Counter>
      )}
    </StyledAssistantChat>
  )
}

export default AssistantChat

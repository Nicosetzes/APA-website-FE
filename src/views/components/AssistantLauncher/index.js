import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined'
import AssistantChat from '../AssistantChat'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import CloseIcon from '@mui/icons-material/Close'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import { ROUTES } from 'routes/routesConfig'
import { useAssistant } from 'context/AssistantContext'
import { assistantUrl } from 'api'
import { useMediaQuery } from 'react-responsive'
import { AnimatePresence, useIsPresent, useReducedMotion } from 'framer-motion'
import { Body, Fab, Header, Panel } from './styled'
import { getFabTap, getFabVariants, getPanelVariants } from './animations'
import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const MOBILE_QUERY = '(max-width: 600px)'

const getExitingProps = (isPresent) =>
  isPresent ? {} : { 'aria-hidden': true, style: { pointerEvents: 'none' } }

const AssistantPanel = ({ variants, isMobile, children }) => {
  const isPresent = useIsPresent()
  const ref = useRef(null)

  useEffect(() => {
    const textarea = isMobile ? null : ref.current.querySelector('textarea')

    ;(textarea || ref.current).focus({ preventScroll: true })
    // Solo al montarse.
  }, [])

  return (
    <Panel
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-label="Asistente de APA"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...getExitingProps(isPresent)}
    >
      {children}
    </Panel>
  )
}

// Si el panel se acaba de cerrar y el foco quedó perdido en el body, el botón
// lo recupera. Si la persona ya enfocó otra cosa, no se le quita.
const AssistantFab = ({ onClick, variants, whileTap, restoreFocusRef }) => {
  const isPresent = useIsPresent()
  const ref = useRef(null)

  useEffect(() => {
    if (!restoreFocusRef.current) return

    restoreFocusRef.current = false
    if (!document.activeElement || document.activeElement === document.body) {
      ref.current.focus({ preventScroll: true })
    }
    // Solo al montarse.
  }, [])

  return (
    <Fab
      ref={ref}
      type="button"
      aria-label="Abrir el asistente"
      aria-haspopup="dialog"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileTap={whileTap}
      onClick={onClick}
      {...getExitingProps(isPresent)}
    >
      <ChatBubbleOutlineIcon />
    </Fab>
  )
}

const AssistantLauncher = () => {
  const { isAvailable, isOpen, open, close, reset } = useAssistant()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isMobile = useMediaQuery({ query: MOBILE_QUERY })
  const reducedMotion = Boolean(useReducedMotion())
  const restoreFocusRef = useRef(false)
  const isVisible =
    Boolean(assistantUrl) && isAvailable && pathname !== ROUTES.ASSISTANT.path
  const showPanel = isVisible && isOpen
  const showFab = isVisible && !isOpen

  useEffect(() => {
    if (!showPanel) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [showPanel, close])

  // Se recuerda que hubo un panel abierto para devolver el foco al botón al
  // cerrarlo, pero no al volver de /asistente.
  useEffect(() => {
    if (showPanel) restoreFocusRef.current = true
    else if (!isVisible) restoreFocusRef.current = false
  }, [showPanel, isVisible])

  const handleNavigate = () => {
    if (window.matchMedia?.(MOBILE_QUERY).matches) close()
  }

  const handleExpand = () => {
    close()
    navigate(ROUTES.ASSISTANT.path)
  }

  return (
    <AnimatePresence exitBeforeEnter>
      {showPanel ? (
        <AssistantPanel
          key="panel"
          isMobile={isMobile}
          variants={getPanelVariants({ isMobile, reducedMotion })}
        >
          <Header>
            <h2>Asistente APA</h2>
            <button
              type="button"
              aria-label="Abrir en una página"
              title="Abrir en una página"
              onClick={handleExpand}
            >
              <OpenInFullIcon fontSize="small" />
            </button>
            <button
              type="button"
              aria-label="Nueva conversación"
              title="Nueva conversación"
              onClick={reset}
            >
              <AddCommentOutlinedIcon fontSize="small" />
            </button>
            <button
              type="button"
              aria-label="Cerrar el asistente"
              title="Cerrar"
              onClick={close}
            >
              <CloseIcon fontSize="small" />
            </button>
          </Header>
          <Body>
            <AssistantChat onNavigate={handleNavigate} />
          </Body>
        </AssistantPanel>
      ) : showFab ? (
        <AssistantFab
          key="fab"
          onClick={open}
          variants={getFabVariants({ reducedMotion })}
          whileTap={getFabTap({ reducedMotion })}
          restoreFocusRef={restoreFocusRef}
        />
      ) : null}
    </AnimatePresence>
  )
}

export default AssistantLauncher

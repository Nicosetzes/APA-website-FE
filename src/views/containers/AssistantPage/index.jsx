import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined'
import { AssistantChat } from 'views/components'
import { assistantUrl } from 'api'
import { motion, useReducedMotion } from 'framer-motion'
import { useAssistant } from 'context/AssistantContext'
import { ChatCard, Container, Header, Unavailable } from './styled'

const PAGE_MOTION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
}
const REDUCED_PAGE_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 },
}

const AssistantPage = () => {
  const { reset, isAvailable } = useAssistant()
  const reducedMotion = useReducedMotion()
  const isConfigured = Boolean(assistantUrl)

  return (
    <motion.div {...(reducedMotion ? REDUCED_PAGE_MOTION : PAGE_MOTION)}>
      <Container>
        <Header>
          <div>
            <h1>Asistente APA</h1>
          </div>
          {isConfigured && isAvailable && (
            <button type="button" onClick={reset}>
              <AddCommentOutlinedIcon fontSize="small" />
              Nueva conversación
            </button>
          )}
        </Header>
        {isConfigured ? (
          <ChatCard>
            <AssistantChat />
          </ChatCard>
        ) : (
          <Unavailable role="status">
            El asistente no está disponible por ahora.
          </Unavailable>
        )}
      </Container>
    </motion.div>
  )
}

export default AssistantPage

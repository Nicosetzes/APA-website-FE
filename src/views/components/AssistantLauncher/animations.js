const PANEL_ENTER = { duration: 0.22, ease: 'easeOut' }
const PANEL_EXIT = { duration: 0.16, ease: 'easeIn' }
const FAB_ENTER = { duration: 0.18, ease: 'easeOut' }
const FAB_EXIT = { duration: 0.1, ease: 'easeIn' }
const REDUCED_ENTER = { duration: 0.12, ease: 'easeOut' }
const REDUCED_EXIT = { duration: 0.1, ease: 'easeIn' }

const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: REDUCED_ENTER },
  exit: { opacity: 0, transition: REDUCED_EXIT },
}

export const getPanelVariants = ({
  isMobile = false,
  reducedMotion = false,
} = {}) => {
  if (reducedMotion) return fade

  if (isMobile) {
    return {
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0, transition: PANEL_ENTER },
      exit: { opacity: 0, y: 16, transition: PANEL_EXIT },
    }
  }

  return {
    hidden: { opacity: 0, y: 8, scale: 0.92 },
    visible: { opacity: 1, y: 0, scale: 1, transition: PANEL_ENTER },
    exit: { opacity: 0, y: 4, scale: 0.94, transition: PANEL_EXIT },
  }
}

export const getFabVariants = ({ reducedMotion = false } = {}) =>
  reducedMotion
    ? fade
    : {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: FAB_ENTER },
        exit: { opacity: 0, scale: 0.9, transition: FAB_EXIT },
      }

export const getFabTap = ({ reducedMotion = false } = {}) =>
  reducedMotion ? undefined : { scale: 0.95 }

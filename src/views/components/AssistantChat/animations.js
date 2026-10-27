const ENTER = { duration: 0.2, ease: 'easeOut' }
const REDUCED_ENTER = { duration: 0.1, ease: 'easeOut' }

const fade = (delay = 0) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { ...REDUCED_ENTER, delay } },
})

export const getMessageVariants = ({
  reducedMotion = false,
  delay = 0,
} = {}) => {
  if (reducedMotion) return fade(delay)

  return {
    hidden: { opacity: 0, y: 8, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { ...ENTER, delay },
    },
  }
}

export const getSuggestionsVariants = ({ reducedMotion = false } = {}) => ({
  hidden: {},
  visible: {
    transition: reducedMotion
      ? { delayChildren: 0.1 }
      : { delayChildren: 0.25, staggerChildren: 0.06 },
  },
})

export const getSuggestionVariants = ({ reducedMotion = false } = {}) =>
  reducedMotion
    ? fade()
    : {
        hidden: { opacity: 0, y: 6 },
        visible: { opacity: 1, y: 0, transition: ENTER },
      }

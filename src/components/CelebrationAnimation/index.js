import { useEffect } from 'react'
import confetti from 'canvas-confetti'

const CelebrationAnimation = ({ showAnimation }) => {
  useEffect(() => {
    if (showAnimation) {
      confetti({
        particleCount: 500,
        spread: 80,
      })
    }
  }, [showAnimation])

  return null // Necesario para que el componente no ocupe espacio en el DOM
}

export default CelebrationAnimation

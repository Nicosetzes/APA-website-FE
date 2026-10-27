import styled from 'styled-components'
import { motion } from 'framer-motion'

// Por encima de los modales de MUI (1300) para que el chat no quede tapado.
const LAYER = 1350

export const Fab = styled(motion.button)`
  align-items: center;
  background-color: var(--blue-900);
  border: none;
  border-radius: 50%;
  bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  color: #fff;
  cursor: pointer;
  display: flex;
  height: 56px;
  justify-content: center;
  position: fixed;
  right: 1rem;
  width: 56px;
  z-index: ${LAYER};

  &:hover {
    filter: brightness(1.15);
  }
`

export const Panel = styled(motion.section)`
  background-color: #fff;
  border-radius: 12px;
  bottom: 1rem;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  height: min(650px, calc(100vh - 3rem));
  overflow: hidden;
  position: fixed;
  right: 1rem;
  /* El panel ocupa el lugar del botón flotante (bottom: 1rem, right: 1rem,
     56px), que no se ve mientras el chat está abierto. Crece desde el centro
     del botón: a 28px del borde derecho y del borde inferior del panel. */
  transform-origin: calc(100% - 28px) calc(100% - 28px);
  width: 380px;
  z-index: ${LAYER};

  /* Recibe el foco por código en celular: sin contorno. */
  &:focus {
    outline: none;
  }

  @media (max-width: 600px) {
    border-radius: 0;
    bottom: 0;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    transform-origin: center;
    width: 100%;
  }
`

export const Header = styled.header`
  align-items: center;
  background-color: var(--blue-900);
  color: #fff;
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem 0.5rem 0.5rem 0.9rem;

  h2 {
    flex: 1;
    font-size: 1rem;
    margin: 0;
  }

  button {
    align-items: center;
    background: none;
    border: none;
    border-radius: 50%;
    color: inherit;
    cursor: pointer;
    display: flex;
    height: 36px;
    justify-content: center;
    width: 36px;
  }

  button:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`

export const Body = styled.div`
  flex: 1;
  min-height: 0;
`

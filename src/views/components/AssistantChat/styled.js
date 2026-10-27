import styled, { css, keyframes } from 'styled-components'
import { motion } from 'framer-motion'

const bounce = keyframes`
  0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-3px); }
`

const bubbleByRole = {
  user: css`
    align-self: flex-end;
    background-color: var(--blue-900);
    color: #fff;
    transform-origin: bottom right;
    white-space: pre-wrap;
  `,
  assistant: css`
    align-self: flex-start;
    background-color: #fff;
    border: 1px solid #d7e1ea;
    color: #1b2a36;
    transform-origin: bottom left;
  `,
  error: css`
    align-self: flex-start;
    background-color: #fdecea;
    border: 1px solid var(--red-700);
    color: var(--red-900);
    transform-origin: bottom left;
    white-space: pre-wrap;
  `,
}

export const StyledAssistantChat = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  width: 100%;
`

export const Messages = styled.div`
  background-color: #f4f7fa;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.6rem;
  min-height: 0;
  overflow-y: auto;
  padding: 0.75rem;
`

export const Bubble = styled(motion.div)`
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.4;
  max-width: 90%;
  overflow-wrap: anywhere;
  padding: 0.55rem 0.8rem;
  ${({ $role }) => bubbleByRole[$role] || bubbleByRole.assistant}

  p {
    margin: 0 0 0.5rem;
  }

  ul,
  ol {
    margin: 0 0 0.5rem;
    padding-left: 1.2rem;
  }

  h1,
  h2,
  h3,
  h4 {
    font-size: 1rem;
    margin: 0.5rem 0 0.25rem;
  }

  a {
    color: var(--blue-900);
    font-weight: 600;
    text-decoration: underline;
  }

  & > :last-child {
    margin-bottom: 0;
  }
`

export const Typing = styled(motion.div)`
  align-self: flex-start;
  background-color: #fff;
  border: 1px solid #d7e1ea;
  border-radius: 12px;
  display: flex;
  gap: 4px;
  padding: 0.7rem 0.9rem;
  transform-origin: bottom left;

  span {
    animation: ${bounce} 1.2s infinite ease-in-out;
    background-color: var(--blue-900);
    border-radius: 50%;
    display: block;
    height: 6px;
    width: 6px;
  }

  span:nth-child(2) {
    animation-delay: 0.15s;
  }

  span:nth-child(3) {
    animation-delay: 0.3s;
  }
`

export const Suggestions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;

  button {
    background-color: #fff;
    border: 1px solid var(--blue-900);
    border-radius: 16px;
    color: var(--blue-900);
    cursor: pointer;
    font-size: 0.85rem;
    padding: 0.3rem 0.7rem;
  }

  button:disabled {
    border-color: var(--disabled);
    color: var(--disabled);
    cursor: not-allowed;
  }

  button:hover {
    background-color: var(--blue-900);
    color: #fff;
  }
`

export const Composer = styled.form`
  align-items: flex-end;
  border-top: 1px solid #d7e1ea;
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;

  textarea {
    border: 1px solid #b8c6d3;
    border-radius: 8px;
    flex: 1;
    font: inherit;
    font-size: 0.95rem;
    max-height: 120px;
    padding: 0.5rem;
    resize: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  /* Foco en el azul del sitio con un halo difuso, en vez del contorno del
     navegador. El contorno transparente conserva el foco visible en el modo
     de alto contraste de Windows. */
  textarea:focus {
    border-color: var(--blue-900);
    box-shadow: 0 0 0 4px rgba(0, 74, 121, 0.16);
    outline: 2px solid transparent;
  }

  button {
    align-items: center;
    background-color: var(--blue-900);
    border: none;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    display: flex;
    height: 40px;
    justify-content: center;
    width: 44px;
  }

  button:disabled {
    background-color: var(--disabled);
    cursor: not-allowed;
  }
`

export const Counter = styled.div`
  color: ${({ $over }) => ($over ? 'var(--red-700)' : 'var(--disabled)')};
  font-size: 0.75rem;
  padding: 0 0.6rem 0.4rem;
  text-align: right;
`

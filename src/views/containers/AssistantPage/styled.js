import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 900px;
  padding: 1.5rem 1rem 2rem;
  width: 100%;
`

export const Header = styled.div`
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1rem;

  h1 {
    color: var(--blue-900);
    font-size: 2rem;
    font-weight: 800;
    margin: 0;
  }

  p {
    color: rgba(0, 0, 0, 0.6);
    margin: 0.25rem 0 0;
  }

  button {
    align-items: center;
    background: var(--blue-900);
    border: none;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    display: flex;
    flex-shrink: 0;
    font-size: 0.95rem;
    font-weight: 600;
    gap: 0.4rem;
    padding: 0.6rem 1rem;
  }

  button:hover {
    opacity: 0.9;
  }

  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column;

    h1 {
      font-size: 1.6rem;
    }
  }
`

export const ChatCard = styled.div`
  border: 1px solid #d7e1ea;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: calc(100vh - var(--navbar-height) - 11rem);
  min-height: 420px;
  overflow: hidden;
`

export const Unavailable = styled.p`
  background: #fff;
  border: 1px solid #d7e1ea;
  border-radius: 12px;
  color: rgba(0, 0, 0, 0.7);
  padding: 2rem 1rem;
  text-align: center;
`

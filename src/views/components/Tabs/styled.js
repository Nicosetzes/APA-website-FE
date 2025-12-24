import styled from 'styled-components'

export const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const TabsList = styled.div`
  background: var(--blue-900);
  border-bottom: 2px solid rgba(245, 216, 127, 0.2);
  display: flex;
  gap: 0;
  overflow-x: auto;
  width: 100%;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(245, 216, 127, 0.3);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(245, 216, 127, 0.5);
  }
`

export const TabButton = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: ${({ $active }) => ($active ? 'var(--orange-900)' : '#fff')};
  cursor: pointer;
  display: flex;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  white-space: nowrap;

  ${({ $active }) =>
    $active &&
    `
    border-bottom-color: var(--orange-900);
  `}

  &:hover {
    color: ${({ $active }) => ($active ? 'var(--orange-900)' : '#fff')};
    background: rgba(255, 255, 255, 0.05);
  }

  &:first-child {
    margin-left: 0;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.75rem 1rem;
  }
`

export const TabContent = styled.div`
  flex: 1;
  padding: 0;
  width: 100%;
`

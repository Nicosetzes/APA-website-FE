import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1200px;
  min-height: 100vh;
  padding: 2rem 1rem;
  width: 100%;
`

export const Header = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  gap: 1rem;
`

export const Title = styled.h1`
  color: var(--blue-900);
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

export const Subtitle = styled.p`
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.1rem;
  margin: 0;
  text-align: center;
`

export const UploadButtonLink = styled.button`
  background: var(--blue-900);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }
`

export const EditsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  place-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const EditCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  width: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`

export const EditImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }
`

export const EditInfo = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const EditInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
`

export const UserName = styled.div`
  color: var(--blue-900);
  font-size: 1rem;
  font-weight: 700;
`

export const Caption = styled.div`
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.9rem;
  line-height: 1.4;
`

export const EditDate = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-size: 0.85rem;
  margin-top: 0.25rem;
`

export const Message = styled.div`
  background: ${(props) => (props.$error ? '#fee' : '#efe')};
  border: 1px solid ${(props) => (props.$error ? '#c00' : '#0c0')};
  border-radius: 8px;
  color: ${(props) => (props.$error ? '#c00' : '#0c0')};
  font-weight: 600;
  margin-bottom: 1rem;
  padding: 1rem;
  text-align: center;
`

export const SpinnerContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
`

export const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem 0;
`

export const PaginationInfo = styled.div`
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.95rem;
  text-align: center;
`

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

export const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
`

export const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  z-index: 1;
`

export const ModalImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  width: auto;
  height: auto;
  display: block;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`

export const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  color: #333;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 700;
  height: 36px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    background: white;
  }

  @media (max-width: 768px) {
    top: 0;
    right: 0;
  }
`

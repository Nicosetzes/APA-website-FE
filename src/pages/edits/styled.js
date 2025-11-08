import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 800px;
  padding: 2rem 1rem;
  width: 100%;
`

export const Header = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`

export const Title = styled.h1`
  color: var(--blue-900);
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  text-align: center;
`

export const Subtitle = styled.p`
  color: rgba(0, 0, 0, 0.6);
  font-size: 1rem;
  margin: 0;
  text-align: center;
`

export const UploadCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border: 2px dashed rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  transition: border-color 0.3s;

  &:hover {
    border-color: var(--blue-900);
  }
`

export const UploadArea = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const FileInput = styled.input`
  display: none;
`

export const FileLabel = styled.label`
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

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const FileName = styled.div`
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
`

export const PreviewImage = styled.img`
  border-radius: 8px;
  max-height: 300px;
  max-width: 100%;
  object-fit: contain;
`

export const UploadButton = styled.button`
  background: #18890e;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.75rem 2rem;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: rgba(0, 0, 0, 0.3);
    cursor: not-allowed;
    opacity: 0.6;
  }
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
  padding: 1rem;
`

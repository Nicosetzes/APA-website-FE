import styled from 'styled-components'
import { Image } from 'cloudinary-react'

export const Wrapper = styled.div`
  background: #003545;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-x: auto;
  padding-block: 2rem;
  width: 100%;
`

export const BracketArea = styled.div`
  align-items: stretch;
  display: flex;
  justify-content: center;
  /* Auto margins center the bracket on both axes without clipping it
     when the viewport is smaller than the bracket */
  margin: auto;
  min-height: 640px;
  min-width: fit-content;
`

export const Podium = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: center;
  width: 220px;
`

export const PodiumCircle = styled.div`
  align-items: center;
  background: #003545;
  border: 2px solid ${(props) => (props.$silver ? '#b3b3b3' : '#ffc30b')};
  border-radius: 50%;
  box-shadow: ${(props) =>
    props.$silver ? 'none' : '0 0 18px rgba(255, 195, 11, 0.35)'};
  display: flex;
  height: ${(props) => props.$size}px;
  justify-content: center;
  overflow: hidden;
  width: ${(props) => props.$size}px;

  img {
    height: 100%;
    object-fit: contain;
    padding: 12px;
    width: 100%;
  }
`

export const CenterImage = styled(Image)`
  height: 100%;
  object-fit: contain;
  padding: 8px;
  width: 100%;
`

export const PodiumTitle = styled.div`
  align-items: center;
  color: ${(props) => (props.$silver ? '#fff' : 'var(--yellow-900)')};
  display: flex;
  font-size: ${(props) => (props.$silver ? '0.95rem' : '1.2rem')};
  font-weight: 700;
  gap: 0.25rem;
  text-transform: uppercase;
`

export const PodiumPlayer = styled.div`
  color: #fff;
  font-size: ${(props) => (props.$silver ? '0.9rem' : '1.1rem')};
  font-weight: 700;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

import styled from 'styled-components'
import { Image } from 'cloudinary-react'

export const Wrapper = styled.div`
  background: #003545;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  padding: 1.75rem 1rem 2.25rem;
  width: 100%;
`

export const RoundLabel = styled.h3`
  color: #fff;
  font-weight: 700;
  margin: 0 0 1.75rem;
  text-align: center;
`

export const BracketArea = styled.div`
  align-items: stretch;
  display: flex;
  gap: 2.5rem;
  justify-content: center;
  margin: 0 auto;
  min-width: fit-content;
`

export const BracketSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  justify-content: space-around;
`

export const CenterLine = styled.div`
  align-items: center;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.25) 15%,
    rgba(255, 255, 255, 0.25) 85%,
    transparent
  );
  display: flex;
  justify-content: center;
  position: relative;
  width: 2px;
`

export const CenterIcon = styled.div`
  align-items: center;
  background: #003545;
  border: 2px solid #ffc30b;
  border-radius: 50%;
  display: flex;
  height: 75px;
  justify-content: center;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 75px;
`

export const CenterImage = styled(Image)`
  height: 100%;
  object-fit: contain;
  padding: 6px;
  width: 100%;
`

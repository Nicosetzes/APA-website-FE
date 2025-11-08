import { StyledPlayerBox } from './styled'

const PlayerBox = ({ name, handler, isActive }) => {
  return (
    <StyledPlayerBox onClick={handler} $isActive={isActive}>
      {name}
    </StyledPlayerBox>
  )
}

export default PlayerBox

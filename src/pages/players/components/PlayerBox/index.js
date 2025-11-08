import { StyledPlayerBox } from './styled'

const PlayerBox = ({ id, name, handler, isActive }) => {
  return (
    <StyledPlayerBox onClick={handler} $isActive={isActive}>
      {name}
    </StyledPlayerBox>
  )
}

export default PlayerBox

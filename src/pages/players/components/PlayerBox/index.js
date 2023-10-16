import { StyledPlayerBox } from './styled'

const PlayerBox = ({ id, name, handler }) => {
  return <StyledPlayerBox onClick={handler}>{name}</StyledPlayerBox>
}

export default PlayerBox

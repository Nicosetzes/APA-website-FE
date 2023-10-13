import { StyledPlayerBox } from './styled'

const PlayerBox = ({ id, name, handler }) => {
  return <StyledPlayerBox onClick={handler}>Jugador: {name}</StyledPlayerBox>
}

export default PlayerBox
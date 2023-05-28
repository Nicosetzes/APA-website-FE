import { database } from '../../../../api'
import { StyledPlayerBox } from './styled'

const PlayerBox = ({
  player,
  position,
  handleOnDrag,
  handleOnDrop,
  handleDragOver,
}) => {
  return (
    <StyledPlayerBox
      onDrop={(e) => handleOnDrop(e, position)}
      onDragOver={handleDragOver}
    >
      <div
        className="drop-zone"
        draggable
        onDragStart={(e) => handleOnDrag(e, player?.id, player?.name)}
      >
        {player && (
          <>
            <img
              src={`${database}/players/${player?.id}`}
              style={{ height: '50px', width: '50px' }}
            />
            <div
              className="drop-zone-name"
              style={{ fontSize: '0.75rem', textAlign: 'center' }}
            >
              {player?.name}
            </div>
          </>
        )}
      </div>
    </StyledPlayerBox>
  )
}

export default PlayerBox

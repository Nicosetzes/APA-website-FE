import { useState } from 'react'
// import CheckBox from './../../../../components/Checkbox'
import Radio from './../../../../components/Radio'
import { StyledTeamAssignmentBox } from './styled'

const TeamAssignmentBox = ({
  id,
  name,
  players,
  definitiveTeamsForTournament,
  updateDefinitiveTeamsForTournament,
}) => {
  const assignPlayerToTeam = (e) => {
    const inputsFromRadioButtons = Array.from(
      e.target.previousSibling.children[1].children,
    ).map(({ children }) => children[1])

    const statesFromRadioButtons = inputsFromRadioButtons.map(
      ({ checked }) => checked,
    )

    if (!statesFromRadioButtons.includes(true)) {
      console.log('No hay ningún radio activo para este equipo')
      return
    }

    const infoAboutCheckedRadioButton = inputsFromRadioButtons
      .filter(({ checked }) => checked)
      .map(({ id, name, value }) => {
        return {
          id,
          name,
          value,
        }
      })
      .at(0)

    return updateDefinitiveTeamsForTournament(infoAboutCheckedRadioButton)
  }

  console.log(definitiveTeamsForTournament)

  return (
    <StyledTeamAssignmentBox>
      <div className="teams-assignment__container-team">
        <div style={{ alignItems: 'center', display: 'flex' }}>
          <div>
            <span>{name}</span>
          </div>
          <div
            style={{
              alignItems: 'flex-start',
              display: 'flex',
              flexDirection: 'column',
              margin: 'auto 0 auto 0.75rem',
              // padding: '0.5rem',
            }}
          >
            {players.map((player) => (
              // <CheckBox key={id} id={id} value={id} name={name} label={name} />
              <Radio
                key={player.id}
                id={id}
                name={name}
                value={player.id}
                label={player.name}
                checked={false}
              />
            ))}
          </div>
        </div>
        <button onClick={(e) => assignPlayerToTeam(e)}>Asignar equipo</button>
      </div>
    </StyledTeamAssignmentBox>
  )
}

export default TeamAssignmentBox

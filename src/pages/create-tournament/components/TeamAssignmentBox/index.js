import { useState } from 'react'
// import CheckBox from './../../../../components/Checkbox'
import Radio from './../../../../components/Radio'
import Select from '../../../../components/Select'
import { StyledTeamAssignmentBox } from './styled'

const TeamAssignmentBox = ({
  id,
  name,
  players,
  format,
  definitiveTeamsForTournament,
  updateDefinitiveTeamsForTournament,
}) => {
  const assignPlayerAndGroupToTeam = (e) => {
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

    let selectedGroupForTeam

    let infoAboutTeamAssignments

    if (format == 'world_cup' || format == 'league_playin_playoff') {
      // Si el formato lo require, averiguo el grupo de cada equipo y lo mapeo //
      selectedGroupForTeam =
        e.target.previousSibling.children[0].children[1].children[0].value

      infoAboutTeamAssignments = inputsFromRadioButtons
        .filter(({ checked }) => checked)
        .map(({ id, name, value }) => {
          return {
            id,
            name,
            value,
            group: selectedGroupForTeam,
          }
        })
        .at(0)
    } else {
      // Si el formato no lo require, no mapeo el grupo (porque no existe) //
      infoAboutTeamAssignments = inputsFromRadioButtons
        .filter(({ checked }) => checked)
        .map(({ id, name, value }) => {
          return {
            id,
            name,
            value,
          }
        })
        .at(0)
    }

    return updateDefinitiveTeamsForTournament(infoAboutTeamAssignments)
  }

  console.log(definitiveTeamsForTournament)

  return (
    <StyledTeamAssignmentBox>
      <div className="teams-assignment__container-team">
        <div style={{ alignItems: 'center', display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>{name}</span>
            {(format == 'world_cup' || format == 'league_playin_playoff') && (
              <Select
                options={
                  format == 'world_cup'
                    ? [
                        { name: 'Zona A', value: 'A' },
                        { name: 'Zona B', value: 'B' },
                        { name: 'Zona C', value: 'C' },
                        { name: 'Zona D', value: 'D' },
                        { name: 'Zona E', value: 'E' },
                        { name: 'Zona F', value: 'F' },
                        { name: 'Zona G', value: 'G' },
                        { name: 'Zona H', value: 'H' },
                      ]
                    : [
                        { name: 'Zona A', value: 'A' },
                        { name: 'Zona B', value: 'B' },
                      ]
                }
              />
            )}
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
        <button onClick={(e) => assignPlayerAndGroupToTeam(e)}>
          Asignar equipo
        </button>
      </div>
    </StyledTeamAssignmentBox>
  )
}

export default TeamAssignmentBox

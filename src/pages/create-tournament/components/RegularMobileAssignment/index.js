import { useState } from 'react'
import { StyledMobileAssignment } from './styled'
import { database } from '../../../../api'

const RegularMobileAssignment = ({
  players,
  teams,
  groups,
  createTournament,
}) => {
  const colors = [
    '#004a79', // azul oscuro //
    '#6fc140', // verde //
    '#ffa4a4', // rosa //
    '#8e8eed', // lila //
    '#3dbfb1', // aguamarina //
    '#b5083b', // fucsia //
    '#f9d207', // dorado //
  ]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

  // const [unassignedTeams, setUnassignedTeams] = useState(teams)
  const [assignedTeams, setAssignedTeams] = useState(
    teams.map(({ id, name }) => {
      return {
        team: { id: id.toString(), name },
      } /* If I don't do toString() id is later saved as a number here on mobile, which is not the way I store the ID in the DB */
    }),
  )

  console.log(assignedTeams)

  const [playersWithAssignedColors, setPlayersWithAssignedColors] = useState(
    players.map(({ id, name }, index) => {
      return {
        id,
        name,
        color: colors[index],
      }
    }),
  )

  const regenerateColors = () => {
    // Vuelvo a mezclar los colores //
    const randomColors = colors
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
    setPlayersWithAssignedColors(
      players.map(({ id, name }, index) => {
        return {
          id,
          name,
          color: randomColors[index],
        }
      }),
    )
    if (assignedTeams.length) {
      // Si hay al menos 1 equipo asignado a un grupo, elimino todas las asignaciones de jugador //
      setAssignedTeams(
        assignedTeams.map(({ team, group }) => {
          if (group)
            return {
              team,
              group,
            }
          else
            return {
              team,
            }
        }),
      )
    } else return
  }

  const assignPlayer = (id, color) => {
    let newPlayerAssignmentForTeam

    console.log(color)

    if (!color) {
      // El equipo no tenía un jugador asignado //
      newPlayerAssignmentForTeam = {
        player: {
          id: playersWithAssignedColors.at(0).id,
          name: playersWithAssignedColors.at(0).name,
        },
        color: playersWithAssignedColors.at(0).color,
      }
    } else {
      // El equipo tenía un jugador (color) asignado //
      // Averiguo en qué posición (dentro del código de colores) se encuentra el jugador //
      const arrayPosition = playersWithAssignedColors.findIndex(
        (player) => player.color == color,
      )
      console.log(arrayPosition)
      // La posición encontrada, es la última? Si es la última, vuelvo al principio //
      newPlayerAssignmentForTeam =
        arrayPosition == playersWithAssignedColors.length - 1
          ? {
              player: {
                id: playersWithAssignedColors.at(0).id,
                name: playersWithAssignedColors.at(0).name,
              },
              color: playersWithAssignedColors.at(0).color,
            }
          : {
              player: {
                id: playersWithAssignedColors.at(arrayPosition + 1).id,
                name: playersWithAssignedColors.at(arrayPosition + 1).name,
              },
              color: playersWithAssignedColors.at(arrayPosition + 1).color,
            }
    }

    console.log(newPlayerAssignmentForTeam)

    // Ahora que tengo la nueva asignación de jugador, modifico assignedTeams //
    // React recomienda modificar el array mediante map //
    // https://react.dev/learn/updating-arrays-in-state#replacing-items-in-an-array //

    // Busco el index del elemento a modificar
    const indexOfChangingTeam = assignedTeams.findIndex(
      ({ team }) => team.id == id,
    )

    setAssignedTeams(
      assignedTeams.map((team, index) => {
        if (indexOfChangingTeam == index)
          return {
            ...team,
            color: newPlayerAssignmentForTeam.color,
            player: newPlayerAssignmentForTeam.player,
          }
        else return team
      }),
    )
  }

  const assignGroup = (e, id) => {
    const group = e.target.value
    // Busco el index del elemento a modificar
    const indexOfChangingTeam = assignedTeams.findIndex(
      ({ team }) => team.id == id,
    )
    // Si group es falsie (""), elimino su asignación de grupo //
    if (!group) {
      setAssignedTeams(
        assignedTeams.map((team, index) => {
          if (indexOfChangingTeam == index)
            return {
              ...team,
              group: '',
            }
          else return team
        }),
      )
    } else {
      // Agrego el grupo //
      setAssignedTeams(
        assignedTeams.map((team, index) => {
          if (indexOfChangingTeam == index)
            return {
              ...team,
              group,
            }
          else return team
        }),
      )
    }
  }

  return (
    <StyledMobileAssignment>
      <div className="container__players">
        {playersWithAssignedColors.map(({ id, name, color }) => (
          <div
            key={id}
            className="players-box"
            style={{ outline: `${color} 3px solid` }}
          >
            {name}
          </div>
        ))}
        <button onClick={() => regenerateColors()}>
          Generar nuevos colores
        </button>
      </div>
      <div className="container__teams">
        {assignedTeams.map(({ team, color }) => (
          <div
            key={team.id}
            className="teams-box"
            style={{ border: `${color ? `${color}` : `#000`} 2px solid` }}
          >
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                margin: '0.5rem 0',
              }}
              onClick={() => assignPlayer(team.id, color)}
            >
              <span className="teams-box-title">
                {team.name[0].toUpperCase()}
                {team.name[1].toUpperCase()}
                {team.name[2].toUpperCase()}
              </span>
              <img
                src={`${database}/logos/${team.id}`}
                className="teams-box-logo"
              />
            </div>
            {groups.length ? (
              <select onChange={(e) => assignGroup(e, team.id)}>
                <option value={''}>Asigne grupo</option>
                {groups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        ))}
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          margin: '1rem auto',
          padding: '0.25rem',
          width: '250px',
        }}
      >
        <button
          style={{ backgroundColor: 'rgb(7, 150, 114)' }}
          onClick={() => createTournament(assignedTeams)}
        >
          Crear torneo
        </button>
      </div>
    </StyledMobileAssignment>
  )
}

export default RegularMobileAssignment

import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { database } from '../../../../api'
import { StyledDragAndDropAssignment } from './styled'

const DragAndDropAssignment = ({
  players,
  teams,
  groups,
  createTournament,
}) => {
  // const isXL = useMediaQuery({ query: '(min-width: 1200px)' })
  // const isL = useMediaQuery({ query: '(min-width: 992px)' })
  // const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 576px)' })
  // const isXS = useMediaQuery({ query: '(min-width: 350px)' })

  // Mezclo los colores iniciales, para asignarlos al azar //
  // Utilizo una combinación de .map y .sort  //

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

  const [unassignedTeams, setUnassignedTeams] = useState(teams)
  const [assignedTeams, setAssignedTeams] = useState([])
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

  // console.log(playersWithAssignedColors)

  // console.log(assignedTeams)

  const handleOnDrag = (e, id, name) => {
    e.dataTransfer.setData('id', id)
    e.dataTransfer.setData('name', name)
  }

  const handleOnDrop = (e, group) => {
    const id = e.dataTransfer.getData('id')
    const name = e.dataTransfer.getData('name')
    // Si no posee data asociada, cancelo el onDrop. //
    if (!id || !name) return
    // Esto soluciona bug donde arrastro un elemento ya asignado y lo vuelvo a soltar en el container //
    e.dataTransfer.setData('id', id)
    e.dataTransfer.setData('name', name)
    // ¿El equipo ya estaba en algún grupo? //
    const team = assignedTeams.filter(({ team }) => team.id == id)
    if (team.length && team.group == group) {
      // El equipo ya estaba asignado y en este grupo, así que no modifico el estado //
      return
    } else if (team.length && team.group != group) {
      // El equipo ya estaba asignado pero en otro grupo, así que no modifico su grupo //
      const indexOfChangingTeam = assignedTeams.findIndex(
        ({ team }) => team.id == id,
      )
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
    } else if (!team.length && group) {
      // El equipo no había sido asignado a ningún grupo, el torneo tiene zonas //
      // Primero borro el equipo asignado de unassignedTeams, esto hace que desaparezca de la lista //
      // Luego lo agrego a assignedTeams, así es mapeado en la zona indicada //
      setUnassignedTeams(unassignedTeams.filter((team) => team.id != id))
      setAssignedTeams([...assignedTeams, { team: { id, name }, group }])
    } else {
      // El equipo no había sido asignado a ningún grupo, pero el torneo no tiene zonas //
      setUnassignedTeams(unassignedTeams.filter((team) => team.id != id))
      setAssignedTeams([...assignedTeams, { team: { id, name } }])
    }
    //
  }

  const handleDragOver = (e) => {
    // Esta función es necesaria para el correcto funcionamiento del drag & drop //
    e.preventDefault()
  }

  return (
    <StyledDragAndDropAssignment>
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
      {/* {groups.length ? ( */}
      {/* <> */}
      <div className="container__teams">
        {unassignedTeams.map(({ id, name }) => (
          <div
            key={id}
            className="teams-box draggable"
            draggable
            onDragStart={(e) => handleOnDrag(e, id, name)}
          >
            <span className="teams-box-title">
              {name[0].toUpperCase()}
              {name[1].toUpperCase()}
              {name[2].toUpperCase()}
            </span>
            <img src={`${database}/logos/${id}`} className="teams-box-logo" />
          </div>
        ))}
      </div>
      <div className="container__groups">
        {groups.length ? (
          <>
            {groups.map((group) => (
              <div
                key={group}
                className="groups-box"
                onDrop={(e) => handleOnDrop(e, group)}
                onDragOver={handleDragOver}
              >
                <div className="groups-box-title">Grupo {group}</div>
                {!assignedTeams.filter((team) => team.group == group).length ? (
                  <div className="groups-box-subtitle bottom">
                    <span style={{ fontWeight: 700 }}>Arrastre</span> los
                    equipos aquí para incluirlos en la zona indicada
                  </div>
                ) : null}
                <div className="groups-box-teams">
                  {assignedTeams
                    .filter((team) => team.group == group)
                    .map(({ team, color }, index) => (
                      <div
                        key={team.id}
                        style={{
                          outline: `${
                            color ? `${color} 3px` : `#000 0px`
                          } solid`,
                        }}
                        onClick={() => assignPlayer(team.id, color)}
                        draggable
                        onDragStart={(e) => handleOnDrag(e, team.id, team.name)}
                      >
                        {index + 1}.{' '}
                        <img
                          src={`${database}/logos/${team.id}`}
                          style={{ width: '30px' }}
                        />
                      </div>
                    ))}
                </div>
                {assignedTeams.filter((team) => team.group == group).length ? (
                  <div className="groups-box-subtitle bottom">
                    <span style={{ fontWeight: 700 }}>Clickee</span> sobre cada
                    equipo para asignarle un jugador
                  </div>
                ) : null}
              </div>
            ))}
          </>
        ) : (
          <div
            className="groups-box"
            style={{ width: isSm && '400px' }} // Zona única, puede ser más grande //
            onDrop={(e) => handleOnDrop(e)}
            onDragOver={handleDragOver}
          >
            <div className="groups-box-title">Zona única</div>
            {!assignedTeams.length && (
              <div className="groups-box-subtitle">
                Arrastre los equipos aquí para incluirlos en el torneo
              </div>
            )}
            <div className="groups-box-teams">
              {assignedTeams.map(({ team, color }, index) => (
                <div
                  key={team.id}
                  style={{
                    outline: `${color ? `${color} 3px` : `#000 0px`} solid`,
                  }}
                  onClick={() => assignPlayer(team.id, color)}
                >
                  {index + 1}.{' '}
                  <img
                    src={`${database}/logos/${team.id}`}
                    style={{ width: '30px' }}
                  />
                </div>
              ))}
            </div>
            {assignedTeams.length ? (
              <div className="groups-box-subtitle bottom">
                Clickee sobre cada equipo para asignarle un jugador
              </div>
            ) : null}
          </div>
        )}
      </div>
      {assignedTeams.length == teams.length ? (
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
      ) : null}
    </StyledDragAndDropAssignment>
  )
}

export default DragAndDropAssignment

import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { database } from '../../../../api'
import { StyledDragAndDropAssignment } from './styled'

const TagTeamsDragAndDropAssignment = ({ teams, groups, createTournament }) => {
  const isSm = useMediaQuery({ query: '(min-width: 576px)' })

  // Mezclo los colores iniciales, para asignarlos al azar //
  // Utilizo una combinación de .map y .sort  //

  const [unassignedTeams, setUnassignedTeams] = useState(teams)
  const [assignedTeams, setAssignedTeams] = useState([])

  const handleOnDrag = (e, id, name) => {
    e.dataTransfer.setData(
      'id',
      id,
    ) /* I need to check, but I think id is originally a number and because of this gets converted to string */
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
                >
                  {index + 1}.{' '}
                  <img
                    src={`${database}/logos/${team.id}`}
                    style={{ width: '30px' }}
                  />
                </div>
              ))}
            </div>
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

export default TagTeamsDragAndDropAssignment

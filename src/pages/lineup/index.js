import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useParams } from 'react-router-dom'
import { StyledLineup } from './styled'
import { api, database } from '../../api'
import PlayerBox from './components/PlayerBox'
import pitch from './../../images/pitch.jpg'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'

const Lineup = () => {
  const MySwal = withReactContent(Swal)

  // const isXL = useMediaQuery({ query: '(min-width: 1200px)' })
  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  // const isM = useMediaQuery({ query: '(min-width: 768px)' })
  // const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  // const isXS = useMediaQuery({ query: '(min-width: 350px)' })

  const { tournament, team } = useParams()

  const [lineupData, setLineupData] = useState()

  const getData = async () => {
    const squad = await axios.get(
      `${api}/tournaments/${tournament}/teams/${team}/squad`,
    )

    const players = await axios.get(`${database}/squads/${team}`)

    Promise.all([squad, players]).then((values) => {
      const data = values.map((response) => response.data)
      setLineupData(data)
    })
  }

  useEffect(() => {
    getData()
  }, [])

  const [unassignedPlayers, setUnassignedPlayers] = useState([])
  const [assignedPlayers, setAssignedPlayers] = useState([])

  console.log(unassignedPlayers)
  console.log(assignedPlayers)

  const determineAssignedAndUnassignedPlayers = () => {
    const { squad, ids } = lineupData[0]
    const { players } = lineupData[1]
    if (squad) {
      // Hay una alineación guardada //
      const newUnassignedPlayers = players
        .map((player) => {
          if (!ids.includes(player.id.toString())) {
            return { ...player }
          }
        })
        .filter((player) => player)
      setUnassignedPlayers([...newUnassignedPlayers])
      setAssignedPlayers([...squad])
    } else {
      // NO Hay una alineación guardada //
      setUnassignedPlayers([...players])
    }
  }
  useEffect(() => {
    if (lineupData) determineAssignedAndUnassignedPlayers()
  }, [lineupData])

  const handleOnDrag = (e, id, name) => {
    e.dataTransfer.setData('id', id)
    e.dataTransfer.setData('name', name)
  }

  const handleOnDrop = (e, position) => {
    const id = e.dataTransfer.getData('id')
    const name = e.dataTransfer.getData('name')

    // Si no posee data asociada, cancelo el onDrop. //
    if (!id || !name) return
    // Esto soluciona bug donde arrastro un elemento ya asignado y lo vuelvo a soltar en el container //
    e.dataTransfer.setData('id', id)
    e.dataTransfer.setData('name', name)

    // ¿El jugador ya estaba en alguna posición? //
    const currentPlayer = assignedPlayers.filter((player) => player.id == id)

    // ¿Esa posición estaba asignada a algún jugador? //
    const previousPlayer = assignedPlayers.filter(
      (player) => player.position == position,
    )

    if (position == 'pool' && currentPlayer.length) {
      // El jugador está siendo retirado del 11 inicial, lo agrego a unassigned y lo elimino de assigned //
      setUnassignedPlayers([...unassignedPlayers, { id, name }])

      setAssignedPlayers(assignedPlayers.filter((player) => player.id != id))

      return
    }
    if (position == 'pool' && !currentPlayer.length) {
      // El jugador está siendo retirado del pool original, y está siendo dropeado allí mismo //
      return
    }

    if (currentPlayer.length && currentPlayer.position == position) {
      // El jugador ya estaba asignado y en esta posición, así que no modifico el estado //
      return
    } else if (
      currentPlayer.length &&
      currentPlayer.position != position &&
      !previousPlayer.length
    ) {
      // El jugador ya estaba asignado pero en otra posición, así que la actualizo //
      // 1er caso: en la nueva posición asignada, no había ningún jugador //
      const indexOfCurrentPlayer = assignedPlayers.findIndex(
        (player) => player.id == id,
      )

      setAssignedPlayers(
        assignedPlayers.map((team, index) => {
          if (indexOfCurrentPlayer == index)
            return {
              ...team,
              position,
            }
          else return team
        }),
      )
    } else if (
      currentPlayer.length &&
      currentPlayer.position != position &&
      previousPlayer.length
    ) {
      // El jugador ya estaba asignado pero en otra posición, así que la actualizo //
      // 2do caso: en la nueva posición asignada, ya había ningún jugador //
      // Los intercambio //
      const indexOfCurrentPlayer = assignedPlayers.findIndex(
        (player) => player.id == id,
      )
      const indexOfPreviousPlayer = assignedPlayers.findIndex(
        (player) => player.position == position,
      )
      const positionOfCurrentPlayer = currentPlayer.at(0).position
      setAssignedPlayers(
        assignedPlayers.map((team, index) => {
          if (indexOfCurrentPlayer == index)
            return {
              ...team,
              position,
            }
          else if (indexOfPreviousPlayer == index)
            return { ...team, position: positionOfCurrentPlayer }
          else return team
        }),
      )
    } else {
      // El equipo no había sido asignado a ninguna posición //

      // Tengo que averiguar si en esta posición había ya asignado un jugador //

      const isPositionAssigned = assignedPlayers.filter(
        (player) => player.position == position,
      )

      if (isPositionAssigned.length) {
        // La posición estaba ocupada, agrego este jugador a unassigned y lo elimino de assigned  //

        const newUnassignedPlayers = [...unassignedPlayers].filter(
          (player) => player.id != id,
        )

        setUnassignedPlayers([
          ...newUnassignedPlayers,
          {
            id: isPositionAssigned.at(0).id,
            name: isPositionAssigned.at(0).name,
          },
        ])
        const newAssignedPlayers = [...assignedPlayers].filter(
          (player) => player.position != position,
        )
        setAssignedPlayers([...newAssignedPlayers, { id, name, position }])
      } else {
        // Asigno el nuevo equipo //
        setUnassignedPlayers(
          unassignedPlayers.filter((player) => player.id != id),
        )
        setAssignedPlayers([...assignedPlayers, { id, name, position }])
      }
    }
  }

  const handleDragOver = (e) => {
    // Esta función es necesaria para el correcto funcionamiento del drag & drop //
    e.preventDefault()
  }

  const handleLineupSubmit = async () => {
    console.log('me ejecuto')

    if (assignedPlayers.length > 11) {
      MySwal.fire({
        background: `rgba(28, 25, 25, 0.95)`,
        color: `#fff`,
        icon: 'info',
        iconColor: '#0a15d1',
        text: 'No puede guardarse una alineación con más de 11 jugadores',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
      })
      return
    }

    axios
      .put(`${api}/tournaments/${tournament}/teams/${team}/squad`, {
        squad: assignedPlayers,
      })
      .then(({ data }) => {
        console.log(data)
        MySwal.fire({
          background: `rgba(28, 25, 25, 0.95)`,
          color: `#fff`,
          icon: 'success',
          iconColor: '#18890e',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          text: 'Alineación guardada con éxito',
          timer: 1500,
          timerProgressBar: true,
          customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
        })
      })
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '1rem 0 0 0',
        }}
      >
        <img src={`${database}/logos/${team}`} />
      </div>
      <StyledLineup>
        {isL && (
          <div
            style={{
              // alignContent: 'center',
              alignItems: 'start',
              border: 'black 2px solid',
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'wrap',
              height: '100%',
              justifyContent: 'center',
              margin: '0 1rem 0 0',
              width: '500px',
            }}
            onDrop={(e) => handleOnDrop(e, 'pool')}
            onDragOver={handleDragOver}
          >
            {/* {unassignedPlayers ? ( */}
            {unassignedPlayers.map(({ id, name, age, number, position }) => (
              <div
                key={id}
                draggable
                onDragStart={(e) => handleOnDrag(e, id, name)}
                style={{
                  alignItems: 'center',
                  cursor: 'grab',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyConter: 'center',
                  height: '75px',
                  margin: '0.25rem',
                  width: '75px',
                }}
              >
                <img
                  src={`${database}/players/${id}`}
                  style={{ height: '50px', width: '50px' }}
                />
                <div style={{ fontSize: '0.75rem', textAlign: 'center' }}>
                  {name}
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            alignItems: 'center',
            backgroundPosition: 'center',
            backgroundImage: `url(${pitch})`,
            backgroundSize: 'cover',
            border: '#000 3px solid',
            display: 'flex',
            flexDirection: 'column-reverse',
            height: '100%',
            maxWidth: `${!isL && `400px`}`,
          }}
        >
          <div className="row">
            <PlayerBox
              className={'GK'}
              player={assignedPlayers
                .filter((player) => player.position == 'A1')
                .at(0)}
              position={'A1'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
          </div>
          <div className="row">
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'B1')
                .at(0)}
              position={'B1'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'B2')
                .at(0)}
              position={'B2'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'B3')
                .at(0)}
              position={'B3'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'B4')
                .at(0)}
              position={'B4'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'B5')
                .at(0)}
              position={'B5'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
          </div>
          <div className="row">
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'C1')
                .at(0)}
              position={'C1'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'C2')
                .at(0)}
              position={'C2'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'C3')
                .at(0)}
              position={'C3'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'C4')
                .at(0)}
              position={'C4'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'C5')
                .at(0)}
              position={'C5'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
          </div>
          <div className="row">
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'D1')
                .at(0)}
              position={'D1'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'D2')
                .at(0)}
              position={'D2'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'D3')
                .at(0)}
              position={'D3'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'D4')
                .at(0)}
              position={'D4'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'D5')
                .at(0)}
              position={'D5'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
          </div>
          <div className="row">
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'E1')
                .at(0)}
              position={'E1'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'E2')
                .at(0)}
              position={'E2'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'E3')
                .at(0)}
              position={'E3'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'E4')
                .at(0)}
              position={'E4'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'E5')
                .at(0)}
              position={'E5'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
          </div>
          <div className="row">
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'F1')
                .at(0)}
              position={'F1'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'F2')
                .at(0)}
              position={'F2'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'F3')
                .at(0)}
              position={'F3'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'F4')
                .at(0)}
              position={'F4'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'F5')
                .at(0)}
              position={'F5'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
          </div>
          <div className="row">
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'G1')
                .at(0)}
              position={'G1'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'G2')
                .at(0)}
              position={'G2'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'G3')
                .at(0)}
              position={'G3'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'G4')
                .at(0)}
              position={'G4'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'G5')
                .at(0)}
              position={'G5'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
          </div>
          <div className="row">
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'H1')
                .at(0)}
              position={'H1'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'H2')
                .at(0)}
              position={'H2'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'H3')
                .at(0)}
              position={'H3'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'H4')
                .at(0)}
              position={'H4'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
            <PlayerBox
              player={assignedPlayers
                .filter((player) => player.position == 'H5')
                .at(0)}
              position={'H5'}
              handleOnDrag={handleOnDrag}
              handleOnDrop={handleOnDrop}
              handleDragOver={handleDragOver}
            />
          </div>
        </div>
      </StyledLineup>
      <div style={{ display: 'flex', margin: '0 0 2rem 0' }}>
        <button className="button-main" onClick={handleLineupSubmit}>
          Guardar alineación
        </button>
      </div>
    </>
  )
}

export default Lineup

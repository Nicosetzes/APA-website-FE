import { useState } from 'react'
import { api, database } from './../../../../api'
import { StyledLeaguesBoxContainer } from './styled'
import LeagueBox from './../LeagueBox'
import TeamBox from '../TeamBox'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'
import TeamAssignmentBox from '../TeamAssignmentBox'

const LeaguesBoxContainer = ({ format, players, leagues }) => {
  const MySwal = withReactContent(Swal)

  const [tournamentName, setTournamentName] = useState('')
  const [tournamentImg, setTournamentImg] = useState(null)
  const [selectedLeagues, setSelectedLeagues] = useState([])
  const [availableTeams, setAvailableTeams] = useState([])
  const [selectedTeams, setSelectedTeams] = useState([])
  const [confirmedTeams, setConfirmedTeams] = useState([])
  const [definitiveTeamsForTournament, setDefinitiveTeamsForTournament] =
    useState([])

  const onChangeTitle = (e) => {
    console.log(e.target.value)
    setTournamentName(e.target.value)
  }

  const onChangeTournamentImg = (e) => {
    setTournamentImg(e.target.files[0])
    console.log(e.target.files)
  }

  // const uploadTournamentImg = () => {
  //   // Create an object of formData
  //   const formData = new FormData()

  //   // Update the formData object
  //   formData.append('tournamentImg', tournamentImg, tournamentImg.name)

  //   // Details of the uploaded file
  //   console.log(tournamentImg)

  //   return formData
  //   // Request made to the backend api
  //   // Send formData object
  //   // axios.post('api/uploadfile', formData)
  // }

  const updateAvailableTeams = (id) => {
    const currentLeagueIds = availableTeams.map(
      ({ league }) => league.id.toString(), // necesario //
    )

    console.log(id)
    console.log(currentLeagueIds)

    if (currentLeagueIds.includes(id)) {
      console.log('Equipos repetidos')
      setAvailableTeams((availableTeams) =>
        availableTeams.filter((team) => team.league.id != id),
      )
    } else {
      axios.get(`${database}/leagues/${id}/teams`).then(({ data }) => {
        console.log('Incluyo equipos')
        setAvailableTeams((availableTeams) => availableTeams.concat(data))
      })
    }
  }

  const updateSelectedTeams = (selectedTeam) => {
    console.log('Selected teams:')
    console.log(selectedTeams)

    const { id } = selectedTeam

    const currentSelectedTeamsIds = selectedTeams.map(({ id }) => id)

    console.log(id)
    console.log(currentSelectedTeamsIds)

    if (currentSelectedTeamsIds.includes(id)) {
      console.log('El equipo ya había sido seleccionado')
      setSelectedTeams((selectedTeams) =>
        selectedTeams.filter((team) => team.id != id),
      )
    } else {
      console.log('Incluyo un equipo nuevo')
      setSelectedTeams((availableTeams) => [...availableTeams, selectedTeam])
    }
  }

  const updateDefinitiveTeamsForTournament = (teamWithAssignedTeam) => {
    console.log(definitiveTeamsForTournament)

    const isTeamAlreadyAssigned = definitiveTeamsForTournament.findIndex(
      ({ id }) => id == teamWithAssignedTeam.id,
    )

    if (isTeamAlreadyAssigned !== -1) {
      console.log('Reemplazo la asignación para este equipo')
      setDefinitiveTeamsForTournament((currentTeams) =>
        currentTeams.map((team, index) => {
          if (isTeamAlreadyAssigned == index) return teamWithAssignedTeam
          if (isTeamAlreadyAssigned != index) return team
        }),
      )
    } else {
      console.log('Equipo nuevo con jugador asignado')
      console.log(teamWithAssignedTeam)
      setDefinitiveTeamsForTournament((currentTeams) =>
        currentTeams.concat(teamWithAssignedTeam),
      )
    }
  }

  const leagueOnClickHandler = (e) => {
    const id = e.target.id

    if (selectedLeagues.includes(id)) {
      setSelectedLeagues((currentLeagues) =>
        currentLeagues.filter((league) => league !== id),
      )
      updateAvailableTeams(id)
    }

    if (!selectedLeagues.includes(id)) {
      setSelectedLeagues((currentLeagues) => [...currentLeagues, id])
      updateAvailableTeams(id)
    }
  }

  const confirmTeams = () => {
    setConfirmedTeams([...selectedTeams])
    console.log('Equipos confirmados')
    console.log(definitiveTeamsForTournament)
  }

  const createTournament = () => {
    MySwal.fire({
      title: 'Nuevo torneo',
      html: (
        <div>
          <div>Está generando el siguiente torneo:</div>
          <br />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <div>
              Nombre: <span style={{ fontWeight: 700 }}>{tournamentName}</span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                margin: '0.5rem 0',
              }}
            >
              Jugadores:
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {players.map(({ name, id }, index) => (
                  <span key={id}>
                    {index + 1}.
                    <span style={{ fontWeight: 700, margin: '0 0.25rem' }}>
                      {name}
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                margin: '0 auto',
              }}
            >
              <div>Equipos: </div>
              <div
                style={{
                  maxWidth: '300px',
                }}
              >
                {definitiveTeamsForTournament.map(({ id, name }) => (
                  <span
                    key={id}
                    style={{ fontWeight: '700', margin: '0 0.25rem' }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ margin: '0.5rem 0' }}>
              Cantidad de equipos:{' '}
              {
                <span style={{ fontWeight: 700, margin: '1rem 0' }}>
                  {definitiveTeamsForTournament.length}
                </span>
              }
            </div>
          </div>
        </div>
      ),
      color: '#000',
      background: 'rgb(240 240 245)',
      icon: 'info',
      showCancelButton: true,
      showConfirmButton: true,
      allowOutsideClick: false,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: 'El torneo ha sido creado con éxito',
          text: 'Será redirigido en breve...',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true,
          showCancelButton: false,
          showConfirmButton: false,
          allowOutsideClick: false,
        })

        const name = tournamentName

        const teams = definitiveTeamsForTournament

        console.log('TORNEO CREADO CON ÉXITO')

        // const img = uploadTournamentImg()

        // Create an object of formData
        const formData = new FormData()

        // Update the formData object
        formData.append('name', name)
        formData.append('format', format)
        formData.append('players', JSON.stringify(players)) // It's needed so it can be processed by node in BE //
        formData.append('teams', JSON.stringify(teams)) // It's needed so it can be processed by node in BE //
        formData.append('apa_id', null) // Para utilizar formatos más adelante //
        formData.append('file', tournamentImg)

        // Details of the uploaded file
        // console.log(tournamentImg)

        // console.log(Object.fromEntries(formData))

        // Primero, hago la llamada POST para generar el torneo en football-database //

        // axios
        //   .post(`${database}/tournaments`, formData, {
        //     headers: {
        //       'Content-Type': 'multipart/form-data',
        //     },
        //   })
        //   .then((response) => {
        //     console.log(response.data)
        //   })
        //   .catch((err) => {
        //     console.log(err)
        //   })

        // Segundo, hago la llamada POST para generar el torneo en apa-website-be //

        // let apa_id = null

        axios
          .post(`${api}/tournaments`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            console.log(response.data)
          })
      } else {
        MySwal.fire({
          title: 'Cancelado',
          text: 'La creación del torneo ha sido detenida, vuelva a intentarlo',
          icon: 'error',
          showCancelButton: false,
        })
      }
    })

    // if (
    //   tournamentName != '' &&
    //   format &&
    //   players &&
    //   definitiveTeamsForTournament
    // ) {
    //   axios
    //     .post(`${api}/tournaments`, {
    //       tournamentName,
    //       format,
    //       players,
    //       definitiveTeamsForTournament,
    //     })
    //     .then((response) => {
    //       console.log(response.data)
    //     })
    // }
  }

  return (
    <>
      <StyledLeaguesBoxContainer>
        <div>
          <div>
            Nombre del torneo:{' '}
            <input
              type="text"
              value={tournamentName}
              onChange={onChangeTitle}
            />
          </div>{' '}
          {tournamentImg ? (
            <div>
              <p>Nombre del archivo: {tournamentImg.name}</p>

              <p>Tipo de Archivo: {tournamentImg.type}</p>

              <p>
                Última modificación:{' '}
                {tournamentImg.lastModifiedDate.toDateString()}
              </p>

              {/* <button onClick={uploadTournamentImg}>Upload!</button> */}
            </div>
          ) : (
            <div>
              <input
                name="files"
                type="file"
                onChange={onChangeTournamentImg}
              />
            </div>
          )}
        </div>
        <div className="leagues-box-title">Ligas</div>
        <div>
          Ligas seleccionadas:{' '}
          {selectedLeagues.map((league, index) => (
            <span key={index} style={{ margin: '1rem' }}>
              {league}
            </span>
          ))}
        </div>
        <div
          style={{
            margin: '1rem 0',
          }}
        >
          Equipos seleccionados:{' '}
          {selectedTeams.map(({ id, name }) => (
            <span key={id} style={{ margin: '1rem' }}>
              {name}
            </span>
          ))}
          ({selectedTeams.length})
        </div>
        <div className="leagues-box-container">
          {leagues.map(({ id, name, country }) => (
            <LeagueBox
              key={id}
              id={id}
              name={name}
              country={country}
              handler={() => leagueOnClickHandler(event)}
            />
          ))}
        </div>
        {selectedLeagues.length ? (
          <>
            <div className="teams__container">
              {availableTeams.map(({ team }) => (
                <TeamBox
                  key={team.id}
                  team={team}
                  updateSelectedTeams={updateSelectedTeams}
                  selectedTeams={selectedTeams}
                />
              ))}
            </div>
          </>
        ) : (
          <div style={{ margin: '2rem auto 1rem' }}>
            No hay ligas seleccionadas
          </div>
        )}
        {!!selectedTeams.length && (
          <button onClick={() => confirmTeams()}>Seleccionar equipos</button>
        )}
        {!!confirmedTeams.length && (
          <div className="teams-assignment__container">
            <div
              style={{
                color: '#fff',
                margin: '2rem auto',
              }}
            >
              Equipos asignados:{' '}
              {`${definitiveTeamsForTournament.length}/${confirmedTeams.length}`}
            </div>
            <div style={{ color: '#fff', margin: '0 auto 2rem' }}>
              {players.map(({ id, name }) => (
                <div key={id}>
                  {name}:{' '}
                  {
                    definitiveTeamsForTournament.filter(
                      ({ value }) => value == id,
                    ).length
                  }
                </div>
              ))}
            </div>
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {confirmedTeams.map(({ id, name }) => (
                <TeamAssignmentBox
                  key={id}
                  id={id}
                  name={name}
                  players={players}
                  definitiveTeamsForTournament={definitiveTeamsForTournament}
                  updateDefinitiveTeamsForTournament={
                    updateDefinitiveTeamsForTournament
                  }
                />
              ))}
              {definitiveTeamsForTournament.length == confirmedTeams.length && (
                <>
                  <div
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      margin: 'auto 0.5rem',
                      padding: '0.25rem',
                      width: '250px',
                    }}
                  >
                    <button
                      className="create-tournament-button"
                      onClick={() => createTournament()}
                    >
                      Crear torneo
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </StyledLeaguesBoxContainer>
    </>
  )
}

export default LeaguesBoxContainer

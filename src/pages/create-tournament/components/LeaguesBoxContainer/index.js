import { useState } from 'react'
import { api, database } from './../../../../api'
import { useNavigate } from 'react-router-dom'
import { StyledLeaguesBoxContainer } from './styled'
import LeagueBox from './../LeagueBox'
import TeamBox from '../TeamBox'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'
import TeamAssignmentBox from '../TeamAssignmentBox'

const LeaguesBoxContainer = ({ format, players, leagues }) => {
  const MySwal = withReactContent(Swal)

  const navigate = useNavigate()

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
        // Cargo la imagen a Cloudinary //

        // const formData = new FormData()

        // formData.append('file', tournamentImg)
        // formData.append('upload_preset', 'tournaments')

        // axios
        //   .post(
        //     'https://api.cloudinary.com/v1_1/apa-images-repository/image/upload',
        //     formData,
        //   )
        //   .then(({ data }) => {
        // const cloudinaryId = data.public_id
        const name = tournamentName
        const teams = definitiveTeamsForTournament
        axios
          .post(`${api}/tournaments`, {
            name,
            format,
            players,
            teams,
            // cloudinaryId,
          })
          .then(({ data }) => {
            console.log(data)
            MySwal.fire({
              background: `rgba(28, 25, 25, 0.95)`,
              color: `#fff`,
              icon: 'success',
              iconColor: '#18890e',
              toast: true,
              title: `Torneo cargado con éxito`,
              position: 'top-end',
              showConfirmButton: false,
              text: 'Aguarde unos instantes y será redirigido...',
              timer: 1500,
              timerProgressBar: true,
              customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              },
              didClose: () => {
                navigate({
                  pathname: `/tournaments/${data._id}`,
                })
              },
            })
          })
        // })
      } else {
        MySwal.fire({
          title: 'Cancelado',
          text: 'La creación del torneo ha sido detenida, vuelva a intentarlo',
          icon: 'error',
          showCancelButton: false,
        })
      }
    })
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
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'column',
            margin: '1rem 0',
          }}
        >
          <div>Equipos seleccionados:</div>
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {selectedTeams.map(({ id, name }) => (
              <span key={id} style={{ margin: '1rem' }}>
                {name}
              </span>
            ))}
            ({selectedTeams.length})
          </div>
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
                  format={format}
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

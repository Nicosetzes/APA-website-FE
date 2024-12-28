import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useLogin } from './../../../../context/LoginContext'
import { api, database } from './../../../../api'
import { useNavigate, useLocation } from 'react-router-dom'
import { StyledLeaguesBoxContainer } from './styled'
import LeagueBox from './../LeagueBox'
import TeamBox from '../TeamBox'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'
import RegularDragAndDropAssignment from '../RegularDragAndDropAssignment'
import RegularMobileAssignment from '../RegularMobileAssignment'
import TagTeamsDragAndDropAssignment from './../TagTeamsDragAndDropAssignment'
import TagTeamsMobileAssignment from './../TagTeamsMobileAssignment'

const LeaguesBoxContainer = ({ format, players, leagues }) => {
  // const isXL = useMediaQuery({ query: '(min-width: 1200px)' })
  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  // const isM = useMediaQuery({ query: '(min-width: 768px)' })
  // const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  // const isXS = useMediaQuery({ query: '(min-width: 350px)' })

  const MySwal = withReactContent(Swal)

  const navigate = useNavigate()

  const location = useLocation()

  const login = useLogin()

  const { setLoginStatus } = login

  const [tournamentName, setTournamentName] = useState('')
  const [tournamentImg, setTournamentImg] = useState(null)
  const [selectedLeagues, setSelectedLeagues] = useState([])
  const [availableTeams, setAvailableTeams] = useState([])
  const [selectedTeams, setSelectedTeams] = useState([])
  const [confirmedTeams, setConfirmedTeams] = useState()

  let groups

  if (format == 'league_playin_playoff') groups = ['A', 'B']
  else if (format == 'world_cup' || format == 'champions_league')
    groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  else groups = []

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
    // TODO: Cuando actualizo confirmedTeams (agrego equipos adicionales, luego de haber
    // apretado el botón por 1ra vez), el componente del D&D no se rerenderiza, por lo que
    // no hereda los equipos actualizados //
    setConfirmedTeams([...selectedTeams])
    console.log('Confirmo equipos')
  }

  const createTournament = (assignedTeams) => {
    // Si el torneo tiene formato con grupos, averiguo si todos los equipos tienen un grupo asignado //
    if (format == 'league_playin_playoff' || format == 'world_cup') {
      const teamsWithAssignedGroups = assignedTeams.filter(({ group }) => group)

      if (teamsWithAssignedGroups.length != assignedTeams.length) {
        MySwal.fire({
          background: `rgba(28, 25, 25, 0.95)`,
          color: `#fff`,
          icon: 'error',
          iconColor: '#b30a0a',
          title: '¡Error!',
          text: 'Todos los equipos deben tener al menos una zona asignada',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
        })
        return
      }
    }

    // Averiguo si todos los equipos tienen un jugador asignado //
    // Si no es así, advierto y retorno //
    const teamsWithAssignedPlayers = assignedTeams.filter(
      ({ player }) => player,
    )

    console.log(teamsWithAssignedPlayers)

    if (
      teamsWithAssignedPlayers.length != assignedTeams.length &&
      format !== 'tag_teams'
    ) {
      MySwal.fire({
        background: `rgba(28, 25, 25, 0.95)`,
        color: `#fff`,
        icon: 'error',
        iconColor: '#b30a0a',
        title: '¡Error!',
        text: 'Todos los equipos deben tener al menos un jugador asignado',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
      })
      return
    }

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
                margin: '1rem 0',
              }}
            >
              Jugadores:
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-evenly',
                }}
              >
                {players.map(({ name, id }, index) => (
                  <span
                    key={id}
                    style={{ fontWeight: 700, margin: '0 0.25rem' }}
                  >
                    {name}
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
                  alignItems: 'center',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-evenly',
                  maxWidth: '300px',
                }}
              >
                {assignedTeams.map(({ team }) => (
                  <div
                    key={team.id}
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      minWidth: '75px',
                    }}
                  >
                    <span style={{ fontWeight: '700', margin: '0 0.25rem' }}>
                      {team.name}
                    </span>
                    <img
                      src={`${database}/logos/${team.id}`}
                      style={{ margin: '0.25rem', width: '25px' }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ margin: '1rem 0 0 0' }}>
              Cantidad de equipos:{' '}
              {
                <span style={{ fontWeight: 700, margin: '1rem 0' }}>
                  {assignedTeams.length}
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
        const teams = assignedTeams.map(({ team, player, group }) => {
          return { team, player, group }
        })
        // const teams = definitiveTeamsForTournament
        axios
          .post(
            `${api}/tournaments`,
            {
              name,
              format,
              players,
              teams,
              // cloudinaryId,
            },
            {
              withCredentials: true,
              credentials: 'include',
            } /* Importante, sirve para incluir la cookie alojada en el navegador */,
          )
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
              timer: 2000,
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
          .catch(({ response }) => {
            const { data } = response
            const { auth, message } = data
            MySwal.fire({
              background: `rgba(28, 25, 25, 0.95)`,
              color: `#fff`,
              icon: 'error',
              iconColor: '#b30a0a',
              text: message,
              title: '¡Error!',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              },
              didClose: () => {
                setLoginStatus((loginStatus) => ({
                  ...loginStatus,
                  status: auth,
                }))
                auth === false &&
                  navigate(
                    {
                      pathname: `/users/login`,
                    },
                    {
                      state: { url: location.pathname },
                    } /* Adjunto info de la ruta actual, para luego volver a ella en caso de login exitoso */,
                  )
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
            <div>Nombre del torneo: </div>
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

        {confirmedTeams && isL && format !== 'tag_teams' && (
          <RegularDragAndDropAssignment
            players={players}
            teams={confirmedTeams}
            groups={groups}
            createTournament={createTournament}
          />
        )}
        {confirmedTeams && !isL && format !== 'tag_teams' && (
          <RegularMobileAssignment
            players={players}
            teams={confirmedTeams}
            groups={groups}
            createTournament={createTournament}
          />
        )}
        {confirmedTeams && isL && format == 'tag_teams' && (
          <TagTeamsDragAndDropAssignment
            players={players}
            teams={confirmedTeams}
            groups={groups}
            createTournament={createTournament}
          />
        )}
        {confirmedTeams && !isL && format == 'tag_teams' && (
          <TagTeamsMobileAssignment
            players={players}
            teams={confirmedTeams}
            groups={groups}
            createTournament={createTournament}
          />
        )}
      </StyledLeaguesBoxContainer>
    </>
  )
}

export default LeaguesBoxContainer

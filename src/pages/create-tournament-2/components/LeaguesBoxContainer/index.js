import { useState } from 'react'
import { api, database } from './../../../../api'
import { StyledLeaguesBoxContainer } from './styled'
import LeagueBox from './../LeagueBox'
import TeamBox from '../TeamBox'
import axios from 'axios'
import TeamAssignmentBox from '../TeamAssignmentBox'

const LeaguesBoxContainer = ({ format, players, leagues }) => {
  const [tournamentName, setTournamentName] = useState('')
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
    console.log('name')
    console.log(tournamentName)
    console.log('format')
    console.log(format)
    console.log('players')
    console.log(players)
    console.log('Equipos definitivos')
    console.log(definitiveTeamsForTournament)
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
        <div style={{ margin: '1rem 0' }}>
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

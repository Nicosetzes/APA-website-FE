import { useState, useEffect } from 'react'
import { database } from './../../../../api'
import { StyledLeaguesBoxContainer } from './styled'
import LeagueBox from './../LeagueBox'
import axios from 'axios'

const LeaguesBoxContainer = ({ leagues }) => {
  const [selectedLeagues, setSelectedLeagues] = useState([])
  const [availableTeams, setAvailableTeams] = useState([])

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

  console.log(selectedLeagues)

  return (
    <>
      <StyledLeaguesBoxContainer>
        <div className="leagues-box-title">Ligas</div>
        <div>
          Ligas seleccionadas:{' '}
          {selectedLeagues.map((league, index) => (
            <span key={index} style={{ margin: '1rem' }}>
              {league}
            </span>
          ))}
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
        {selectedLeagues.length && (
          <div className="teams-container">
            {availableTeams.map(({ team, league }) => (
              <div key={team.id} className="teams-container-team">
                <div>
                  <span>{team.name}</span> <span>({league.name})</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </StyledLeaguesBoxContainer>
    </>
  )
}

export default LeaguesBoxContainer

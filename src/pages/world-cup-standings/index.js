import { useState, useEffect } from 'react'
import { api, database } from './../../api'
import axios from 'axios'
import GroupStandings from './components/GroupStandings'
import { Oval } from 'react-loader-spinner'
import PlayerStatsTable from './../../components/PlayerStatsTable'

const WorldCupStandings = () => {
  const tournament = '6372f83c88e2408e9cadcc73' // Harcodeado, REVISAR //

  const [tournamentData, setTournamentData] = useState()

  const getWorldCupDataData = () => {
    const standings = axios.get(`${api}/world-cup/${tournament}/standings`)
    const playerInfoFromTournament = axios.get(
      `${api}/tournaments/${tournament}/standings/player-info`,
    )

    Promise.all([standings, playerInfoFromTournament]).then((values) => {
      const data = values.map((response) => response.data)
      setTournamentData(data)
    })
  }

  useEffect(() => {
    getWorldCupDataData()
  }, [])

  console.log(tournamentData)

  if (tournamentData) {
    const teams = tournamentData[0]
    const playerStats = tournamentData[1]
    return (
      <>
        <div
          style={{
            fontWeight: 700,
            margin: '2rem 0',
            textAlign: 'center',
            fontSize: '2.5rem',
          }}
        >
          Copa del Mundo 2022
        </div>
        <div
          style={{
            fontWeight: 700,
            margin: '2rem 0',
            textAlign: 'center',
            fontSize: '2.5rem',
          }}
        >
          Fase de grupos
        </div>
        <div className="container__groups">
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              textAlign: 'center',
              textDecoration: 'underline',
            }}
          >
            Grupo A
          </div>
          <GroupStandings
            teams={teams.filter(({ team }) => team.group == 'A')}
          />
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              textAlign: 'center',
              textDecoration: 'underline',
            }}
          >
            Grupo B
          </div>
          <GroupStandings
            teams={teams.filter(({ team }) => team.group == 'B')}
          />
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              textAlign: 'center',
              textDecoration: 'underline',
            }}
          >
            Grupo C
          </div>
          <GroupStandings
            teams={teams.filter(({ team }) => team.group == 'C')}
          />
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              textAlign: 'center',
              textDecoration: 'underline',
            }}
          >
            Grupo D
          </div>
          <GroupStandings
            teams={teams.filter(({ team }) => team.group == 'D')}
          />
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              textAlign: 'center',
              textDecoration: 'underline',
            }}
          >
            Grupo E
          </div>
          <GroupStandings
            teams={teams.filter(({ team }) => team.group == 'E')}
          />
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              textAlign: 'center',
              textDecoration: 'underline',
            }}
          >
            Grupo F
          </div>
          <GroupStandings
            teams={teams.filter(({ team }) => team.group == 'F')}
          />
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              textAlign: 'center',
              textDecoration: 'underline',
            }}
          >
            Grupo G
          </div>
          <GroupStandings
            teams={teams.filter(({ team }) => team.group == 'G')}
          />
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              textAlign: 'center',
              textDecoration: 'underline',
            }}
          >
            Grupo H
          </div>
          <GroupStandings
            teams={teams.filter(({ team }) => team.group == 'H')}
          />
        </div>
        <PlayerStatsTable stats={playerStats} />
      </>
    )
  } else {
    return (
      <div style={{ margin: 'auto', width: '100px' }}>
        <Oval
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="three-dots-loading"
          $wrapperStyle
          $wrapperClass
        />
      </div>
    )
  }
}

export default WorldCupStandings
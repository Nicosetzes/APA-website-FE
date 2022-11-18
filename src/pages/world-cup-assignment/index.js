import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, database } from './../../api'
import axios from 'axios'
import { Oval } from 'react-loader-spinner'
import NationalTeamBox from './components/NationalTeamBox'

const WorldCupAssignment = () => {
  const tournament = '6372f83c88e2408e9cadcc73' // Harcodeado, REVISAR //

  const [tournamentData, setTournamentData] = useState()

  useEffect(() => {
    const fetchData = async () => {
      console.log('Hago el fetch de data')
      await axios
        .get(`${api}/tournaments/${tournament}`, {
          withCredentials: true,
          credentials: 'include',
        })
        .then(({ data }) => {
          console.log(data)
          setTournamentData(data)
        })
    }
    fetchData()
  }, [])

  if (tournamentData) {
    const { players, teams } = tournamentData
    const sortedTeamsByGroup = teams.sort((a, b) =>
      a.team.group > b.team.group ? 1 : -1,
    )
    return (
      <div>
        {sortedTeamsByGroup.map(({ team }) => (
          <NationalTeamBox key={team.id} team={team} players={players} />
        ))}
      </div>
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

export default WorldCupAssignment

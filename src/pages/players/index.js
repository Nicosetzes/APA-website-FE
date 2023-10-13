import { useState, useEffect } from 'react'
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
  useNavigate,
} from 'react-router-dom'
import { StyledPlayers } from './styled'
import StatsLayout from './components/StatsLayout'
import PlayerBox from './components/PlayerBox'
import { api } from './../../api'
import { Oval } from 'react-loader-spinner'
import axios from 'axios'

const Players = () => {
  const { tournament } = useParams()

  const [searchParams, setSearchParams] = useSearchParams()

  const [players, setPlayers] = useState()

  const getPlayersData = async () => {
    await axios
      .get(`${api}/tournaments/${tournament}/players`)
      .then(({ data }) => {
        setPlayers(data)
      })
  }

  useEffect(() => {
    getPlayersData()
  }, [])

  const [playerStats, setPlayerStats] = useState()

  const getPlayerStats = async () => {
    const player = searchParams.get('player')

    if (!player) return

    await axios
      .get(`${api}/tournaments/${tournament}/players/${player}`)
      .then(({ data }) => {
        setPlayerStats(data)
      })
  }

  useEffect(() => {
    getPlayerStats()
  }, [searchParams])

  console.log(players)
  console.log(playerStats)

  if (players) {
    return (
      <StyledPlayers>
        <div className="players">
          {players.map(({ id, name }) => (
            <PlayerBox
              key={id}
              id={id}
              name={name}
              handler={() => setSearchParams({ player: id })}
            />
          ))}
        </div>
        {playerStats ? <StatsLayout playerStats={playerStats} /> : null}
      </StyledPlayers>
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

export default Players

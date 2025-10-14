import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import BreadCrumbsMUI from './../../components/BreadCrumbsMUI'
import { StyledPlayers } from './styled'
import StatsLayout from './components/StatsLayout'
import PlayerBox from './components/PlayerBox'
import { api } from './../../api'
import axios from 'axios'
import PageLoader from '../../components/PageLoader'

const Players = () => {
  const { tournament } = useParams()

  const [searchParams, setSearchParams] = useSearchParams()

  const [tournamentData, setTournamentData] = useState()

  const getTournamentData = () => {
    console.log('Traigo la data del torneo')
    axios
      .get(`${api}/tournaments/${tournament}`)
      .then(({ data }) => setTournamentData(data))
  }

  useEffect(() => {
    getTournamentData()
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

  console.log(playerStats)

  if (tournamentData) {
    const { name, players } = tournamentData

    const breadCrumbsLinks = [
      { name: 'Home', route: '' },
      { name: 'Torneos', route: 'tournaments' },
      {
        name: `${name}`,
        route: `tournaments/${tournament}`,
      },
      {
        name: 'Jugadores',
        route: `tournaments/${tournament}/players`,
      },
    ]
    return (
      <StyledPlayers>
        <BreadCrumbsMUI links={breadCrumbsLinks} />
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
    return <PageLoader />
  }
}

export default Players

import { useState, useEffect, useMemo, useRef } from 'react'
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
  const [tournamentError, setTournamentError] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    setTournamentError(null)
    setTournamentData(undefined)
    axios
      .get(`${api}/tournaments/${tournament}`, { signal: controller.signal })
      .then(({ data }) => setTournamentData(data))
      .catch((err) => {
        if (axios.isCancel?.(err) || err?.name === 'CanceledError') return
        console.error(err)
        setTournamentError('No se pudo cargar el torneo')
      })
    return () => controller.abort()
  }, [tournament])

  const [playerStats, setPlayerStats] = useState()
  const [playerLoading, setPlayerLoading] = useState(false)
  const [playerError, setPlayerError] = useState(null)
  const playerCacheRef = useRef({})
  const currentRequestRef = useRef(null)
  // Reset cache when tournament changes
  useEffect(() => {
    playerCacheRef.current = {}
    setPlayerStats(undefined)
    setPlayerError(null)
    setPlayerLoading(false)
    // Abort any in-flight
    if (currentRequestRef.current) {
      currentRequestRef.current.abort()
      currentRequestRef.current = null
    }
  }, [tournament])

  const playerId = useMemo(() => searchParams.get('player'), [searchParams])

  useEffect(() => {
    if (!playerId) {
      setPlayerStats(undefined)
      setPlayerError(null)
      setPlayerLoading(false)
      return
    }

    // Serve from cache if available
    const cached = playerCacheRef.current[playerId]
    if (cached) {
      setPlayerStats(cached)
      setPlayerError(null)
      setPlayerLoading(false)
      return
    }

    // Abort previous request if any
    if (currentRequestRef.current) {
      currentRequestRef.current.abort()
    }
    const controller = new AbortController()
    currentRequestRef.current = controller
    setPlayerLoading(true)
    setPlayerError(null)
    axios
      .get(`${api}/tournaments/${tournament}/players/info?player=${playerId}`, {
        signal: controller.signal,
      })
      .then(({ data }) => {
        // Cache and set
        playerCacheRef.current[playerId] = data
        setPlayerStats(data)
      })
      .catch((err) => {
        if (axios.isCancel?.(err) || err?.name === 'CanceledError') return
        console.error(err)
        setPlayerError('No se pudo cargar la información del jugador')
      })
      .finally(() => {
        if (currentRequestRef.current === controller) {
          currentRequestRef.current = null
        }
        setPlayerLoading(false)
      })
  }, [playerId, tournament])

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
        {playerId ? (
          playerLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '0.5rem',
              }}
            >
              Cargando jugador...
            </div>
          ) : playerError ? (
            <div
              style={{
                color: 'crimson',
                display: 'flex',
                justifyContent: 'center',
                padding: '0.5rem',
              }}
            >
              {playerError}
            </div>
          ) : playerStats ? (
            <StatsLayout playerStats={playerStats} />
          ) : null
        ) : null}
      </StyledPlayers>
    )
  } else {
    return tournamentError ? (
      <div
        style={{
          color: 'crimson',
          display: 'flex',
          justifyContent: 'center',
          padding: '0.5rem',
        }}
      >
        {tournamentError}
      </div>
    ) : (
      <PageLoader />
    )
  }
}

export default Players

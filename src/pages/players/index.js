import { PageLoader } from 'views/components'
import PlayerBox from './components/PlayerBox'
import StatsLayout from './components/StatsLayout'
import { StyledPlayers } from './styled'
import { api } from 'api'
import axios from 'axios'
import { useOutletContext } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

const Players = () => {
  const { tournament } = useParams()

  const [searchParams, setSearchParams] = useSearchParams()

  const { tournamentData } = useOutletContext()

  // Set first player as active if no player is selected
  useEffect(() => {
    if (!searchParams.get('player') && tournamentData?.players?.length > 0) {
      setSearchParams({ player: tournamentData.players[0].id })
    }
  }, [tournamentData, searchParams, setSearchParams])

  const [playerStats, setPlayerStats] = useState()
  const [playerError, setPlayerError] = useState(null)
  const playerCacheRef = useRef({})
  const currentRequestRef = useRef(null)
  // Reset cache when tournament changes
  useEffect(() => {
    playerCacheRef.current = {}
    setPlayerStats(undefined)
    setPlayerError(null)

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
      return
    }

    // Serve from cache if available
    const cached = playerCacheRef.current[playerId]
    if (cached) {
      setPlayerStats(cached)
      setPlayerError(null)
      return
    }

    // Abort previous request if any
    if (currentRequestRef.current) {
      currentRequestRef.current.abort()
    }
    const controller = new AbortController()
    currentRequestRef.current = controller
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
      })
  }, [playerId, tournament])

  if (!tournamentData) {
    return <PageLoader />
  }

  const { players } = tournamentData

  return (
    <StyledPlayers>
      <div className="players">
        {players.map(({ id, name }) => (
          <PlayerBox
            key={id}
            id={id}
            name={name}
            isActive={playerId === id}
            handler={() => setSearchParams({ player: id })}
          />
        ))}
      </div>
      {playerId ? (
        playerError ? (
          <div
            style={{
              color: 'crimson',
              display: 'flex',
              justifyContent: 'center',
              padding: '2rem',
              fontSize: '1.1rem',
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
}

export default Players

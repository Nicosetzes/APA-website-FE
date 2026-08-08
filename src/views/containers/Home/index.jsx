import { Image } from 'cloudinary-react'
import { Loader } from 'views/components'
import { StyledHome } from './styled'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, cloudName, database } from 'api'
import { useEffect, useState } from 'react'

const Home = () => {
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  const isXS = useMediaQuery({ query: '(min-width: 350px)' })

  const navigate = useNavigate()

  const [activeTournaments, setActiveTournaments] = useState([])
  const [finalizedTournaments, setFinalizedTournaments] = useState([])
  const [tournamentsLoading, setTournamentsLoading] = useState(false)
  const [tournamentsError, setTournamentsError] = useState(null)

  const fetchTournaments = async () => {
    const controller = new AbortController()
    setTournamentsLoading(true)
    try {
      const [activeTournamentsRes, finalizedTournamentsRes] = await Promise.all(
        [
          axios.get(`${api}/tournaments`, {
            params: { status: 'active' },
            signal: controller.signal,
          }),
          axios.get(`${api}/tournaments`, {
            params: { status: 'finalized' },
            signal: controller.signal,
          }),
        ],
      )
      setActiveTournaments(activeTournamentsRes.data || [])
      setFinalizedTournaments(finalizedTournamentsRes.data || [])
    } catch (err) {
      if (axios.isCancel?.(err) || err?.name === 'CanceledError') return
      console.error(err)
      setTournamentsError('No se pudieron cargar los torneos activos')
    } finally {
      setTournamentsLoading(false)
    }
    return () => controller.abort()
  }

  useEffect(() => {
    fetchTournaments()
  }, [])

  const lastTournament = useMemo(() => {
    if (finalizedTournaments.length === 0) return null
    return finalizedTournaments
      .filter(({ updatedAt }) => !!updatedAt)
      .sort((a, b) => {
        const aDate = new Date(a.updatedAt)
        const bDate = new Date(b.updatedAt)
        return bDate - aDate
      })[0]
  }, [finalizedTournaments])

  const lastChampion = useMemo(() => {
    if (!lastTournament) return null
    return lastTournament.outcome?.champion || null
  }, [lastTournament])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <StyledHome
        presentationBackground={
          isSm ? '/images/desktop.jpg' : '/images/mobile.jpg'
        }
        championBackground="/images/desktop-2.jpg"
        isXS={isXS && !isSm}
        isM={isM}
      >
        <div className="container__presentation">
          <img className="logo" src="/images/sitioapalogo2.png" />
          <div className="container__coaches">
            <img src="/images/nico.png" />
            <img src="/images/max.png" />
            <img src="/images/santi.png" />
            <img src="/images/lucho.png" />
            <img src="/images/leo.png" />
          </div>
        </div>
        <div className="container__accolades">
          <div className="box__champion">
            <div className="champion-title">CAMPEÓN VIGENTE</div>
            <div className="champion-tournament">{lastTournament?.name}</div>
            <div className="champion-img">
              <Image
                cloudName={cloudName}
                publicId={lastTournament?.cloudinary_id}
              />
              <img
                alt={lastChampion?.player?.name}
                src={`${database}/logos/small/${lastChampion?.team?.id}`}
              />
            </div>
            <div className="champion-player">
              <span>
                {lastChampion?.player?.name}
                {lastTournament?.updatedAt &&
                  ` - ${new Date(
                    lastTournament.updatedAt,
                  ).toLocaleDateString()}`}
              </span>
            </div>
            <button onClick={() => navigate('./hall-of-fame')}>
              SALÓN DE LA FAMA
            </button>
          </div>
        </div>
        <div className="container__tournament">
          <div
            style={{
              color: 'var(--blue-900)',
              display: 'flex',
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: '0.5rem auto 1rem auto',
            }}
          >
            TORNEOS ACTIVOS
          </div>
          {tournamentsLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '2rem',
              }}
            >
              <Loader />
            </div>
          ) : tournamentsError ? (
            <div
              style={{
                color: 'crimson',
                display: 'flex',
                justifyContent: 'center',
                padding: '1rem',
              }}
            >
              {tournamentsError}
            </div>
          ) : activeTournaments.length === 0 ? (
            <div
              style={{
                color: 'var(--blue-900)',
                display: 'flex',
                justifyContent: 'center',
                padding: '1rem',
              }}
            >
              No hay torneos activos
            </div>
          ) : (
            <div
              style={{
                alignItems: 'end',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                margin: '0.5rem 0',
                gap: '1rem',
              }}
            >
              {activeTournaments.map((tournament) => (
                <div
                  key={tournament._id}
                  style={{
                    alignItems: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    flexBasis: activeTournaments.length === 1 ? '100%' : '45%',
                    minWidth: '200px',
                  }}
                  onClick={() => navigate(`./tournaments/${tournament._id}`)}
                >
                  <div className="tournament-name">{tournament.name}</div>
                  <div className="tournament-img">
                    <Image
                      cloudName={cloudName}
                      publicId={tournament.cloudinary_id}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => navigate('./tournaments')}>VER TORNEOS</button>
        </div>
      </StyledHome>
    </motion.div>
  )
}

export default Home

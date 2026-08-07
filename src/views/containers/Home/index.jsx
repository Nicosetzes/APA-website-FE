import { useMediaQuery } from 'react-responsive'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StyledHome } from './styled'
import { api, cloudName } from 'api'
import { Image } from 'cloudinary-react'
import { Loader } from 'views/components'
import axios from 'axios'

const superliga_internacional_cloudinary_id = 'tournaments/internacional_co4gg7'

const Home = () => {
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  const isXS = useMediaQuery({ query: '(min-width: 350px)' })

  const navigate = useNavigate()

  const [activeTournaments, setActiveTournaments] = useState([])
  const [tournamentsLoading, setTournamentsLoading] = useState(false)
  const [tournamentsError, setTournamentsError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setTournamentsLoading(true)
    setTournamentsError(null)
    axios
      .get(`${api}/tournaments`, {
        params: { status: 'active' },
        signal: controller.signal,
      })
      .then(({ data }) => {
        setActiveTournaments(data || [])
      })
      .catch((err) => {
        if (axios.isCancel?.(err) || err?.name === 'CanceledError') return
        console.error(err)
        setTournamentsError('No se pudieron cargar los torneos activos')
      })
      .finally(() => setTournamentsLoading(false))

    return () => controller.abort()
  }, [])

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
            <div className="champion-player">Nico</div>
            <div className="champion-img">
              <Image
                cloudName={cloudName}
                publicId={superliga_internacional_cloudinary_id}
              />
            </div>
            <div className="champion-team">
              <span>ITALIA</span>
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

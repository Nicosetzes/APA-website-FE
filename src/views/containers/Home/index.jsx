import { Image } from 'cloudinary-react'
import { Loader } from 'views/components'
import { StyledHome } from './styled'
import axios from 'axios'
import { formatDate } from 'utils/dates'
import { formatPlayedAt } from 'utils/playedAt'
import { motion } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, cloudName, database } from 'api'
import { useEffect, useRef, useState } from 'react'

const getClosedAt = (tournament) => tournament?.closedAt ?? null

const formatRecapDate = (date) => {
  const [year, month, day] = String(date).split('-')
  return year && month && day ? `${day}/${month}/${year}` : date
}

const isRecapNotFound = (err) => err?.response?.status === 404

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

  const [recap, setRecap] = useState(null)
  const [recapDates, setRecapDates] = useState([])
  const [selectedRecapDate, setSelectedRecapDate] = useState('')
  const [recapLoading, setRecapLoading] = useState(true)
  const [recapError, setRecapError] = useState(null)
  const recapRequestId = useRef(0)

  useEffect(() => {
    const requestId = ++recapRequestId.current
    const isStale = () => requestId !== recapRequestId.current

    const fetchInitialRecap = async () => {
      const [latestRes, datesRes] = await Promise.allSettled([
        axios.get(`${api}/recaps/latest`),
        axios.get(`${api}/recaps/dates`),
      ])
      if (isStale()) return

      if (datesRes.status === 'fulfilled') {
        setRecapDates(datesRes.value.data?.data || [])
      }

      if (latestRes.status === 'fulfilled') {
        const latest = latestRes.value.data?.data
        setRecap(latest || null)
        setSelectedRecapDate(latest?.date || '')
      } else if (!isRecapNotFound(latestRes.reason)) {
        console.error(latestRes.reason)
        setRecapError('No se pudo cargar el resumen del día')
      }
      setRecapLoading(false)
    }

    fetchInitialRecap()
    return () => {
      recapRequestId.current += 1
    }
  }, [])

  const handleRecapDateChange = async (event) => {
    const date = event.target.value
    const requestId = ++recapRequestId.current
    setSelectedRecapDate(date)
    setRecapLoading(true)
    setRecapError(null)
    try {
      const res = await axios.get(`${api}/recaps/${date}`)
      if (requestId !== recapRequestId.current) return
      setRecap(res.data?.data || null)
    } catch (err) {
      if (requestId !== recapRequestId.current) return
      setRecap(null)
      if (!isRecapNotFound(err)) {
        console.error(err)
        setRecapError('No se pudo cargar el resumen del día')
      }
    } finally {
      if (requestId === recapRequestId.current) setRecapLoading(false)
    }
  }

  const lastTournament = useMemo(() => {
    if (finalizedTournaments.length === 0) return null
    return finalizedTournaments
      .filter((tournament) => !!getClosedAt(tournament))
      .sort((a, b) => new Date(getClosedAt(b)) - new Date(getClosedAt(a)))[0]
  }, [finalizedTournaments])

  const lastTournamentDate = useMemo(() => {
    if (!lastTournament) return null
    const closedAt = getClosedAt(lastTournament)
    return (
      formatPlayedAt(
        lastTournament.closedAt,
        lastTournament.closedAtPrecision,
      ) || formatDate(closedAt)
    )
  }, [lastTournament])

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
                {lastTournamentDate && ` - ${lastTournamentDate}`}
              </span>
            </div>
            <button onClick={() => navigate('./hall-of-fame')}>
              SALÓN DE LA FAMA
            </button>
          </div>
        </div>
        <div className="container__recap">
          <div className="recap-title">RESUMEN DEL DÍA</div>
          {recapDates.length > 0 && (
            <select
              aria-label="Fecha del resumen"
              className="recap-select"
              disabled={recapLoading}
              value={selectedRecapDate}
              onChange={handleRecapDateChange}
            >
              {recapDates.map((date) => (
                <option key={date} value={date}>
                  {formatRecapDate(date)}
                </option>
              ))}
            </select>
          )}
          {recapLoading ? (
            <div className="recap-status">
              <Loader />
            </div>
          ) : recapError ? (
            <div className="recap-status recap-status--error">{recapError}</div>
          ) : !recap ? (
            <div className="recap-status">No hay resúmenes disponibles</div>
          ) : (
            <div className="recap-card">
              <div className="recap-meta">
                {formatRecapDate(recap.date)} · {recap.matchCount}{' '}
                {recap.matchCount === 1 ? 'partido' : 'partidos'}
              </div>
              <div className="recap-text">{recap.recap}</div>
            </div>
          )}
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

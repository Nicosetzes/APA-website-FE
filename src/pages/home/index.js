import { useMediaQuery } from 'react-responsive'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StyledHome } from './styled'
import { api, cloudName } from './../../api'
import { Image } from 'cloudinary-react'
import MemeCarousel from '../../components/MemeCarousel'
import axios from 'axios'
import presentationDesktop from './../../../src/images/desktop.jpg'
import presentationMobile from './../../../src/images/mobile.jpg'
import championBackground from './../../../src/images/desktop-2.jpg'
import logo from './../../../src/images/sitioapalogo2.png'
import nico from './../../../src/images/nico.png'
import max from './../../../src/images/max.png'
import santi from './../../../src/images/santi.png'
import lucho from './../../../src/images/lucho.png'
import leo from './../../../src/images/leo.png'

const superliga_internacional_cloudinary_id = 'tournaments/internacional_co4gg7'
const mundial_de_ferraris_cloudinary_id = 'tournaments/ferraris_ykvwlf'

const Home = () => {
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  const isXS = useMediaQuery({ query: '(min-width: 350px)' })

  const navigate = useNavigate()

  const activeTournamentId = '67bb58104e0e363cd8eecbf1'
  const [recap, setRecap] = useState(null)
  const [recapLoading, setRecapLoading] = useState(false)
  const [recapError, setRecapError] = useState(null)

  console.log(recap)

  // Format a date string safely without timezone shifts for date-only values (YYYY-MM-DD)
  const formatRecapDate = (dateStr) => {
    if (!dateStr) return ''
    // If it's a plain date (YYYY-MM-DD), build a local Date to avoid UTC -> previous day shift
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split('-').map(Number)
      const localDate = new Date(y, m - 1, d)
      return localDate.toLocaleDateString()
    }
    // Otherwise, fall back to native parsing
    const parsed = new Date(dateStr)
    return isNaN(parsed) ? dateStr : parsed.toLocaleDateString()
  }

  useEffect(() => {
    const controller = new AbortController()
    setRecapLoading(true)
    setRecapError(null)
    axios
      .get(`${api}/tournaments/${activeTournamentId}/daily-recap`, {
        signal: controller.signal,
      })
      .then(({ data }) => {
        setRecap(data)
      })
      .catch((err) => {
        if (axios.isCancel?.(err) || err?.name === 'CanceledError') return
        console.error(err)
        setRecapError('No se pudo cargar el recap diario')
      })
      .finally(() => setRecapLoading(false))

    return () => controller.abort()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <StyledHome
        presentationBackground={isSm ? presentationDesktop : presentationMobile}
        championBackground={championBackground}
        isXS={isXS && !isSm}
        isM={isM}
      >
        <div className="container__presentation">
          <img className="logo" src={logo} />
          <div className="container__coaches">
            <img src={nico} />
            <img src={max} />
            <img src={santi} />
            <img src={lucho} />
            <img src={leo} />
          </div>
        </div>
        {/* Daily recap section */}
        {recapLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <span style={{ color: 'var(--blue-900)', fontWeight: 700 }}>
              Cargando recap diario...
            </span>
          </div>
        ) : recap && recap.content ? (
          <div
            className="container__recap"
            style={{
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(2px)',
              margin: '0.5rem auto 1rem auto',
              padding: '1rem',
              maxWidth: 1000,
              width: 'calc(100% - 1rem)',
              alignSelf: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <div style={{ fontWeight: 800, color: 'var(--blue-900)' }}>
                {recap?.tournament?.name || 'Torneo'} — Recap diario
              </div>
              <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                {recap?.date ? formatRecapDate(recap.date) : ''}
              </div>
            </div>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.35 }}>
              {recap.content}
            </div>
          </div>
        ) : recapError ? (
          <div
            style={{
              color: 'crimson',
              display: 'flex',
              justifyContent: 'center',
              padding: '0.5rem',
            }}
          >
            {recapError}
          </div>
        ) : null}
        <div className="container__memes">
          <MemeCarousel />
        </div>
        <div className="container__accolades">
          <div className="box__champion">
            <div className="champion-title">CAMPEÓN VIGENTE</div>
            <div className="champion-player">Leo</div>
            <div className="champion-img">
              <Image
                cloudName={cloudName}
                publicId={mundial_de_ferraris_cloudinary_id}
              />
            </div>
            <div className="champion-team">
              <span>ATLÉTICO MADRID</span>
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
          <div
            style={{
              alignItems: 'end',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              margin: '0.5rem 0',
            }}
          >
            <div
              style={{
                alignItems: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                flexBasis: '50%',
              }}
              onClick={() => navigate('./tournaments/67bb58104e0e363cd8eecbf1')}
            >
              <div className="tournament-name">
                Superliga Internacional 2025
              </div>
              <div className="tournament-img">
                <Image
                  cloudName={cloudName}
                  publicId={superliga_internacional_cloudinary_id}
                />
              </div>
            </div>
          </div>

          <button onClick={() => navigate('./tournaments')}>VER TORNEOS</button>
        </div>
      </StyledHome>
    </motion.div>
  )
}

export default Home

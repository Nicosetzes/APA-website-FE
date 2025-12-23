import { useMediaQuery } from 'react-responsive'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ExtendedNavMenu from '../ExtendedNavMenu'
import MenuWrapper from '../MenuWrapper'
import { StyledNavbar } from './styled'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'

const Navbar = () => {
  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  // const isM = useMediaQuery({ query: '(min-width: 768px)' })
  // const isSm = useMediaQuery({ query: '(min-width: 576px)' })

  const useAudio = (file) => {
    const [audio] = useState(new Audio(file))
    const [playing, setPlaying] = useState(false)

    const toggle = () => setPlaying(!playing)

    useEffect(() => {
      playing ? audio.play() : audio.pause()
    }, [playing])

    useEffect(() => {
      audio.addEventListener('ended', () => setPlaying(false))
      return () => {
        audio.removeEventListener('ended', () => setPlaying(false))
      }
    }, [])

    return [playing, toggle]
  }

  const [playing, toggle] = useAudio('/audio/boca.wav')

  return (
    <StyledNavbar>
      <Link to="/">
        <img className="logo" src="/images/logo.webp" alt="logo" />
      </Link>
      <button
        onClick={toggle}
        style={{
          background: 'none',
          border: 'var(--yellow-900) 2px solid',
          marginLeft: '1rem',
        }}
      >
        {playing ? (
          <StopIcon sx={{ color: '#fff' }} />
        ) : (
          <PlayArrowIcon sx={{ color: '#fff' }} />
        )}{' '}
      </button>
      {/* <Login loginStatus={loginStatus} /> */}
      {!isL ? <MenuWrapper /> : <ExtendedNavMenu />}
    </StyledNavbar>
  )
}

export default Navbar

import ExtendedNavMenu from '../ExtendedNavMenu'
import { Link } from 'react-router-dom'
import MenuWrapper from '../MenuWrapper'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import { StyledNavbar } from './styled'
import { useMediaQuery } from 'react-responsive'
import { useEffect, useState } from 'react'

const Navbar = () => {
  const isXl = useMediaQuery({ query: '(min-width: 1200px)' })

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
          border: 'none',
          cursor: 'pointer',
          marginLeft: '1rem',
        }}
      >
        {playing ? (
          <StopIcon sx={{ color: '#fff' }} />
        ) : (
          <PlayArrowIcon sx={{ color: '#fff' }} />
        )}{' '}
      </button>
      {!isXl ? <MenuWrapper /> : <ExtendedNavMenu />}
    </StyledNavbar>
  )
}

export default Navbar

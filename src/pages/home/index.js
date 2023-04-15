import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StyledHome } from './styled'
import Card from '../../components/Card'
import ArchiveIcon from '@mui/icons-material/Archive'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <StyledHome>
        <Link to={'/matches'}>
          <Card
            title={'Partidos'}
            subtitle={'Historial de partidos'}
            icon={ArchiveIcon}
            text={
              'Esta sección contiene toda la información acerca de los partidos jugados en la historia APA'
            }
          />
        </Link>
        <Link to={'/tournaments'}>
          <Card
            title={'Torneos'}
            subtitle={'Torneos en activo'}
            icon={SportsSoccerIcon}
            text={
              'Esta sección incluye toda la información relevante acerca de los torneos que se disputan en la actualidad'
            }
          />
        </Link>
        <Link to={'/statistics'}>
          <Card
            title={'Estadística'}
            subtitle={'Análisis de datos'}
            icon={ArchiveIcon}
            text={
              'Accede aquí para visitar la estadística detrás de los resultados en la historia APA'
            }
          />
        </Link>
        <Link to={'/hall-of-fame'}>
          <Card
            title={'Salón de la fama'}
            subtitle={'Trofeos y logros'}
            icon={ArchiveIcon}
            text={'Accede aquí para recorer el salón de la fama APA'}
          />
        </Link>
      </StyledHome>
    </motion.div>
  )
}

export default Home

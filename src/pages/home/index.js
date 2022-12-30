import { motion } from 'framer-motion'
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
      <div>Home</div>
      <div>Other stuff</div>
      <Card
        title={'Torneos'}
        subtitle={'Torneos en activo'}
        icon={SportsSoccerIcon}
        text={
          'Esta sección incluye toda la información relevante acerca de los torneos que se disputan en la actualidad'
        }
      />
      <Card
        title={'Partidos'}
        subtitle={'Historial de partidos'}
        icon={ArchiveIcon}
        text={
          'Esta sección incluye toda la información relevante acerca de los torneos que se disputan en la actualidad'
        }
      />
    </motion.div>
  )
}

export default Home

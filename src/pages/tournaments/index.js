import BreadCrumbsMUI from './../../components/BreadCrumbsMUI'
import { Image } from 'cloudinary-react'
import { StyledTournamentsContainer } from './styled'
import { api, database, cloudName } from './../../api'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import PageLoader from '../../components/PageLoader'

const Tournaments = () => {
  const [tournaments, setTournaments] = useState()

  const getTournamentsData = async () => {
    const tournaments = await axios.get(`${api}/tournaments`)

    setTournaments(tournaments.data)
  }

  useEffect(() => {
    getTournamentsData()
  }, [])

  if (tournaments) {
    const breadCrumbsLinks = [
      { name: 'Home', route: '' },
      { name: 'Torneos', route: 'tournaments' },
    ]
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <BreadCrumbsMUI links={breadCrumbsLinks} />
        <div
          style={{
            fontSize: '1.75rem',
            margin: '2.25rem auto',
            textAlign: 'center',
            textDecoration: 'underline',
          }}
        >
          Torneos activos
        </div>
        <StyledTournamentsContainer>
          {tournaments
            .filter(({ ongoing }) => ongoing)
            .map(({ _id, name, cloudinary_id }) => (
              <div className="container__card" key={_id}>
                <Link to={`/tournaments/${_id}`}>
                  <Image cloudName={cloudName} publicId={cloudinary_id} />
                  <div className="container__card-name">{name}</div>
                </Link>
              </div>
            ))}
        </StyledTournamentsContainer>
        <div
          style={{
            fontSize: '1.75rem',
            margin: '2.25rem auto',
            textAlign: 'center',
            textDecoration: 'underline',
          }}
        >
          Torneos finalizados
        </div>
        <StyledTournamentsContainer>
          {tournaments
            .filter(({ ongoing }) => !ongoing)
            .map(({ _id, name, cloudinary_id, outcome }) => (
              <div className="container__card" key={_id}>
                <Link to={`/tournaments/${_id}`}>
                  <Image cloudName={cloudName} publicId={cloudinary_id} />
                  <div className="container__card-name">
                    <span>{name}</span>
                    {outcome ? (
                      <img
                        src={`${database}/logos/${outcome.champion.team.id}`}
                        style={{
                          alignSelf: 'center',
                          height: 'auto',
                          width: '120px',
                        }}
                      />
                    ) : null}
                  </div>
                </Link>
              </div>
            ))}
        </StyledTournamentsContainer>
      </motion.div>
    )
  } else {
    return <PageLoader />
  }
}

export default Tournaments

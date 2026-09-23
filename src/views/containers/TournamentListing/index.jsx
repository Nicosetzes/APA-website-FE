import { Image } from 'cloudinary-react'
import { Link } from 'react-router-dom'
import { PageLoader } from 'views/components'
import { StyledTournamentsContainer } from './styled'
import { motion } from 'framer-motion'
import { apiClient, getApiErrorMessage } from 'api/axiosConfig'
import { database, cloudName } from 'api'
import { useEffect, useState } from 'react'

const TournamentListing = () => {
  const [tournaments, setTournaments] = useState()
  const [tournamentsError, setTournamentsError] = useState(null)

  const getTournamentsData = async () => {
    try {
      const response = await apiClient.get('/tournaments')
      setTournaments(response.data)
      setTournamentsError(null)
    } catch (error) {
      setTournamentsError(
        getApiErrorMessage(error, 'No se pudieron cargar los torneos'),
      )
    }
  }

  useEffect(() => {
    getTournamentsData()
  }, [])

  if (tournamentsError) {
    return <div style={{ margin: '2rem auto' }}>{tournamentsError}</div>
  }

  if (tournaments) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
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
                          maxHeight: '120px',
                          maxWidth: '120px',
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

export default TournamentListing

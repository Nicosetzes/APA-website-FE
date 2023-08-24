import BreadCrumbsMUI from './../../components/BreadCrumbsMUI'
import { Image } from 'cloudinary-react'
import { StyledTournamentsContainer } from './styled'
import { api, database, cloudName } from './../../api'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useLogin } from './../../context/LoginContext'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Oval } from 'react-loader-spinner'

const Tournaments = () => {
  const login = useLogin()

  const { loginStatus, setLoginStatus } = login

  console.log(loginStatus)

  const [tournaments, setTournaments] = useState()

  const getTournamentsData = async () => {
    const tournaments = await axios.get(`${api}/tournaments`)

    setTournaments(tournaments.data)

    // Promise.all([tournaments]).then((values) => {
    //   const data = values.map((response) => response.data)
    //   setTournaments(data)
    // })
  }

  useEffect(() => {
    getTournamentsData()
  }, [])

  if (tournaments) {
    const { activeTournaments, inactiveTournaments } = tournaments
    console.log(activeTournaments, inactiveTournaments)
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
          {activeTournaments.map(({ _id, name, cloudinary_id }) => (
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
          {inactiveTournaments.map(({ _id, name, cloudinary_id, outcome }) => (
            <div className="container__card" key={_id}>
              <Link to={`/tournaments/${_id}`}>
                <Image cloudName={cloudName} publicId={cloudinary_id} />
                <div className="container__card-name">
                  <span>{name}</span>
                  <img
                    src={`${database}/logos/${outcome.champion.team.id}`}
                    style={{
                      alignSelf: 'center',
                      height: 'auto',
                      width: '120px',
                    }}
                  />
                </div>
              </Link>
            </div>
          ))}
        </StyledTournamentsContainer>
      </motion.div>
    )
  } else {
    return (
      <div style={{ margin: 'auto', width: '100px' }}>
        <Oval
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="three-dots-loading"
          $wrapperStyle
          $wrapperClass
        />
      </div>
    )
  }
}

export default Tournaments

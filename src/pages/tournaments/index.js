import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import BreadCrumbsMUI from './../../components/BreadCrumbsMUI'
import { StyledTournamentsContainer } from './styled'
import { api } from './../../api'
import { CardActionArea } from '@mui/material'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Oval } from 'react-loader-spinner'
import { database } from './../../api'

const Tournaments = () => {
  const [tournaments, setTournaments] = useState()

  const getTournamentsData = async () => {
    const tournaments = await axios.get(`${api}/tournaments`, {
      params: {
        active: true,
        inactive: true,
      },
    })

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
          {activeTournaments.map(({ _id, name, apa_id, type }) => (
            <div
              className="container__card"
              key={_id}
              sx={{ maxWidth: 250, display: 'flex', margin: '2rem auto' }}
            >
              <Link to={`/tournaments/${_id}`}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="350"
                    image={`${database}/tournaments/logos/${apa_id}`}
                    alt={`${name}`}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ textAlign: 'center' }}
                    >
                      {name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
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
          {inactiveTournaments.map(({ _id, name, apa_id, type }) => (
            <div className="container__card" key={_id}>
              <Link to={`/tournaments/${_id}`}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="350"
                    image={`${database}/tournaments/logos/${apa_id}`}
                    alt={`${name}`}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ textAlign: 'center' }}
                    >
                      {name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
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

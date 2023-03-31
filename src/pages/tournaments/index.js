import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
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
    console.log(tournaments)
    const { activeTournaments, inactiveTournaments } = tournaments
    console.log(activeTournaments, inactiveTournaments)
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
          {activeTournaments.map((tournament, index) => (
            <div
              className="container__card"
              key={tournament._id}
              sx={{ maxWidth: 250, display: 'flex', margin: '2rem auto' }}
            >
              <Link to={`/tournaments/${tournament._id}`}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="350"
                    image={`${database}/tournaments/logos/${tournament.apa_id}`}
                    alt={`${tournament.name}`}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ textAlign: 'center' }}
                    >
                      {tournament.name}
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
          {inactiveTournaments.map((tournament) => (
            <div className="container__card" key={tournament._id}>
              {tournament.type == 'world_cup' ? (
                <Link to={`/world-cup`}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="350"
                      image={`${database}/tournaments/logos/${tournament.apa_id}`}
                      alt={`${tournament.name}`}
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ textAlign: 'center' }}
                      >
                        {tournament.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
              ) : (
                <Link to={`/tournaments/${tournament._id}`}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="350"
                      image={`${database}/tournaments/logos/${tournament.apa_id}`}
                      alt={`${tournament.name}`}
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ textAlign: 'center' }}
                      >
                        {tournament.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
              )}
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

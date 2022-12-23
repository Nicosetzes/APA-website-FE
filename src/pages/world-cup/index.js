import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, database } from './../../api'
import axios from 'axios'
import { Oval } from 'react-loader-spinner'

const WorldCup = () => {
  // const tournament = useParams()

  const tournament = '6372f83c88e2408e9cadcc73' // Harcodeado, REVISAR //

  const [tournamentData, setTournamentData] = useState()

  useEffect(() => {
    const fetchData = async () => {
      console.log('Hago el fetch de data')
      await axios
        .get(`${api}/tournaments/${tournament}`, {
          withCredentials: true,
          credentials: 'include',
        })
        .then(({ data }) => {
          console.log(data)
          setTournamentData(data)
        })
    }
    fetchData()
  }, [])

  // const [tournamentData, setTournamentData] = useState()

  // const getTournamentData = () => {
  //   const players = axios.get(`${api}/players`)
  //   const leagues = axios.get(`${database}/leagues/1/teams`)

  //   Promise.all([players, leagues]).then((values) => {
  //     const data = values.map((response) => response.data)
  //     setTournamentData(data)
  //   })
  // }

  // useEffect(() => {
  //   getTournamentData()
  // }, [])

  if (tournamentData) {
    const { name, players, teams } = tournamentData

    // const players = tournamentData[0]
    // const teams = tournamentData[1]

    // console.log(players)
    console.log(teams)

    return (
      <>
        <div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: '1.5rem 0',
              textAlign: 'center',
            }}
          >
            <span>{name}</span>
          </div>{' '}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
            }}
          >
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                margin: '1rem 0',
                outline: 'black 2px solid',
                padding: '1rem',
              }}
            >
              <Link
                to={`matches`}
                style={{
                  color: '#004a79',
                  fontSize: '2rem',
                  margin: '1.25rem',
                  textDecoration: 'none',
                }}
              >
                Partidos
              </Link>
              <Link
                to={`standings`}
                style={{
                  color: '#004a79',
                  fontSize: '2rem',
                  margin: '1.25rem',
                  textDecoration: 'none',
                }}
              >
                Clasificación
              </Link>
              <Link
                to={`playoffs`}
                style={{
                  color: '#004a79',
                  fontSize: '2rem',
                  margin: '1.25rem',
                  textDecoration: 'none',
                }}
              >
                Playoffs
              </Link>
            </div>
            {/* <div style={{ margin: '1rem 0' }}>
              <Link to={`playoffs`}>Playoffs</Link>
            </div> */}
          </div>
        </div>

        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            margin: '3rem',
          }}
        >
          <span>Equipos:</span>{' '}
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {teams.map(({ team }) => (
              <div
                key={team.id}
                style={{
                  backgroundColor: 'grey',
                  display: 'flex',
                  height: '90px',
                  justifyContent: 'center',
                  margin: '1rem',
                  padding: '0.5rem',
                  width: '90px',
                }}
              >
                <img
                  src={`${database}/logos/${team.id}`}
                  style={{ width: '100%' }}
                />
              </div>
            ))}
          </div>
        </div>
      </>
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

export default WorldCup

import { useState, useEffect } from 'react'
import { api, database } from './../../../../api'
import { StyledTournamentSettings } from './styled'
import { Oval } from 'react-loader-spinner'
import axios from 'axios'
import LeaguesBoxContainer from '../LeaguesBoxContainer'

const TournamentSettings = ({ format }) => {
  const [data, setData] = useState()

  console.log(format)

  const getData = () => {
    const players = axios.get(`${api}/users`)
    const leagues = axios.get(`${database}/leagues`)

    Promise.all([players, leagues]).then((values) => {
      const data = values.map((response) => response.data)
      setData(data)
    })
  }

  useEffect(() => {
    getData()
  }, [])

  if (data) {
    const players = data[0]
    const leagues = data[1]

    console.log(players)
    console.log(leagues)

    return (
      <StyledTournamentSettings>
        <div>Formato elegido: {format}</div>
        <div style={{ margin: '1rem auto' }}>
          Jugadores:
          {players.map(({ id, name }) => (
            <div key={id}>{name}</div>
          ))}
        </div>
        <LeaguesBoxContainer
          format={format}
          players={players}
          leagues={leagues}
        />
      </StyledTournamentSettings>
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

export default TournamentSettings

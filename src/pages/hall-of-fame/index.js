import { useState, useEffect } from 'react'
import Accolades from './components/Accolades'
import Showcase from './components/Showcase'
import PlayerStatsTable from './../../components/PlayerStatsTable'
import { api } from './../../api'
import axios from 'axios'
import { Oval } from 'react-loader-spinner'

const Trophies = () => {
  const [historicalData, setHistoricalData] = useState()

  const getHistoricalData = () => {
    const standings = axios.get(`${api}/statistics/all-time/standings`)
    // const playerInfoFromTournament = axios.get(
    //   `${api}/tournaments/${tournament}/standings/player-info`,
    // )

    Promise.all([standings]).then((values) => {
      const data = values.map((response) => response.data)
      setHistoricalData(data)
    })
  }

  useEffect(() => {
    getHistoricalData()
  }, [])

  return (
    <>
      <div style={{ margin: '2rem', textAlign: 'center' }}>Trofeos</div>
      <Showcase />
      <Accolades />
      {historicalData ? (
        <PlayerStatsTable stats={historicalData[0]} />
      ) : (
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
      )}
    </>
  )
}

export default Trophies

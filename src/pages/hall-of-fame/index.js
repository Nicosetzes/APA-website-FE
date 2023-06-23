import { useState, useEffect } from 'react'
import Accolades from './components/Accolades'
import Showcase from './components/Showcase'
import PlayerStatsTable from './../../components/PlayerStatsTable'
import FaceToFaceTable from './../../components/FaceToFaceTable'
import TeamRankings from './components/TeamRankings'
import { api } from './../../api'
import axios from 'axios'
import { Oval } from 'react-loader-spinner'

const Trophies = () => {
  const [historicalData, setHistoricalData] = useState()

  const getHistoricalData = () => {
    const standings = axios.get(`${api}/statistics/all-time/standings`)
    const faceToFace = axios.get(`${api}/statistics/all-time/face-to-face`)
    const teams = axios.get(`${api}/statistics/all-time/teams`)

    Promise.all([standings, faceToFace, teams]).then((values) => {
      const data = values.map((response) => response.data)
      setHistoricalData(data)
    })
  }

  useEffect(() => {
    getHistoricalData()
  }, [])

  return (
    <>
      {/* <div style={{ margin: '2rem', textAlign: 'center' }}>Trofeos</div> */}
      <Showcase />
      <Accolades />
      {historicalData ? (
        <>
          <PlayerStatsTable stats={historicalData[0]} />
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <TeamRankings
              title={'Mejores equipos'}
              subtitle={'(Puntos totales)'}
              teams={historicalData[2].completeStatsByPoints}
            />
            <TeamRankings
              title={'Mejores equipos'}
              subtitle={'(%Ef) / Mín. 10 partidos'}
              teams={historicalData[2].completeStatsByEffectiveness}
            />
          </div>

          {historicalData[1].map(({ p1, p2 }, index) => (
            <FaceToFaceTable stats={[p1, p2]} key={index} />
          ))}
        </>
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

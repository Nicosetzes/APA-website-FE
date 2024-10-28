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
  const [data, setData] = useState()

  const getData = () => {
    const standings = axios.get(`${api}/statistics/all-time/standings`)
    const faceToFace = axios.get(`${api}/statistics/all-time/face-to-face`)
    const teams = axios.get(`${api}/statistics/all-time/teams`)
    const tournaments = axios.get(`${api}/tournaments?status=finalized`)

    Promise.all([standings, faceToFace, teams, tournaments]).then((values) => {
      const dataFromDB = values.map((response) => response.data)
      setData(dataFromDB)
    })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      {/* <div style={{ margin: '2rem', textAlign: 'center' }}>Trofeos</div> */}
      {data ? (
        <>
          <Showcase tournaments={data[3]} />
          <Accolades />
          <PlayerStatsTable stats={data[0]} />
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <TeamRankings
              title={'Mejores equipos históricos'}
              subtitle={'Puntos totales'}
              teams={data[2].completeStatsByTotalPoints}
            />
            <TeamRankings
              title={'Mejores equipos por torneo'}
              subtitle={'% efectividad (mín. 10 partidos)'}
              teams={data[2].completeStatsByEffectiveness}
            />
          </div>

          {data[1].map(({ p1, p2 }, index) => (
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

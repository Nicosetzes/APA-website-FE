import Accolades from './components/Accolades'
import { Oval } from 'react-loader-spinner'
import Showcase from './components/Showcase'
import TeamRankings from './components/TeamRankings'
import { api } from 'api'
import axios from 'axios'
import { FaceToFaceTable, PrimaryLink } from 'views/components'
import { useState, useEffect } from 'react'

const Trophies = () => {
  const [tournamentsData, setTournamentsData] = useState(null)
  const [teamsData, setTeamsData] = useState(null)
  const [faceToFaceData, setFaceToFaceData] = useState(null)
  const [teamsStatsLoading, setTeamsStatsLoading] = useState(false)
  const [faceToFaceLoading, setFaceToFaceLoading] = useState(false)
  const [teamsStatsButtonState, setTeamsStatsButtonState] = useState(true)
  const [faceToFaceButtonState, setFaceToFaceButtonState] = useState(true)

  const getTournamentsData = () => {
    axios.get(`${api}/tournaments?status=finalized`).then((response) => {
      setTournamentsData(response.data)
    })
  }

  const getTeamsStats = () => {
    setTeamsStatsButtonState(false)
    setTeamsStatsLoading(true)
    axios
      .get(`${api}/statistics/all-time/teams`)
      .then((response) => {
        setTeamsData(response.data) // Guardamos los datos de equipos
        setTeamsStatsLoading(false) // Dejamos de mostrar el loading
      })
      .catch(() => {
        setTeamsStatsLoading(false) // Si ocurre un error, dejamos de mostrar el loading
        setTeamsStatsButtonState(true)
      })
  }

  const getFaceToFaceStats = () => {
    setFaceToFaceButtonState(false)
    setFaceToFaceLoading(true)
    axios
      .get(`${api}/statistics/all-time/face-to-face`)
      .then((response) => {
        setFaceToFaceData(response.data) // Guardamos los datos de equipos
        setFaceToFaceLoading(false) // Dejamos de mostrar el loading
      })
      .catch(() => {
        setFaceToFaceLoading(false) // Si ocurre un error, dejamos de mostrar el loading
        setFaceToFaceButtonState(true)
      })
  }

  console.log(teamsData)
  console.log(faceToFaceData)

  useEffect(() => {
    getTournamentsData()
  }, [])

  return (
    <>
      {tournamentsData ? (
        <Showcase tournaments={tournamentsData} />
      ) : (
        <div style={{ margin: 'auto', width: '100px' }}>
          <Oval
            height="80"
            width="80"
            radius="9"
            color="var(--green-900)"
            ariaLabel="three-dots-loading"
            $wrapperStyle
            $wrapperClass
          />
        </div>
      )}
      <Accolades />
      {teamsStatsButtonState && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '2rem 0 2.5rem 0',
          }}
        >
          <PrimaryLink
            asButton
            text={'Mostrar stats históricas (equipos)'}
            onClick={getTeamsStats}
          />
        </div>
      )}
      {teamsStatsLoading && (
        <div style={{ margin: 'auto', width: '100px' }}>
          <Oval
            height="80"
            width="80"
            radius="9"
            color="var(--green-900)"
            ariaLabel="three-dots-loading"
            $wrapperStyle
            $wrapperClass
          />
        </div>
      )}
      {teamsData && (
        <div>
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
              teams={teamsData.completeStatsByTotalPoints}
            />
            <TeamRankings
              title={'Mejores equipos por torneo'}
              subtitle={'% efectividad (mín. 10 partidos)'}
              teams={teamsData.completeStatsByEffectiveness}
            />
          </div>
        </div>
      )}
      {faceToFaceButtonState && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '2rem 0 2.5rem 0',
          }}
        >
          <PrimaryLink
            asButton
            text={'Mostrar historial APA'}
            onClick={getFaceToFaceStats}
          />
        </div>
      )}
      {faceToFaceLoading && (
        <div style={{ margin: 'auto', width: '100px' }}>
          <Oval
            height="80"
            width="80"
            radius="9"
            color="var(--green-900)"
            ariaLabel="three-dots-loading"
            $wrapperStyle
            $wrapperClass
          />
        </div>
      )}
      {faceToFaceData &&
        faceToFaceData.map(({ p1, p2 }, index) => (
          <FaceToFaceTable stats={[p1, p2]} key={index} />
        ))}
    </>
  )
}

export default Trophies

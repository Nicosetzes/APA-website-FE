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
  const [tournamentsData, setTournamentsData] = useState(null)
  const [playerStandingsData, setPlayerStandingsData] = useState(null)
  const [teamsData, setTeamsData] = useState(null)
  const [faceToFaceData, setFaceToFaceData] = useState(null)
  const [playerStandingsLoading, setPlayerStandingsLoading] = useState(false)
  const [teamsStatsLoading, setTeamsStatsLoading] = useState(false)
  const [faceToFaceLoading, setFaceToFaceLoading] = useState(false)
  const [playerStandingsButtonState, setPlayerStandingsButtonState] =
    useState(true)
  const [teamsStatsButtonState, setTeamsStatsButtonState] = useState(true)
  const [faceToFaceButtonState, setFaceToFaceButtonState] = useState(true)

  const getTournamentsData = () => {
    axios.get(`${api}/tournaments?status=finalized`).then((response) => {
      setTournamentsData(response.data)
    })
  }

  const getPlayerStandings = () => {
    setPlayerStandingsButtonState(false)
    setPlayerStandingsLoading(true)
    axios
      .get(`${api}/statistics/all-time/standings`)
      .then((response) => {
        setPlayerStandingsData(response.data) // Guardamos los datos de equipos
        setPlayerStandingsLoading(false) // Dejamos de mostrar el loading
      })
      .catch(() => {
        setPlayerStandingsLoading(false) // Si ocurre un error, dejamos de mostrar el loading
        setPlayerStandingsButtonState(true)
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
            color="green"
            ariaLabel="three-dots-loading"
            $wrapperStyle
            $wrapperClass
          />
        </div>
      )}
      <Accolades />
      {playerStandingsButtonState && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '2rem 0 2.5rem 0',
          }}
        >
          <button className="button-main" onClick={getPlayerStandings}>
            Mostrar stats históricas (jugadores)
          </button>
        </div>
      )}
      {playerStandingsLoading && (
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
      {playerStandingsData && <PlayerStatsTable stats={playerStandingsData} />}
      {teamsStatsButtonState && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '2rem 0 2.5rem 0',
          }}
        >
          <button className="button-main" onClick={getTeamsStats}>
            Mostrar stats históricas (equipos)
          </button>
        </div>
      )}
      {teamsStatsLoading && (
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
          <button className="button-main" onClick={getFaceToFaceStats}>
            Mostrar historial APA
          </button>
        </div>
      )}
      {faceToFaceLoading && (
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
      {faceToFaceData &&
        faceToFaceData.map(({ p1, p2 }, index) => (
          <FaceToFaceTable stats={[p1, p2]} key={index} />
        ))}
    </>
  )
}

export default Trophies

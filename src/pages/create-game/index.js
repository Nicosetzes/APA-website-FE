import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from './../../api'
import { Oval } from 'react-loader-spinner'
import axios from 'axios'

const CreateGame = () => {
  const { id } = useParams()

  const [tournamentData, setTournamentData] = useState()

  useEffect(() => {
    const fetchData = async () => {
      console.log('Hago el fetch de data')
      await axios
        .get(`${api}/tournaments/${id}/create-game`, {
          withCredentials: true,
          credentials: 'include',
        })
        .then(({ data }) => {
          setTournamentData(data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    fetchData()
  }, [])

  const [matchData, setMatchData] = useState({})

  const onHandleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setMatchData((values) => ({ ...values, [name]: value }))
  }

  const onHandleSubmit = (event) => {
    event.preventDefault()
    console.log(matchData)
  }

  if (tournamentData) {
    const { teams, players } = tournamentData
    return (
      <>
        <div>Crear partido</div>
        <form
          onSubmit={onHandleSubmit}
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            margin: '2rem auto',
          }}
        >
          <div style={{ display: 'flex' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span>Equipo 1: </span>
              <select name="teamP1" onChange={onHandleChange}>
                {teams.map(({ team, id }) => (
                  // <option key={id}>{name}</option>
                  <option key={id} value={team}>
                    {team}
                  </option>
                  // <img src={`${database}/logos/${id}`} />
                ))}
              </select>
              <span>Jugador 1: </span>
              <select name="playerP1" onChange={onHandleChange}>
                {players.map(({ name, id }) => (
                  // <option key={id}>{name}</option>
                  <option key={id} value={name}>
                    {name}
                  </option>
                  // <img src={`${database}/logos/${id}`} />
                ))}
              </select>
            </div>
            <div style={{ display: 'flex' }}>
              <input
                onChange={onHandleChange}
                value={matchData.scoreP1 || ''}
                name="scoreP1"
                label="Marcador"
              />
              <span>-</span>
              <input
                onChange={onHandleChange}
                value={matchData.scoreP2 || ''}
                name="scoreP2"
                label="Marcador"
              />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span>Equipo 2: </span>
              <select name="teamP2" onChange={onHandleChange}>
                {teams.map(({ team, id }) => (
                  // <option key={id}>{name}</option>
                  <option key={id} value={team}>
                    {team}
                  </option>
                ))}
              </select>
              <span>Jugador 2: </span>
              <select name="playerP2" onChange={onHandleChange}>
                {players.map(({ name, id }) => (
                  // <option key={id}>{name}</option>
                  <option key={id} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', margin: '2rem auto' }}>
            <span>Tipo de partido</span>
            <select name="type" onChange={onHandleChange}>
              <option value="regular">Regular</option>
              <option value="playin">Play-in</option>
              <option value="playoff">Play-off</option>
            </select>
          </div>
          <button type="submit">Enviar</button>
        </form>
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

export default CreateGame

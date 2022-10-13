import { api, database } from './../../../../api'
import { useState, useEffect } from 'react'
import { StyledPlayoffsMatch } from './styled'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CheckIcon from '@mui/icons-material/Check'
import Swal from 'sweetalert2'
import axios from 'axios'

const PlayoffsMatch = ({ topTeam, bottomTeam, matches }) => {
  const [matchScore, setMatchScore] = useState({})

  const [matchScoreFromDatabase, setMatchScoreFromDatabase] = useState()

  const findMatchResult = (topTeam, bottomTeam) => {
    if (topTeam && bottomTeam) {
      const filteredMatches = matches
        .filter(
          ({ teamP1, teamP2 }) =>
            (topTeam.id == teamP1.id && bottomTeam.id == teamP2.id) ||
            (topTeam.id == teamP2.id && bottomTeam.id == teamP1.id),
        )
        .map(({ teamP1, teamP2, scoreP1, scoreP2 }) => {
          return {
            teamP1,
            teamP2,
            scoreP1,
            scoreP2,
          }
        })

      filteredMatches.length && setMatchScoreFromDatabase(filteredMatches[0])
    }
  }

  useEffect(() => {
    findMatchResult(topTeam, bottomTeam)
  }, [])

  const onHandleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setMatchScore((values) => ({ ...values, [name]: value }))
  }

  const handleMatchSubmit = (event) => {
    event.preventDefault()
    const { scoreP1, penaltyScoreP1, scoreP2, penaltyScoreP2 } = matchScore

    if (!scoreP1 || !scoreP2) {
      Swal.fire({
        title: 'Error!',
        html: `Uno de los resultados no fue cargado. <br>
						Intente nuevamente`,
        color: '#000',
        background: 'rgb(240 240 245)',
        icon: 'error',
        confirmButtonText: 'Volver',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      })
      return
    }

    const playerP1 = {
      name: event.target.getAttribute('data-topteam-playername'),
      id: event.target.getAttribute('data-topteam-playerid'),
    }
    const teamP1 = {
      name: event.target.getAttribute('data-topteam-teamname'),
      id: event.target.getAttribute('data-topteam-teamid'),
    }
    const playerP2 = {
      name: event.target.getAttribute('data-bottomteam-playername'),
      id: event.target.getAttribute('data-bottomteam-playerid'),
    }
    const teamP2 = {
      name: event.target.getAttribute('data-bottomteam-teamname'),
      id: event.target.getAttribute('data-bottomteam-teamid'),
    }
    const type = 'playoff'
    const tournament = {
      name: event.target.getAttribute('data-tournamentname'),
      id: event.target.getAttribute('data-tournamentid'),
    }

    const match = {
      playerP1,
      teamP1,
      scoreP1: Number(scoreP1),
      penaltyScoreP1,
      playerP2,
      teamP2,
      scoreP2: Number(scoreP2),
      penaltyScoreP2,
      type,
      tournament,
    }

    Swal.fire({
      title: 'Partido cargado con éxito',
      html: `Aguarde unos instantes...`,
      color: '#000',
      background: 'rgb(240 240 245)',
      icon: 'success',
      timer: 3000,
      timerProgressBar: true,
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    })
    axios.post(`${api}/matches`, match).then((response) => {
      console.log(response)
      setTimeout(() => {
        location.reload()
      }, 3000)
    })
  }

  return (
    <StyledPlayoffsMatch
      className="match"
      data-topteam-playername={topTeam?.player.name}
      data-topteam-playerid={topTeam?.player.id}
      data-topteam-teamname={topTeam?.name} // Cambiar a futuro //
      data-topteam-teamid={topTeam?.id} // Cambiar a futuro //
      data-bottomteam-playername={bottomTeam?.player.name}
      data-bottomteam-playerid={bottomTeam?.player.id}
      data-bottomteam-teamname={bottomTeam?.name} // Cambiar a futuro //
      data-bottomteam-teamid={bottomTeam?.id} // Cambiar a futuro //
      data-tournamentname={topTeam?.tournament.name}
      data-tournamentid={topTeam?.tournament.id}
      onSubmit={(e) => {
        handleMatchSubmit(e)
      }}
    >
      <div className="match__teams">
        {topTeam && (
          <div className="match__teams-team">
            <div className="team-seed">
              <span>{topTeam.seed}</span>
            </div>
            <img
              className="team-logo"
              src={`${database}/logos/${topTeam.id}`}
            />
            <div className="team-name">
              <div>
                {topTeam.name} ({topTeam.player.name[0].toUpperCase()}
                {topTeam.player.name[1].toUpperCase()})
              </div>
              <div>
                {matchScoreFromDatabase && (
                  <span className="team-score">
                    {matchScoreFromDatabase.teamP1.id == topTeam.id
                      ? matchScoreFromDatabase.scoreP1
                      : matchScoreFromDatabase.scoreP2}
                  </span>
                )}
                <input
                  name="scoreP1"
                  value={matchScore.scoreP1 || ''}
                  onChange={onHandleChange}
                />
                <input
                  name="penaltyScoreP1"
                  value={matchScore.penaltyScoreP1 || ''}
                  onChange={onHandleChange}
                  placeholder="PEN"
                />
              </div>
            </div>
          </div>
        )}

        <Divider />
        {bottomTeam && (
          <div className="match__teams-team">
            <span className="team-seed">{bottomTeam.seed}</span>
            <img
              className="team-logo"
              src={`${database}/logos/${bottomTeam.id}`}
            />
            <div className="team-name">
              <div>
                {bottomTeam.name} ({bottomTeam.player.name[0].toUpperCase()}
                {bottomTeam.player.name[1].toUpperCase()})
              </div>
              <div>
                {matchScoreFromDatabase && (
                  <span className="team-score">
                    {matchScoreFromDatabase.teamP1.id == bottomTeam.id
                      ? matchScoreFromDatabase.scoreP1
                      : matchScoreFromDatabase.scoreP2}
                  </span>
                )}
                <input
                  name="scoreP2"
                  value={matchScore.scoreP2 || ''}
                  onChange={onHandleChange}
                />
                <input
                  name="penaltyScoreP2"
                  value={matchScore.penaltyScoreP2 || ''}
                  onChange={onHandleChange}
                  placeholder="PEN"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="match__confirmation">
        <IconButton type="submit" aria-label="delete" color="success">
          <CheckIcon />
        </IconButton>
      </div>
    </StyledPlayoffsMatch>
  )
}

export default PlayoffsMatch

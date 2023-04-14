import { useNavigate, createSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import { api, database } from './../../api'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const Match = ({ match }) => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { tournament } = useParams()

  const {
    playerP1,
    playerP2,
    teamP1,
    teamP2,
    scoreP1,
    scoreP2,
    played,
    _id,
    updatedAt,
  } = match
  const [matchScore, setMatchScore] = useState({
    scoreP1: scoreP1,
    scoreP2: scoreP2,
  })

  const onHandleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setMatchScore((values) => ({ ...values, [name]: Number(value) }))
  }

  const handleMatchSubmit = async (event) => {
    event.preventDefault()
    const { scoreP1, scoreP2 } = matchScore
    if (
      scoreP1 == null ||
      scoreP1 === '' ||
      scoreP2 == null ||
      scoreP2 === ''
    ) {
      // The comparison with == checks for both null and undefined //
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

    const data = {
      playerP1,
      playerP2,
      teamP1,
      teamP2,
      scoreP1,
      scoreP2,
    }

    Swal.fire({
      title: 'Resultado actualizado con éxito',
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
    axios
      .put(`${api}/tournaments/${tournament}/matches/update-game/${_id}`, data)
      .then(({ data }) => {
        console.log(data)
        // navigate({
        //   pathname: `/tournaments/${tournament}/matches`,
        // })
      })
  }

  const handleMatchRemoval = async () => {
    if (scoreP1 == null || scoreP2 == null) {
      // The comparison with == checks for both null and undefined //
      Swal.fire({
        title: 'Error!',
        html: `No puede borrar partidos que no tengan cargado un resultado. <br>
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

    Swal.fire({
      title: 'Eliminar',
      html: `¿Está seguro que desea eliminar este partido?`,
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Volver',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Eliminado!',
          'El partido ha sido eliminado de la base de datos.',
          'success',
        )
        axios
          .put(`${api}/tournaments/${tournament}/matches/delete-game/${_id}`)
          .then(({ data }) => {
            console.log(data)
            // navigate({
            //   pathname: `/tournaments/${tournament}/matches`,
            // })
          })
      }
    })
  }

  return (
    <form
      className="match"
      onSubmit={(e) => {
        handleMatchSubmit(e)
      }}
      style={{
        outline: played ? '#2aa723 3px solid' : '#dc3545 3px solid',
      }}
    >
      <div className="match-view">
        <div className="match-info">
          <textarea
            name="teamP1"
            wrap="soft"
            className="match-info__team"
            value={teamP1.name}
            readOnly
          >
            {teamP1.name}
          </textarea>
          {/* <Route path={`/tournaments/62e0b0a53d86565327b95a82/fixture?team=${teamP1.id}`} element={<FixtureId />} /> className="logo-link"> */}
          <img
            src={`${database}/logos/${teamP1.id}`}
            alt={match.teamP1}
            className="match-info__logo"
            // onClick={() => fixture.updateSelectedTeam(teamP1.id)}
            onClick={() => setSearchParams({ team: teamP1.id })}
          />
          <input
            name="playerP1"
            className="match-info__player"
            value={playerP1.name}
            readOnly
          />
        </div>
        <div className="match-score">
          <div className="match__container">
            <input
              name="scoreP1"
              className="match-score__goals"
              value={matchScore.scoreP1 ?? ''} // IMPORTANT // TODO: Handle react warning about not adding and onChange handler
              onChange={onHandleChange}
            />
            <span className="match-score__versus">vs</span>
            <input
              name="scoreP2"
              className="match-score__goals"
              value={matchScore.scoreP2 ?? ''} // IMPORTANT // TODO: Handle react warning about not adding and onChange handler
              onChange={onHandleChange}
            />
          </div>
          <div className="input__container">
            <IconButton type="submit" aria-label="edit" color="success">
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleMatchRemoval()}
              aria-label="delete"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </div>
          {/* <InputContainer
          id={_id}
          isFinished={match.scoreP1 !== undefined ? true : false}
        /> */}
        </div>
        <div className="match-info">
          <textarea
            name="teamP2"
            wrap="soft"
            className="match-info__team"
            value={teamP2.name}
            readOnly
          >
            {teamP2.name}
          </textarea>
          <img
            src={`${database}/logos/${teamP2.id}`}
            alt={teamP2.name}
            className="match-info__logo"
            onClick={() => setSearchParams({ team: teamP2.id })}
          />
          <input
            name="playerP2"
            className="match-info__player"
            value={playerP2.name}
            readOnly
          />
        </div>
      </div>
      {updatedAt && (
        <div className="match-date">
          Actualizado el: {updatedAt && new Date(updatedAt).toLocaleString()}{' '}
        </div>
      )}
    </form>
  )
}

export default Match

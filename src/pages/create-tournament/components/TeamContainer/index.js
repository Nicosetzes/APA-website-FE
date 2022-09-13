import { StyledForm } from './styled'
import { api, database } from './../../../../api'
import Checkbox from '../../../../components/Checkbox'
import { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const TeamContainer = ({ teams, players }) => {
  const MySwal = withReactContent(Swal)

  const [tournamentName, setTournamentName] = useState()

  const handleTournamentNameChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setTournamentName((values) => ({ ...values, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const allInputs = Array.from(event.target)

    console.log(allInputs)

    const players = allInputs
      .filter(({ name, checked }) => {
        return checked && name == 'player'
      })
      .map(({ id, value }) => {
        return {
          id,
          name: value,
        }
      })

    const selectedTeams = allInputs
      .filter(({ name, checked }) => {
        return checked && name == 'team'
      })
      .map(({ id, value, attributes }) => {
        return {
          id: id.split('|')[1],
          leagueId: id.split('|')[0],
          name: value,
          img: attributes.img.value,
        }
      })

    MySwal.fire({
      title: 'Nuevo torneo',
      html: (
        <div>
          <div>Está generando el siguiente torneo:</div>
          <br />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <div>
              Nombre:{' '}
              <span style={{ fontWeight: 700 }}>{tournamentName.name}</span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                margin: '0.5rem 0',
              }}
            >
              Jugadores:
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {players.map(({ name, id }, index) => (
                  <span key={id}>
                    {index + 1}.
                    <span style={{ fontWeight: 700, margin: '0 0.25rem' }}>
                      {name}
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                margin: '0 auto',
              }}
            >
              <div>Equipos: </div>
              <div
                style={{
                  maxWidth: '300px',
                }}
              >
                {selectedTeams.map(({ id, img }) => (
                  <img
                    key={id}
                    src={img}
                    style={{ width: '25px', margin: '0 0.25rem' }}
                  />
                ))}
              </div>
            </div>
            <div>
              Cantidad de equipos:{' '}
              {
                <span style={{ fontWeight: 700, margin: '1rem 0' }}>
                  {selectedTeams.length}
                </span>
              }
            </div>
          </div>
        </div>
      ),
      color: '#000',
      background: 'rgb(240 240 245)',
      icon: 'info',
      showCancelButton: true,
      showConfirmButton: true,
      allowOutsideClick: false,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'El torneo ha sido creado con éxito',
          text: 'Será redirigido en breve...',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true,
          showCancelButton: false,
          showConfirmButton: false,
          allowOutsideClick: false,
        })

        const { name } = tournamentName

        const teams = selectedTeams.map(({ id, leagueId, name }) => {
          return {
            id,
            leagueId,
            name,
          }
        })

        axios
          .post(`${api}/tournaments`, {
            name,
            players,
            teams,
          })
          .then((response) => {
            console.log(response.data)
          })
      } else {
        Swal.fire({
          title: 'Cancelado',
          text: 'La creación del torneo ha sido detenida, vuelva a intentarlo',
          icon: 'error',
          showCancelButton: false,
        })
      }
    })
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <div className="container__title">
        <div>¿Cuál será el nombre del torneo?</div>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={tournamentName?.name}
          onChange={handleTournamentNameChange}
        />
      </div>
      <div className="container__players">
        <div>¿Quiénes participarán del torneo?</div>
        {players.map(({ id, name }) => (
          <div key={id}>
            <Checkbox id={id} value={name} label={name} name={'player'} />
          </div>
        ))}
      </div>
      <div className="header">Equipos</div>
      <div className="container__teams">
        {teams.map(({ team, league }) => (
          <div key={team.id}>
            <Checkbox
              id={`${league.id}|${team.id}`}
              value={team.name}
              label={team.name}
              name={'team'}
              img={`${database}/leagues/${league.id}/teams/${team.id}/logo`}
            />
          </div>
        ))}
      </div>

      <input type="submit" className="form__submit" />
    </StyledForm>
  )
}

export default TeamContainer

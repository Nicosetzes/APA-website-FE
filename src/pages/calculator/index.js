import { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { api, database } from 'api'
import axios from 'axios'
import CalculatorStandingsTable from './components/CalculatorStandingsTable'
import IconButton from '@mui/material/IconButton'
import ClearIcon from '@mui/icons-material/Clear'
import { PageLoader } from 'views/components'

const Calculator = () => {
  const { tournament } = useParams()

  const location = useLocation()

  const teams = location?.state

  console.log(teams)

  const [calculatorTeams, setCalculatorTeams] = useState()

  const [calculatorStandings, setCalculatorStandings] = useState()

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${api}/tournaments/${tournament}/calculator`, {
          params: {
            teams: `${JSON.stringify(teams)}`,
          },
        })
        .then(({ data }) => {
          const { teams, standings } = data
          setCalculatorTeams(teams)
          setCalculatorStandings(standings)
        })
      // .catch((err) => {
      //   console.log(err)
      //   navigate('/')
      // })
    }
    fetchData()
  }, [])

  const [simulatedMatches, setSimulatedMatches] = useState([])

  const updateCalculatorStandings = (e, matchID) => {
    const winnerID = e.target.getAttribute('winner-id')
    const loserID = e.target.getAttribute('loser-id')
    const draw = e.target.getAttribute('is-draw')
    console.log(winnerID)
    console.log(loserID)
    console.log(draw)

    const isResultStored = simulatedMatches.filter(({ id }) => id == matchID)

    if (!isResultStored.length) {
      // El partido no se había simulado
      console.log('El partido no se había simulado')
      // Planteo las posibilidades

      if (!draw) {
        // Si !draw == true asigno 3pts y 1PG al ganador, y 1PP al perdedor. También sumo 1PJ a ambos.
        setCalculatorStandings(
          calculatorStandings.map(
            ({ team, player, played, wins, draws, losses, points }) => {
              if (team.id == winnerID)
                return {
                  team,
                  player,
                  played: played + 1,
                  wins: wins + 1,
                  draws,
                  losses,
                  points: points + 3,
                }
              else if (team.id == loserID)
                return {
                  team,
                  player,
                  played: played + 1,
                  wins: wins,
                  draws,
                  losses: losses + 1,
                  points: points,
                }
              else return { team, player, played, wins, draws, losses, points }
            },
          ),
        )
        setSimulatedMatches((currentMatches) => [
          ...currentMatches,
          { id: matchID, winner: winnerID, loser: loserID },
        ])
      } else {
        // Sino, el partido es empate. Asigno 1 punto y 1PJ a cada equipo //
        setCalculatorStandings(
          calculatorStandings.map(
            ({ team, player, played, wins, draws, losses, points }) => {
              if (team.id == winnerID || team.id == loserID)
                return {
                  team,
                  player,
                  played: played + 1,
                  wins: wins,
                  draws: draws + 1,
                  losses,
                  points: points + 1,
                }
              else return { team, player, played, wins, draws, losses, points }
            },
          ),
        )
        setSimulatedMatches((currentMatches) => [
          ...currentMatches,
          { id: matchID, winner: winnerID, loser: loserID, draw: true },
        ])
      }
    } else {
      // El partido YA se había simulado
      const match = isResultStored.at(0)
      // Los primeros 2 escenarios son si se vuelve a elegir el mismo resultado. Tan solo retorno.
      if (match.draw && draw) {
        console.log('Volví a clickear en empate')
        return
      } // Volví a clickear en empate
      else if (!match.draw && !draw && match.winner == winnerID) {
        console.log('Volví a elegir el mismo ganador')
        return // Volví a elegir el mismo ganador
      }
      // Si el resultado cambió, computo.
      else if (!match.draw && draw) {
        // Era victoria, el nuevo resultado es empate
        console.log('Era victoria, el nuevo resultado es empate')
        setCalculatorStandings(
          calculatorStandings.map(
            ({ team, player, played, wins, draws, losses, points }) => {
              // Computo todo lo necesario para el antiguo ganador (-2 pts, -1PG, +1PE)
              if (team.id == match.winner)
                return {
                  team,
                  player,
                  played: played,
                  wins: wins - 1,
                  draws: draws + 1,
                  losses,
                  points: points - 2,
                }
              // Ahora computo todo lo necesario para el perdedor (+1 pts, -1PP, +1PE)
              else if (team.id == match.loser)
                return {
                  team,
                  player,
                  played: played,
                  wins: wins,
                  draws: draws + 1,
                  losses: losses - 1,
                  points: points + 1,
                }
              else return { team, player, played, wins, draws, losses, points }
            },
          ),
        )
        // Modifico el partido guardado, para indicar que ahora es un empate!
        setSimulatedMatches(
          simulatedMatches.map(({ id, winner, loser, draw }) => {
            if (id == matchID) {
              return { id, winner, loser, draw: true }
            } else {
              return { id, winner, loser, draw }
            }
          }),
        )
      } else if (match.draw && !draw) {
        // Era empate, el nuevo resultado es victoria para un equipo
        console.log('Era empate, el nuevo resultado es victoria para un equipo')
        setCalculatorStandings(
          calculatorStandings.map(
            ({ team, player, played, wins, draws, losses, points }) => {
              // Computo todo lo necesario para el nuevo ganador (+2pts, +1PG, -1PE)
              if (team.id == winnerID)
                return {
                  team,
                  player,
                  played: played,
                  wins: wins + 1,
                  draws: draws - 1,
                  losses,
                  points: points + 2,
                }
              // Ahora computo todo lo necesario para el nuevo perdedor (-1pts, -1PE, +1PP)
              else if (team.id == loserID)
                return {
                  team,
                  player,
                  played: played,
                  wins: wins,
                  draws: draws - 1,
                  losses: losses + 1,
                  points: points - 1,
                }
              else return { team, player, played, wins, draws, losses, points }
            },
          ),
        )
        // Modifico el partido guardado, para indicar que dejó de ser un empate y ahora es victoria!
        setSimulatedMatches(
          simulatedMatches.map(({ id, winner, loser, draw }) => {
            if (id == matchID) {
              return { id, winner: winnerID, loser: loserID }
            } else {
              return { id, winner, loser, draw }
            }
          }),
        )
      } else {
        // Era victoria, el nuevo resultado es victoria para el otro equipo
        console.log(
          'Era victoria, el nuevo resultado es victoria para el otro equipo',
        )
        setCalculatorStandings(
          calculatorStandings.map(
            ({ team, player, played, wins, draws, losses, points }) => {
              // Computo todo lo necesario para el antiguo ganador (ahora perdedor, -3 pts, -1PG, +1PP)
              if (team.id == loserID)
                return {
                  team,
                  player,
                  played: played,
                  wins: wins - 1,
                  draws: draws,
                  losses: losses + 1,
                  points: points - 3,
                }
              // Ahora computo todo lo necesario para el antiguo perdedor (ahora ganador, +3 pts, +1PG, -1PP)
              else if (team.id == winnerID)
                return {
                  team,
                  player,
                  played: played,
                  wins: wins + 1,
                  draws: draws,
                  losses: losses - 1,
                  points: points + 3,
                }
              else return { team, player, played, wins, draws, losses, points }
            },
          ),
        )
        // Modifico el partido guardado, para indicar que se invirtieron los roles!
        setSimulatedMatches(
          simulatedMatches.map(({ id, winner, loser, draw }) => {
            if (id == matchID) {
              return { id, winner: winnerID, loser: loserID }
            } else return { id, winner, loser, draw }
          }),
        )
      }
    }
  }

  const assignColor = (matchID, teamID) => {
    const isResultStored = simulatedMatches.filter(({ id }) => id == matchID)
    if (isResultStored.length) {
      // El partido ya ha sido simulado
      const { winner, draw } = isResultStored.at(0)
      if (draw && !teamID) return '#17f117 2px solid'
      else if (!draw && winner == teamID) return '#17f117 2px solid'
      else return 'black 2px solid'
    } else return 'black 2px solid'
  }

  const deleteStoredResult = (matchID) => {
    const isResultStored = simulatedMatches.filter(({ id }) => id == matchID)

    if (!isResultStored.length) return // El partido no puede eliminarse porque aun no ha sido simulado
    const { winner, loser, draw } = isResultStored.at(0)

    // Debo modificar calculator standings para revertir los valores del partido eliminado
    if (draw) {
      // El partido era un empate
      setCalculatorStandings(
        calculatorStandings.map(
          ({ team, player, played, wins, draws, losses, points }) => {
            if (team.id == winner || team.id == loser)
              return {
                team,
                player,
                played: played - 1,
                wins,
                draws: draws - 1,
                losses,
                points: points - 1,
              }
            else return { team, player, played, wins, draws, losses, points }
          },
        ),
      )
    } else {
      // Si el partido no era empate, cambio particularmente para cada equipo
      setCalculatorStandings(
        calculatorStandings.map(
          ({ team, player, played, wins, draws, losses, points }) => {
            if (team.id == winner)
              // El antiguo ganador (ahora reseteo sus números)
              return {
                team,
                player,
                played: played - 1,
                wins: wins - 1,
                draws,
                losses,
                points: points - 3,
              }
            else if (team.id == loser)
              // El antiguo perdedor (ahora reseteo sus números)
              return {
                team,
                player,
                played: played - 1,
                wins,
                draws,
                losses: losses - 1,
                points: points,
              }
            else return { team, player, played, wins, draws, losses, points }
          },
        ),
      )
    }

    // Por último, elimino el partido de simulatedMatches
    setSimulatedMatches(simulatedMatches.filter(({ id }) => id != matchID))
  }

  console.log('Simulated Matches')
  console.log(simulatedMatches)

  if (calculatorTeams && calculatorStandings) {
    console.log('calculatorTeams')
    console.log(calculatorTeams)

    console.log('calculatorStandings')
    console.log(calculatorStandings)

    return (
      <>
        <div
          style={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'space-evenly',
          }}
        >
          {calculatorTeams.map(({ team, matches }) => (
            <div
              key={team.id}
              style={{
                alignItems: 'center',
                display: 'flex',
                flexFlow: 'column wrap',
                margin: '0.5rem',
                minWidth: '275px',
              }}
            >
              <div>
                {' '}
                <img
                  src={`${database}/logos/${team.id}`}
                  alt={team.id}
                  style={{ margin: '0.5rem', width: '45px' }}
                />
                {/* <span>Cantidad de partidos: {matches.length}</span> */}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                {matches.map(({ playerP1, teamP1, playerP2, teamP2, _id }) => (
                  <div
                    key={_id}
                    style={{
                      display: 'flex',
                      flexFlow: 'row nowrap',
                      margin: '0.5rem 0',
                    }}
                  >
                    <div
                      onClick={(e) => updateCalculatorStandings(e, _id)}
                      winner-id={teamP1.id} // custom attribute, so I can capture the team ID with the onClick
                      loser-id={teamP2.id} // custom attribute, so I can capture the team ID with the onClick
                      style={{
                        alignItems: 'center',
                        cursor: 'pointer',
                        display: 'flex',
                        flexBasis: '30%',
                        flexFlow: 'column wrap',
                        margin: '0 0.25rem',
                        outline: assignColor(_id, teamP1.id),
                        padding: '0.5rem',
                      }}
                    >
                      <img
                        onClick={(e) => updateCalculatorStandings(e, _id)}
                        winner-id={teamP1.id} // custom attribute, so I can capture the team ID with the onClick
                        loser-id={teamP2.id} // custom attribute, so I can capture the team ID with the onClick
                        src={`${database}/logos/${teamP1.id}`}
                        alt={teamP1.name}
                        style={{ margin: '0.5rem', width: '35px' }}
                      />{' '}
                      ({playerP1.name})
                    </div>
                    <div
                      onClick={(e) => updateCalculatorStandings(e, _id)}
                      winner-id={teamP1.id} // custom attribute, so I can capture the team ID with the onClick
                      loser-id={teamP2.id} // custom attribute, so I can capture the team ID with the onClick
                      is-draw={'true'} // custom attribute, so I can capture the team ID with the onClick. Must be a string!
                      style={{
                        alignItems: 'center',
                        cursor: 'pointer',
                        display: 'flex',
                        flexBasis: '30%',
                        justifyContent: 'center',
                        margin: '0 0.25rem',
                        outline: assignColor(_id),
                        padding: '0.5rem',
                      }}
                    >
                      <span
                        onClick={(e) => updateCalculatorStandings(e, _id)}
                        winner-id={teamP1.id} // custom attribute, so I can capture the team ID with the onClick
                        loser-id={teamP2.id} // custom attribute, so I can capture the team ID with the onClick
                        is-draw={'true'} // custom attribute, so I can capture the team ID with the onClick. Must be a string!
                        style={{ fontSize: '1.5rem' }}
                      >
                        E
                      </span>
                    </div>
                    <div
                      onClick={(e) => updateCalculatorStandings(e, _id)}
                      winner-id={teamP2.id} // custom attribute, so I can capture the team ID with the onClick
                      loser-id={teamP1.id} // custom attribute, so I can capture the team ID with the onClick
                      style={{
                        alignItems: 'center',
                        cursor: 'pointer',
                        display: 'flex',
                        flexBasis: '30%',
                        flexFlow: 'column wrap',
                        margin: '0 0.25rem',
                        outline: assignColor(_id, teamP2.id),
                        padding: '0.5rem',
                      }}
                    >
                      <img
                        onClick={(e) => updateCalculatorStandings(e, _id)}
                        winner-id={teamP2.id} // custom attribute, so I can capture the team ID with the onClick
                        loser-id={teamP1.id} // custom attribute, so I can capture the team ID with the onClick
                        src={`${database}/logos/${teamP2.id}`}
                        alt={teamP2.name}
                        style={{ margin: '0.5rem', width: '35px' }}
                      />{' '}
                      ({playerP2.name})
                    </div>
                    <IconButton
                      aria-label="edit"
                      color="error"
                      sx={{
                        height: 'fit-content',
                        margin: '0 0 0 0.75rem',
                        padding: '0.25rem',
                      }}
                      onClick={() => deleteStoredResult(_id)}
                    >
                      <ClearIcon />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <CalculatorStandingsTable
          standings={calculatorStandings}
          calculatorTeams={calculatorTeams}
        />
      </>
    )
  } else {
    return <PageLoader />
  }
}

export default Calculator

import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import TagTeamsMatchPreview from '../../components/TagTeamsMatchPreview'
import BreadCrumbsMUI from './../../components/BreadCrumbsMUI'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useMediaQuery } from 'react-responsive'
import FormGroup from '@mui/material/FormGroup'
import { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner'
import Switch from '@mui/material/Switch'
import { motion } from 'framer-motion'
import { api } from './../../api'

import axios from 'axios'
import FixtureContainer from '../../components/FixtureContainer'

const TagTeamsGenerator = () => {
  // const isL = useMediaQuery({ query: '(min-width: 992px)' })
  // const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 600px)' })
  const isXS = useMediaQuery({ query: '(min-width: 375px)' })

  const navigate = useNavigate()

  const { tournament } = useParams()

  const [tournamentData, setTournamentData] = useState()

  const getTournamentData = () => {
    console.log('Traigo la data del torneo')
    axios
      .get(`${api}/tournaments/${tournament}`)
      .then(({ data }) => setTournamentData(data))
  }

  useEffect(() => {
    getTournamentData()
  }, [])

  console.log(tournamentData)

  const [playerSwitchState, setPlayerSwitchState] = useState([])

  const handlePlayerSwitchChange = (event) => {
    event.target.checked
      ? setPlayerSwitchState([
          ...playerSwitchState,
          { id: event.target.value, name: event.target.name },
        ])
      : setPlayerSwitchState((currentState) =>
          currentState.filter(({ id }) => id !== event.target.value),
        )
  }

  const [formatSwitchState, setFormatSwitchState] = useState([])

  const handleFormatSwitchChange = (event) => {
    event.target.checked
      ? setFormatSwitchState([...formatSwitchState, event.target.value])
      : setFormatSwitchState((currentState) =>
          currentState.filter((id) => id !== event.target.value),
        )
  }

  const [matchSettings, setMatchSettings] = useState()

  const randomizeMatch = (players, teams) => {
    console.log(playerSwitchState)
    console.log(formatSwitchState)

    console.log(players)
    console.log(teams)

    const formattedTeams = teams.map(({ team }) => {
      return { id: team.id, name: team.name }
    })

    const randomizedTeams = formattedTeams.sort(() => 0.5 - Math.random())

    let firstTeamIndex = Math.floor(Math.random() * randomizedTeams.length)
    let secondTeamIndex = Math.floor(Math.random() * randomizedTeams.length)

    // Genero un while por si se repite el número sorteado

    while (firstTeamIndex === secondTeamIndex) {
      secondTeamIndex = Math.floor(Math.random() * randomizedTeams.length)
    }

    const teamP1 = randomizedTeams.at(firstTeamIndex)
    const teamP2 = randomizedTeams.at(secondTeamIndex)

    const playersLottery = [
      ...playerSwitchState.sort(() => 0.5 - Math.random()),
    ]

    const firstPlayerIndex = Math.floor(
      Math.random() * playersLottery.sort(() => 0.5 - Math.random()).length,
    )

    const playerP1 = playersLottery.at(firstPlayerIndex)

    playersLottery.splice(firstPlayerIndex, 1)

    const secondPlayerIndex = Math.floor(
      Math.random() * playersLottery.sort(() => 0.5 - Math.random()).length,
    )

    const playerP2 = playersLottery.at(secondPlayerIndex)

    playersLottery.splice(secondPlayerIndex, 1)

    const playerP3 = playersLottery.at(0)

    let playerP4

    if (playerSwitchState.length == 4 && formatSwitchState == '4') {
      playerP4 = playersLottery.at(-1)
    }

    setMatchSettings({ playerP1, playerP2, playerP3, playerP4, teamP1, teamP2 })
  }

  const [fixtureData, setFixtureData] = useState()

  const getFixtureData = () => {
    console.log('Traigo el fixture del torneo')

    axios.get(`${api}/tournaments/${tournament}/fixture`).then(({ data }) => {
      setFixtureData(data)
    })
  }

  useEffect(() => {
    getFixtureData()
  }, [])

  if (tournamentData) {
    const { name, players, teams, format } = tournamentData

    const breadCrumbsLinks = [
      { name: 'Home', route: '' },
      { name: 'Torneos', route: 'tournaments' },
      {
        name: `${name}`,
        route: `tournaments/${tournament}`,
      },
      {
        name: 'Generador APA',
        route: `tournaments/${tournament}/tag-teams-generator`,
      },
    ]
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <BreadCrumbsMUI links={breadCrumbsLinks} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormGroup sx={{ alignItems: 'center' }}>
            <div style={{ margin: '1rem' }}>¿Qué jugadores participarán?</div>
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'wrap',
                margin: '0 1.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: isSm ? 'row' : 'column',
                  flexWrap: 'wrap',
                  justifyContent: 'space-evenly',
                  margin: '0 1.5rem',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    margin: isSm ? '0' : '0 auto',
                    padding: '0.75rem',
                  }}
                >
                  Jugadores
                </div>
                {players.map(({ name, id }) => (
                  <FormControlLabel
                    key={id}
                    control={
                      <Switch
                        color="warning"
                        checked={playerSwitchState
                          .map(({ id }) => id)
                          .includes(id)}
                        name={name}
                        onChange={handlePlayerSwitchChange}
                        value={id}
                      />
                    }
                    label={name}
                  />
                ))}
              </div>
            </div>
          </FormGroup>
          <FormGroup sx={{ alignItems: 'center' }}>
            <div style={{ margin: '1rem' }}>¿Cómo se organizan?</div>
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'wrap',
                margin: '0 1.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: isSm ? 'row' : 'column',
                  flexWrap: 'wrap',
                  justifyContent: 'space-evenly',
                  margin: '0 1.5rem',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    margin: isSm ? '0' : '0 auto',
                    padding: '0.75rem',
                  }}
                >
                  Formato
                </div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formatSwitchState.includes('3')}
                      color="warning"
                      disabled={
                        playerSwitchState.length < 3 ||
                        (formatSwitchState.length === 1 &&
                          !formatSwitchState.includes('3'))
                      }
                      onChange={handleFormatSwitchChange}
                      value={'3'}
                    />
                  }
                  label={'2 vs 1'}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formatSwitchState.includes('4')}
                      color="warning"
                      disabled={
                        playerSwitchState.length < 4 ||
                        (formatSwitchState.length === 1 &&
                          !formatSwitchState.includes('4'))
                      }
                      onChange={handleFormatSwitchChange}
                      value={'4'}
                    />
                  }
                  label={'2 vs 2'}
                />
              </div>
            </div>
          </FormGroup>
          <button
            className="button-main"
            onClick={() => randomizeMatch(players, teams)}
            style={{
              marginBottom: '1rem',
            }}
          >
            Generar
          </button>
        </div>
        {matchSettings && (
          <TagTeamsMatchPreview
            getFixtureData={getFixtureData}
            match={matchSettings}
          />
        )}
        {fixtureData && fixtureData.matches.length ? (
          <FixtureContainer
            format={format}
            matches={fixtureData.matches}
            getFixtureData={getFixtureData}
          />
        ) : null}
      </motion.div>
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

export default TagTeamsGenerator

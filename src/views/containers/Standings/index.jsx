import { Oval } from 'react-loader-spinner'
import { SpinnerContainer } from './styled'
import StandingsTable from './components/StandingsTable'
import { api } from 'api'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useOutletContext } from 'react-router-dom'
import {
  Card,
  ControlsRow,
  GroupButton,
  GroupButtons,
  GroupsTitle,
  Header,
  HeaderContainer,
  StandingsLink,
  StandingsLinks,
  Title,
} from './styled'
import { PageLoader, PlayerStatsTable } from 'views/components'
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'

const Standings = () => {
  const [tournamentData, setTournamentData] = useState()

  const { tournamentSummary } = useOutletContext()

  const [searchParams, setSearchParams] = useSearchParams()

  const { tournament } = useParams()

  const navigate = useNavigate()

  const playerParams = (param) => {
    return { player: param }
  }
  const teamParams = (param) => {
    return { team: param }
  }

  const goToSpecificFixture = (id, params) => {
    const group = searchParams.get('group')
    if (isNaN(Number(params))) {
      // Navigate by player (state), keep current group context if present
      return navigate(
        {
          pathname: `/tournaments/${id}/fixture`,
          search: group ? `?${createSearchParams({ group })}` : undefined,
        },
        { state: playerParams(params) },
      )
    } else {
      // Navigate by team (query), also include current group if present
      const query = group
        ? createSearchParams({ ...teamParams(params), group }).toString()
        : createSearchParams(teamParams(params)).toString()
      return navigate({
        pathname: `/tournaments/${id}/fixture`,
        search: `?${query}`,
      })
    }
  }

  const onHandleGroupChange = (group) => {
    setSearchParams({ group })
  }

  const [loading, setLoading] = useState(false)

  const getTournamentData = useCallback(() => {
    const controller = new AbortController()
    setLoading(true)
    const group = searchParams.get('group')

    const standParams = group
      ? { params: { group }, signal: controller.signal }
      : { signal: controller.signal }

    const standingsReq = axios.get(
      `${api}/tournaments/${tournament}/standings/table`,
      standParams,
    )
    const playerReq = axios.get(
      `${api}/tournaments/${tournament}/standings/player-info`,
      standParams,
    )

    Promise.all([standingsReq, playerReq]).then((values) => {
      const data = values.map((response) => response.data)
      setTournamentData(data)
      setLoading(false)
    })

    return () => controller.abort()
  }, [api, tournament, searchParams])

  useEffect(() => {
    const cleanup = getTournamentData()
    return cleanup
  }, [getTournamentData])

  if (tournamentSummary && tournamentData) {
    const { format, groups } = tournamentSummary
    const { standings } = tournamentData[0]
    const playerStats = tournamentData[1]

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <HeaderContainer>
          <Header>
            <Title>Clasificación</Title>
            <StandingsLinks>
              {(format === 'league_playin_playoff' ||
                format === 'champions_league' ||
                format === 'world_cup') && (
                <StandingsLink to={`/tournaments/${tournament}/playoffs`}>
                  Ir a Playoffs
                </StandingsLink>
              )}
              <StandingsLink to={`/tournaments/${tournament}/fixture`}>
                Ir a Fixture
              </StandingsLink>
            </StandingsLinks>
          </Header>

          {groups?.length ? (
            <Card>
              <ControlsRow>
                <GroupsTitle>Grupos</GroupsTitle>
                <GroupButtons>
                  {groups.map((group) => {
                    const active =
                      (group === 'A' && !searchParams.get('group')) ||
                      group === searchParams.get('group')
                    return (
                      <GroupButton
                        key={group}
                        $active={active}
                        onClick={() => onHandleGroupChange(group)}
                      >
                        {group}
                      </GroupButton>
                    )
                  })}
                </GroupButtons>
              </ControlsRow>
            </Card>
          ) : null}
        </HeaderContainer>

        {loading ? (
          <SpinnerContainer>
            <Oval
              height="80"
              width="80"
              color="var(--green-900)"
              ariaLabel="loading"
            />
          </SpinnerContainer>
        ) : (
          <>
            <StandingsTable
              tournament={tournament}
              format={format}
              standings={standings}
              onHandle={goToSpecificFixture}
            />
            <PlayerStatsTable stats={playerStats} />
          </>
        )}
      </motion.div>
    )
  } else {
    return <PageLoader />
  }
}

export default Standings

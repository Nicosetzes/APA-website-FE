import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import PlayerStatsTable from './../../components/PlayerStatsTable'
import BreadCrumbsMUI from './../../components/BreadCrumbsMUI'
import StandingsTable from './components/StandingsTable'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { api } from './../../api'
import axios from 'axios'
import PageLoader from '../../components/PageLoader'
import { SpinnerContainer } from './styled'
import { Oval } from 'react-loader-spinner'
import {
  HeaderContainer,
  Header,
  Title,
  FixtureLink,
  Card,
  ControlsRow,
  GroupsTitle,
  GroupButtons,
  GroupButton,
} from './styled'

const Standings = () => {
  const [tournamentData, setTournamentData] = useState()

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

    const tournamentInfo = axios.get(`${api}/tournaments/${tournament}`, {
      signal: controller.signal,
    })

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

    Promise.all([tournamentInfo, standingsReq, playerReq])
      .then((values) => {
        const data = values.map((response) => response.data)
        setTournamentData(data)
        setLoading(false)
      })
      .catch((err) => {
        if (axios.isCancel?.(err) || err?.name === 'CanceledError') return
        console.error(err)
        setLoading(false)
      })

    return () => controller.abort()
  }, [api, tournament, searchParams])

  const searchKey = useMemo(() => searchParams.toString(), [searchParams])
  useEffect(() => {
    const cleanup = getTournamentData()
    return cleanup
  }, [getTournamentData, searchKey])

  if (tournamentData) {
    const { name, format, groups } = tournamentData[0]
    const { standings } = tournamentData[1] // Index 0 because of the order in which I invoked the promises call in Promise.all //
    const playerStats = tournamentData[2]

    const breadCrumbsLinks = [
      { name: 'Home', route: '' },
      { name: 'Torneos', route: 'tournaments' },
      {
        name: `${name}`,
        route: `tournaments/${tournament}`,
      },
      {
        name: 'Clasificación',
        route: `tournaments/${tournament}/standings`,
      },
    ]
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <BreadCrumbsMUI links={breadCrumbsLinks} />
        <HeaderContainer>
          <Header>
            <Title>Clasificación</Title>
            <FixtureLink to={`/tournaments/${tournament}/fixture`}>
              Ir a Fixture
            </FixtureLink>
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

import { Loader } from 'views/components'
import { SpinnerContainer } from './styled'
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
import { PageLoader, StandingsTable } from 'views/components'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'

const TournamentStandings = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const { tournament } = useParams()

  const { tournamentData } = useOutletContext()
  const [standingsData, setStandingsData] = useState()

  const navigate = useNavigate()

  const goToSpecificFixture = (id, param) => {
    const group = searchParams.get('group')
    const search = new URLSearchParams()

    if (group) {
      search.set('group', group)
    }

    if (isNaN(Number(param))) {
      navigate(
        {
          pathname: `/tournaments/${id}/fixture`,
          search: search.toString() || undefined,
        },
        {
          state: { player: param },
        },
      )
      return
    }

    search.set('team', param)

    navigate({
      pathname: `/tournaments/${id}/fixture`,
      search: `?${search.toString()}`,
    })
  }

  const selectedGroup = searchParams.get('group')

  const onHandleGroupChange = (group) => {
    if (selectedGroup === group) {
      setSearchParams({})
    } else {
      setSearchParams({ group })
    }
  }

  const [loading, setLoading] = useState(false)

  const getTournamentData = useCallback(() => {
    const controller = new AbortController()
    setLoading(true)
    axios
      .get(`${api}/tournaments/${tournament}/standings/table`, {
        signal: controller.signal,
      })
      .then(({ data }) => {
        setStandingsData(data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [api, tournament])

  useEffect(() => {
    const cleanup = getTournamentData()
    return cleanup
  }, [getTournamentData])

  if (tournamentData && standingsData) {
    const { format, groups } = tournamentData
    const { standings } = standingsData

    const displayedStandings = selectedGroup
      ? standings.filter(({ group }) => group === selectedGroup)
      : standings

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
              {[
                'champions_league',
                'league_playin_playoff',
                'world_cup',
                'world_cup_2026',
              ].includes(format) && (
                <StandingsLink to={`/tournaments/${tournament}/playoffs`}>
                  Playoffs
                </StandingsLink>
              )}
              <StandingsLink to={`/tournaments/${tournament}/fixture`}>
                Fixture
              </StandingsLink>
            </StandingsLinks>
          </Header>
          {groups?.length ? (
            <Card>
              <ControlsRow>
                <GroupsTitle>Grupos</GroupsTitle>
                <GroupButtons>
                  <GroupButton
                    $active={!selectedGroup}
                    onClick={() => setSearchParams({})}
                  >
                    Todos
                  </GroupButton>
                  {groups.map((group) => (
                    <GroupButton
                      key={group}
                      $active={group === selectedGroup}
                      onClick={() => onHandleGroupChange(group)}
                    >
                      {group}
                    </GroupButton>
                  ))}
                </GroupButtons>
              </ControlsRow>
            </Card>
          ) : null}
        </HeaderContainer>

        {loading ? (
          <SpinnerContainer>
            <Loader />
          </SpinnerContainer>
        ) : (
          <>
            {displayedStandings.map(({ group, teams }) => (
              <StandingsTable
                key={group ?? 'standings'}
                format={format}
                standings={teams}
                title={group ? `Grupo ${group}` : null}
                tournament={tournament}
                onHandle={
                  format === 'world_cup_2026_preview'
                    ? null
                    : goToSpecificFixture
                }
              />
            ))}
          </>
        )}
      </motion.div>
    )
  } else {
    return <PageLoader />
  }
}

export default TournamentStandings

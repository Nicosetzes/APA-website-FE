import { Oval } from 'react-loader-spinner'
import Pagination from '@mui/material/Pagination'
import Swal from 'sweetalert2'
import { apiClient } from 'api/axiosConfig'
import { motion } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'
import { useOutletContext } from 'react-router-dom'
import withReactContent from 'sweetalert2-react-content'
import {
  Card,
  ClearButton,
  ControlsRow,
  Divider,
  GroupsTitle,
  FiltersContainer,
  FiltersTitle,
  GroupButton,
  GroupButtons,
  Header,
  HeaderContainer,
  PlayerToggle,
  SpinnerContainer,
  StandingsLink,
  StatusChip,
  StatusRow,
  TeamInfoRow,
  Title,
} from './styled'
import { FixtureContainer, PageLoader } from 'views/components'
import { api, database } from 'api'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'

const Fixture = () => {
  const isXS = useMediaQuery({ query: '(min-width: 375px)' })

  const MySwal = withReactContent(Swal)

  const { tournament } = useParams()

  const { tournamentSummary } = useOutletContext()

  const [searchParams, setSearchParams] = useSearchParams()

  const location = useLocation()

  const initialPlayer = location?.state?.player

  const [switchState, setSwitchState] = useState(
    initialPlayer ? [initialPlayer] : [],
  )

  const setParams = useCallback(
    (next) => {
      const current = Object.fromEntries(searchParams.entries())
      const merged = { ...current, ...next }
      // remove nullish/empty values so URL stays clean
      Object.keys(merged).forEach((k) => {
        if (merged[k] === undefined || merged[k] === null || merged[k] === '') {
          delete merged[k]
        }
      })
      setSearchParams(merged)
    },
    [searchParams, setSearchParams],
  )

  const handleSwitchChange = useCallback(
    (event) => {
      // Reset to first page and keep current filters
      setParams({ page: 0 })

      const id = event.target.name
      const checked = event.target.checked
      setSwitchState((prev) =>
        checked ? [...prev, id] : prev.filter((item) => item !== id),
      )
    },
    [setParams],
  )

  const [fixtureData, setFixtureData] = useState()
  const [fixtureLoading, setFixtureLoading] = useState(false)

  const getFixtureData = useCallback(() => {
    const controller = new AbortController()
    setFixtureLoading(true)
    const page = searchParams.get('page')
    const team = searchParams.get('team')
    const group = searchParams.get('group')

    const params = {
      // Only include defined params to keep URL clean
      ...(page ? { page } : {}),
      ...(team ? { team } : {}),
      ...(group ? { group } : {}),
      ...(switchState.length ? { players: JSON.stringify(switchState) } : {}),
    }

    apiClient
      .get(`${api}/tournaments/${tournament}/fixture`, {
        params,
        signal: controller.signal,
      })
      .then(({ data }) => {
        setFixtureData(data)
        setFixtureLoading(false)
      })
      .catch((err) => {
        if (apiClient.isCancel?.(err) || err?.name === 'CanceledError') return
        console.error(err)
        setFixtureLoading(false)
      })

    return () => controller.abort()
  }, [api, tournament, searchParams, switchState])

  // Track search params by their string representation to avoid unnecessary reruns
  const searchKey = useMemo(() => searchParams.toString(), [searchParams])
  useEffect(() => {
    const cleanup = getFixtureData()
    return cleanup
  }, [getFixtureData, searchKey])

  const handlePageChange = useCallback(
    (event, value) => {
      setParams({ page: Number(value) - 1 })
    },
    [setParams],
  )

  const onHandleGroupChange = useCallback(
    (group) => {
      // If changing groups, clear any active team filter since teams are group-specific
      const currentGroup = searchParams.get('group')
      if (currentGroup && currentGroup === group) {
        setParams({ group, page: 0 })
      } else {
        // Passing an empty string removes the key in setParams cleaning step
        setParams({ group, page: 0, team: '' })
      }
    },
    [setParams, searchParams],
  )

  const resetTeamFilter = useCallback(() => {
    const current = Object.fromEntries(searchParams.entries())
    delete current.team
    // Keep current page/group if present
    setSearchParams(current)
  }, [searchParams, setSearchParams])

  const fixtureGeneration = (group = null) => {
    apiClient
      .post(`${api}/tournaments/${tournament}/fixture`, {
        group,
      })
      .then(({ data }) => {
        MySwal.fire({
          background: `rgba(28, 25, 25, 0.95)`,
          color: `#fff`,
          icon: 'success',
          iconColor: '#18890e',
          toast: true,
          title: `Fixture ${
            group ? `para la zona ${group}` : `del torneo`
          } creado con éxito`,
          position: 'top-end',
          showConfirmButton: false,
          text: 'Aguarde unos instantes...',
          timer: 1500,
          timerProgressBar: true,
          customClass: { timerProgressBar: 'toast-progress-dark' },
          didOpen: (toast) => {
            getFixtureData()
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  if (tournamentSummary && fixtureData) {
    const { format, name, players, groups } = tournamentSummary
    const {
      matches,
      amountOfNotPlayedMatches,
      amountOfTotalMatches,
      totalPages,
    } = fixtureData

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <HeaderContainer>
          <Header>
            <Title>Fixture</Title>
            <StandingsLink to={`/tournaments/${tournament}/standings`}>
              Ir a Clasificación
            </StandingsLink>
          </Header>

          <Card>
            {groups?.length ? (
              <ControlsRow>
                <GroupsTitle>Grupos</GroupsTitle>
                <GroupButtons>
                  {groups.map((g) => {
                    const active =
                      (groups.includes(searchParams.get('group'))
                        ? searchParams.get('group') || 'A'
                        : groups?.[0] || 'A') === g
                    return (
                      <GroupButton
                        key={g}
                        $active={active}
                        onClick={() => onHandleGroupChange(g)}
                      >
                        {g}
                      </GroupButton>
                    )
                  })}
                </GroupButtons>
              </ControlsRow>
            ) : (
              <ControlsRow>
                <GroupsTitle>Zona única</GroupsTitle>
              </ControlsRow>
            )}

            <Divider />

            <div>
              <FiltersTitle>Jugadores (máx 2)</FiltersTitle>
              <FiltersContainer>
                {players.map(({ name, id }) => (
                  <PlayerToggle key={id}>
                    <input
                      type="checkbox"
                      disabled={
                        switchState.length === 2 && !switchState.includes(id)
                      }
                      checked={switchState.includes(id)}
                      onChange={handleSwitchChange}
                      name={id}
                    />
                    <span>{name}</span>
                  </PlayerToggle>
                ))}
              </FiltersContainer>
            </div>

            <StatusRow>
              <StatusChip $dim={fixtureLoading}>
                {`${amountOfNotPlayedMatches} partidos restantes de ${amountOfTotalMatches} en TOTAL`}
              </StatusChip>
              {searchParams.get('team') && (
                <TeamInfoRow>
                  <span>Equipo seleccionado:</span>
                  <img
                    src={`${database}/logos/${searchParams.get('team')}`}
                    alt="team"
                    style={{ width: '25px', margin: '0 0.5rem' }}
                  />
                  <ClearButton onClick={() => resetTeamFilter()}>
                    Limpiar
                  </ClearButton>
                </TeamInfoRow>
              )}
            </StatusRow>
          </Card>
        </HeaderContainer>

        {fixtureLoading ? (
          <SpinnerContainer>
            <Oval
              height="80"
              width="80"
              color="var(--green-900)"
              ariaLabel="loading"
            />
          </SpinnerContainer>
        ) : matches.length ? (
          <>
            <FixtureContainer
              format={format}
              matches={matches}
              getFixtureData={getFixtureData}
            />
            <Pagination
              color="primary"
              count={totalPages}
              name={'page'}
              page={Number(searchParams.get('page')) + 1}
              shape="rounded"
              size={!isXS ? 'small' : 'medium'}
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '0.75rem 0.5rem',
              }}
              variant="outlined"
              onChange={handlePageChange}
            />
          </>
        ) : searchParams.get('team') ? (
          <div
            style={{
              display: 'flex',
              fontSize: '1.125rem',
              fontWeight: 700,
              justifyContent: 'center',
              margin: '1.5rem 0',
            }}
          >
            No existen partidos con los filtros seleccionados
          </div>
        ) : (
          <div
            style={{
              alignItems: 'center',
              border: 'var(--blue-900) 3px solid',
              display: 'flex',
              flexDirection: 'column',
              margin: '2rem auto',
              padding: '1.5rem 1.75rem',
              width: 'fit-content',
            }}
          >
            {groups?.length ? (
              <>
                <div style={{ fontSize: '1.25rem' }}>
                  La zona{' '}
                  <span style={{ color: 'var(--blue-900)', fontWeight: '700' }}>
                    {searchParams.get('group') || 'A'}
                  </span>{' '}
                  aun no cuenta con partidos
                </div>
                <div style={{ margin: '0.5rem auto' }}>¿Desea generarlos?</div>
                <button
                  className="button-main"
                  onClick={() =>
                    fixtureGeneration(searchParams.get('group') || 'A')
                  }
                >
                  Generar partidos
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: '1.25rem' }}>
                  El torneo{' '}
                  <span style={{ color: 'var(--blue-900)', fontWeight: '700' }}>
                    {name}
                  </span>{' '}
                  aun no cuenta con partidos
                </div>
                <div style={{ margin: '0.5rem auto' }}>¿Desea generarlos?</div>
                <button
                  className="button-main"
                  onClick={() => fixtureGeneration()}
                >
                  Generar partidos
                </button>
              </>
            )}
          </div>
        )}
      </motion.div>
    )
  } else {
    return <PageLoader />
  }
}

export default Fixture

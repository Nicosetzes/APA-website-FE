import { Image } from 'cloudinary-react'
import { cloudName } from 'api'
import styled from 'styled-components'
import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const TabsContainer = styled.div`
  width: 100%;
`

const TabsList = styled.div`
  align-items: center;
  background: var(--blue-900);
  border-bottom: 2px solid rgba(245, 216, 127, 0.2);
  display: flex;
  gap: 0;
  overflow-x: auto;
  padding-inline: 1rem;
  width: 100%;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(245, 216, 127, 0.3);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(245, 216, 127, 0.5);
  }
`

const TabButton = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: ${({ $active }) => ($active ? 'var(--orange-900)' : '#fff')};
  cursor: pointer;
  display: flex;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  white-space: nowrap;

  ${({ $active }) =>
    $active &&
    `
    border-bottom-color: var(--orange-900);
  `}

  &:hover {
    color: ${({ $active }) => ($active ? 'var(--orange-900)' : '#fff')};
    background: rgba(255, 255, 255, 0.05);
  }

  &:first-child {
    margin-left: 0;
  }
`

const TournamentName = styled.div`
  align-items: center;
  border-bottom: 3px solid transparent;
  color: #fff;
  display: flex;
  font-weight: 700;
  font-size: 0.9rem;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-left: auto;
  min-width: 275px;
  padding-left: 1rem;
`

const TournamentImage = styled.div`
  align-items: center;
  display: flex;
  height: 50px;
`

const TournamentTabs = ({ name, format, tournamentId, cloudinary_id }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const activeTab = useMemo(() => {
    const path = location.pathname
    if (path.includes('/fixture')) return 'fixture'
    if (path.includes('/standings')) return 'clasificacion'
    if (path.includes('/simulator')) return 'simulador'
    if (path.includes('/teams')) return 'equipos'
    if (path.includes('/stats')) return 'stats'
    if (path.includes('/playin')) return 'playin'
    if (path.includes('/playoffs')) return 'playoffs'
    return 'resumen'
  }, [location.pathname])

  const tabs = useMemo(() => {
    const tabsArray = [
      { id: 'resumen', label: 'Resumen', path: `/tournaments/${tournamentId}` },
    ]

    if (format !== 'playoff') {
      tabsArray.push({
        id: 'fixture',
        label: 'Fixture',
        path: `/tournaments/${tournamentId}/fixture`,
      })
      tabsArray.push({
        id: 'clasificacion',
        label: 'Clasificación',
        path: `/tournaments/${tournamentId}/standings`,
      })
    }

    if (format === 'league') {
      tabsArray.push({
        id: 'simulador',
        label: 'Simulador',
        path: `/tournaments/${tournamentId}/simulator`,
      })
    }

    tabsArray.push({
      id: 'stats',
      label: 'Rendimiento',
      path: `/tournaments/${tournamentId}/stats`,
    })

    if (format === 'league_playin_playoff') {
      tabsArray.push({
        id: 'playin',
        label: 'PlayIn',
        path: `/tournaments/${tournamentId}/playin`,
      })
    }

    if (format !== 'league') {
      tabsArray.push({
        id: 'playoffs',
        label: 'Playoffs',
        path: `/tournaments/${tournamentId}/playoffs`,
      })
    }

    return tabsArray
  }, [format, tournamentId])

  const handleTabClick = (path) => {
    navigate(path)
  }

  return (
    <TabsContainer>
      <TabsList>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => handleTabClick(tab.path)}
          >
            {tab.label}
          </TabButton>
        ))}
        <TournamentName>
          {cloudinary_id && (
            <TournamentImage>
              <Image
                cloudName={cloudName}
                publicId={cloudinary_id}
                style={{ height: '100%', objectFit: 'contain' }}
              />
            </TournamentImage>
          )}
          {name}
        </TournamentName>
      </TabsList>
    </TabsContainer>
  )
}

export default TournamentTabs

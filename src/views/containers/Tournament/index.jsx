import { Image } from 'cloudinary-react'
import StarIcon from '@mui/icons-material/Star'
import { api } from 'api'
import { apiClient } from 'api/axiosConfig'
import axios from 'axios'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useMediaQuery } from 'react-responsive'
import {
  Container,
  ContentWrapper,
  ImageWrapper,
  InfoCard,
  InfoSection,
  InfoText,
  InfoTitle,
  MatchCard,
  MatchContainer,
  MatchDate,
  MatchList,
  MatchScore,
  MatchTeam,
  MatchType,
  OutcomeCard,
  OutcomeContent,
  OutcomeHeader,
  OutcomePlayerName,
  OutcomeTeamLogo,
  OutcomeTeamName,
  OutcomeTitle,
  OutcomeWrapper,
  ParticipantsTable,
  PlayerName,
  RecentMatchesSection,
  TeamInfo,
  TeamLogo,
  TeamName,
  TableCell,
  TableHeader,
  TableRow,
} from './styled'
import { PageLoader, PrimaryLink } from 'views/components'
import { cloudName, database } from 'api'
import { format as formatDate, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'


const Tournament = () => {
  const isSm = useMediaQuery({ query: '(min-width: 576px)' })
  const { tournamentData } = useOutletContext()
  const { tournament } = useParams()
  const [tournamentSummary, setTournamentSummary] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const MySwal = withReactContent(Swal)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${api}/tournaments/${tournament}/summary`)
        setTournamentSummary(data)
      } catch (err) {
        console.error('Error fetching tournament stats:', err)
      } finally {
        setStatsLoading(false)
      }
    }
    fetchStats()
  }, [tournament])

  if (statsLoading) return <PageLoader />

  const { cloudinary_id, format, legacy, name, ongoing, outcome, teams } = tournamentData
  const champion = outcome?.champion
  const finalist = outcome?.finalist

  const handleFinishTournament = async () => {
    const result = await MySwal.fire({
      title: '¿Finalizar torneo?',
      text: '¿Estás seguro de que quieres finalizar este torneo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--red-700)',
      cancelButtonColor: 'var(--blue-900)',
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'Cancelar',
      background: 'rgba(28, 25, 25, 0.95)',
      color: '#fff',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await apiClient.put(`/tournaments/${tournament}/complete`)
      
      MySwal.fire({
        background: 'rgba(28, 25, 25, 0.95)',
        color: '#fff',
        icon: 'success',
        iconColor: '#18890e',
        toast: true,
        title: 'Torneo finalizado con éxito',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        customClass: { timerProgressBar: 'toast-progress-dark' },
      })
      
      // Refresh page to show updated data
      setTimeout(() => window.location.reload(), 1500)
    } catch (err) {
      console.error('Error finishing tournament:', err)
      MySwal.fire({
        title: 'Error',
        text: 'Error al finalizar el torneo',
        icon: 'error',
        background: 'rgba(28, 25, 25, 0.95)',
        color: '#fff',
        confirmButtonColor: 'var(--red-700)',
      })
    }
  }

  const parseMatchType = (type) => {
    switch (type) {
      case 'regular':
        return 'Fase Regular'
      case 'playin':
        return 'Play-in'
      case 'playoff':
        return 'Playoff'
      default:
        return type
    }
  }

  const parseMatchTypeColor = (type) => {
    switch (type) {
      case 'group':
        return 'var(--blue-900)'
      case 'playin':
        return 'var(--red-900)'
      case 'playoff':
        return 'var(--green-900)'
      default:
        return 'var(--blue-900)'
    }
  }

  const parseStreak = (streak) => {
    const amount = Number(streak?.slice(0, 1))
    if (streak?.includes('W')) return `${streak.split('W')[0]} ${amount > 1 ? 'victorias' : 'victoria'}`
    else if (streak?.includes('L')) return `${streak.split('L')[0]} ${amount > 1 ? 'derrotas' : 'derrota'}`
    else if (streak?.includes('D')) return `${streak.split('D')[0]} ${amount > 1 ? 'empates' : 'empate'}`
    else return '-'
  }

  const parseTournamentFormat = (format) => {
    if (format === 'club_world_cup') return 'Mundial de clubes'
    else if (format === 'league') return 'Torneo largo'
    else if (format === 'league_playin_playoff') return 'Superliga APA'
    else if (format === 'playoff') return 'Eliminatoria'
    else if (format === 'world_cup') return 'Copa del Mundo'
    else return format
  }


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{backgroundColor: '#f6f8fb', minHeight: '100vh'}}>
      <Container>
        <ContentWrapper>
          <ImageWrapper>
            <Image cloudName={cloudName} publicId={cloudinary_id} style={{ height: '300px', objectFit: 'contain' }} />
          </ImageWrapper>
          <InfoSection>
            <InfoCard>
              <InfoTitle>Información del Torneo</InfoTitle>
              <InfoText>
                <strong>Nombre:</strong>{' '}
                {name}
              </InfoText>
              <InfoText>
                <strong>Formato:</strong>{' '}
                {parseTournamentFormat(format)}
              </InfoText>
              { !legacy && (
                <InfoText>
                <strong>Equipos:</strong> {teams?.length || 0}
              </InfoText>
              )}
              { !legacy && (
                <InfoText>
                <strong>Partidos jugados:</strong> {tournamentSummary?.matches?.totalPlayed || 0}
              </InfoText>
              )}
              <InfoText>
                <strong>Estado:</strong> {ongoing ? <span style={{ color: 'var(--green-900)', fontWeight: 'bold' }}>En curso</span> : <span style={{ color: 'var(--red-700)', fontWeight: 'bold' }}>Finalizado</span>}
              </InfoText>
              {ongoing && format === 'league' && (
                  <PrimaryLink asButton text={"Finalizar Torneo"} onClick={handleFinishTournament} />
                )}
            </InfoCard>
          </InfoSection>
        </ContentWrapper>

        {outcome && (
          <OutcomeWrapper>
            <OutcomeCard>
              <OutcomeHeader $centered={!isSm}>
                <OutcomeTitle>Campeón</OutcomeTitle>
                <StarIcon htmlColor={'#ffc30b'} fontSize={'large'} />
              </OutcomeHeader>
              <OutcomeContent $centered={!isSm}>
                <OutcomeTeamLogo
                  src={`${database}/logos/${champion.team.id}`}
                  alt={champion.team.name}
                />
                <TeamInfo>
                  <OutcomeTeamName>{champion.team.name}</OutcomeTeamName>
                  <OutcomePlayerName>({champion.player.name})</OutcomePlayerName>
                </TeamInfo>
              </OutcomeContent>
            </OutcomeCard>
            <OutcomeCard>
              <OutcomeHeader $centered={!isSm}>
                <OutcomeTitle>Finalista</OutcomeTitle>
                <StarIcon htmlColor={'#b3b3b3'} fontSize={'large'} />
              </OutcomeHeader>
              <OutcomeContent $centered={!isSm}>
                <OutcomeTeamLogo
                  src={`${database}/logos/${finalist.team.id}`}
                  alt={finalist.team.name}
                />
                <TeamInfo>
                  <OutcomeTeamName>{finalist.team.name}</OutcomeTeamName>
                  <OutcomePlayerName>({finalist.player.name})</OutcomePlayerName>
                </TeamInfo>
              </OutcomeContent>
            </OutcomeCard>
          </OutcomeWrapper>
        )}

        {tournamentSummary?.matches?.recent?.length > 0 && (
          <RecentMatchesSection>
            <h2 style={{margin: '0 0 1rem 0'}}>Partidos Recientes</h2>
            <MatchList>
            {tournamentSummary.matches.recent.map((match) => (
              <MatchCard color={parseMatchTypeColor(match.type)} key={match.id}>
                <MatchType color={parseMatchTypeColor(match.type)}>{parseMatchType(match.type)}</MatchType>
                <MatchContainer>
                  <MatchTeam>
                    <TeamLogo src={`${database}/logos/${match.teamP1.id}`} alt={match.teamP1.name} />
                    <div>
                      <TeamName>{`${match.teamP1.name.slice(0,3).toUpperCase()}`}</TeamName>
                      <PlayerName>{match.playerP1.name}</PlayerName>
                    </div>
                  </MatchTeam>
                  <MatchScore>{match.scoreP1} - {match.scoreP2}</MatchScore>
                  <MatchTeam>
                    <div style={{ textAlign: 'right' }}>
                      <TeamName>{`${match.teamP2.name.slice(0,3).toUpperCase()}`}</TeamName>
                      <PlayerName>{match.playerP2.name}</PlayerName>
                    </div>
                    <TeamLogo src={`${database}/logos/${match.teamP2.id}`} alt={match.teamP2.name} />
                  </MatchTeam>  
                </MatchContainer>
                <MatchDate>{formatDate(parseISO(match.updatedAt), 'dd/MM/yyyy hh:mm:ss a')}</MatchDate>
              </MatchCard>
            ))}
            </MatchList>
          </RecentMatchesSection>
        )}

        {!legacy && tournamentSummary?.participants?.length > 0 && (
          <div style={{ width: '100%', overflowX: 'auto'}}>
            <h2 style={{ color: "var(--blue-900)", margin: '0 0 1rem 0'}}>Estadísticas de Participantes</h2>
            <ParticipantsTable>
              <thead>
                <TableRow header>
                  <TableHeader>Jugador</TableHeader>
                  <TableHeader>PJ</TableHeader>
                  <TableHeader>PG</TableHeader>
                  <TableHeader>PE</TableHeader>
                  <TableHeader>PP</TableHeader>
                  <TableHeader>GF</TableHeader>
                  <TableHeader>GC</TableHeader>
                  <TableHeader>DG</TableHeader>
                  <TableHeader>EF%</TableHeader>
                  <TableHeader>Racha</TableHeader>
                </TableRow>
              </thead>
              <tbody>
                {tournamentSummary.participants.map((participant, index) => (
                  <TableRow key={participant.player?.id || index}>
                    <TableCell>{participant.player.name}</TableCell>
                    <TableCell>{participant.played}</TableCell>
                    <TableCell>{participant.wins}</TableCell>
                    <TableCell>{participant.draws}</TableCell>
                    <TableCell>{participant.losses}</TableCell>
                    <TableCell>{participant.goalsFor}</TableCell>
                    <TableCell>{participant.goalsAgainst}</TableCell>
                    <TableCell>{participant.scoringDifference}</TableCell>
                    <TableCell>{participant.effectiveness}%</TableCell>
                    <TableCell>{parseStreak(participant.streak)}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </ParticipantsTable>
          </div>
        )}
      </Container>
    </motion.div>
  )
}

export default Tournament
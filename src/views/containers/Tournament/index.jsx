import { Image } from 'cloudinary-react'
import { PageLoader } from 'views/components'
import StarIcon from '@mui/icons-material/Star'
import { api } from 'api'
import axios from 'axios'
import { motion } from 'framer-motion'
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

  const { cloudinary_id, format, name, ongoing, outcome, teams } = tournamentData
  const champion = outcome?.champion
  const finalist = outcome?.finalist

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
    const amount = Number(streak.slice(0, 1))
    if (streak.includes('W')) return `${streak.split('W')[0]} ${amount > 1 ? 'victorias' : 'victoria'}`
    if (streak.includes('L')) return `${streak.split('L')[0]} ${amount > 1 ? 'derrotas' : 'derrota'}`
    if (streak.includes('D')) return `${streak.split('D')[0]} ${amount > 1 ? 'empates' : 'empate'}`
    else return '-'
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{backgroundColor: '#f6f8fb'}}>
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
                {format === 'league' ? 'Liga' : format === 'playoff' ? 'Playoff' : format === 'league_playin_playoff' ? 'Superliga APA' : 'Copa del mundo'}
              </InfoText>
              <InfoText>
                <strong>Equipos:</strong> {teams?.length || 0}
              </InfoText>
              <InfoText>
                <strong>Partidos jugados:</strong> {tournamentSummary?.matches?.totalPlayed || 0}
              </InfoText>
              <InfoText>
                <strong>Estado:</strong> {ongoing ? <span style={{ color: 'var(--green-900)', fontWeight: 'bold' }}>En curso</span> : <span style={{ color: 'var(--red-700)', fontWeight: 'bold' }}>Finalizado</span>}
              </InfoText>
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
                <TeamLogo
                  src={`${database}/logos/${champion.team.id}`}
                  alt={champion.team.name}
                />
                <TeamInfo>
                  <TeamName>{champion.team.name}</TeamName>
                  <PlayerName>({champion.player.name})</PlayerName>
                </TeamInfo>
              </OutcomeContent>
            </OutcomeCard>
            <OutcomeCard>
              <OutcomeHeader $centered={!isSm}>
                <OutcomeTitle>Finalista</OutcomeTitle>
                <StarIcon htmlColor={'#b3b3b3'} fontSize={'large'} />
              </OutcomeHeader>
              <OutcomeContent $centered={!isSm}>
                <TeamLogo
                  src={`${database}/logos/${finalist.team.id}`}
                  alt={finalist.team.name}
                />
                <TeamInfo>
                  <TeamName>{finalist.team.name}</TeamName>
                  <PlayerName>({finalist.player.name})</PlayerName>
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

        {/* Participant Statistics */}
        {tournamentSummary?.participants?.length > 0 && (
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
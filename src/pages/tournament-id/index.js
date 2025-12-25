import { Image } from 'cloudinary-react'
import StarIcon from '@mui/icons-material/Star'
import { motion } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'
import { useOutletContext } from 'react-router-dom'
import {
  Container,
  ContentWrapper,
  ImageWrapper,
  InfoCard,
  InfoSection,
  InfoText,
  InfoTitle,
  OutcomeCard,
  OutcomeContent,
  OutcomeHeader,
  OutcomeTitle,
  OutcomeWrapper,
  PlayerName,
  TeamInfo,
  TeamLogo,
  TeamName,
} from './styled'
import { database, cloudName } from 'api'

const TournamentId = () => {
  const isSm = useMediaQuery({ query: '(min-width: 576px)' })
  const { tournamentSummary } = useOutletContext()

  const { players, teams, format, groups, cloudinary_id, outcome } =
    tournamentSummary

  const champion = outcome?.champion
  const finalist = outcome?.finalist

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container>
        <ContentWrapper>
          <ImageWrapper>
            <Image
              cloudName={cloudName}
              publicId={cloudinary_id}
              style={{ height: '300px', objectFit: 'contain' }}
            />
          </ImageWrapper>
          <InfoSection>
            <InfoCard>
              <InfoTitle>Información del Torneo</InfoTitle>
              <InfoText>
                <strong>Formato:</strong>{' '}
                {format === 'league'
                  ? 'Liga'
                  : format === 'playoff'
                  ? 'Playoff'
                  : format === 'league_playin_playoff'
                  ? 'Liga + PlayIn + Playoff'
                  : 'Liga + Playoff'}
              </InfoText>
              <InfoText>
                <strong>Equipos:</strong> {teams?.length || 0}
              </InfoText>
              <InfoText>
                <strong>Jugadores:</strong> {players?.length || 0}
              </InfoText>
              {groups && groups.length > 0 && (
                <InfoText>
                  <strong>Grupos:</strong> {groups.length}
                </InfoText>
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
      </Container>
    </motion.div>
  )
}

export default TournamentId

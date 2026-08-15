import { MatchBox } from '../index'
import { database } from 'api'
import {
  FormBadge,
  FormRow,
  MatchesGrid,
  Section,
  SectionTitle,
  StatCard,
  StatGrid,
  StatLabel,
  StatValue,
  StatsWrapper,
  StreakBadge,
  TeamChip,
  TeamCompareCard,
  TeamCompareBadge,
  TeamCompareRow,
  TeamWinRate,
  TeamEffectiveness,
  TeamLogo,
  TeamName,
  TeamRecord,
  TeamsGrid,
} from './styled'

const FORM_COLORS = { W: '#22c55e', D: '#eab308', L: '#ef4444' }
const FORM_LABELS = { W: 'V', D: 'E', L: 'D' }
const STREAK_LABELS = { W: 'victorias', D: 'empates', L: 'derrotas' }
const STREAK_COLORS = { W: '#22c55e', D: '#eab308', L: '#ef4444' }

const StatsLayout = ({ playerStats }) => {
  const { matches, stats, teams, bestTeam, worstTeam } = playerStats
  const {
    played,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    scoringDifference,
    effectiveness,
    winRate,
    goalsPerMatch,
    goalsAgainstPerMatch,
    cleanSheets,
    recentForm,
    currentStreak,
  } = stats

  const statCards = [
    { label: 'Partidos jugados', value: played },
    { label: 'Victorias', value: wins, accent: '#22c55e' },
    { label: 'Empates', value: draws, accent: '#eab308' },
    { label: 'Derrotas', value: losses, accent: '#ef4444' },
    { label: 'Goles a favor', value: goalsFor },
    { label: 'Goles en contra', value: goalsAgainst },
    {
      label: 'Diferencia',
      value:
        scoringDifference > 0 ? `+${scoringDifference}` : scoringDifference,
      accent: scoringDifference >= 0 ? '#22c55e' : '#ef4444',
    },
    {
      label: 'Efectividad',
      value: `${effectiveness}%`,
      accent: effectiveness >= 50 ? '#22c55e' : '#ef4444',
    },
    {
      label: 'Win rate',
      value: `${winRate}%`,
      accent: winRate >= 50 ? '#22c55e' : '#ef4444',
    },
    { label: 'Goles / PJ', value: goalsPerMatch },
    { label: 'GC / PJ', value: goalsAgainstPerMatch },
    {
      label: 'Vallas inv.',
      value: cleanSheets,
      accent: cleanSheets > 0 ? '#22c55e' : undefined,
    },
  ]

  return (
    <StatsWrapper>
      <Section>
        <SectionTitle>Forma reciente</SectionTitle>
        <FormRow>
          {recentForm.map((f, i) => (
            <FormBadge key={i} $color={FORM_COLORS[f]}>
              {FORM_LABELS[f]}
            </FormBadge>
          ))}
          <StreakBadge $color={STREAK_COLORS[currentStreak.type]}>
            {currentStreak.count} {STREAK_LABELS[currentStreak.type]} seguidas
          </StreakBadge>
        </FormRow>
      </Section>

      <Section>
        <SectionTitle>Estadísticas</SectionTitle>
        <StatGrid>
          {statCards.map(({ label, value, accent }) => (
            <StatCard key={label} $accent={accent}>
              <StatValue $accent={accent}>{value}</StatValue>
              <StatLabel>{label}</StatLabel>
            </StatCard>
          ))}
        </StatGrid>
      </Section>

      <Section>
        <SectionTitle>Mejor y peor equipo</SectionTitle>

        <TeamCompareRow>
          <TeamCompareCard $accent="#22c55e">
            <TeamCompareBadge $color="#22c55e">Mejor</TeamCompareBadge>

            <TeamLogo
              src={`${database}/logos/${bestTeam.team.id}`}
              alt={bestTeam.team.name}
            />

            <TeamName>{bestTeam.team.name}</TeamName>

            <TeamEffectiveness $color="#22c55e">
              <strong>{bestTeam.effectiveness}%</strong>
              <span>Efectividad</span>
            </TeamEffectiveness>

            <TeamRecord>
              {bestTeam.wins}V · {bestTeam.draws}E · {bestTeam.losses}D
            </TeamRecord>

            <TeamWinRate>
              Victorias <strong>{bestTeam.winRate}%</strong>
            </TeamWinRate>
          </TeamCompareCard>

          <TeamCompareCard $accent="#ef4444">
            <TeamCompareBadge $color="#ef4444">Peor</TeamCompareBadge>

            <TeamLogo
              src={`${database}/logos/${worstTeam.team.id}`}
              alt={worstTeam.team.name}
            />

            <TeamName>{worstTeam.team.name}</TeamName>

            <TeamEffectiveness $color="#ef4444">
              <strong>{worstTeam.effectiveness}%</strong>
              <span>Efectividad</span>
            </TeamEffectiveness>

            <TeamRecord>
              {worstTeam.wins}V · {worstTeam.draws}E · {worstTeam.losses}D
            </TeamRecord>

            <TeamWinRate>
              Victorias <strong>{worstTeam.winRate}%</strong>
            </TeamWinRate>
          </TeamCompareCard>
        </TeamCompareRow>
      </Section>

      <Section>
        <SectionTitle>Equipos</SectionTitle>
        <TeamsGrid>
          {[...teams]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(({ id, name }) => (
              <TeamChip key={id}>
                <img src={`${database}/logos/${id}`} alt={name} />
                <span>{name}</span>
              </TeamChip>
            ))}
        </TeamsGrid>
      </Section>

      <Section>
        <SectionTitle>Partidos</SectionTitle>
        <MatchesGrid>
          {matches.map(
            ({
              _id,
              playerP1,
              playerP2,
              teamP1,
              teamP2,
              scoreP1,
              scoreP2,
              outcome,
              updatedAt,
            }) => (
              <MatchBox
                key={_id}
                outcome={outcome}
                playerP1={playerP1}
                playerP2={playerP2}
                teamP1={teamP1}
                teamP2={teamP2}
                scoreP1={scoreP1}
                scoreP2={scoreP2}
                updatedAt={updatedAt}
              />
            ),
          )}
        </MatchesGrid>
      </Section>
    </StatsWrapper>
  )
}

export default StatsLayout

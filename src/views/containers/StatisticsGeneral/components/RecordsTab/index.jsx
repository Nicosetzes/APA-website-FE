import StreakRecordCard, { MIN_STREAK } from '../StreakRecordCard'
import StreakTabs, { getPanelId, getTabId } from '../StreakTabs'
import { format, parseISO } from 'date-fns'
import { formatPlayedAt } from 'utils/playedAt'
import {
  EmptyMessage,
  RecordCard,
  RecordDetail,
  RecordsGrid,
  RecordTitle,
  RecordValue,
  Section,
  SectionTitle,
  StreakPanelBox,
  StreakPanelDescription,
  StreakRecordsGrid,
} from '../../styled'
import { useState } from 'react'

const RECORD_LABELS = {
  highest_scoring_difference_match: 'Mayor diferencia de goles',
  highest_total_goals_match: 'Más goles en un partido',
  most_clean_sheets_in_a_row: 'Con valla invicta',
  most_consecutive_matches_scoring_1_plus_goals: 'Convirtiendo (+1 gol)',
  most_consecutive_matches_scoring_2_plus_goals: 'Convirtiendo (+2 goles)',
  most_consecutive_matches_scoring_3_plus_goals: 'Convirtiendo (+3 goles)',
  most_wins_in_a_row: 'Con victoria',
  most_unbeaten_in_a_row: 'Invicto (sin derrotas)',
  most_draws_in_a_row: 'Con empate',
  most_losses_in_a_row: 'Con derrota',
  most_penalty_shootout_wins_in_a_row: 'Con victoria (penales)',
  most_knockout_wins_in_a_row: 'Con victoria (eliminación)',
  most_knockout_unbeaten_in_a_row: 'Invicto (eliminación)',
  most_consecutive_semifinals: 'Semis consecutivas',
  most_consecutive_finals: 'Finales consecutivas',
  most_consecutive_titles: 'Campeonatos consecutivos',
}

// Orden explícito: claves que no estén acá no se renderizan.
const MATCH_RECORD_KEYS = [
  'highest_scoring_difference_match',
  'highest_total_goals_match',
]

// Orden explícito y categoría de cada racha: claves que no estén acá no se
// renderizan.
const STREAK_KEYS = [
  ['most_unbeaten_in_a_row', 'Resultados'],
  ['most_wins_in_a_row', 'Resultados'],
  ['most_draws_in_a_row', 'Resultados'],
  ['most_losses_in_a_row', 'Resultados'],
  ['most_consecutive_matches_scoring_1_plus_goals', 'Goles'],
  ['most_consecutive_matches_scoring_2_plus_goals', 'Goles'],
  ['most_consecutive_matches_scoring_3_plus_goals', 'Goles'],
  ['most_clean_sheets_in_a_row', 'Defensa'],
  ['most_penalty_shootout_wins_in_a_row', 'Penales'],
  ['most_knockout_unbeaten_in_a_row', 'Partidos de eliminación'],
  ['most_knockout_wins_in_a_row', 'Partidos de eliminación'],
  ['most_consecutive_semifinals', 'Eliminatorias'],
  ['most_consecutive_finals', 'Eliminatorias'],
  ['most_consecutive_titles', 'Eliminatorias'],
]

const KNOCKOUT_HELP = 'Partidos de eliminatoria (Playin / Playoffs)'
const STREAK_TITLE_HELP = {
  most_knockout_unbeaten_in_a_row: KNOCKOUT_HELP,
  most_knockout_wins_in_a_row: KNOCKOUT_HELP,
}

const STREAK_VARIANTS = {
  most_penalty_shootout_wins_in_a_row: 'knockout',
  most_knockout_wins_in_a_row: 'knockout',
  most_knockout_unbeaten_in_a_row: 'knockout',
  most_consecutive_semifinals: 'tournament',
  most_consecutive_finals: 'tournament',
  most_consecutive_titles: 'tournament',
}

const STREAK_TONES = {
  most_draws_in_a_row: 'neutral',
  most_losses_in_a_row: 'negative',
}

const getStreakTone = (key) => STREAK_TONES[key] || 'positive'

const STREAK_VIEWS = {
  historicas: {
    label: 'Rachas históricas',
    description: 'La racha más larga de la historia en cada tipo.',
    emptyCard: 'Sin racha registrada',
    emptyAll:
      'Todavía no hay rachas registradas. Aparecen cuando se cargan resultados.',
  },
  actuales: {
    label: 'Rachas actuales',
    description: 'Rachas en curso más largas, sean récord o no.',
    emptyCard: 'Nadie en racha',
    emptyAll: 'No hay rachas en curso.',
  },
}

// La racha en curso iguala al récord histórico (y por ser vigente, lo es).
const isCurrentRecord = (active, record) =>
  active?.count >= MIN_STREAK && active.count === record?.count

const StreakCards = ({ view, streaks, records }) => {
  const { emptyCard, emptyAll } = STREAK_VIEWS[view]
  // `null` es "sin racha" y muestra la tarjeta vacía; una clave ausente (BE
  // viejo) no se muestra.
  const keys = STREAK_KEYS.filter(([key]) => streaks && key in streaks)

  if (keys.length === 0) return <EmptyMessage>{emptyAll}</EmptyMessage>

  const isActual = view === 'actuales'

  return (
    <StreakRecordsGrid>
      {keys.map(([key, category]) => (
        <StreakRecordCard
          key={key}
          idPrefix={view}
          recordKey={key}
          title={RECORD_LABELS[key]}
          titleHelp={STREAK_TITLE_HELP[key]}
          tone={getStreakTone(key)}
          category={category}
          variant={STREAK_VARIANTS[key]}
          record={streaks[key]}
          emptyMessage={emptyCard}
          showActive={!isActual}
          isRecord={isActual && isCurrentRecord(streaks[key], records?.[key])}
        />
      ))}
    </StreakRecordsGrid>
  )
}

const StreakPanel = ({ view, streaks, records, tabbed, hidden = false }) => (
  <StreakPanelBox
    hidden={hidden}
    {...(tabbed && {
      role: 'tabpanel',
      id: getPanelId('rachas', view),
      'aria-labelledby': getTabId('rachas', view),
      tabIndex: 0,
    })}
  >
    <StreakPanelDescription>
      {STREAK_VIEWS[view].description}
    </StreakPanelDescription>
    <StreakCards view={view} streaks={streaks} records={records} />
  </StreakPanelBox>
)

const RecordsTab = ({ records, activeStreaks }) => {
  const [view, setView] = useState('historicas')
  const matchRecordKeys = MATCH_RECORD_KEYS.filter((key) => records?.[key])
  // Un BE viejo no manda `activeStreaks`: sólo la vista histórica, sin tabs.
  const hasActual = Boolean(activeStreaks)
  const streaksByView = { historicas: records, actuales: activeStreaks }

  return (
    <>
      <Section>
        <SectionTitle>Récords de Partidos</SectionTitle>
        {matchRecordKeys.length === 0 ? (
          <EmptyMessage>
            Todavía no hay partidos cargados para calcular récords.
          </EmptyMessage>
        ) : (
          <RecordsGrid>
            {matchRecordKeys.map((key) => {
              const record = records[key]
              return (
                <RecordCard key={key}>
                  <RecordTitle>{RECORD_LABELS[key]}</RecordTitle>
                  <RecordValue>
                    {record.count || record.diff || record.total}
                  </RecordValue>
                  {record.match && (
                    <RecordDetail>
                      <div>
                        <strong>{record.match.player1}</strong> (
                        {record.match.team1})
                      </div>
                      <div
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          margin: '0.25rem 0',
                        }}
                      >
                        {record.match.score}
                      </div>
                      <div>
                        <strong>{record.match.player2}</strong> (
                        {record.match.team2})
                      </div>
                      <div
                        style={{
                          marginTop: '0.5rem',
                          fontSize: '0.85rem',
                          opacity: 0.8,
                        }}
                      >
                        {record.match.tournament}
                      </div>
                      {/* 880 partidos del histórico no tienen fecha, y
                          `parseISO(null)` rompe el render. */}
                      {record.match.date && (
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                          {formatPlayedAt(
                            record.match.date,
                            record.match.datePrecision,
                          ) ||
                            format(parseISO(record.match.date), 'dd/MM/yyyy')}
                        </div>
                      )}
                    </RecordDetail>
                  )}
                </RecordCard>
              )
            })}
          </RecordsGrid>
        )}
      </Section>

      <Section>
        <SectionTitle>Récords de Rachas</SectionTitle>
        {hasActual ? (
          <>
            <StreakTabs
              idPrefix="rachas"
              label="Tipo de rachas"
              tabs={Object.entries(STREAK_VIEWS).map(([id, { label }]) => ({
                id,
                label,
              }))}
              selected={view}
              onSelect={setView}
            />
            {/* Los dos paneles quedan en el DOM para que `aria-controls`
                apunte a algo; el inactivo va con `hidden`. */}
            {Object.keys(STREAK_VIEWS).map((id) => (
              <StreakPanel
                key={id}
                view={id}
                streaks={streaksByView[id]}
                records={records}
                tabbed
                hidden={view !== id}
              />
            ))}
          </>
        ) : (
          <StreakPanel view="historicas" streaks={records} records={records} />
        )}
      </Section>
    </>
  )
}

export default RecordsTab

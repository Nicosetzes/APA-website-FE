import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import StreakMatchSummary from '../StreakMatchSummary'
import StreakTournamentSummary from '../StreakTournamentSummary'
import Tooltip from 'views/components/Tooltip'
import {
  EmptyMessage,
  HolderBadge,
  RecordHolders,
  RecordTitle,
} from '../../styled'
import {
  CategoryTag,
  DurationText,
  HolderItem,
  HolderLine,
  HolderList,
  MatchesGrid,
  RangeText,
  StatusDot,
  StatusPill,
  StreakValue,
  StyledStreakCard,
  TitleHelpButton,
  TitleTail,
  ToggleButton,
  ValueBlock,
  ValueUnit,
  VisuallyHidden,
} from './styled'
import { format, parseISO } from 'date-fns'
import { formatPlayedAt, isExactPrecision } from 'utils/playedAt'
import { formatStreakDuration, getCountUnit } from 'utils/streaks'
import { useState } from 'react'

// Un solo partido no es racha.
export const MIN_STREAK = 2

// Un BE viejo manda sólo `{ id, name, date }` por poseedor.
const hasDetails = (holder) => typeof holder?.isActive === 'boolean'

const DateText = ({ value, precision }) => (
  <time dateTime={value}>
    {formatPlayedAt(value, precision) || format(parseISO(value), 'dd/MM/yyyy')}
  </time>
)

const TitleHelp = ({ text }) => (
  <Tooltip title={text}>
    <TitleHelpButton type="button" aria-label={text}>
      <HelpOutlineIcon aria-hidden="true" fontSize="inherit" />
    </TitleHelpButton>
  </Tooltip>
)

// Separa la última palabra para que el ícono no quede solo en otra línea.
const splitLastWord = (text) => {
  const index = text.lastIndexOf(' ')
  return index === -1
    ? ['', text]
    : [text.slice(0, index + 1), text.slice(index + 1)]
}

const CardTitle = ({ title, help }) => {
  if (!help) return <RecordTitle as="h4">{title}</RecordTitle>

  const [head, tail] =
    typeof title === 'string' ? splitLastWord(title) : [title, '']

  return (
    <RecordTitle as="h4">
      {head}
      <TitleTail>
        {tail}
        <TitleHelp text={help} />
      </TitleTail>
    </RecordTitle>
  )
}

const STATUS_LABELS = { active: 'Activa', record: 'Récord' }

const Status = ({ variant }) => (
  <StatusPill $variant={variant}>
    <StatusDot $variant={variant} aria-hidden="true" />
    {STATUS_LABELS[variant]}
  </StatusPill>
)

// Racha por torneo cuyo último torneo sigue abierto: el BE manda su
// `lastPlayedAt` como fecha final, pero la racha todavía no terminó.
const getOngoing = (holder, variant) => ({
  start: variant === 'tournament' && holder.startTournament?.ongoing === true,
  end: variant === 'tournament' && holder.endTournament?.ongoing === true,
})

const ONGOING_TEXT = 'En curso'

// "desde el 15/11/2024" pero "desde 2019" / "desde aprox. jul. 2019".
const sincePrefix = (precision) =>
  !precision || precision === 'exact' || precision === 'day'
    ? 'desde el '
    : 'desde '

// Rango con el último torneo en curso: "15/11/2024 → En curso", leído
// "desde el 15/11/2024, en curso".
const OngoingRange = ({ holder, startOngoing }) => {
  const { startDate, startDatePrecision } = holder

  // Defensivo: con el torneo de inicio también abierto no hay fecha real.
  if (startOngoing) return <RangeText>{ONGOING_TEXT}</RangeText>

  return (
    <RangeText>
      {startDate ? (
        <>
          <VisuallyHidden>{sincePrefix(startDatePrecision)}</VisuallyHidden>
          <DateText value={startDate} precision={startDatePrecision} />
        </>
      ) : (
        'Inicio sin fecha registrada'
      )}
      <span aria-hidden="true"> → </span>
      <VisuallyHidden>, </VisuallyHidden>
      {ONGOING_TEXT}
    </RangeText>
  )
}

const StreakRange = ({ holder, ongoing }) => {
  const { startDate, endDate, startDatePrecision, endDatePrecision } = holder

  if (ongoing.end) {
    return <OngoingRange holder={holder} startOngoing={ongoing.start} />
  }

  if (!startDate && !endDate) {
    return <RangeText>Sin fechas registradas</RangeText>
  }

  return (
    <RangeText>
      {startDate ? (
        <DateText value={startDate} precision={startDatePrecision} />
      ) : (
        'Inicio sin fecha registrada'
      )}
      <span aria-hidden="true"> → </span>
      <VisuallyHidden> hasta </VisuallyHidden>
      {endDate ? (
        <DateText value={endDate} precision={endDatePrecision} />
      ) : (
        'sin fecha'
      )}
    </RangeText>
  )
}

// Mini-tarjetas por tipo de ítem: partidos (rachas de partidos, de partidos de
// eliminación y de penales) o torneos (rachas por torneo).
const ITEMS = {
  match: {
    keys: { start: 'startMatch', end: 'endMatch', cut: 'breakMatch' },
    descriptions: {
      start: 'Partido de inicio',
      last: 'Último partido',
      cut: 'Partido que cortó la racha',
      end: 'Partido final',
    },
    toggle: ['Ver partidos', 'Ocultar partidos'],
    idSuffix: 'partidos',
  },
  tournament: {
    keys: {
      start: 'startTournament',
      end: 'endTournament',
      cut: 'breakTournament',
    },
    descriptions: {
      start: 'Torneo de inicio',
      last: 'Último torneo',
      cut: 'Torneo que cortó la racha',
      end: 'Torneo final',
    },
    toggle: ['Ver torneos', 'Ocultar torneos'],
    idSuffix: 'torneos',
  },
}

const getItems = (variant) =>
  variant === 'tournament' ? ITEMS.tournament : ITEMS.match

const UNITS = {
  match: ['partido', 'partidos'],
  tournament: ['torneo', 'torneos'],
}

// Segunda mini-tarjeta: vigente → último ítem; cerrada → el que la cortó.
// Sin corte (BE viejo) se cae al ítem final.
const getSecondItem = (holder, { keys, descriptions }) => {
  if (holder.isActive) {
    return {
      label: 'Último',
      description: descriptions.last,
      item: holder[keys.end],
    }
  }
  if (holder[keys.cut]) {
    return {
      label: 'Fin',
      description: descriptions.cut,
      item: holder[keys.cut],
      isBreak: true,
    }
  }
  return { label: 'Fin', description: descriptions.end, item: holder[keys.end] }
}

const StreakItemSummary = ({ variant, item, ...props }) =>
  variant === 'tournament' ? (
    <StreakTournamentSummary tournament={item} {...props} />
  ) : (
    <StreakMatchSummary
      match={item}
      isKnockout={variant === 'knockout'}
      {...props}
    />
  )

const StreakItems = ({ holder, variant, id, hidden }) => {
  const items = getItems(variant)
  const start = holder[items.keys.start]
  const second = getSecondItem(holder, items)
  if (!start && !second.item) return null

  return (
    <MatchesGrid id={id} hidden={hidden}>
      <StreakItemSummary
        variant={variant}
        label="Inicio"
        description={items.descriptions.start}
        holderName={holder.name}
        item={start}
      />
      <StreakItemSummary
        variant={variant}
        label={second.label}
        description={second.description}
        holderName={holder.name}
        item={second.item}
        isBreak={second.isBreak}
      />
    </MatchesGrid>
  )
}

// Con una punta no exacta (p. ej. sólo el año) la duración sería inventada.
// En torneos no se asume exacta una precisión que falta.
const hasExactRange = (holder, variant) =>
  variant === 'tournament'
    ? holder.startDatePrecision === 'exact' &&
      holder.endDatePrecision === 'exact'
    : isExactPrecision(holder.startDatePrecision) &&
      isExactPrecision(holder.endDatePrecision)

const HolderRow = ({
  holder,
  count,
  collapsible,
  itemsId,
  showActive,
  isRecord,
  variant,
}) => {
  const [open, setOpen] = useState(false)
  const items = getItems(variant)
  const ongoing = getOngoing(holder, variant)
  // Racha todavía abierta: la duración cambiaría con cada partido del torneo.
  const duration =
    !ongoing.start && !ongoing.end && hasExactRange(holder, variant)
      ? formatStreakDuration({
          startDate: holder.startDate,
          endDate: holder.endDate,
          count,
        })
      : null
  const hasItems = Object.values(items.keys).some((key) => holder[key])
  const isActive = showActive && holder.isActive

  return (
    <HolderItem>
      <HolderLine>
        <HolderBadge $isActive={isActive}>{holder.name}</HolderBadge>
        {isActive && <Status variant="active" />}
        {isRecord && <Status variant="record" />}
      </HolderLine>
      <StreakRange holder={holder} ongoing={ongoing} />
      {duration && <DurationText>{duration}</DurationText>}
      {collapsible && hasItems && (
        <ToggleButton
          type="button"
          aria-expanded={open}
          aria-controls={itemsId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? items.toggle[1] : items.toggle[0]}
        </ToggleButton>
      )}
      <StreakItems
        holder={holder}
        variant={variant}
        id={itemsId}
        hidden={collapsible && !open}
      />
    </HolderItem>
  )
}

/**
 * Tarjeta de una racha. `idPrefix` distingue históricas de actuales para que
 * los ids de los toggles no se repitan en la página.
 *
 * - `title`: texto o nodo del título. `titleHelp`: texto del tooltip de
 *   ayuda que va pegado al final del título.
 * - `category`: tag de la esquina (Resultados / Goles / Defensa / Penales /
 *   Partidos de eliminación / Eliminatorias).
 * - `variant`: `match` (por defecto), `knockout` (partidos con la tanda como
 *   victoria o derrota) o `tournament` (mini-tarjetas de torneo y unidad
 *   "torneos").
 * - `emptyMessage`: se muestra si no hay racha de al menos `MIN_STREAK`.
 * - `showActive`: pill "Activa" en los poseedores vigentes. En actuales todas
 *   son vigentes, así que se apaga.
 * - `isRecord`: la racha en curso también es el récord histórico; pill
 *   "Récord" junto a cada poseedor, en el lugar de "Activa".
 */
const StreakRecordCard = ({
  idPrefix,
  recordKey,
  title,
  titleHelp,
  tone,
  record,
  category,
  emptyMessage = 'Sin racha registrada',
  showActive = true,
  isRecord = false,
  variant = 'match',
}) => {
  const holders = record?.players || []
  const count = record?.count
  const isEmpty = !(count >= MIN_STREAK) || holders.length === 0
  const detailed = holders.some(hasDetails)
  // Con empate, una fila compacta por poseedor y los ítems detrás de un botón.
  const collapsible = holders.length > 1
  const unit = getCountUnit(
    count,
    variant === 'tournament' ? UNITS.tournament : UNITS.match,
  )
  const { idSuffix } = getItems(variant)

  return (
    <StyledStreakCard $tone={tone}>
      {category && <CategoryTag>{category}</CategoryTag>}
      <CardTitle title={title} help={titleHelp} />
      {isEmpty ? (
        <EmptyMessage>{emptyMessage}</EmptyMessage>
      ) : (
        <>
          <ValueBlock>
            <StreakValue $tone={tone}>{count}</StreakValue>
            <ValueUnit>{unit}</ValueUnit>
          </ValueBlock>
          {detailed ? (
            <HolderList>
              {holders.map((holder) =>
                hasDetails(holder) ? (
                  <HolderRow
                    key={holder.id}
                    holder={holder}
                    count={count}
                    collapsible={collapsible}
                    showActive={showActive}
                    isRecord={isRecord}
                    variant={variant}
                    itemsId={`${idPrefix}-${recordKey}-${holder.id}-${idSuffix}`}
                  />
                ) : (
                  <HolderItem key={holder.id}>
                    <HolderLine>
                      <HolderBadge>{holder.name}</HolderBadge>
                      {isRecord && <Status variant="record" />}
                    </HolderLine>
                  </HolderItem>
                ),
              )}
            </HolderList>
          ) : (
            <RecordHolders>
              {holders.map((holder) => (
                <HolderBadge key={holder.id}>{holder.name}</HolderBadge>
              ))}
              {isRecord && <Status variant="record" />}
            </RecordHolders>
          )}
        </>
      )}
    </StyledStreakCard>
  )
}

export default StreakRecordCard

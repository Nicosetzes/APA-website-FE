import StreakMatchSummary from '../StreakMatchSummary'
import { format, parseISO } from 'date-fns'
import { formatStreakDuration } from 'utils/streaks'
import {
  EmptyMessage,
  HolderBadge,
  RecordHolders,
  RecordTitle,
} from '../../styled'
import {
  ActiveDot,
  ActivePill,
  CategoryTag,
  DurationText,
  HolderItem,
  HolderLine,
  HolderList,
  MatchesGrid,
  RangeText,
  RecordTag,
  StreakValue,
  StyledStreakCard,
  ToggleButton,
  ValueBlock,
  ValueUnit,
  VisuallyHidden,
} from './styled'
import { useState } from 'react'

// Un solo partido no es racha.
export const MIN_STREAK = 2

// Un BE viejo manda sólo `{ id, name, date }` por poseedor.
const hasDetails = (holder) => typeof holder?.isActive === 'boolean'

const DateText = ({ value }) => (
  <time dateTime={value}>{format(parseISO(value), 'dd/MM/yyyy')}</time>
)

const StreakRange = ({ holder }) => {
  const { startDate, endDate } = holder

  if (!startDate && !endDate) {
    return <RangeText>Sin fechas registradas</RangeText>
  }

  return (
    <RangeText>
      {startDate ? (
        <DateText value={startDate} />
      ) : (
        'Inicio sin fecha registrada'
      )}
      <span aria-hidden="true"> → </span>
      <VisuallyHidden> hasta </VisuallyHidden>
      {endDate ? <DateText value={endDate} /> : 'sin fecha'}
    </RangeText>
  )
}

// Segunda mini-tarjeta: vigente → último partido; cerrada → el que la cortó.
// Sin `breakMatch` (BE viejo) se cae al partido final.
const getSecondMatch = ({ isActive, breakMatch, endMatch }) => {
  if (isActive) {
    return { label: 'Último', description: 'Último partido', match: endMatch }
  }
  if (breakMatch) {
    return {
      label: 'Fin',
      description: 'Partido que cortó la racha',
      match: breakMatch,
      isBreak: true,
    }
  }
  return { label: 'Fin', description: 'Partido final', match: endMatch }
}

const StreakMatches = ({ holder, id, hidden }) => {
  const { startMatch, name } = holder
  const second = getSecondMatch(holder)
  if (!startMatch && !second.match) return null

  return (
    <MatchesGrid id={id} hidden={hidden}>
      <StreakMatchSummary
        label="Inicio"
        description="Partido de inicio"
        holderName={name}
        match={startMatch}
      />
      <StreakMatchSummary
        label={second.label}
        description={second.description}
        holderName={name}
        match={second.match}
        isBreak={second.isBreak}
      />
    </MatchesGrid>
  )
}

const HolderRow = ({ holder, count, collapsible, matchesId, showActive }) => {
  const [open, setOpen] = useState(false)
  const duration = formatStreakDuration({
    startDate: holder.startDate,
    endDate: holder.endDate,
    count,
  })
  const hasMatches = Boolean(
    holder.startMatch || holder.endMatch || holder.breakMatch,
  )
  const isActive = showActive && holder.isActive

  return (
    <HolderItem>
      <HolderLine>
        <HolderBadge $isActive={isActive}>{holder.name}</HolderBadge>
        {isActive && (
          <ActivePill>
            <ActiveDot aria-hidden="true" />
            Activa
          </ActivePill>
        )}
      </HolderLine>
      <StreakRange holder={holder} />
      {duration && <DurationText>{duration}</DurationText>}
      {collapsible && hasMatches && (
        <ToggleButton
          type="button"
          aria-expanded={open}
          aria-controls={matchesId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Ocultar partidos' : 'Ver partidos'}
        </ToggleButton>
      )}
      <StreakMatches
        holder={holder}
        id={matchesId}
        hidden={collapsible && !open}
      />
    </HolderItem>
  )
}

/**
 * Tarjeta de una racha. `idPrefix` distingue históricas de actuales para que
 * los ids de los toggles no se repitan en la página.
 *
 * - `category`: tag de la esquina (Resultados / Goles / Defensa).
 * - `emptyMessage`: se muestra si no hay racha de al menos `MIN_STREAK`.
 * - `showActive`: pill "Activa" en los poseedores vigentes. En actuales todas
 *   son vigentes, así que se apaga.
 * - `isRecord`: la racha en curso también es el récord histórico.
 */
const StreakRecordCard = ({
  idPrefix,
  recordKey,
  title,
  tone,
  record,
  category,
  emptyMessage = 'Sin racha registrada',
  showActive = true,
  isRecord = false,
}) => {
  const holders = record?.players || []
  const count = record?.count
  const isEmpty = !(count >= MIN_STREAK) || holders.length === 0
  const detailed = holders.some(hasDetails)
  // Con empate, una fila compacta por poseedor y los partidos detrás de un botón.
  const collapsible = holders.length > 1

  return (
    <StyledStreakCard $tone={tone}>
      {category && <CategoryTag>{category}</CategoryTag>}
      <RecordTitle as="h4">{title}</RecordTitle>
      {isEmpty ? (
        <EmptyMessage>{emptyMessage}</EmptyMessage>
      ) : (
        <>
          <ValueBlock>
            <StreakValue $tone={tone}>{count}</StreakValue>
            <ValueUnit>partidos</ValueUnit>
          </ValueBlock>
          {isRecord && <RecordTag>Récord</RecordTag>}
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
                    matchesId={`${idPrefix}-${recordKey}-${holder.id}-partidos`}
                  />
                ) : (
                  <HolderItem key={holder.id}>
                    <HolderLine>
                      <HolderBadge>{holder.name}</HolderBadge>
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
            </RecordHolders>
          )}
        </>
      )}
    </StyledStreakCard>
  )
}

export default StreakRecordCard

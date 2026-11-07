import DateFilter, {
  DateFilterProvider,
} from 'views/containers/MatchListing/DateFilter'
import { getPeriodOptions, formatDay } from 'utils/ratingHistory'
import {
  FieldsRow,
  FilterCard,
  FilterTitle,
  FormGroup,
  PeriodControls,
  PeriodNote,
  ShortcutButton,
  ShortcutRow,
  TournamentField,
  YearSelect,
} from './styled'

const PeriodFilter = ({
  today,
  slug,
  dateFrom,
  dateTo,
  onShortcut,
  onDateChange,
  dimmed = false,
  dimmedNote = null,
  tournamentSelect = null,
  tournamentsError = null,
}) => {
  const { shortcuts, years } = getPeriodOptions(today)
  const activeYear = years.some((year) => year.slug === slug) ? slug : ''

  return (
    <FilterCard aria-label="Filtro de período">
      <FilterTitle>Período</FilterTitle>
      <PeriodControls>
        <ShortcutRow
          role="group"
          aria-label="Períodos frecuentes"
          $dimmed={dimmed}
        >
          {shortcuts.map((option) => (
            <ShortcutButton
              key={option.slug}
              type="button"
              $active={slug === option.slug}
              aria-pressed={slug === option.slug}
              onClick={() => onShortcut(option.slug)}
            >
              {option.label}
            </ShortcutButton>
          ))}
        </ShortcutRow>
        <FieldsRow $dimmed={dimmed}>
          <FormGroup>
            <label htmlFor="rating-year">Año</label>
            <YearSelect
              id="rating-year"
              value={activeYear}
              onChange={(event) => {
                if (event.target.value) onShortcut(event.target.value)
              }}
            >
              <option value="">Elegir año</option>
              {years.map((year) => (
                <option key={year.slug} value={year.slug}>
                  {year.label}
                </option>
              ))}
            </YearSelect>
          </FormGroup>
          <DateFilterProvider>
            <DateFilter
              id="rating-dateFrom"
              label="Desde"
              value={dateFrom}
              onChange={(value) => onDateChange('dateFrom', value)}
            />
            <DateFilter
              id="rating-dateTo"
              label="Hasta"
              value={dateTo}
              onChange={(value) => onDateChange('dateTo', value)}
            />
          </DateFilterProvider>
          {tournamentSelect && (
            <TournamentField>{tournamentSelect}</TournamentField>
          )}
        </FieldsRow>
      </PeriodControls>
      {dimmed && dimmedNote && <PeriodNote>{dimmedNote}</PeriodNote>}
      {!dimmed && dateFrom && dateTo && (
        <PeriodNote>
          Mostrando del {formatDay(dateFrom)} al {formatDay(dateTo)}.
        </PeriodNote>
      )}
      {tournamentsError && <PeriodNote>{tournamentsError}</PeriodNote>}
    </FilterCard>
  )
}

export default PeriodFilter

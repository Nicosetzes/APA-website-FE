import { database } from 'api'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import { FormGroup, StyledInput, TeamOption } from './styled'

export const MIN_TEAM_SEARCH_CHARS = 3

export const normalizeTeamSearch = (value) => {
  const trimmed = value.trim()
  return trimmed.length >= MIN_TEAM_SEARCH_CHARS ? trimmed : ''
}

const MAX_SUGGESTIONS = 20

const baseFilter = createFilterOptions({
  ignoreAccents: true,
  ignoreCase: true,
  matchFrom: 'any',
  limit: MAX_SUGGESTIONS,
  stringify: (team) => team.name,
})

const filterTeams = (options, state) =>
  normalizeTeamSearch(state.inputValue) ? baseFilter(options, state) : []

const getOptionLabel = (option) =>
  typeof option === 'string' ? option : option?.name ?? ''

const hideBrokenLogo = (event) => {
  event.currentTarget.style.visibility = 'hidden'
}

const TeamAutocomplete = ({
  id,
  label,
  teams,
  value,
  onChange,
  disabled = false,
  placeholder = 'Ej. Brazil, Morocco...',
}) => (
  <FormGroup>
    <label htmlFor={id}>{label}</label>
    <Autocomplete
      id={id}
      freeSolo
      disabled={disabled}
      options={teams}
      filterOptions={filterTeams}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, current) =>
        option.name === getOptionLabel(current)
      }
      value={value}
      inputValue={value}
      onInputChange={(event, newValue) => onChange(newValue)}
      onChange={(event, newValue) => onChange(getOptionLabel(newValue))}
      renderOption={(props, team) => (
        <TeamOption {...props} key={team.name}>
          {team.id !== null && team.id !== undefined ? (
            <img
              src={`${database}/logos/${team.id}`}
              alt=""
              loading="lazy"
              width="22"
              height="22"
              onError={hideBrokenLogo}
            />
          ) : (
            <span className="logo-placeholder" aria-hidden="true" />
          )}
          <span>{team.name}</span>
        </TeamOption>
      )}
      renderInput={(params) => (
        <div ref={params.InputProps.ref}>
          <StyledInput
            {...params.inputProps}
            disabled={disabled}
            placeholder={placeholder}
          />
        </div>
      )}
    />
  </FormGroup>
)

export default TeamAutocomplete

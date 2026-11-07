import { FormGroup, StyledSelect } from 'views/containers/MatchListing/styled'

export const ALL_TOURNAMENTS = 'all'

const TournamentSelect = ({
  id,
  label,
  value,
  tournaments,
  onChange,
  extraOption,
  disabled,
}) => (
  <FormGroup>
    <label htmlFor={id}>{label}</label>
    <StyledSelect
      id={id}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value={ALL_TOURNAMENTS}>Todos los torneos</option>
      {extraOption && (
        <option value={value} disabled>
          {extraOption}
        </option>
      )}
      {tournaments.map((tournament) => (
        <option key={tournament._id} value={tournament._id}>
          {tournament.name}
        </option>
      ))}
    </StyledSelect>
  </FormGroup>
)

export default TournamentSelect

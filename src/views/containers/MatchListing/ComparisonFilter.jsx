import { FormGroup, InlineInputs, StyledInput, StyledSelect } from './styled'

const ComparisonFilter = ({
  id,
  label,
  op,
  value,
  onOpChange,
  onValueChange,
  disabled = false,
  max,
  placeholder = 'Ej. 2',
}) => (
  <FormGroup>
    <label htmlFor={id}>{label}</label>
    <InlineInputs>
      <StyledSelect
        aria-label={`${label}: criterio`}
        disabled={disabled}
        value={op}
        onChange={(e) => onOpChange(e.target.value)}
      >
        <option value="gte">≥ (Mayor o igual)</option>
        <option value="lte">≤ (Menor o igual)</option>
        <option value="eq">= (Igual a)</option>
      </StyledSelect>
      <StyledInput
        id={id}
        type="number"
        min="0"
        max={max}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      />
    </InlineInputs>
  </FormGroup>
)

export default ComparisonFilter

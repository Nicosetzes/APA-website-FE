import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { FormGroup } from './styled'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { es } from 'date-fns/locale/es'
import { esES } from '@mui/x-date-pickers/locales'
import { useMemo } from 'react'
import { parseDateParam, toDateParam } from 'utils/dates'

// Lo que ve el usuario; la URL/API sigue con YYYY-MM-DD.
export const DATE_FILTER_FORMAT = 'dd/MM/yyyy'

const localeText = {
  ...esES.components.MuiLocalizationProvider.defaultProps.localeText,
  previousMonth: 'Mes anterior',
  nextMonth: 'Mes siguiente',
}

// Mismo look que StyledInput/StyledSelect de los otros filtros.
const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    fontSize: '0.95rem',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#3b82f6',
      borderWidth: '1px',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '0.6rem 0.8rem',
    height: 'auto',
  },
}

/** Adapter date-fns con locale `es` para los DatePicker de la página. */
export const DateFilterProvider = ({ children }) => (
  <LocalizationProvider
    dateAdapter={AdapterDateFns}
    adapterLocale={es}
    localeText={localeText}
  >
    {children}
  </LocalizationProvider>
)

/**
 * Filtro de fecha DD/MM/YYYY. `value`/`onChange` usan el param de la URL
 * (YYYY-MM-DD): `''` al borrar; una fecha incompleta o inválida no lo cambia.
 */
const DateFilter = ({ id, label, value, onChange }) => {
  const date = useMemo(() => parseDateParam(value), [value])

  const handleChange = (newValue, context) => {
    if (newValue === null) {
      if (value) onChange('')
      return
    }
    if (context?.validationError) return
    const param = toDateParam(newValue)
    if (param && param !== value) onChange(param)
  }

  return (
    <FormGroup>
      <label htmlFor={id}>{label}</label>
      <DatePicker
        value={date}
        onChange={handleChange}
        format={DATE_FILTER_FORMAT}
        slotProps={{
          // En mobile el campo es de sólo lectura: el diálogo trae "Limpiar".
          actionBar: ({ wrapperVariant }) => ({
            actions:
              wrapperVariant === 'mobile' ? ['clear', 'cancel', 'accept'] : [],
          }),
          field: { clearable: true },
          textField: { id, size: 'small', fullWidth: true, sx: textFieldSx },
        }}
      />
    </FormGroup>
  )
}

export default DateFilter

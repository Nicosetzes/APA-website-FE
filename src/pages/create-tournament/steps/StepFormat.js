import { useFormContext, Controller } from 'react-hook-form'
import { database } from '../../../api'
import {
  StepContainer,
  StepTitle,
  StepDescription,
  FormatsGrid,
  FormatCard,
  FormatImage,
  FormatTitle,
  ErrorMessage,
  InputField,
  InputLabel,
} from './styled'

const FORMATS = [
  { id: 'league', name: 'Liga Única', logo: 1 },
  { id: 'league_playin_playoff', name: 'Superliga APA', logo: 8 },
  { id: 'world_cup', name: 'Copa del Mundo', logo: 2 },
  { id: 'champions_league', name: 'Chempions', logo: 5 },
  { id: 'playoff', name: 'Playoffs', logo: 10 },
]

const StepFormat = () => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext()

  const selectedFormat = watch('format')
  const tournamentName = watch('tournamentName')

  return (
    <StepContainer>
      <StepTitle>Configuración Inicial</StepTitle>
      <StepDescription>
        Elige el formato del torneo y asígnale un nombre
      </StepDescription>

      <div style={{ marginBottom: '2rem' }}>
        <InputLabel>Nombre del Torneo *</InputLabel>
        <Controller
          name="tournamentName"
          control={control}
          rules={{
            required: 'El nombre del torneo es obligatorio',
            minLength: {
              value: 3,
              message: 'El nombre debe tener al menos 3 caracteres',
            },
          }}
          render={({ field }) => (
            <InputField
              {...field}
              type="text"
              placeholder="Ej: Copa América 2025"
              $error={!!errors.tournamentName}
            />
          )}
        />
        {errors.tournamentName && (
          <ErrorMessage>{errors.tournamentName.message}</ErrorMessage>
        )}
      </div>

      <InputLabel>Formato del Torneo *</InputLabel>
      <Controller
        name="format"
        control={control}
        rules={{ required: 'Debes seleccionar un formato' }}
        render={({ field }) => (
          <FormatsGrid>
            {FORMATS.map((format) => (
              <FormatCard
                key={format.id}
                $selected={field.value === format.id}
                onClick={() => field.onChange(format.id)}
              >
                <FormatImage
                  src={`${database}/tournaments/logos/${format.logo}`}
                  alt={format.name}
                />
                <FormatTitle>{format.name}</FormatTitle>
              </FormatCard>
            ))}
          </FormatsGrid>
        )}
      />
      {errors.format && <ErrorMessage>{errors.format.message}</ErrorMessage>}

      {selectedFormat && tournamentName && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#e8f5e9',
            borderRadius: '8px',
            color: '#2e7d32',
            fontWeight: '500',
          }}
        >
          ✓ Torneo "{tournamentName}" - Formato:{' '}
          {FORMATS.find((f) => f.id === selectedFormat)?.name}
        </div>
      )}
    </StepContainer>
  )
}

export default StepFormat

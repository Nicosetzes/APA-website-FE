import { FORMATS } from '../../formats'
import { database } from 'api'
import { Controller, useFormContext } from 'react-hook-form'
import {
  ErrorMessage,
  FormatCard,
  FormatsGrid,
  FormatImage,
  FormatTitle,
  ImagesGrid,
  ImageCard,
  InputField,
  InputLabel,
  StepContainer,
  StepDescription,
  StepTitle,
  TournamentImage,
} from './styled'

const StepFormat = ({ tournamentImages }) => {
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
                $selected={field.value?.id === format.id}
                onClick={() => field.onChange(format)}
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

      <div style={{ marginTop: '2rem' }}>
        <InputLabel>Imagen del Torneo</InputLabel>

        <Controller
          name="cloudinaryId"
          control={control}
          render={({ field }) => (
            <ImagesGrid>
              {tournamentImages.map((image) => (
                <ImageCard
                  key={image.cloudinary_id}
                  type="button"
                  $selected={field.value === image.cloudinary_id}
                  onClick={() => field.onChange(image.cloudinary_id)}
                >
                  <TournamentImage src={image.url} alt="Imagen de torneo" />
                </ImageCard>
              ))}
            </ImagesGrid>
          )}
        />
      </div>

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
          {FORMATS.find((f) => f.id === selectedFormat.id)?.name}
        </div>
      )}
    </StepContainer>
  )
}

export default StepFormat

import { useFormContext, Controller } from 'react-hook-form'
import {
  StepContainer,
  StepTitle,
  StepDescription,
  PlayersGrid,
  PlayerCard,
  PlayerCheckbox,
  PlayerName,
  ErrorMessage,
} from './styled'

const StepPlayers = ({ players }) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext()

  const selectedPlayers = watch('selectedPlayers') || []

  return (
    <StepContainer>
      <StepTitle>Seleccionar Jugadores</StepTitle>
      <StepDescription>
        Elige los jugadores que participarán en el torneo (mínimo 2)
      </StepDescription>

      <Controller
        name="selectedPlayers"
        control={control}
        rules={{
          validate: (value) =>
            value?.length >= 2 || 'Debes seleccionar al menos 2 jugadores',
        }}
        render={({ field }) => (
          <PlayersGrid>
            {players.map((player) => {
              const isSelected = field.value?.includes(player.id)
              return (
                <PlayerCard
                  key={player.id}
                  $selected={isSelected}
                  onClick={() => {
                    const currentValue = field.value || []
                    if (isSelected) {
                      field.onChange(
                        currentValue.filter((id) => id !== player.id),
                      )
                    } else {
                      field.onChange([...currentValue, player.id])
                    }
                  }}
                >
                  <PlayerCheckbox $checked={isSelected}>
                    {isSelected && '✓'}
                  </PlayerCheckbox>
                  <PlayerName>{player.name}</PlayerName>
                </PlayerCard>
              )
            })}
          </PlayersGrid>
        )}
      />
      {errors.selectedPlayers && (
        <ErrorMessage>{errors.selectedPlayers.message}</ErrorMessage>
      )}

      {selectedPlayers.length > 0 && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#e3f2fd',
            borderRadius: '8px',
            color: '#1565c0',
            fontWeight: '500',
          }}
        >
          ✓ {selectedPlayers.length} jugador
          {selectedPlayers.length !== 1 ? 'es' : ''} seleccionado
          {selectedPlayers.length !== 1 ? 's' : ''}
        </div>
      )}
    </StepContainer>
  )
}

export default StepPlayers

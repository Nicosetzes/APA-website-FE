import { useState } from 'react'
import { MAX_DEFAULT_PLAYERS } from 'utils/ratingHistory'
import {
  ActionButton,
  NoResults,
  PickerActions,
  PickerLegend,
  PickerWrapper,
  PlayerChip,
  PlayerList,
  SearchInput,
  Swatch,
} from './styled'

const normalize = (text) =>
  String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const PlayerPicker = ({ players, colors, selectedIds, onChange }) => {
  const [query, setQuery] = useState('')
  const selected = new Set(selectedIds)
  const showSearch = players.length > MAX_DEFAULT_PLAYERS
  const term = normalize(query.trim())
  const visible =
    showSearch && term
      ? players.filter(({ name }) => normalize(name).includes(term))
      : players

  const toggle = (id) => {
    const next = players
      .map((player) => player.id)
      .filter((playerId) =>
        playerId === id ? !selected.has(id) : selected.has(playerId),
      )
    onChange(next)
  }

  return (
    <PickerWrapper>
      <PickerLegend>Jugadores en el gráfico</PickerLegend>
      <PickerActions>
        <ActionButton
          type="button"
          onClick={() => onChange(players.map((player) => player.id))}
        >
          Todos
        </ActionButton>
        <ActionButton type="button" onClick={() => onChange([])}>
          Ninguno
        </ActionButton>
        {showSearch && (
          <SearchInput
            type="search"
            value={query}
            placeholder="Buscar jugador"
            aria-label="Buscar jugador por nombre"
            onChange={(event) => setQuery(event.target.value)}
          />
        )}
      </PickerActions>
      <PlayerList>
        {visible.map(({ id, name }) => {
          const checked = selected.has(id)
          const color = colors.get(id)
          return (
            <PlayerChip key={id} $checked={checked} $color={color}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(id)}
              />
              <Swatch $color={color} $checked={checked} aria-hidden="true" />
              {name}
            </PlayerChip>
          )
        })}
        {visible.length === 0 && (
          <NoResults>No hay jugadores que coincidan con la búsqueda.</NoResults>
        )}
      </PlayerList>
    </PickerWrapper>
  )
}

export default PlayerPicker

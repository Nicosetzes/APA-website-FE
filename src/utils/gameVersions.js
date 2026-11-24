// Ediciones del juego que se pueden elegir al crear un torneo, de la más nueva
// a la más vieja. Tienen que coincidir con las que el BE tiene cargadas en
// `data/team-ratings.csv` (el BE rechaza cualquier otra): al sumar una edición
// nueva allá, agregarla primera acá.
export const GAME_VERSIONS = [
  'FC 27',
  'FC 26',
  'FC 25',
  'FC 24',
  'FIFA 23',
  'FIFA 22',
  'FIFA 21',
  'FIFA 19',
]

// Por defecto, la más nueva.
export const DEFAULT_GAME_VERSION = GAME_VERSIONS[0]

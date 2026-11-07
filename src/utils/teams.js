import { database } from 'api'

/**
 * Sigla de un equipo como la muestra la tabla de /matches: las primeras 3
 * letras del nombre, en mayúsculas. `null` si no hay nombre.
 */
export const teamAbbreviation = (name) =>
  name ? name.substring(0, 3).toUpperCase() : null

/** URL del escudo de un equipo por su id, como en /matches. */
export const teamLogoUrl = (id) => `${database}/logos/${id}`

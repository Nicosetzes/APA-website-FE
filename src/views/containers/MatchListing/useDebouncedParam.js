import { useEffect, useState } from 'react'

const DEBOUNCE_MS = 400

const identity = (value) => value

// Estado local de un input de texto/número que se sincroniza con un parámetro
// de la URL cuando el usuario deja de tipear.
//
// - `normalize` transforma el valor tipeado en el que va a la URL (por ejemplo,
//   ignorar búsquedas de menos de 3 letras). La comparación se hace contra el
//   valor normalizado para no reescribir la URL en loop con el mismo valor.
// - Si la URL cambia por fuera del input (limpiar filtros, quitar un jugador,
//   navegar atrás), el input la acompaña.
// - Con `enabled` en false el input se vacía y no escribe en la URL: evita que
//   un valor pendiente de debounce reaparezca después de quitar su dependencia.
//
// `normalize` tiene que ser estable (definida fuera del componente).
const useDebouncedParam = ({
  paramKey,
  paramValue,
  updateFilters,
  normalize = identity,
  enabled = true,
}) => {
  const [input, setInput] = useState(paramValue)

  useEffect(() => {
    setInput((current) =>
      normalize(current) === paramValue ? current : paramValue,
    )
  }, [paramValue, normalize])

  useEffect(() => {
    if (!enabled) setInput('')
  }, [enabled])

  useEffect(() => {
    const next = normalize(input)
    if (!enabled || next === paramValue) return undefined

    const timer = setTimeout(
      () => updateFilters({ [paramKey]: next }),
      DEBOUNCE_MS,
    )
    return () => clearTimeout(timer)
  }, [enabled, input, normalize, paramKey, paramValue, updateFilters])

  return [input, setInput]
}

export default useDebouncedParam

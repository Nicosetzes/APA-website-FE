/* eslint-env jest */
import {
  getMessageVariants,
  getSuggestionVariants,
  getSuggestionsVariants,
} from './animations'

describe('animaciones del chat', () => {
  it('los mensajes entran con un corrimiento y una escala mínimos', () => {
    const { hidden, visible } = getMessageVariants()

    expect(hidden.opacity).toBe(0)
    expect(Math.abs(hidden.y)).toBeLessThanOrEqual(16)
    expect(hidden.scale).toBeGreaterThanOrEqual(0.9)
    expect(visible).toMatchObject({ opacity: 1, y: 0, scale: 1 })
    expect(visible.transition.duration).toBeLessThanOrEqual(0.25)
    expect(visible.transition.type).toBeUndefined()
  })

  it('el saludo puede esperar a que termine de abrirse el panel', () => {
    expect(getMessageVariants({ delay: 0.12 }).visible.transition.delay).toBe(
      0.12,
    )
    expect(getMessageVariants().visible.transition.delay).toBe(0)
  })

  it('con movimiento reducido solo hay un fundido', () => {
    const { hidden, visible } = getMessageVariants({ reducedMotion: true })

    expect(hidden).toEqual({ opacity: 0 })
    expect(visible.opacity).toBe(1)
    expect(visible).not.toHaveProperty('y')
    expect(visible).not.toHaveProperty('scale')
    expect(getSuggestionVariants({ reducedMotion: true }).hidden).toEqual({
      opacity: 0,
    })
  })

  it('las sugerencias aparecen una tras otra, y sin escalonar con movimiento reducido', () => {
    const normal = getSuggestionsVariants().visible.transition
    const reduced = getSuggestionsVariants({ reducedMotion: true }).visible
      .transition

    expect(normal.staggerChildren).toBeGreaterThan(0)
    expect(reduced.staggerChildren).toBeUndefined()
    expect(getSuggestionVariants().hidden.y).toBeLessThanOrEqual(8)
  })
})

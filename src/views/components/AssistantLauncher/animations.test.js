/* eslint-env jest */
import { getFabTap, getFabVariants, getPanelVariants } from './animations'

const states = (variants) => Object.values(variants)
const durations = (variants) =>
  [variants.visible, variants.exit].map(({ transition }) => transition.duration)

describe('movimiento reducido', () => {
  test('el panel y el botón solo hacen un fundido corto', () => {
    const variants = [
      getPanelVariants({ reducedMotion: true }),
      getPanelVariants({ reducedMotion: true, isMobile: true }),
      getFabVariants({ reducedMotion: true }),
    ]

    variants.forEach((variant) => {
      states(variant).forEach((state) => {
        expect(state).not.toHaveProperty('x')
        expect(state).not.toHaveProperty('y')
        expect(state).not.toHaveProperty('scale')
      })
      durations(variant).forEach((duration) =>
        expect(duration).toBeLessThanOrEqual(0.12),
      )
    })
  })

  test('el botón no se achica al apretarlo', () => {
    expect(getFabTap({ reducedMotion: true })).toBeUndefined()
    expect(getFabTap()).toEqual({ scale: 0.95 })
  })
})

describe('movimiento normal', () => {
  test('el panel de escritorio es sutil y sale más rápido de lo que entra', () => {
    const variants = getPanelVariants()

    states(variants).forEach(({ scale = 1, y = 0 }) => {
      expect(scale).toBeGreaterThanOrEqual(0.9)
      expect(scale).toBeLessThanOrEqual(1)
      expect(Math.abs(y)).toBeLessThanOrEqual(16)
    })
    const [enter, exit] = durations(variants)
    expect(enter).toBeLessThanOrEqual(0.3)
    expect(exit).toBeLessThanOrEqual(enter)
  })

  test('el panel de celular no usa escala', () => {
    const variants = getPanelVariants({ isMobile: true })

    states(variants).forEach((state) => {
      expect(state).not.toHaveProperty('scale')
      expect(Math.abs(state.y || 0)).toBeLessThanOrEqual(24)
    })
  })

  test('la salida del botón es muy corta para no demorar al panel', () => {
    const [enter, exit] = durations(getFabVariants())

    expect(enter).toBeLessThanOrEqual(0.3)
    expect(exit).toBeLessThanOrEqual(0.12)
  })

  test('ninguna transición rebota', () => {
    const all = [
      getPanelVariants(),
      getPanelVariants({ isMobile: true }),
      getFabVariants(),
    ]

    all.forEach((variant) =>
      [variant.visible, variant.exit].forEach(({ transition }) =>
        expect(transition.type).not.toBe('spring'),
      ),
    )
  })
})

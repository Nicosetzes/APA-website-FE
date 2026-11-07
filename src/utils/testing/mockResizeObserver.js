// jsdom no trae ResizeObserver y no calcula layout: `ResponsiveContainer` de
// Recharts no dibuja nada. Este mock informa un tamaño fijo apenas se observa
// el elemento (ver rating-history-spike.md, caso C).
export const installResizeObserver = ({ width = 800, height = 300 } = {}) => {
  const original = global.ResizeObserver
  global.ResizeObserver = class {
    constructor(callback) {
      this.callback = callback
    }

    observe(target) {
      this.callback([{ target, contentRect: { width, height } }])
    }

    unobserve() {}

    disconnect() {}
  }
  return () => {
    if (original === undefined) delete global.ResizeObserver
    else global.ResizeObserver = original
  }
}

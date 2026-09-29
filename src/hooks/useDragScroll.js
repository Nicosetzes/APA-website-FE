import { useEffect, useRef } from 'react'

// Elements that keep their normal mouse behaviour (typing, clicking, etc.)
const INTERACTIVE_SELECTOR =
  'input, textarea, select, button, a, label, [contenteditable="true"], [data-no-drag]'

// Pixels the mouse must travel before a press becomes a drag, so plain
// clicks inside the container keep working
const DRAG_THRESHOLD = 5

const useDragScroll = () => {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    let start = null
    let dragging = false

    const canPan = () => element.scrollWidth > element.clientWidth

    const updateCursor = () => {
      if (!dragging) element.style.cursor = canPan() ? 'grab' : ''
    }

    const suppressClick = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }

    const onPointerMove = (event) => {
      if (!start) return

      const dx = event.clientX - start.x

      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return
        dragging = true
        element.style.cursor = 'grabbing'
        document.body.style.userSelect = 'none'
        window.getSelection()?.removeAllRanges()
      }

      event.preventDefault()
      element.scrollLeft = start.scrollLeft - dx
    }

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)

      if (dragging) {
        // The click that follows a drag must not trigger anything
        element.addEventListener('click', suppressClick, {
          capture: true,
          once: true,
        })
        setTimeout(() => {
          element.removeEventListener('click', suppressClick, { capture: true })
        }, 0)
      }

      start = null
      dragging = false
      document.body.style.userSelect = ''
      updateCursor()
    }

    const onPointerDown = (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      if (event.target.closest(INTERACTIVE_SELECTOR)) return
      if (!canPan()) return

      start = { x: event.clientX, scrollLeft: element.scrollLeft }

      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerUp)
    }

    // Avoid the browser's native image "ghost" drag (team logos)
    const onDragStart = (event) => event.preventDefault()

    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('dragstart', onDragStart)

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(updateCursor)
        : null
    // Watch the container and its content: loading matches changes the
    // scroll width without resizing the container itself
    ;[element, ...element.children].forEach((node) =>
      resizeObserver?.observe(node),
    )
    updateCursor()

    return () => {
      onPointerUp()
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('dragstart', onDragStart)
      resizeObserver?.disconnect()
      element.style.cursor = ''
    }
  }, [])

  return ref
}

export default useDragScroll

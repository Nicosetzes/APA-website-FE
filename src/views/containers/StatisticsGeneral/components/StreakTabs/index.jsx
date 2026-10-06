import { SegmentedList, SegmentedTab } from './styled'
import { useRef } from 'react'

export const getTabId = (idPrefix, id) => `${idPrefix}-tab-${id}`
export const getPanelId = (idPrefix, id) => `${idPrefix}-panel-${id}`

const NEXT_INDEX = {
  ArrowRight: (index, total) => (index + 1) % total,
  ArrowLeft: (index, total) => (index - 1 + total) % total,
  Home: () => 0,
  End: (index, total) => total - 1,
}

/**
 * Control segmentado con el patrón tablist de WAI-ARIA (activación
 * automática): flechas, Home y End mueven el foco y seleccionan. Los paneles
 * los renderiza quien lo usa con `getPanelId`/`getTabId`.
 */
const StreakTabs = ({ idPrefix, label, tabs, selected, onSelect }) => {
  const refs = useRef({})

  const handleKeyDown = (event) => {
    const getNext = NEXT_INDEX[event.key]
    if (!getNext) return
    event.preventDefault()
    const index = tabs.findIndex((tab) => tab.id === selected)
    const next = tabs[getNext(index, tabs.length)]
    onSelect(next.id)
    refs.current[next.id]?.focus()
  }

  return (
    <SegmentedList role="tablist" aria-label={label} onKeyDown={handleKeyDown}>
      {tabs.map((tab) => {
        const isSelected = tab.id === selected
        return (
          <SegmentedTab
            key={tab.id}
            ref={(node) => {
              refs.current[tab.id] = node
            }}
            type="button"
            role="tab"
            id={getTabId(idPrefix, tab.id)}
            aria-selected={isSelected}
            aria-controls={getPanelId(idPrefix, tab.id)}
            tabIndex={isSelected ? 0 : -1}
            $selected={isSelected}
            onClick={() => onSelect(tab.id)}
          >
            {tab.label}
          </SegmentedTab>
        )
      })}
    </SegmentedList>
  )
}

export default StreakTabs

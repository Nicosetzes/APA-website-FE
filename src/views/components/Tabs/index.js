import { useState } from 'react'
import { TabButton, TabsContainer, TabContent, TabsList } from './styled'

/**
 * Reusable Tabs Component
 *
 * @param {Array} tabs - Array of tab objects with { id, label, content }
 * @param {string} defaultTab - Optional default tab id to show initially
 * @param {string} activeTab - Optional tab id to make the component controlled:
 * the parent decides which tab is shown (e.g. from the URL)
 * @param {Function} onChange - Optional, called with the tab id on every click
 * (in both controlled and uncontrolled mode)
 *
 */

const Tabs = ({ tabs, defaultTab, activeTab: controlledTab, onChange }) => {
  const [internalTab, setInternalTab] = useState(defaultTab || tabs[0]?.id)

  const isControlled = controlledTab !== undefined
  const activeTab = isControlled ? controlledTab : internalTab

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content

  const handleClick = (id) => {
    if (!isControlled) setInternalTab(id)
    if (onChange) onChange(id)
  }

  return (
    <TabsContainer>
      <TabsList>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => handleClick(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabsList>
      <TabContent>{activeContent}</TabContent>
    </TabsContainer>
  )
}

export default Tabs

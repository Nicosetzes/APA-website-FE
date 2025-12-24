import { useState } from 'react'
import { TabButton, TabsContainer, TabContent, TabsList } from './styled'

/**
 * Reusable Tabs Component
 *
 * @param {Array} tabs - Array of tab objects with { id, label, content }
 * @param {string} defaultTab - Optional default tab id to show initially
 *
 */

const Tabs = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content

  return (
    <TabsContainer>
      <TabsList>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
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

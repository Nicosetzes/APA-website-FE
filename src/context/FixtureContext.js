import { createContext, useState, useContext } from 'react'

const FixtureContext = createContext()

export const useFixture = () => useContext(FixtureContext)

export const FixtureProvider = ({ children }) => {
  const [fixture, setFixture] = useState()

  const [originalFixture, setOriginalFixture] = useState()

  const [playersFromTournament, setPlayersFromTournament] = useState()

  const [selectedTeam, setSelectedTeam] = useState()

  const updateFixture = (updated) => {
    setFixture(updated)
  }

  const updateOriginalFixture = (updated) => {
    setOriginalFixture(updated)
  }

  const updatePlayersFromTournament = (players) => {
    setPlayersFromTournament(players)
  }

  const updateSelectedTeam = (updated) => {
    setSelectedTeam(updated)
  }

  return (
    <FixtureContext.Provider
      value={{
        fixture,
        originalFixture,
        playersFromTournament,
        selectedTeam,
        updateFixture,
        updateOriginalFixture,
        updatePlayersFromTournament,
        updateSelectedTeam,
      }}
    >
      {children}
    </FixtureContext.Provider>
  )
}

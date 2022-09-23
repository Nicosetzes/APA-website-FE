import { createContext, useState, useContext } from 'react'

const TournamentContext = createContext()

export const useTournament = () => useContext(TournamentContext)

export const TournamentProvider = ({ children }) => {
  const [tournament, setTournament] = useState()

  const [originalTournament, setOriginalTournament] = useState()

  const [selectedTeam, setSelectedTeam] = useState()

  const updateTournament = (updated) => {
    setTournament(updated)
  }

  const updateOriginalTournament = (updated) => {
    setOriginalTournament(updated)
  }

  const updateSelectedTeam = (updated) => {
    setSelectedTeam(updated)
  }

  return (
    <TournamentContext.Provider
      value={{
        tournament,
        originalTournament,
        selectedTeam,
        updateTournament,
        updateOriginalTournament,
        updateSelectedTeam,
      }}
    >
      {children}
    </TournamentContext.Provider>
  )
}

import { createContext, useState, useContext } from 'react'

const TournamentContext = createContext()

export const useTournament = () => useContext(TournamentContext)

export const TournamentProvider = ({ children }) => {
  const [tournament, setTournament] = useState()

  const updateTournament = (updated) => {
    setTournament(updated)
  }

  return (
    <TournamentContext.Provider
      value={{
        tournament,
        updateTournament,
      }}
    >
      {children}
    </TournamentContext.Provider>
  )
}

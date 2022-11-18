import { createContext, useState, useContext } from 'react'

const TeamAssignmentContext = createContext()

export const useTeamAssignment = () => useContext(TeamAssignmentContext)

export const TeamAssignmentProvider = ({ children }) => {
  const [assignment, setAssignment] = useState([])

  const updateAssignment = (update) => {
    const indexOfFoundAssignment = assignment.findIndex(
      (teamFromAssignment) => teamFromAssignment.team.id == update.team.id,
    )
    indexOfFoundAssignment !== -1
      ? assignment.splice(indexOfFoundAssignment, 1, update)
      : setAssignment([...assignment, update])
  }

  return (
    <TeamAssignmentContext.Provider
      value={{
        assignment,
        updateAssignment,
      }}
    >
      {children}
    </TeamAssignmentContext.Provider>
  )
}

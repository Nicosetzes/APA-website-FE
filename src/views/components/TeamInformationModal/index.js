import SmallStandingsTable from './../SmallStandingsTable'
import SmallMatch from './../SmallMatch'
import { StyledTeamInformationModal } from './styled'
import SmallTeamPresentation from '../SmallTeamPresentation'

const TeamInformationModal = ({ teamInformation }) => {
  console.log(teamInformation)
  const { team, player, matches, standings } = teamInformation

  return (
    <StyledTeamInformationModal>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
        }}
      >
        <SmallTeamPresentation team={team} player={player} />
        {matches.map(
          ({
            _id,
            playerP1,
            teamP1,
            scoreP1,
            playerP2,
            teamP2,
            scoreP2,
            updatedAt,
          }) => (
            <SmallMatch
              key={_id}
              playerP1={playerP1}
              teamP1={teamP1}
              scoreP1={scoreP1}
              playerP2={playerP2}
              teamP2={teamP2}
              scoreP2={scoreP2}
              updatedAt={updatedAt}
            />
          ),
        )}
      </div>
      <SmallStandingsTable standings={standings} team={team} />
    </StyledTeamInformationModal>
  )
}

export default TeamInformationModal

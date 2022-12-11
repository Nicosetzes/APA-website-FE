// import { useNavigate, createSearchParams } from 'react-router-dom'
import InputContainer from './../InputContainer'
import { useFixture } from './../../../../context/FixtureContext'
import { PropTypes } from 'prop-types'
import { database } from './../../../../api'

const Match = ({ match, handleSubmit }) => {
  const tournament = useFixture()

  // const navigate = useNavigate()

  // const teamParams = (param) => {
  //   return { team: param }
  // }

  // const goToSpecificFixture = (params) => {
  //   // El query es de team (numérico, es el id);
  //   navigate({
  //     pathname: ``,
  //     search: `?${createSearchParams(teamParams(params))}`,
  //   })
  // }

  const {
    playerP1,
    playerP2,
    teamP1,
    teamP2,
    scoreP1,
    scoreP2,
    outcome,
    id,
    updatedAt,
  } = match

  return (
    <form
      className="match"
      data-player1-name={playerP1.name}
      data-player1-id={playerP1.id}
      data-player2-name={playerP2.name}
      data-player2-id={playerP2.id}
      data-team1-name={teamP1.name}
      data-team1-id={teamP1.id}
      data-team2-name={teamP2.name}
      data-team2-id={teamP2.id}
      data-id={id}
      onSubmit={(e) => {
        handleSubmit(e)
      }}
      style={{
        outline: outcome ? '#2aa723 3px solid' : '#dc3545 3px solid',
      }}
    >
      <div className="match-info">
        <textarea
          name="teamP1"
          wrap="soft"
          className="match-info__team"
          value={teamP1.name}
          readOnly
        >
          {teamP1.name}
        </textarea>
        {/* <Route path={`/tournaments/62e0b0a53d86565327b95a82/fixture?team=${teamP1.id}`} element={<FixtureId />} /> className="logo-link"> */}
        <img
          src={`${database}/logos/${teamP1.id}`}
          alt={match.teamP1}
          className="match-info__logo"
          onClick={() => tournament.updateSelectedTeam(teamP1.id)}
        />
        <input
          name="playerP1"
          className="match-info__player"
          value={playerP1.name}
          readOnly
        />
      </div>
      <div className="match-score">
        <div className="match__container">
          <input
            name="scoreP1"
            className="match-score__goals"
            value={scoreP1 ?? ''} // IMPORTANT // TODO: Handle react warning about not adding and onChange handler
          />
          <span className="match-score__versus">vs</span>
          <input
            name="scoreP2"
            className="match-score__goals"
            value={scoreP2 ?? ''} // IMPORTANT // TODO: Handle react warning about not adding and onChange handler
          />
        </div>
        <InputContainer
          id={id}
          isFinished={match.scoreP1 !== undefined ? true : false}
        />
      </div>
      <div className="match-info">
        <textarea
          name="teamP2"
          wrap="soft"
          className="match-info__team"
          value={teamP2.name}
          readOnly
        >
          {teamP2.name}
        </textarea>
        <img
          src={`${database}/logos/${teamP2.id}`}
          alt={teamP2.name}
          className="match-info__logo"
          onClick={() => tournament.updateSelectedTeam(teamP2.id)}
        />
        <input
          name="playerP2"
          className="match-info__player"
          value={playerP2.name}
          readOnly
        />
      </div>
    </form>
  )
}

InputContainer.propTypes = {
  matchId: PropTypes.string,
  isFinished: PropTypes.bool,
}

export default Match

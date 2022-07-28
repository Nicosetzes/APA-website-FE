import { Link, useParams } from "react-router-dom";
import InputContainer from "./../InputContainer";
import { PropTypes } from "prop-types";

const Match = ({ match, handleSubmit }) => {

	console.log("Me renderizo")

	const { id } = useParams();

	return (
		<form className="match" data-player1={match.playerP1} data-player2={match.playerP2} data-team1={match.teamP1} data-team2={match.teamP2} data-id={match.matchId}
			onSubmit={e => { handleSubmit(e) }}>
			<div className="match-info">
				<textarea name="teamP1" wrap="soft" className="match-info__team" value={match.teamP1} readOnly>{match.teamP1}</textarea>
				<Link to={`/tournaments/${id}/fixture?q=${match.teamIdP1}`} className="logo-link">
					<img src={match.teamLogoP1} alt={match.teamP1} />
				</Link>
				<Link to="" className="player-link">
					<input name="playerP1" className="match-info__player" value={match.playerP1} readOnly />
				</Link>
			</div>
			<div className="match-score">
				<div className="match__container">
					<input name="scoreP1" className="match-score__goals" defaultValue={match.scoreP1} />
					<span className="match-score__versus">vs</span>
					<input name="scoreP2" className="match-score__goals" defaultValue={match.scoreP2} />
				</div>
				<InputContainer matchId={match.matchId} isFinished={match.scoreP1 !== undefined ? true : false} />
			</div>
			<div className="match-info">
				<textarea name="teamP2" wrap="soft" className="match-info__team" value={match.teamP2} readOnly>{match.teamP2}</textarea>
				<Link to={`/tournaments/${id}/fixture?q=${match.teamIdP2}`} className="logo-link">
					<img src={match.teamLogoP2} alt={match.teamP2} />
				</Link>
				<Link to="" className="player-link">
					<input name="playerP2" className="match-info__player" value={match.playerP2} readOnly />
				</Link>
			</div>
		</form>
	);
}

InputContainer.propTypes = {
	matchId: PropTypes.string,
	isFinished: PropTypes.bool
}

export default Match;
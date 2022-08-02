import { StyledMatchView } from './styled';

const MatchView = ({ playerP1, playerP2, teamP1, teamP2, scoreP1, scoreP2, tournament, date }) => {
	return (
		<StyledMatchView className="card__match">
			<div className="card__match-score">
				<span>{teamP1}</span> <span>{scoreP1}</span> <span>-</span> <span>{scoreP2}</span> <span>{teamP2}</span>
			</div>
			<div className="card__match-info">
				<span>{tournament}</span> <span>{date}</span>
			</div>
		</StyledMatchView>
	);
}

export default MatchView;
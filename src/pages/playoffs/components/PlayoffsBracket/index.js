import Divider from '@mui/material/Divider'
import { StyledPlayoffsContainer } from './styled'

const PlayoffsBracket = ({ rankedTeams }) => {
  console.log(rankedTeams)
  return (
    <StyledPlayoffsContainer>
      <div className="playoff__container-left">
        <div className="match">
          <div className="match-team">
            <span className="match-team-seed">1</span>
            <img className="match-team-logo" src={rankedTeams[0].logo}></img>
            <span className="match-team-name">
              {rankedTeams[0].team} ({rankedTeams[0].player[0].toUpperCase()}
              {rankedTeams[0].player[1].toUpperCase()})
            </span>
          </div>
          <Divider />
          <div className="match-team">
            <span className="match-team-seed">16</span>
            <img className="match-team-logo" src={rankedTeams[15].logo}></img>
            <span className="match-team-name">
              {rankedTeams[15].team} ({rankedTeams[15].player[0].toUpperCase()}
              {rankedTeams[15].player[1].toUpperCase()})
            </span>
          </div>
        </div>
        <div className="match">
          <div className="match-team">
            <span className="match-team-seed">8</span>
            <img className="match-team-logo" src={rankedTeams[7].logo}></img>
            <span className="match-team-name">
              {rankedTeams[7].team} ({rankedTeams[7].player[0].toUpperCase()}
              {rankedTeams[7].player[1].toUpperCase()})
            </span>
          </div>
          <div className="match-team">
            <span className="match-team-seed">9</span>
            <img className="match-team-logo" src={rankedTeams[8].logo}></img>
            <span className="match-team-name">
              {rankedTeams[8].team} ({rankedTeams[8].player[0].toUpperCase()}
              {rankedTeams[8].player[1].toUpperCase()})
            </span>
          </div>
        </div>
        <div className="match">
          <div className="match-team">
            <span className="match-team-seed">5</span>
            <img className="match-team-logo" src={rankedTeams[4].logo}></img>
            <span className="match-team-name">
              {rankedTeams[4].team} ({rankedTeams[4].player[0].toUpperCase()}
              {rankedTeams[4].player[1].toUpperCase()})
            </span>
          </div>
          <div className="match-team">
            <span className="match-team-seed">12</span>
            <img className="match-team-logo" src={rankedTeams[11].logo}></img>
            <span className="match-team-name">
              {rankedTeams[11].team} ({rankedTeams[11].player[0].toUpperCase()}
              {rankedTeams[11].player[1].toUpperCase()})
            </span>
          </div>
        </div>
        <div className="match">
          <div className="match-team">
            <span className="match-team-seed">4</span>
            <img className="match-team-logo" src={rankedTeams[3].logo}></img>
            <span className="match-team-name">
              {rankedTeams[3].team} ({rankedTeams[3].player[0].toUpperCase()}
              {rankedTeams[3].player[1].toUpperCase()})
            </span>
          </div>
          <div className="match-team">
            <span className="match-team-seed">13</span>
            <img className="match-team-logo" src={rankedTeams[12].logo}></img>
            <span className="match-team-name">
              {rankedTeams[12].team} ({rankedTeams[12].player[0].toUpperCase()}
              {rankedTeams[12].player[1].toUpperCase()})
            </span>
          </div>
        </div>
      </div>
      <div className="playoff__container-right">
        <div className="match">
          <div className="match-team">
            <span className="match-team-seed">6</span>
            <img className="match-team-logo" src={rankedTeams[5].logo}></img>
            <span className="match-team-name">
              {rankedTeams[5].team} ({rankedTeams[5].player[0].toUpperCase()}
              {rankedTeams[5].player[1].toUpperCase()})
            </span>
          </div>
          <div className="match-team">
            <span className="match-team-seed">11</span>
            <img className="match-team-logo" src={rankedTeams[10].logo}></img>
            <span className="match-team-name">
              {rankedTeams[10].team} ({rankedTeams[10].player[0].toUpperCase()}
              {rankedTeams[10].player[1].toUpperCase()})
            </span>
          </div>
        </div>
        <div className="match">
          <div className="match-team">
            <span className="match-team-seed">3</span>
            <img className="match-team-logo" src={rankedTeams[2].logo}></img>
            <span className="match-team-name">
              {rankedTeams[2].team} ({rankedTeams[2].player[0].toUpperCase()}
              {rankedTeams[2].player[1].toUpperCase()})
            </span>
          </div>
          <div className="match-team">
            <span className="match-team-seed">14</span>
            <img className="match-team-logo" src={rankedTeams[13].logo}></img>
            <span className="match-team-name">
              {rankedTeams[13].team} ({rankedTeams[13].player[0].toUpperCase()}
              {rankedTeams[13].player[1].toUpperCase()})
            </span>
          </div>
        </div>
        <div className="match">
          <div className="match-team">
            <span className="match-team-seed">7</span>
            <img className="match-team-logo" src={rankedTeams[6].logo}></img>
            <span className="match-team-name">
              {rankedTeams[6].team} ({rankedTeams[6].player[0].toUpperCase()}
              {rankedTeams[6].player[1].toUpperCase()})
            </span>
          </div>
          <div className="match-team">
            <span className="match-team-seed">10</span>
            <img className="match-team-logo" src={rankedTeams[9].logo}></img>
            <span className="match-team-name">
              {rankedTeams[9].team} ({rankedTeams[9].player[0].toUpperCase()}
              {rankedTeams[9].player[1].toUpperCase()})
            </span>
          </div>
        </div>
        <div className="match">
          <div className="match-team">
            <span className="match-team-seed">2</span>
            <img className="match-team-logo" src={rankedTeams[0].logo}></img>
            <span className="match-team-name">
              {rankedTeams[0].team} ({rankedTeams[0].player[0].toUpperCase()}
              {rankedTeams[0].player[1].toUpperCase()})
            </span>
          </div>
          <div className="match-team">
            <span className="match-team-seed">15</span>
            <img className="match-team-logo" src={rankedTeams[14].logo}></img>
            <span className="match-team-name">
              {rankedTeams[14].team} ({rankedTeams[14].player[0].toUpperCase()}
              {rankedTeams[14].player[1].toUpperCase()})
            </span>
          </div>
        </div>
      </div>
    </StyledPlayoffsContainer>
  )
}

export default PlayoffsBracket

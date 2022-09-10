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
            <img className="match-team-logo" src={rankedTeams.at(0).logo}></img>
            <span className="match-team-name">
              {rankedTeams.at(0).team} (
              {rankedTeams.at(0).player[0].toUpperCase()}
              {rankedTeams.at(0).player[1].toUpperCase()})
            </span>
          </div>
          <Divider />
          <div className="match-team">
            <span className="match-team-seed">16</span>
            <img
              className="match-team-logo"
              src={rankedTeams.at(15).logo}
            ></img>
            <span className="match-team-name">
              {rankedTeams.at(15).team} (
              {rankedTeams.at(15).player[0].toUpperCase()}
              {rankedTeams.at(15).player[1].toUpperCase()})
            </span>
          </div>
        </div>
        <div className="match">
          <div className="match-team">
            <span className="match-team-seed">8</span>
            <img className="match-team-logo" src={rankedTeams.at(7).logo}></img>
            <span className="match-team-name">
              {rankedTeams.at(7).team} (
              {rankedTeams.at(7).player[0].toUpperCase()}
              {rankedTeams.at(7).player[1].toUpperCase()})
            </span>
          </div>
          <div className="match-team">
            <span className="match-team-seed">9</span>
            <img className="match-team-logo" src={rankedTeams.at(8).logo}></img>
            <span className="match-team-name">
              {rankedTeams.at(8).team} (
              {rankedTeams.at(8).player[0].toUpperCase()}
              {rankedTeams.at(8).player[1].toUpperCase()})
            </span>
          </div>
        </div>
        <div className="match">
          <div className="match-team">
            <span className="match-team-seed">5</span>
            <img className="match-team-logo" src={rankedTeams.at(4).logo}></img>
            <span className="match-team-name">
              {rankedTeams.at(4).team} (
              {rankedTeams.at(4).player[0].toUpperCase()}
              {rankedTeams.at(4).player[1].toUpperCase()})
            </span>
          </div>
          <div className="match-team">
            <span className="match-team-seed">12</span>
            <img
              className="match-team-logo"
              src={rankedTeams.at(11).logo}
            ></img>
            <span className="match-team-name">
              {rankedTeams.at(11).team} (
              {rankedTeams.at(11).player[0].toUpperCase()}
              {rankedTeams.at(11).player[1].toUpperCase()})
            </span>
          </div>
        </div>
        <div className="match">
          <div className="match-team">
            <span className="match-team-seed">4</span>
            <img className="match-team-logo" src={rankedTeams.at(3).logo}></img>
            <span className="match-team-name">
              {rankedTeams.at(3).team} (
              {rankedTeams.at(3).player[0].toUpperCase()}
              {rankedTeams.at(3).player[1].toUpperCase()})
            </span>
          </div>
          <div className="match-team">
            <span className="match-team-seed">13</span>
            <img
              className="match-team-logo"
              src={rankedTeams.at(12).logo}
            ></img>
            <span className="match-team-name">
              {rankedTeams.at(12).team} (
              {rankedTeams.at(12).player[0].toUpperCase()}
              {rankedTeams.at(12).player[1].toUpperCase()})
            </span>
          </div>
        </div>
      </div>
      <div className="playoff__container-right">
        <div className="match">
          <div className="match-team">
            <span className="match-team-seed">6</span>
            <img className="match-team-logo" src={rankedTeams.at(5).logo}></img>
            <span className="match-team-name">
              {rankedTeams.at(5).team} (
              {rankedTeams.at(5).player[0].toUpperCase()}
              {rankedTeams.at(5).player[1].toUpperCase()})
            </span>
          </div>
          <div className="match-team">
            <span className="match-team-seed">11</span>
            <img
              className="match-team-logo"
              src={rankedTeams.at(10).logo}
            ></img>
            <span className="match-team-name">
              {rankedTeams.at(10).team} (
              {rankedTeams.at(10).player[0].toUpperCase()}
              {rankedTeams.at(10).player[1].toUpperCase()})
            </span>
          </div>
        </div>
        <div className="match">
          <div className="match-team">
            <span className="match-team-seed">3</span>
            <img className="match-team-logo" src={rankedTeams.at(2).logo}></img>
            <span className="match-team-name">
              {rankedTeams.at(2).team} (
              {rankedTeams.at(2).player[0].toUpperCase()}
              {rankedTeams.at(2).player[1].toUpperCase()})
            </span>
          </div>
          <div className="match-team">
            <span className="match-team-seed">14</span>
            <img
              className="match-team-logo"
              src={rankedTeams.at(13).logo}
            ></img>
            <span className="match-team-name">
              {rankedTeams.at(13).team} (
              {rankedTeams.at(13).player[0].toUpperCase()}
              {rankedTeams.at(13).player[1].toUpperCase()})
            </span>
          </div>
        </div>
        <div className="match">
          <div className="match-team">
            <span className="match-team-seed">7</span>
            <img className="match-team-logo" src={rankedTeams.at(6).logo}></img>
            <span className="match-team-name">
              {rankedTeams.at(6).team} (
              {rankedTeams.at(6).player[0].toUpperCase()}
              {rankedTeams.at(6).player[1].toUpperCase()})
            </span>
          </div>
          <div className="match-team">
            <span className="match-team-seed">10</span>
            <img className="match-team-logo" src={rankedTeams.at(9).logo}></img>
            <span className="match-team-name">
              {rankedTeams.at(9).team} (
              {rankedTeams.at(9).player[0].toUpperCase()}
              {rankedTeams.at(9).player[1].toUpperCase()})
            </span>
          </div>
        </div>
        <div className="match">
          <div className="match-team">
            <span className="match-team-seed">2</span>
            <img className="match-team-logo" src={rankedTeams.at(1).logo}></img>
            <span className="match-team-name">
              {rankedTeams.at(1).team} (
              {rankedTeams.at(1).player[0].toUpperCase()}
              {rankedTeams.at(1).player[1].toUpperCase()})
            </span>
          </div>
          <div className="match-team">
            <span className="match-team-seed">15</span>
            <img
              className="match-team-logo"
              src={rankedTeams.at(14).logo}
            ></img>
            <span className="match-team-name">
              {rankedTeams.at(14).team} (
              {rankedTeams.at(14).player[0].toUpperCase()}
              {rankedTeams.at(14).player[1].toUpperCase()})
            </span>
          </div>
        </div>
      </div>
    </StyledPlayoffsContainer>
  )
}

export default PlayoffsBracket

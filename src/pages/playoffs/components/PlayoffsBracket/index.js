import Divider from '@mui/material/Divider'
import { StyledPlayoffsContainer } from './styled'
import { database } from './../../../../api'
import bracket from './../../../../images/bracket.png'

const PlayoffsBracket = ({ rankedTeams }) => {
  console.log(rankedTeams)
  return (
    <StyledPlayoffsContainer>
      <div className="playoff__container-left">
        <div className="playoff__first-round">
          <div className="match">
            <div className="match-team">
              <span className="match-team-seed">1</span>
              <img
                className="match-team-logo"
                src={`${database}/logos/${rankedTeams[0].id}`}
              />
              <span className="match-team-name">
                {rankedTeams[0].team} (
                {rankedTeams[0].player.name[0].toUpperCase()}
                {rankedTeams[0].player.name[1].toUpperCase()})
              </span>
            </div>
            <Divider />
            <div className="match-team">
              <span className="match-team-seed">16</span>
              <img
                className="match-team-logo"
                src={`${database}/logos/${rankedTeams[15].id}`}
              />
              <span className="match-team-name">
                {rankedTeams[15].team} (
                {rankedTeams[15].player.name[0].toUpperCase()}
                {rankedTeams[15].player.name[1].toUpperCase()})
              </span>
            </div>
          </div>
          <div className="match">
            <div className="match-team">
              <span className="match-team-seed">8</span>
              <img
                className="match-team-logo"
                src={`${database}/logos/${rankedTeams[7].id}`}
              />
              <span className="match-team-name">
                {rankedTeams[7].team} (
                {rankedTeams[7].player.name[0].toUpperCase()}
                {rankedTeams[7].player.name[1].toUpperCase()})
              </span>
            </div>
            <div className="match-team">
              <span className="match-team-seed">9</span>
              <img
                className="match-team-logo"
                src={`${database}/logos/${rankedTeams[8].id}`}
              />
              <span className="match-team-name">
                {rankedTeams[8].team} (
                {rankedTeams[8].player.name[0].toUpperCase()}
                {rankedTeams[8].player.name[1].toUpperCase()})
              </span>
            </div>
          </div>
          <div className="match">
            <div className="match-team">
              <span className="match-team-seed">5</span>
              <img
                className="match-team-logo"
                src={`${database}/logos/${rankedTeams[4].id}`}
              />
              <span className="match-team-name">
                {rankedTeams[4].team} (
                {rankedTeams[4].player.name[0].toUpperCase()}
                {rankedTeams[4].player.name[1].toUpperCase()})
              </span>
            </div>
            <div className="match-team">
              <span className="match-team-seed">12</span>
              <img
                className="match-team-logo"
                src={`${database}/logos/${rankedTeams[11].id}`}
              />
              <span className="match-team-name">
                {rankedTeams[11].team} (
                {rankedTeams[11].player.name[0].toUpperCase()}
                {rankedTeams[11].player.name[1].toUpperCase()})
              </span>
            </div>
          </div>
          <div className="match">
            <div className="match-team">
              <span className="match-team-seed">4</span>
              <img
                className="match-team-logo"
                src={`${database}/logos/${rankedTeams[3].id}`}
              />
              <span className="match-team-name">
                {rankedTeams[3].team} (
                {rankedTeams[3].player.name[0].toUpperCase()}
                {rankedTeams[3].player.name[1].toUpperCase()})
              </span>
            </div>
            <div className="match-team">
              <span className="match-team-seed">13</span>
              <img
                className="match-team-logo"
                src={`${database}/logos/${rankedTeams[12].id}`}
              />
              <span className="match-team-name">
                {rankedTeams[12].team} (
                {rankedTeams[12].player.name[0].toUpperCase()}
                {rankedTeams[12].player.name[1].toUpperCase()})
              </span>
            </div>
          </div>
        </div>
        <div className="brackets two">
          <img src={bracket} />
          <img src={bracket} />
        </div>
        <div className="playoff__second-round">
          <div className="match">
            <div className="match-team">
              {/* <span className="match-team-seed">1</span>
              <img className="match-team-logo" src={rankedTeams[0].logo}></img>
              <span className="match-team-name">
                {rankedTeams[0].team} ({rankedTeams[0].player[0].toUpperCase()}
                {rankedTeams[0].player[1].toUpperCase()})
              </span> */}
            </div>
            <Divider />
            <div className="match-team">
              {/* <span className="match-team-seed">16</span>
              <img className="match-team-logo" src={rankedTeams[15].logo}></img>
              <span className="match-team-name">
                {rankedTeams[15].team} (
                {rankedTeams[15].player[0].toUpperCase()}
                {rankedTeams[15].player[1].toUpperCase()})
              </span> */}
            </div>
          </div>
          <div className="match">
            <div className="match-team">
              {/* <span className="match-team-seed">1</span>
              <img className="match-team-logo" src={rankedTeams[0].logo}></img>
              <span className="match-team-name">
                {rankedTeams[0].team} ({rankedTeams[0].player[0].toUpperCase()}
                {rankedTeams[0].player[1].toUpperCase()})
              </span> */}
            </div>
            <Divider />
            <div className="match-team">
              {/* <span className="match-team-seed">16</span>
              <img className="match-team-logo" src={rankedTeams[15].logo}></img>
              <span className="match-team-name">
                {rankedTeams[15].team} (
                {rankedTeams[15].player[0].toUpperCase()}
                {rankedTeams[15].player[1].toUpperCase()})
              </span> */}
            </div>
          </div>
        </div>
        <div className="brackets one">
          <img src={bracket} />
        </div>
        <div className="playoff__third-round">
          <div className="match">
            <div className="match-team">
              {/* <span className="match-team-seed">1</span>
              <img className="match-team-logo" src={rankedTeams[0].logo}></img>
              <span className="match-team-name">
                {rankedTeams[0].team} ({rankedTeams[0].player[0].toUpperCase()}
                {rankedTeams[0].player[1].toUpperCase()})
              </span> */}
            </div>
            <Divider />
            <div className="match-team">
              {/* <span className="match-team-seed">16</span>
              <img className="match-team-logo" src={rankedTeams[15].logo}></img>
              <span className="match-team-name">
                {rankedTeams[15].team} (
                {rankedTeams[15].player[0].toUpperCase()}
                {rankedTeams[15].player[1].toUpperCase()})
              </span> */}
            </div>
          </div>
        </div>
      </div>
      <div className="playoff__container-center">
        <div className="match">
          <div
            style={{
              backgroundColor: '#001a2a',
              color: '#fff',
              fontWeight: 700,
              padding: '0.5rem 0',
              textAlign: 'center',
              textDecoration: 'underline',
            }}
          >
            Final
          </div>
          <div className="match-team">
            {/* <span className="match-team-seed">6</span>
            <img className="match-team-logo" src={rankedTeams[5].logo}></img>
            <span className="match-team-name">
              {rankedTeams[5].team} ({rankedTeams[5].player[0].toUpperCase()}
              {rankedTeams[5].player[1].toUpperCase()})
            </span> */}
          </div>
          <div className="match-team">
            {/* <span className="match-team-seed">11</span>
            <img className="match-team-logo" src={rankedTeams[10].logo}></img>
            <span className="match-team-name">
              {rankedTeams[10].team} ({rankedTeams[10].player[0].toUpperCase()}
              {rankedTeams[10].player[1].toUpperCase()})
            </span> */}
          </div>
        </div>
      </div>
      <div className="playoff__container-right">
        <div className="playoff__first-round">
          <div className="match">
            <div className="match-team">
              <span className="match-team-seed">6</span>
              <img
                className="match-team-logo"
                src={`${database}/logos/${rankedTeams[5].id}`}
              />
              <span className="match-team-name">
                {rankedTeams[5].team} (
                {rankedTeams[5].player.name[0].toUpperCase()}
                {rankedTeams[5].player.name[1].toUpperCase()})
              </span>
            </div>
            <div className="match-team">
              <span className="match-team-seed">11</span>
              <img
                className="match-team-logo"
                src={`${database}/logos/${rankedTeams[10].id}`}
              />
              <span className="match-team-name">
                {rankedTeams[10].team} (
                {rankedTeams[10].player.name[0].toUpperCase()}
                {rankedTeams[10].player.name[1].toUpperCase()})
              </span>
            </div>
          </div>
          <div className="match">
            <div className="match-team">
              <span className="match-team-seed">3</span>
              <img
                className="match-team-logo"
                src={`${database}/logos/${rankedTeams[2].id}`}
              />
              <span className="match-team-name">
                {rankedTeams[2].team} (
                {rankedTeams[2].player.name[0].toUpperCase()}
                {rankedTeams[2].player.name[1].toUpperCase()})
              </span>
            </div>
            <div className="match-team">
              <span className="match-team-seed">14</span>
              <img
                className="match-team-logo"
                src={`${database}/logos/${rankedTeams[13].id}`}
              />
              <span className="match-team-name">
                {rankedTeams[13].team} (
                {rankedTeams[13].player.name[0].toUpperCase()}
                {rankedTeams[13].player.name[1].toUpperCase()})
              </span>
            </div>
          </div>
          <div className="match">
            <div className="match-team">
              <span className="match-team-seed">7</span>
              <img
                className="match-team-logo"
                src={`${database}/logos/${rankedTeams[6].id}`}
              />
              <span className="match-team-name">
                {rankedTeams[6].team} (
                {rankedTeams[6].player.name[0].toUpperCase()}
                {rankedTeams[6].player.name[1].toUpperCase()})
              </span>
            </div>
            <div className="match-team">
              <span className="match-team-seed">10</span>
              <img
                className="match-team-logo"
                src={`${database}/logos/${rankedTeams[9].id}`}
              />
              <span className="match-team-name">
                {rankedTeams[9].team} (
                {rankedTeams[9].player.name[0].toUpperCase()}
                {rankedTeams[9].player.name[1].toUpperCase()})
              </span>
            </div>
          </div>
          <div className="match">
            <div className="match-team">
              <span className="match-team-seed">2</span>
              <img
                className="match-team-logo"
                src={`${database}/logos/${rankedTeams[1].id}`}
              />
              <span className="match-team-name">
                {rankedTeams[1].team} (
                {rankedTeams[1].player.name[0].toUpperCase()}
                {rankedTeams[1].player.name[1].toUpperCase()})
              </span>
            </div>
            <div className="match-team">
              <span className="match-team-seed">15</span>
              <img
                className="match-team-logo"
                src={`${database}/logos/${rankedTeams[14].id}`}
              />
              <span className="match-team-name">
                {rankedTeams[14].team} (
                {rankedTeams[14].player.name[0].toUpperCase()}
                {rankedTeams[14].player.name[1].toUpperCase()})
              </span>
            </div>
          </div>
        </div>
        <div className="brackets two reverse">
          <img src={bracket} />
          <img src={bracket} />
        </div>
        <div className="playoff__second-round">
          <div className="match">
            <div className="match-team">
              {/* <span className="match-team-seed">1</span>
              <img className="match-team-logo" src={rankedTeams[0].logo}></img>
              <span className="match-team-name">
                {rankedTeams[0].team} ({rankedTeams[0].player[0].toUpperCase()}
                {rankedTeams[0].player[1].toUpperCase()})
              </span> */}
            </div>
            <Divider />
            <div className="match-team">
              {/* <span className="match-team-seed">16</span>
              <img className="match-team-logo" src={rankedTeams[15].logo}></img>
              <span className="match-team-name">
                {rankedTeams[15].team} (
                {rankedTeams[15].player[0].toUpperCase()}
                {rankedTeams[15].player[1].toUpperCase()})
              </span> */}
            </div>
          </div>
          <div className="match">
            <div className="match-team">
              {/* <span className="match-team-seed">1</span>
              <img className="match-team-logo" src={rankedTeams[0].logo}></img>
              <span className="match-team-name">
                {rankedTeams[0].team} ({rankedTeams[0].player[0].toUpperCase()}
                {rankedTeams[0].player[1].toUpperCase()})
              </span> */}
            </div>
            <Divider />
            <div className="match-team">
              {/* <span className="match-team-seed">16</span>
              <img className="match-team-logo" src={rankedTeams[15].logo}></img>
              <span className="match-team-name">
                {rankedTeams[15].team} (
                {rankedTeams[15].player[0].toUpperCase()}
                {rankedTeams[15].player[1].toUpperCase()})
              </span> */}
            </div>
          </div>
        </div>
        <div className="brackets one reverse">
          <img src={bracket} />
        </div>
        <div className="playoff__third-round">
          <div className="match">
            <div className="match-team">
              {/* <span className="match-team-seed">1</span>
              <img className="match-team-logo" src={rankedTeams[0].logo}></img>
              <span className="match-team-name">
                {rankedTeams[0].team} ({rankedTeams[0].player[0].toUpperCase()}
                {rankedTeams[0].player[1].toUpperCase()})
              </span> */}
            </div>
            <Divider />
            <div className="match-team">
              {/* <span className="match-team-seed">16</span>
              <img className="match-team-logo" src={rankedTeams[15].logo}></img>
              <span className="match-team-name">
                {rankedTeams[15].team} (
                {rankedTeams[15].player[0].toUpperCase()}
                {rankedTeams[15].player[1].toUpperCase()})
              </span> */}
            </div>
          </div>
        </div>
      </div>
    </StyledPlayoffsContainer>
  )
}

export default PlayoffsBracket

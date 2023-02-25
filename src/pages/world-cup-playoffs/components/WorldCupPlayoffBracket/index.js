// import { useState, useEffect } from 'react'
import PlayoffsMatch from './../WorldCupPlayoffMatch'
import ChampionCard from './../ChampionCard'
import FinalistCard from './../FinalistCard'
import { StyledPlayoffsContainer } from './styled'
// import bracket from './../../../../images/bracket.png'
// import axios from 'axios'
// import { api } from './../../../../api'

const PlayoffsBracket = ({
  firstQuadrant,
  secondQuadrant,
  thirdQuadrant,
  fourthQuadrant,
  matches,
}) => {
  const sortedByWinsFirstQuadrant = [...firstQuadrant].sort((a, b) =>
    a.winsInPlayoffs > b.winsInPlayoffs ? -1 : 1,
  )

  const sortedByWinsSecondQuadrant = [...secondQuadrant].sort((a, b) =>
    a.winsInPlayoffs > b.winsInPlayoffs ? -1 : 1,
  )

  const sortedByWinsThirdQuadrant = [...thirdQuadrant].sort((a, b) =>
    a.winsInPlayoffs > b.winsInPlayoffs ? -1 : 1,
  )

  const sortedByWinsFourthQuadrant = [...fourthQuadrant].sort((a, b) =>
    a.winsInPlayoffs > b.winsInPlayoffs ? -1 : 1,
  )

  return (
    <StyledPlayoffsContainer>
      <div className="playoff__first-round">
        <PlayoffsMatch
          topTeam={firstQuadrant[0]}
          bottomTeam={firstQuadrant[1]}
          matches={matches}
        />
        <PlayoffsMatch
          topTeam={firstQuadrant[2]}
          bottomTeam={firstQuadrant[3]}
          matches={matches}
        />
        <PlayoffsMatch
          topTeam={secondQuadrant[0]}
          bottomTeam={secondQuadrant[1]}
          matches={matches}
        />
        <PlayoffsMatch
          topTeam={secondQuadrant[2]}
          bottomTeam={secondQuadrant[3]}
          matches={matches}
        />
        <PlayoffsMatch
          topTeam={thirdQuadrant[0]}
          bottomTeam={thirdQuadrant[1]}
          matches={matches}
        />
        <PlayoffsMatch
          topTeam={thirdQuadrant[2]}
          bottomTeam={thirdQuadrant[3]}
          matches={matches}
        />
        <PlayoffsMatch
          topTeam={fourthQuadrant[0]}
          bottomTeam={fourthQuadrant[1]}
          matches={matches}
        />
        <PlayoffsMatch
          topTeam={fourthQuadrant[2]}
          bottomTeam={fourthQuadrant[3]}
          matches={matches}
        />
      </div>
      <div className="playoff__second-round">
        {(firstQuadrant[0].winsInPlayoffs || firstQuadrant[1].winsInPlayoffs) &&
        (firstQuadrant[2].winsInPlayoffs || firstQuadrant[3].winsInPlayoffs) ? (
          <PlayoffsMatch
            topTeam={
              firstQuadrant[0].winsInPlayoffs > firstQuadrant[1].winsInPlayoffs
                ? firstQuadrant[0]
                : firstQuadrant[1]
            }
            bottomTeam={
              firstQuadrant[2].winsInPlayoffs > firstQuadrant[3].winsInPlayoffs
                ? firstQuadrant[2]
                : firstQuadrant[3]
            }
            matches={matches}
          />
        ) : null}
        {(secondQuadrant[0].winsInPlayoffs ||
          secondQuadrant[1].winsInPlayoffs) &&
        (secondQuadrant[2].winsInPlayoffs ||
          secondQuadrant[3].winsInPlayoffs) ? (
          <PlayoffsMatch
            topTeam={
              secondQuadrant[0].winsInPlayoffs >
              secondQuadrant[1].winsInPlayoffs
                ? secondQuadrant[0]
                : secondQuadrant[1]
            }
            bottomTeam={
              secondQuadrant[2].winsInPlayoffs >
              secondQuadrant[3].winsInPlayoffs
                ? secondQuadrant[2]
                : secondQuadrant[3]
            }
            matches={matches}
          />
        ) : null}
        {(thirdQuadrant[0].winsInPlayoffs || thirdQuadrant[1].winsInPlayoffs) &&
        (thirdQuadrant[2].winsInPlayoffs || thirdQuadrant[3].winsInPlayoffs) ? (
          <PlayoffsMatch
            topTeam={
              thirdQuadrant[0].winsInPlayoffs > thirdQuadrant[1].winsInPlayoffs
                ? thirdQuadrant[0]
                : thirdQuadrant[1]
            }
            bottomTeam={
              thirdQuadrant[2].winsInPlayoffs > thirdQuadrant[3].winsInPlayoffs
                ? thirdQuadrant[2]
                : thirdQuadrant[3]
            }
            matches={matches}
          />
        ) : null}
        {(fourthQuadrant[0].winsInPlayoffs ||
          fourthQuadrant[1].winsInPlayoffs) &&
        (fourthQuadrant[2].winsInPlayoffs ||
          fourthQuadrant[3].winsInPlayoffs) ? (
          <PlayoffsMatch
            topTeam={
              fourthQuadrant[0].winsInPlayoffs >
              fourthQuadrant[1].winsInPlayoffs
                ? fourthQuadrant[0]
                : fourthQuadrant[1]
            }
            bottomTeam={
              fourthQuadrant[2].winsInPlayoffs >
              fourthQuadrant[3].winsInPlayoffs
                ? fourthQuadrant[2]
                : fourthQuadrant[3]
            }
            matches={matches}
          />
        ) : null}
      </div>
      <div className="playoff__third-round">
        {sortedByWinsFirstQuadrant[0].winsInPlayoffs > 1 &&
          sortedByWinsSecondQuadrant[0].winsInPlayoffs > 1 && (
            <PlayoffsMatch
              topTeam={sortedByWinsFirstQuadrant[0]}
              bottomTeam={sortedByWinsSecondQuadrant[0]}
              matches={matches}
            />
          )}
        {sortedByWinsThirdQuadrant[0].winsInPlayoffs > 1 &&
          sortedByWinsFourthQuadrant[0].winsInPlayoffs > 1 && (
            <PlayoffsMatch
              topTeam={sortedByWinsThirdQuadrant[0]}
              bottomTeam={sortedByWinsFourthQuadrant[0]}
              matches={matches}
            />
          )}
      </div>
      <div className="playoff__last-round">
        <div className="playoff__champion">
          {sortedByWinsFirstQuadrant[0].winsInPlayoffs > 3 && (
            <ChampionCard champion={sortedByWinsFirstQuadrant[0]} />
          )}
          {sortedByWinsSecondQuadrant[0].winsInPlayoffs > 3 && (
            <ChampionCard champion={sortedByWinsSecondQuadrant[0]} />
          )}
          {sortedByWinsThirdQuadrant[0].winsInPlayoffs > 3 && (
            <ChampionCard champion={sortedByWinsThirdQuadrant[0]} />
          )}
          {sortedByWinsFourthQuadrant[0].winsInPlayoffs > 3 && (
            <ChampionCard champion={sortedByWinsFourthQuadrant[0]} />
          )}
        </div>
        {(sortedByWinsFirstQuadrant[0].winsInPlayoffs > 2 ||
          sortedByWinsSecondQuadrant[0].winsInPlayoffs > 2) &&
          (sortedByWinsThirdQuadrant[0].winsInPlayoffs > 2 ||
            sortedByWinsFourthQuadrant[0].winsInPlayoffs > 2) && (
            <>
              <PlayoffsMatch
                topTeam={
                  sortedByWinsFirstQuadrant[0].winsInPlayoffs >
                  sortedByWinsSecondQuadrant[0].winsInPlayoffs
                    ? sortedByWinsFirstQuadrant[0]
                    : sortedByWinsSecondQuadrant[0]
                }
                bottomTeam={
                  sortedByWinsThirdQuadrant[0].winsInPlayoffs >
                  sortedByWinsFourthQuadrant[0].winsInPlayoffs
                    ? sortedByWinsThirdQuadrant[0]
                    : sortedByWinsFourthQuadrant[0]
                }
                matches={matches}
              />
              <div className="playoff__finalist">
                {sortedByWinsFirstQuadrant[0].winsInPlayoffs == 3 && (
                  <FinalistCard finalist={sortedByWinsFirstQuadrant[0]} />
                )}
                {sortedByWinsSecondQuadrant[0].winsInPlayoffs == 3 && (
                  <FinalistCard finalist={sortedByWinsSecondQuadrant[0]} />
                )}
                {sortedByWinsThirdQuadrant[0].winsInPlayoffs == 3 && (
                  <FinalistCard finalist={sortedByWinsThirdQuadrant[0]} />
                )}
                {sortedByWinsFourthQuadrant[0].winsInPlayoffs == 3 && (
                  <FinalistCard finalist={sortedByWinsFourthQuadrant[0]} />
                )}
              </div>
            </>
          )}
      </div>
    </StyledPlayoffsContainer>
  )
}

export default PlayoffsBracket

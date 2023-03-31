// import { useState, useEffect } from 'react'
import PlayoffsMatch from '../PlayoffsMatch'
import { StyledPlayoffsContainer } from './styled'
import bracket from './../../../../images/bracket.png'
// import axios from 'axios'
// import { api } from './../../../../api'

const PlayoffsBracket = ({ teams, updatedWins, matches }) => {
  console.log(teams)
  console.log(updatedWins)
  console.log(matches)

  return (
    <StyledPlayoffsContainer>
      <div className="playoff__container-left">
        <div className="playoff__first-round">
          <PlayoffsMatch
            topTeam={teams[0]}
            bottomTeam={teams[15]}
            matches={matches}
          />
          <PlayoffsMatch
            topTeam={teams[7]}
            bottomTeam={teams[8]}
            matches={matches}
          />
          <PlayoffsMatch
            topTeam={teams[4]}
            bottomTeam={teams[11]}
            matches={matches}
          />
          <PlayoffsMatch
            topTeam={teams[3]}
            bottomTeam={teams[12]}
            matches={matches}
          />
        </div>
        <div className="brackets two">
          <img src={bracket} />
          <img src={bracket} />
        </div>
        <div className="playoff__second-round">
          <div
            style={{
              backgroundColor: '#001a2a',
              display: 'flex',
              height: '113px',
              justifyContent: 'center',
              margin: 'auto 0',
              width: '375px',
            }}
          >
            {/* Primer caso: el partido 1 está decidido, pero el 2 NO */}
            {updatedWins.length > 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[0].team.id)[0]
                .wins > 0 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[15].team.id,
                )[0].wins > 0) &&
              updatedWins.filter(({ team }) => team.id == teams[7].team.id)[0]
                .wins == 0 &&
              updatedWins.filter(({ team }) => team.id == teams[8].team.id)[0]
                .wins == 0 && (
                <PlayoffsMatch
                  topTeam={
                    updatedWins.filter(
                      ({ team }) => team.id == teams[0].team.id,
                    )[0].wins > 0
                      ? teams[0]
                      : teams[15]
                  }
                  bottomTeam={null}
                  matches={matches}
                />
              )}
            {/* Segundo caso: el partido 1 NO está decidido, pero el 2 SÍ */}
            {updatedWins.length > 0 &&
              updatedWins.filter(({ team }) => team.id == teams[0].team.id)[0]
                .wins == 0 &&
              updatedWins.filter(({ team }) => team.id == teams[15].team.id)[0]
                .wins == 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[7].team.id)[0]
                .wins > 0 ||
                updatedWins.filter(({ team }) => team.id == teams[8].team.id)[0]
                  .wins > 0) && (
                <PlayoffsMatch
                  topTeam={null}
                  bottomTeam={
                    updatedWins.filter(
                      ({ team }) => team.id == teams[7].team.id,
                    )[0].wins > 0
                      ? teams[7]
                      : teams[8]
                  }
                  matches={matches}
                />
              )}
            {/* Tercer caso: ambos partidos ya se jugaron */}
            {updatedWins.length > 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[0].team.id)[0]
                .wins > 0 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[15].team.id,
                )[0].wins > 0) &&
              (updatedWins.filter(({ team }) => team.id == teams[7].team.id)[0]
                .wins > 0 ||
                updatedWins.filter(({ team }) => team.id == teams[8].team.id)[0]
                  .wins > 0) && (
                <PlayoffsMatch
                  topTeam={
                    updatedWins.filter(
                      ({ team }) => team.id == teams[0].team.id,
                    )[0].wins > 0
                      ? teams[0]
                      : teams[15]
                  }
                  bottomTeam={
                    updatedWins.filter(
                      ({ team }) => team.id == teams[7].team.id,
                    )[0].wins > 0
                      ? teams[7]
                      : teams[8]
                  }
                  matches={matches}
                />
              )}
          </div>
          <div
            style={{
              backgroundColor: '#001a2a',
              display: 'flex',
              height: '113px',
              justifyContent: 'center',
              margin: 'auto 0',
              width: '375px',
            }}
          >
            {/* Primer caso: el partido 1 está decidido, pero el 2 NO */}
            {updatedWins.length > 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[4].team.id)[0]
                .wins > 0 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[11].team.id,
                )[0].wins > 0) &&
              updatedWins.filter(({ team }) => team.id == teams[3].team.id)[0]
                .wins == 0 &&
              updatedWins.filter(({ team }) => team.id == teams[12].team.id)[0]
                .wins == 0 && (
                <PlayoffsMatch
                  topTeam={
                    updatedWins.filter(
                      ({ team }) => team.id == teams[4].team.id,
                    )[0].wins > 0
                      ? teams[4]
                      : teams[11]
                  }
                  bottomTeam={null}
                  matches={matches}
                />
              )}
            {/* Segundo caso: el partido 1 NO está decidido, pero el 2 SÍ */}
            {updatedWins.length > 0 &&
              updatedWins.filter(({ team }) => team.id == teams[4].team.id)[0]
                .wins == 0 &&
              updatedWins.filter(({ team }) => team.id == teams[11].team.id)[0]
                .wins == 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[3].team.id)[0]
                .wins > 0 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[12].team.id,
                )[0].wins > 0) && (
                <PlayoffsMatch
                  topTeam={null}
                  bottomTeam={
                    updatedWins.filter(
                      ({ team }) => team.id == teams[3].team.id,
                    )[0].wins > 0
                      ? teams[3]
                      : teams[12]
                  }
                  matches={matches}
                />
              )}
            {/* Tercer caso: ambos partidos ya se jugaron */}
            {updatedWins.length > 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[4].team.id)[0]
                .wins > 0 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[11].team.id,
                )[0].wins > 0) &&
              (updatedWins.filter(({ team }) => team.id == teams[3].team.id)[0]
                .wins > 0 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[12].team.id,
                )[0].wins > 0) && (
                <PlayoffsMatch
                  topTeam={
                    updatedWins.filter(
                      ({ team }) => team.id == teams[4].team.id,
                    )[0].wins > 0
                      ? teams[4]
                      : teams[11]
                  }
                  bottomTeam={
                    updatedWins.filter(
                      ({ team }) => team.id == teams[3].team.id,
                    )[0].wins > 0
                      ? teams[3]
                      : teams[12]
                  }
                  matches={matches}
                />
              )}
          </div>
        </div>
        <div className="brackets one">
          <img src={bracket} />
        </div>
        <div className="playoff__third-round">
          <div
            style={{
              backgroundColor: '#001a2a',
              display: 'flex',
              height: '113px',
              justifyContent: 'center',
              margin: 'auto 0',
              width: '375px',
            }}
          >
            {/* Primer caso: el equipo de arriba está decidido, pero el de abajo NO */}
            {updatedWins.length > 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[0].team.id)[0]
                .wins > 1 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[15].team.id,
                )[0].wins > 1 ||
                updatedWins.filter(({ team }) => team.id == teams[7].team.id)[0]
                  .wins > 1 ||
                updatedWins.filter(({ team }) => team.id == teams[8].team.id)[0]
                  .wins > 1) &&
              updatedWins.filter(({ team }) => team.id == teams[4].team.id)[0]
                .wins <= 1 &&
              updatedWins.filter(({ team }) => team.id == teams[11].team.id)[0]
                .wins <= 1 &&
              updatedWins.filter(({ team }) => team.id == teams[3].team.id)[0]
                .wins <= 1 &&
              updatedWins.filter(({ team }) => team.id == teams[12].team.id)[0]
                .wins <= 1 && (
                <PlayoffsMatch
                  topTeam={updatedWins
                    .filter(
                      ({ team }) =>
                        team.id == teams[0].id ||
                        team.id == teams[15].id ||
                        team.id == teams[7].id ||
                        team.id == teams[8].id,
                    )
                    .sort((a, b) => (a.wins > b.wins ? -1 : 1))
                    .at(0)}
                  bottomTeam={null}
                  matches={matches}
                />
              )}
            {/* Segundo caso: el partido 1 NO está decidido, pero el 2 SÍ */}
            {updatedWins.length > 0 &&
              updatedWins.filter(({ team }) => team.id == teams[0].team.id)[0]
                .wins <= 1 &&
              updatedWins.filter(({ team }) => team.id == teams[15].team.id)[0]
                .wins <= 1 &&
              updatedWins.filter(({ team }) => team.id == teams[7].team.id)[0]
                .wins <= 1 &&
              updatedWins.filter(({ team }) => team.id == teams[8].team.id)[0]
                .wins <= 1 &&
              (updatedWins.filter(({ team }) => team.id == teams[4].team.id)[0]
                .wins > 1 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[11].team.id,
                )[0].wins > 1 ||
                updatedWins.filter(({ team }) => team.id == teams[3].team.id)[0]
                  .wins > 1 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[12].team.id,
                )[0].wins > 1) && (
                <PlayoffsMatch
                  topTeam={null}
                  bottomTeam={updatedWins
                    .filter(
                      ({ team }) =>
                        team.id == teams[4].team.id ||
                        team.id == teams[11].team.id ||
                        team.id == teams[3].team.id ||
                        team.id == teams[12].team.id,
                    )
                    .sort((a, b) => (a.wins > b.wins ? -1 : 1))
                    .at(0)}
                  matches={matches}
                />
              )}
            {/* Tercer caso: ambos partidos ya se jugaron */}
            {updatedWins.length > 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[0].team.id)[0]
                .wins > 1 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[15].team.id,
                )[0].wins > 1 ||
                updatedWins.filter(({ team }) => team.id == teams[7].team.id)[0]
                  .wins > 1 ||
                updatedWins.filter(({ team }) => team.id == teams[8].team.id)[0]
                  .wins > 1) &&
              (updatedWins.filter(({ team }) => team.id == teams[4].team.id)[0]
                .wins > 1 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[11].team.id,
                )[0].wins > 1 ||
                updatedWins.filter(({ team }) => team.id == teams[3].team.id)[0]
                  .wins > 1 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[12].team.id,
                )[0].wins > 1) && (
                <PlayoffsMatch
                  topTeam={updatedWins
                    .filter(
                      ({ team }) =>
                        team.id == teams[0].team.id ||
                        team.id == teams[15].team.id ||
                        team.id == teams[7].team.id ||
                        team.id == teams[8].team.id,
                    )
                    .sort((a, b) => (a.wins > b.wins ? -1 : 1))
                    .at(0)}
                  bottomTeam={updatedWins
                    .filter(
                      ({ team }) =>
                        team.id == teams[4].team.id ||
                        team.id == teams[11].team.id ||
                        team.id == teams[3].team.id ||
                        team.id == teams[12].team.id,
                    )
                    .sort((a, b) => (a.wins > b.wins ? -1 : 1))
                    .at(0)}
                  matches={matches}
                />
              )}
          </div>
        </div>
      </div>
      <div className="playoff__container-center">
        <div className="match">
          <div
            style={{
              backgroundColor: '#343825',
              display: 'flex',
              height: '113px',
              justifyContent: 'center',
              margin: 'auto 0',
              width: '375px',
            }}
          >
            <span style={{ color: '#fff', fontWeight: 700 }}>Final</span>
            {/* Primer caso: el finalista 1 está decidido, pero el 2 NO */}
            {updatedWins.length > 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[0].team.id)[0]
                .wins > 2 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[15].team.id,
                )[0].wins > 2 ||
                updatedWins.filter(({ team }) => team.id == teams[7].team.id)[0]
                  .wins > 2 ||
                updatedWins.filter(({ team }) => team.id == teams[8].team.id)[0]
                  .wins > 2 ||
                updatedWins.filter(({ team }) => team.id == teams[4].team.id)[0]
                  .wins > 2 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[11].team.id,
                )[0].wins > 2 ||
                updatedWins.filter(({ team }) => team.id == teams[3].team.id)[0]
                  .wins > 2 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[12].team.id,
                )[0].wins > 2) &&
              updatedWins.filter(({ team }) => team.id == teams[5].team.id)[0]
                .wins <= 2 &&
              updatedWins.filter(({ team }) => team.id == teams[10].team.id)[0]
                .wins <= 2 &&
              updatedWins.filter(({ team }) => team.id == teams[2].team.id)[0]
                .wins <= 2 &&
              updatedWins.filter(({ team }) => team.id == teams[13].team.id)[0]
                .wins <= 2 &&
              updatedWins.filter(({ team }) => team.id == teams[6].team.id)[0]
                .wins <= 2 &&
              updatedWins.filter(({ team }) => team.id == teams[9].team.id)[0]
                .wins <= 2 &&
              updatedWins.filter(({ team }) => team.id == teams[1].team.id)[0]
                .wins <= 2 &&
              updatedWins.filter(({ team }) => team.id == teams[14].team.id)[0]
                .wins <= 2 && (
                <PlayoffsMatch
                  topTeam={updatedWins
                    .filter(
                      ({ team }) =>
                        team.id == teams[0].team.id ||
                        team.id == teams[15].team.id ||
                        team.id == teams[7].team.id ||
                        team.id == teams[8].team.id ||
                        team.id == teams[4].team.id ||
                        team.id == teams[11].team.id ||
                        team.id == teams[3].team.id ||
                        team.id == teams[12].team.id,
                    )
                    .sort((a, b) => (a.wins > b.wins ? -1 : 1))
                    .at(0)}
                  bottomTeam={null}
                  matches={matches}
                />
              )}
            {/* Segundo caso: el partido 1 NO está decidido, pero el 2 SÍ */}
            {updatedWins.length > 0 &&
              updatedWins.filter(({ team }) => team.id == teams[0].team.id)[0]
                .wins <= 2 &&
              updatedWins.filter(({ team }) => team.id == teams[15].team.id)[0]
                .wins <= 2 &&
              updatedWins.filter(({ team }) => team.id == teams[7].team.id)[0]
                .wins <= 2 &&
              updatedWins.filter(({ team }) => team.id == teams[8].team.id)[0]
                .wins <= 2 &&
              updatedWins.filter(({ team }) => team.id == teams[4].team.id)[0]
                .wins <= 2 &&
              updatedWins.filter(({ team }) => team.id == teams[11].team.id)[0]
                .wins <= 2 &&
              updatedWins.filter(({ team }) => team.id == teams[3].team.id)[0]
                .wins <= 2 &&
              updatedWins.filter(({ team }) => team.id == teams[12].team.id)[0]
                .wins <= 2 &&
              (updatedWins.filter(({ team }) => team.id == teams[5].team.id)[0]
                .wins > 2 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[10].team.id,
                )[0].wins > 2 ||
                updatedWins.filter(({ team }) => team.id == teams[2].team.id)[0]
                  .wins > 2 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[13].team.id,
                )[0].wins > 2 ||
                updatedWins.filter(({ team }) => team.id == teams[6].team.id)[0]
                  .wins > 2 ||
                updatedWins.filter(({ team }) => team.id == teams[9].team.id)[0]
                  .wins > 2 ||
                updatedWins.filter(({ team }) => team.id == teams[1].team.id)[0]
                  .wins > 2 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[14].team.id,
                )[0].wins > 2) && (
                <PlayoffsMatch
                  topTeam={null}
                  bottomTeam={updatedWins
                    .filter(
                      ({ team }) =>
                        team.id == teams[5].team.id ||
                        team.id == teams[10].team.id ||
                        team.id == teams[2].team.id ||
                        team.id == teams[13].team.id ||
                        team.id == teams[6].team.id ||
                        team.id == teams[9].team.id ||
                        team.id == teams[1].team.id ||
                        team.id == teams[14].team.id,
                    )
                    .sort((a, b) => (a.wins > b.wins ? -1 : 1))
                    .at(0)}
                  matches={matches}
                />
              )}
            {/* Tercer caso: ambos partidos ya se jugaron */}
            {updatedWins.length > 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[0].team.id)[0]
                .wins > 2 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[15].team.id,
                )[0].wins > 2 ||
                updatedWins.filter(({ team }) => team.id == teams[7].team.id)[0]
                  .wins > 2 ||
                updatedWins.filter(({ team }) => team.id == teams[8].team.id)[0]
                  .wins > 2 ||
                updatedWins.filter(({ team }) => team.id == teams[4].team.id)[0]
                  .wins > 2 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[11].team.id,
                )[0].wins > 2 ||
                updatedWins.filter(({ team }) => team.id == teams[3].team.id)[0]
                  .wins > 2 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[12].team.id,
                )[0].wins > 2) &&
              (updatedWins.filter(({ team }) => team.id == teams[5].team.id)[0]
                .wins > 2 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[10].team.id,
                )[0].wins > 2 ||
                updatedWins.filter(({ team }) => team.id == teams[2].team.id)[0]
                  .wins > 2 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[13].team.id,
                )[0].wins > 2 ||
                updatedWins.filter(({ team }) => team.id == teams[6].team.id)[0]
                  .wins > 2 ||
                updatedWins.filter(({ team }) => team.id == teams[9].team.id)[0]
                  .wins > 2 ||
                updatedWins.filter(({ team }) => team.id == teams[1].team.id)[0]
                  .wins > 2 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[14].team.id,
                )[0].wins > 2) && (
                <PlayoffsMatch
                  topTeam={updatedWins
                    .filter(
                      ({ team }) =>
                        team.id == teams[0].team.id ||
                        team.id == teams[15].team.id ||
                        team.id == teams[7].team.id ||
                        team.id == teams[8].team.id ||
                        team.id == teams[4].team.id ||
                        team.id == teams[11].team.id ||
                        team.id == teams[3].team.id ||
                        team.id == teams[12].team.id,
                    )
                    .sort((a, b) => (a.wins > b.wins ? -1 : 1))
                    .at(0)}
                  bottomTeam={updatedWins
                    .filter(
                      ({ team }) =>
                        team.id == teams[5].team.id ||
                        team.id == teams[10].team.id ||
                        team.id == teams[2].team.id ||
                        team.id == teams[13].team.id ||
                        team.id == teams[6].team.id ||
                        team.id == teams[9].team.id ||
                        team.id == teams[1].team.id ||
                        team.id == teams[14].team.id,
                    )
                    .sort((a, b) => (a.wins > b.wins ? -1 : 1))
                    .at(0)}
                  matches={matches}
                />
              )}
          </div>
        </div>
      </div>
      <div className="playoff__container-right">
        <div className="playoff__first-round">
          <PlayoffsMatch
            topTeam={teams[5]}
            bottomTeam={teams[10]}
            matches={matches}
          />
          <PlayoffsMatch
            topTeam={teams[2]}
            bottomTeam={teams[13]}
            matches={matches}
          />
          <PlayoffsMatch
            topTeam={teams[6]}
            bottomTeam={teams[9]}
            matches={matches}
          />
          <PlayoffsMatch
            topTeam={teams[1]}
            bottomTeam={teams[14]}
            matches={matches}
          />
        </div>
        <div className="brackets two reverse">
          <img src={bracket} />
          <img src={bracket} />
        </div>
        <div className="playoff__second-round">
          <div
            style={{
              backgroundColor: '#001a2a',
              display: 'flex',
              height: '113px',
              justifyContent: 'center',
              margin: 'auto 0',
              width: '375px',
            }}
          >
            {/* Primer caso: el partido 1 está decidido, pero el 2 NO */}
            {updatedWins.length > 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[5].team.id)[0]
                .wins > 0 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[10].team.id,
                )[0].wins > 0) &&
              updatedWins.filter(({ team }) => team.id == teams[2].team.id)[0]
                .wins == 0 &&
              updatedWins.filter(({ team }) => team.id == teams[13].team.id)[0]
                .wins == 0 && (
                <PlayoffsMatch
                  topTeam={
                    updatedWins.filter(
                      ({ team }) => team.id == teams[5].team.id,
                    )[0].wins > 0
                      ? teams[5]
                      : teams[10]
                  }
                  bottomTeam={null}
                  matches={matches}
                />
              )}
            {/* Segundo caso: el partido 1 NO está decidido, pero el 2 SÍ */}
            {updatedWins.length > 0 &&
              updatedWins.filter(({ team }) => team.id == teams[5].team.id)[0]
                .wins == 0 &&
              updatedWins.filter(({ team }) => team.id == teams[10].team.id)[0]
                .wins == 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[2].team.id)[0]
                .wins > 0 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[13].team.id,
                )[0].wins > 0) && (
                <PlayoffsMatch
                  topTeam={null}
                  bottomTeam={
                    updatedWins.filter(
                      ({ team }) => team.id == teams[2].team.id,
                    )[0].wins > 0
                      ? teams[2]
                      : teams[13]
                  }
                  matches={matches}
                />
              )}
            {/* Tercer caso: ambos partidos ya se jugaron */}
            {updatedWins.length > 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[5].team.id)[0]
                .wins > 0 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[10].team.id,
                )[0].wins > 0) &&
              (updatedWins.filter(({ team }) => team.id == teams[2].team.id)[0]
                .wins > 0 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[13].team.id,
                )[0].wins > 0) && (
                <PlayoffsMatch
                  topTeam={
                    updatedWins.filter(
                      ({ team }) => team.id == teams[5].team.id,
                    )[0].wins > 0
                      ? teams[5]
                      : teams[10]
                  }
                  bottomTeam={
                    updatedWins.filter(
                      ({ team }) => team.id == teams[2].team.id,
                    )[0].wins > 0
                      ? teams[2]
                      : teams[13]
                  }
                  matches={matches}
                />
              )}
          </div>
          <div
            style={{
              backgroundColor: '#001a2a',
              display: 'flex',
              height: '113px',
              justifyContent: 'center',
              margin: 'auto 0',
              width: '375px',
            }}
          >
            {/* Primer caso: el partido 1 está decidido, pero el 2 NO */}
            {updatedWins.length > 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[6].team.id)[0]
                .wins > 0 ||
                updatedWins.filter(({ team }) => team.id == teams[9].team.id)[0]
                  .wins > 0) &&
              updatedWins.filter(({ team }) => team.id == teams[1].team.id)[0]
                .wins == 0 &&
              updatedWins.filter(({ team }) => team.id == teams[14].team.id)[0]
                .wins == 0 && (
                <PlayoffsMatch
                  topTeam={
                    updatedWins.filter(
                      ({ team }) => team.id == teams[6].team.id,
                    )[0].wins > 0
                      ? teams[6]
                      : teams[9]
                  }
                  bottomTeam={null}
                  matches={matches}
                />
              )}
            {/* Segundo caso: el partido 1 NO está decidido, pero el 2 SÍ */}
            {updatedWins.length > 0 &&
              updatedWins.filter(({ team }) => team.id == teams[6].team.id)[0]
                .wins == 0 &&
              updatedWins.filter(({ team }) => team.id == teams[9].team.id)[0]
                .wins == 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[1].team.id)[0]
                .wins > 0 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[14].team.id,
                )[0].wins > 0) && (
                <PlayoffsMatch
                  topTeam={null}
                  bottomTeam={
                    updatedWins.filter(
                      ({ team }) => team.id == teams[1].team.id,
                    )[0].wins > 0
                      ? teams[1]
                      : teams[14]
                  }
                  matches={matches}
                />
              )}
            {/* Tercer caso: ambos partidos ya se jugaron */}
            {updatedWins.length > 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[6].team.id)[0]
                .wins > 0 ||
                updatedWins.filter(({ team }) => team.id == teams[9].team.id)[0]
                  .wins > 0) &&
              (updatedWins.filter(({ team }) => team.id == teams[1].team.id)[0]
                .wins > 0 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[14].team.id,
                )[0].wins > 0) && (
                <PlayoffsMatch
                  topTeam={
                    updatedWins.filter(
                      ({ team }) => team.id == teams[6].team.id,
                    )[0].wins > 0
                      ? teams[6]
                      : teams[9]
                  }
                  bottomTeam={
                    updatedWins.filter(
                      ({ team }) => team.id == teams[1].team.id,
                    )[0].wins > 0
                      ? teams[1]
                      : teams[14]
                  }
                  matches={matches}
                />
              )}
          </div>
        </div>
        <div className="brackets one reverse">
          <img src={bracket} />
        </div>
        <div className="playoff__third-round">
          <div
            style={{
              backgroundColor: '#001a2a',
              display: 'flex',
              height: '113px',
              justifyContent: 'center',
              margin: 'auto 0',
              width: '325px',
            }}
          >
            {/* Primer caso: el equipo de arriba está decidido, pero el de abajo NO */}
            {updatedWins.length > 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[5].team.id)[0]
                .wins > 1 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[10].team.id,
                )[0].wins > 1 ||
                updatedWins.filter(({ team }) => team.id == teams[2].team.id)[0]
                  .wins > 1 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[13].team.id,
                )[0].wins > 1) &&
              updatedWins.filter(({ team }) => team.id == teams[6].team.id)[0]
                .wins <= 1 &&
              updatedWins.filter(({ team }) => team.id == teams[9].team.id)[0]
                .wins <= 1 &&
              updatedWins.filter(({ team }) => team.id == teams[1].team.id)[0]
                .wins <= 1 &&
              updatedWins.filter(({ team }) => team.id == teams[14].team.id)[0]
                .wins <= 1 && (
                <PlayoffsMatch
                  topTeam={updatedWins
                    .filter(
                      ({ team }) =>
                        team.id == teams[5].team.id ||
                        team.id == teams[10].team.id ||
                        team.id == teams[2].team.id ||
                        team.id == teams[13].team.id,
                    )
                    .sort((a, b) => (a.wins > b.wins ? -1 : 1))
                    .at(0)}
                  bottomTeam={null}
                  matches={matches}
                />
              )}
            {/* Segundo caso: el partido 1 NO está decidido, pero el 2 SÍ */}
            {updatedWins.length > 0 &&
              updatedWins.filter(({ team }) => team.id == teams[5].team.id)[0]
                .wins <= 1 &&
              updatedWins.filter(({ team }) => team.id == teams[10].team.id)[0]
                .wins <= 1 &&
              updatedWins.filter(({ team }) => team.id == teams[2].team.id)[0]
                .wins <= 1 &&
              updatedWins.filter(({ team }) => team.id == teams[13].team.id)[0]
                .wins <= 1 &&
              (updatedWins.filter(({ team }) => team.id == teams[6].team.id)[0]
                .wins > 1 ||
                updatedWins.filter(({ team }) => team.id == teams[9].team.id)[0]
                  .wins > 1 ||
                updatedWins.filter(({ team }) => team.id == teams[1].team.id)[0]
                  .wins > 1 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[14].team.id,
                )[0].wins > 1) && (
                <PlayoffsMatch
                  topTeam={null}
                  bottomTeam={updatedWins
                    .filter(
                      ({ team }) =>
                        team.id == teams[6].id ||
                        team.id == teams[9].id ||
                        team.id == teams[1].id ||
                        team.id == teams[14].id,
                    )
                    .sort((a, b) => (a.wins > b.wins ? -1 : 1))
                    .at(0)}
                  matches={matches}
                />
              )}
            {/* Tercer caso: ambos partidos ya se jugaron */}
            {updatedWins.length > 0 &&
              (updatedWins.filter(({ team }) => team.id == teams[5].team.id)[0]
                .wins > 1 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[10].team.id,
                )[0].wins > 1 ||
                updatedWins.filter(({ team }) => team.id == teams[2].team.id)[0]
                  .wins > 1 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[13].team.id,
                )[0].wins > 1) &&
              (updatedWins.filter(({ team }) => team.id == teams[6].team.id)[0]
                .wins > 1 ||
                updatedWins.filter(({ team }) => team.id == teams[9].team.id)[0]
                  .wins > 1 ||
                updatedWins.filter(({ team }) => team.id == teams[1].team.id)[0]
                  .wins > 1 ||
                updatedWins.filter(
                  ({ team }) => team.id == teams[14].team.id,
                )[0].wins > 1) && (
                <PlayoffsMatch
                  topTeam={updatedWins
                    .filter(
                      ({ team }) =>
                        team.id == teams[5].team.id ||
                        team.id == teams[10].team.id ||
                        team.id == teams[2].team.id ||
                        team.id == teams[13].team.id,
                    )
                    .sort((a, b) => (a.wins > b.wins ? -1 : 1))
                    .at(0)}
                  bottomTeam={updatedWins
                    .filter(
                      ({ team }) =>
                        team.id == teams[6].team.id ||
                        team.id == teams[9].team.id ||
                        team.id == teams[1].team.id ||
                        team.id == teams[14].team.id,
                    )
                    .sort((a, b) => (a.wins > b.wins ? -1 : 1))
                    .at(0)}
                  matches={matches}
                />
              )}
          </div>
        </div>
      </div>
    </StyledPlayoffsContainer>
  )
}

export default PlayoffsBracket

import * as React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { api } from './../../api'
import { Oval } from 'react-loader-spinner'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import PlayoffsTable from './components/PlayoffsTable'
import PlayerStatsTable from './../../components/PlayerStatsTable'
import PlayoffsBracket from './components/PlayoffsBracket'

const Playoffs = () => {
  const [playoffsData, setPlayoffsData] = useState()

  const getPlayoffsData = () => {
    const table = axios.get(`${api}/tournaments/:tournament/playoffs/table`)
    const playerInfo = axios.get(
      `${api}/tournaments/:tournament/playoffs/player-info`,
    )
    const bracket = axios.get(`${api}/tournaments/:tournament/playoffs/bracket`)
    const updatedWins = axios.get(
      `${api}/tournaments/:tournament/playoffs/updated-wins`,
    )

    Promise.all([table, playerInfo, bracket, updatedWins]).then((values) => {
      const data = values.map((response) => response.data)
      setPlayoffsData(data)
    })
  }

  useEffect(() => {
    getPlayoffsData()
  }, [])

  if (playoffsData) {
    const playoffsTeamsForTable = playoffsData[0]
    const playoffsPlayerInfo = playoffsData[1]
    const playoffsBracketInfo = playoffsData[2]
    const playoffsUpdatedWins = playoffsData[3].winsByTeam
    const playoffsMatches = playoffsData[3].playoffsMatches

    console.log(playoffsTeamsForTable)
    // console.log(playoffsUpdatedWins)
    // console.log(playoffsMatches)

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <TableContainer component={Paper}>
          <div className="title">Tabla general</div>
          <PlayoffsTable allTeams={playoffsTeamsForTable} />
        </TableContainer>
        <PlayerStatsTable
          stats={playoffsPlayerInfo.sort((a, b) =>
            a.totalPoints > b.totalPoints ? -1 : 1,
          )}
        />
        <PlayoffsBracket
          teams={playoffsBracketInfo}
          updatedWins={playoffsUpdatedWins}
          matches={playoffsMatches}
        />
      </motion.div>
    )
  } else {
    return (
      <div style={{ margin: 'auto', width: '100px' }}>
        <Oval
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="three-dots-loading"
          $wrapperStyle
          $wrapperClass
        />
      </div>
    )
  }
}

export default Playoffs

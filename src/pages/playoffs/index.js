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
    const table = axios.get(`${api}/playoffs/table`)
    const playerInfo = axios.get(`${api}/playoffs/player-info`)
    // const bracket = axios.get(`${api}/playoffs/bracket`)

    Promise.all([table, playerInfo]).then((values) => {
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
    // const sortedRankedTeams = playoffsData[2]

    // console.log(playoffsTeamsForTable)
    // console.log(playoffsPlayerInfo)
    // console.log(sortedRankedTeams)

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
        <PlayoffsBracket rankedTeams={playoffsTeamsForTable} />
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

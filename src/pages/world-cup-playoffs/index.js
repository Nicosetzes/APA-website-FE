import * as React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { api } from './../../api'
import { Oval } from 'react-loader-spinner'
import WorldCupPlayoffBracket from './components/WorldCupPlayoffBracket'

const WorldCupPlayoffs = () => {
  const tournament = '6372f83c88e2408e9cadcc73' // Harcodeado, REVISAR //

  const [worldCupPlayoffsData, setWorldCupPlayoffsData] = useState()

  const getWorldCupPlayoffsData = () => {
    const playoffTeams = axios.get(
      `${api}/world-cup/${tournament}/playoffs/teams`,
    )
    const playoffMatches = axios.get(
      `${api}/world-cup/${tournament}/playoffs/matches`,
    )

    Promise.all([playoffTeams, playoffMatches]).then((values) => {
      const data = values.map((response) => response.data)
      setWorldCupPlayoffsData(data)
    })
  }

  useEffect(() => {
    getWorldCupPlayoffsData()
  }, [])

  if (worldCupPlayoffsData) {
    console.log(worldCupPlayoffsData)
    const { firstQuadrant, secondQuadrant, thirdQuadrant, fourthQuadrant } =
      worldCupPlayoffsData[0]
    const worldCupPlayoffMatches = worldCupPlayoffsData[1]

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <WorldCupPlayoffBracket
          firstQuadrant={firstQuadrant}
          secondQuadrant={secondQuadrant}
          thirdQuadrant={thirdQuadrant}
          fourthQuadrant={fourthQuadrant}
          matches={worldCupPlayoffMatches}
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

export default WorldCupPlayoffs

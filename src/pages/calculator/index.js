import { useState, useEffect } from 'react'
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
  useNavigate,
} from 'react-router-dom'
import { api, database, cloudName } from './../../api'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Oval } from 'react-loader-spinner'

const Calculator = () => {
  const { tournament } = useParams()

  const location = useLocation()

  console.log(location)

  const teams = location?.state

  console.log(teams)

  const [calculatorData, setCalculatorData] = useState()

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${api}/tournaments/${tournament}/calculator`, {
          params: {
            teams: `${JSON.stringify(teams)}`,
          },
        })
        .then(({ data }) => {
          console.log(data)
          setCalculatorData(data)
        })
      // .catch((err) => {
      //   console.log(err)
      //   navigate('/')
      // })
    }
    fetchData()
  }, [])

  if (calculatorData) {
    const { teams, standings } = calculatorData
    console.log(teams)
    console.log(standings)
    return (
      <>
        <div>Calculadora</div>
        <div>
          Equipos:{' '}
          {teams.map(({ team, matches }) => (
            <div key={team.id}>
              <img
                src={`${database}/logos/${team.id}`}
                alt={team.id}
                style={{ margin: '0.5rem', width: '45px' }}
              />
              <span>Cantidad de partidos: {matches.length}</span>
            </div>
          ))}
        </div>
      </>
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

export default Calculator

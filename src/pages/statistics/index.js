import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { motion } from 'framer-motion'
import { StyledStatistics } from './styled'
import { api } from './../../api'
import BarChart from './../../charts/BarChart'
import DoughnutChart from './../../charts/DoughnutChart'
import MatchView from './components/MatchView'
import { Oval } from 'react-loader-spinner'
import axios from 'axios'

const Statistics = () => {
  // const isL = useMediaQuery({ query: "(min-width: 992px)" });
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  // const isSm = useMediaQuery({ query: "(min-width: 500px)" });
  // const isXS = useMediaQuery({ query: "(min-width: 400px)" });

  // const api = 'http://localhost:5000/api'

  const [stats, setStats] = useState()

  const slideUpVariant = {
    hidden: { y: 50 },
    visible: {
      y: 0,
      transition: {
        type: 'spring',
        duration: 1,
        bounce: 0.3,
      },
    },
  }

  useEffect(() => {
    const fetchData = async () => {
      console.log('Hago el fetch de data')
      const res = await axios.get(`${api}/statistics/`)
      setStats(res.data)
    }
    fetchData()
  }, [])

  console.log(stats)

  if (stats) {
    const { playerStats, recentMatches, accolades } = stats
    const { mostWins, mostDraws, mostLosses } = accolades

    console.log(stats)

    const dataForDoughnutChart = {
      labels: playerStats.map((data) => data.player),
      datasets: [
        {
          label: 'Victorias totales',
          data: playerStats.map((data) => data.wins),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#004a79',
            '#3daf44',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#004a79',
            '#3daf44',
          ],
        },
      ],
    }

    const optionsForDoughnutChart = {
      maintainAspectRatio: false,
      layout: {
        padding: 15,
      },
      plugins: {
        title: {
          align: 'center',
          display: true,
          text: 'Cantidad de victorias',
          font: {
            weight: 'bold',
            size: '17.5px',
          },
        },
        legend: {
          display: true, //Is the legend shown?
          position: 'right', //Position of the legend.
        },
      },
      // responsive: true,
    }

    const dataForBarChart = {
      labels: playerStats.map((data) => data.player),
      datasets: [
        {
          data: playerStats.map((data) => data.effectiveness),
          label: 'Efectividad (%)',
          fill: true,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#004a79',
            '#3daf44',
          ],
          borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#004a79', '#3daf44'],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#004a79',
            '#3daf44',
          ],
        },
      ],
    }

    const optionsForBarChart = {
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 100,
          position: 'left',
          title: {
            display: true,
            text: '% Efectividad (pts obtenidos/totales)',
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: '% Efectividad',
          font: {
            weight: 'bold',
            size: '17.5px',
          },
        },
        legend: {
          display: false, //Is the legend shown?
          position: 'right', //Position of the legend.
        },
      },
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <StyledStatistics>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              textDecoration: 'underline',
              margin: '1.5rem auto',
              width: 'fit-content',
            }}
          >
            Estadísticas
          </div>
          <div
            className="chart__container"
            style={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
            }}
          >
            <div
              style={{ width: '300px', height: '300px', display: 'flex' }}
              data-aos="fade-in"
              data-aos-duration="1000"
            >
              <BarChart
                data={dataForBarChart}
                options={optionsForBarChart}
                className="hola"
              />
            </div>
            <div
              style={{ width: '300px', height: '300px', margin: '1rem 0' }}
              data-aos="fade-in"
              data-aos-duration="1000"
            >
              <DoughnutChart
                data={dataForDoughnutChart}
                options={optionsForDoughnutChart}
              />
            </div>
          </div>
          <motion.div
            style={{
              display: 'grid',
              gridTemplateRows: isM ? 'auto' : 'auto auto',
              gridTemplateColumns: isM ? 'auto auto auto auto' : 'auto auto',
              justifyContent: 'space-evenly',
            }}
            initial="hidden"
            whileInView={'visible'}
            viewport={{ once: false, amount: 0.125 }}
            transition={{ staggerChildren: 0.1 }}
            variants={slideUpVariant}
          >
            {recentMatches.map((match, index) => (
              <MatchView key={index} match={match} />
            ))}
          </motion.div>
          <motion.div
            className="accolades"
            initial="hidden"
            whileInView={'visible'}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ staggerChildren: 0.1 }}
            variants={slideUpVariant}
          >
            <motion.div className="accolades-item" variants={slideUpVariant}>
              <div className="accolades-item-title">
                Mayor cantidad de victorias
              </div>
              <div className="accolades-item-player">{mostWins.player}</div>
              <div className="accolades-item-number">{mostWins.wins}</div>
            </motion.div>
            <motion.div className="accolades-item" variants={slideUpVariant}>
              <div className="accolades-item-title">
                Mayor cantidad de empates
              </div>
              <div className="accolades-item-player">{mostDraws.player}</div>
              <div className="accolades-item-number">{mostDraws.draws}</div>
            </motion.div>
            <motion.div className="accolades-item" variants={slideUpVariant}>
              <div className="accolades-item-title">
                Mayor cantidad de derrotas
              </div>
              <div className="accolades-item-player">{mostLosses.player}</div>
              <div className="accolades-item-number">{mostLosses.losses}</div>
            </motion.div>
          </motion.div>
        </StyledStatistics>
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

export default Statistics

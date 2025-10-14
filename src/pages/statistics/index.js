import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { StyledStatistics } from './styled'
import { api } from './../../api'
import BarChart from './../../charts/BarChart'
import DoughnutChart from './../../charts/DoughnutChart'
import axios from 'axios'
import StreakContainer from './components/StreakContainer'
import PageLoader from '../../components/PageLoader'

const Statistics = () => {
  const [stats, setStats] = useState()

  const flipVariant = {
    hidden: { rotateY: 180 },
    visible: {
      rotateY: 0,
      transition: {
        type: 'spring',
        duration: 1.5,
        bounce: 0.3,
      },
    },
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    console.log('Hago el fetch de data')
    const stats = axios.get(`${api}/statistics/`)
    const streaks = axios.get(`${api}/streaks/`)
    Promise.all([stats, streaks]).then((values) => {
      const res = values.map((response) => response.data)
      setStats(res)
    })
  }

  console.log(stats)

  if (stats) {
    const { playerStats } = stats[0]
    const { playerStreaks } = stats[1]

    console.log(stats)

    const dataForDoughnutChart = {
      labels: playerStats.map(({ player }) => player.name),
      datasets: [
        {
          label: 'Victorias totales',
          data: playerStats.map(({ wins }) => wins),
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
      labels: playerStats.map(({ player }) => player.name),
      datasets: [
        {
          data: playerStats.map(({ effectiveness }) => effectiveness),
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
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            Resultados recientes
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateRows: 'auto auto auto auto auto',
              gridTemplateColumns: 'auto',
              justifyContent: 'space-evenly',
              width: '100%',
            }}
          >
            {playerStreaks.map((individualStreak, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView={'visible'}
                viewport={{ once: false, amount: 0.125 }}
                transition={{ staggerChildren: 0.1 }}
                variants={flipVariant}
              >
                <StreakContainer individualStreak={individualStreak} />
              </motion.div>
            ))}
          </div>
        </StyledStatistics>
      </motion.div>
    )
  } else {
    return <PageLoader />
  }
}

export default Statistics

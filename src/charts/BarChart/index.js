import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
  TimeScale,
  BarElement,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
  TimeScale,
  BarElement,
)

const BarChart = ({ data, options }) => {
  return (
    <>
      <Bar data={data} options={options} />
    </>
  )
}

export default BarChart

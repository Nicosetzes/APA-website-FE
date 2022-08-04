import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DoughnutChart = ({ data, options }) => {
  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;

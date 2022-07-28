import { Doughnut } from "react-chartjs-3";
import { Chart } from "chart.js"

const DoughnutChart = ({ data, options }) => {

	console.log(data)
	console.log(options)

	// const DoughData = {
	// 	labels: ["Red", "Green", "Yellow"],
	// 	datasets: [
	// 		{
	// 			data: [300, 50, 100],
	// 			backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
	// 			hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
	// 		}
	// 	]
	// };

	// const options = {
	// 	legend: {
	// 		display: true,
	// 		position: "bottom"
	// 	}
	// };

	return (
		<div style={{ width: "600px", margin: "auto" }}>
			<Doughnut data={data} options={options} />
		</div>
	);
}

export default DoughnutChart;
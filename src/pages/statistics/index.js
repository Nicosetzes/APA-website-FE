import { useState, useEffect } from "react";
import axios from "axios";
// import BarChart from "../../views/charts/BarChart";
import DoughnutChart from "../../views/charts/DoughnutChart";
// import PieChart from "../../views/charts/PieChart";
// import LineChart from "../../views/charts/LineChart";
import { Oval } from 'react-loader-spinner'

const Statistics = () => {

	const api = "http://localhost:5000/api"

	const [stats, setStats] = useState();

	const options = {
		legend: {
			display: true,
			position: "bottom"
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			console.log("Hago el fetch de data")
			const res = await axios.get(`${api}/statistics/`);
			setStats(res.data);
		};
		fetchData();
	}, []);

	// console.log(userData);
	// console.log(stats);
	// console.log(userData);

	if (stats) {
		const userData = {
			labels: stats.map(individualStats => individualStats.player),
			datasets: [
				{
					data: stats.map(individualStats => individualStats.wins),
					backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#004a79", "#3daf44"],
					hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#004a79", "#3daf44"]
				}
			]
		}
		return (
			<>
				<div>Statistics</div>
				{/* <BarChart data={userData} options={options} /> */}
				<div style={{ margin: "auto" }}>
					<DoughnutChart data={userData} options={options} />
				</div>
				{/* <PieChart />
					<LineChart /> */}
			</>
		);
	}
	else {
		return (
			<div style={{ margin: "auto", width: "100px" }}>
				<Oval
					height="80"
					width="80"
					radius="9"
					color='green'
					ariaLabel='three-dots-loading'
					wrapperStyle
					wrapperClass
				/>
			</div>
		)
	}
}

export default Statistics;
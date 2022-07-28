import { Line } from "react-chartjs-3";
const LineChart = () => {
	const data = {
		labels: [
			"W5,Jun 21",
			"W1,Jul 21",
			"W2,Jul 21",
			"W3,Jul 21",
			"W4,Jul 21",
			"W5,Jul 21",
			"W1,Aug 21",
			"W2,Aug 21",
			"W3,Aug 21",
			"W4,Aug 21",
			"W5,Aug 21",
			"W1,Sep 21"
		],
		datasets: [
			{
				label: "Forecast",
				data: [33, 53, 85, 41, 44, 65],
				fill: false,
				lineTension: 0,
				pointBackgroundColor: "rgba(76, 163, 254,1)",
				borderColor: "rgba(76, 163, 254,0.7)"
			},
			{
				label: "Actual",
				data: [33, 25, 35, 51, 54, 76],
				lineTension: 0,
				fill: false,
				pointBackgroundColor: "rgba(241, 96, 101,1)",
				borderColor: "rgba(241, 96, 101,0.7)"
			}
		]
	};

	const options = {
		legend: {
			display: true,
			position: "bottom"
		},
		onClick: function (event, items) {
			console.log(event);
			console.log(items);
			var activePoints = items;
			//get the internal index of slice in pie chart
			var clickedElementindex = activePoints[0]["_index"];

			//get specific label by index
			var label = this.data.labels[clickedElementindex];
			console.log(label);
			//get value by index
			var value = this.data.datasets[0].data[clickedElementindex];
			console.log(value);
		}
	};

	return (
		<div style={{ width: "600px", margin: "1.5rem" }}>
			<Line data={data} options={options} />
			{/* <Doughnut data={DoughData} options={options} /> */}
		</div>
	);
}

export default LineChart;
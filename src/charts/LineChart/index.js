import { Line } from 'react-chartjs-2'

const LineChart = ({ data, options }) => {
  // const dataForLineChart = {
  // 	labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  // 	datasets: [
  // 		{
  // 			label: recentMatches[0].player,
  // 			data: recentMatches[0].goalsFor,
  // 			fill: false,
  // 			lineTension: 0,
  // 			pointBackgroundColor: "#FF6384",
  // 			borderColor: "#FF6384"
  // 		},
  // 		{
  // 			label: recentMatches[1].player,
  // 			data: recentMatches[1].goalsFor,
  // 			fill: false,
  // 			lineTension: 0,
  // 			pointBackgroundColor: "#36A2EB",
  // 			borderColor: "#36A2EB"
  // 		},
  // 		{
  // 			label: recentMatches[2].player,
  // 			data: recentMatches[2].goalsFor,
  // 			fill: false,
  // 			lineTension: 0,
  // 			pointBackgroundColor: "#FFCE56",
  // 			borderColor: "#FFCE56"
  // 		},
  // 		{
  // 			label: recentMatches[3].player,
  // 			data: recentMatches[3].goalsFor,
  // 			fill: false,
  // 			lineTension: 0,
  // 			pointBackgroundColor: "var(--blue-900)",
  // 			borderColor: "var(--blue-900)"
  // 		},
  // 		{
  // 			label: recentMatches[4].player,
  // 			data: recentMatches[4].goalsFor,
  // 			fill: false,
  // 			lineTension: 0,
  // 			pointBackgroundColor: "#3daf44",
  // 			borderColor: "#3daf44"
  // 		}

  // 	]
  // 	// recentMatches.map((info, index) => {
  // 	// 	return {
  // 	// 		label: info.player,
  // 	// 		data: info.goalsFor,
  // 	// 		fill: false,
  // 	// 		lineTension: 0,
  // 	// 		pointBackgroundColor: "rgba(76, 163, 254,1)",
  // 	// 		borderColor: "rgba(76, 163, 254,0.7)"
  // 	// 	}
  // 	// })
  // };

  // const optionsForLineChart = {
  // 	title: {
  // 		display: true,
  // 		text: 'Goles anotados en los últimos 10 partidos'
  // 	},
  // 	legend: {
  // 		display: true,
  // 		position: "right"
  // 	},
  // 	onClick: function (event, items) {
  // 		console.log(event);
  // 		console.log(items);
  // 		let activePoints = items;
  // 		//get the internal index of slice in pie chart
  // 		let clickedElementindex = activePoints[0]["_index"];
  // 		//get specific label by index
  // 		let label = this.data.labels[clickedElementindex];
  // 		//get value by index
  // 		let value = this.data.datasets[0].data[clickedElementindex];
  // 	}
  // };

  return (
    <div style={{ width: '500px', margin: '1.5rem' }}>
      <Line data={data} options={options} />
    </div>
  )
}

export default LineChart

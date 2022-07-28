import { Bar } from "react-chartjs-3";

const BarChart = ({ data, options }) => {

	return (
		<>
			<div style={{ width: "600px", margin: "1.5rem" }}>
				<Bar data={data} options={options} />
			</div>
		</>
	);

}

export default BarChart;
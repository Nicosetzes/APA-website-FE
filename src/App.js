import { useState } from "react"
import BarChart from "./views/charts/BarChart";
import DoughnutChart from "./views/charts/DoughnutChart";
import PieChart from "./views/charts/PieChart";
import LineChart from "./views/charts/LineChart";

function App() {

  // const [userData, setUserData] = useState({
  //   labels: UserData.map((data) => data.year),
  //   datasets: [{
  //     label: "Users gained",
  //     data: UserData.map((data) => data.userGain),
  //     backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
  //     hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
  //     borderColor: "#000",
  //     borderWidth: 2
  //   }]
  // });

  // const options = {
  //   legend: {
  //     display: true,
  //     position: "bottom"
  //   }
  // };

  return (
    <>
      <div>Home</div>
      {/* <BarChart chartData={userData} chartOptions={options} />
      <DoughnutChart />
      <PieChart />
      <LineChart /> */}
    </>
  );
}

export default App;

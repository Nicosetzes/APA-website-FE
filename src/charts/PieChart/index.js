import { Pie } from 'react-chartjs-2'

const PieChart = () => {
  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
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
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: (context) => {
            console.log(context)

            const totalSum = context.dataset.data.reduce((total, point) => {
              return total + point
            })
            const itemPercent = ((context.parsed / totalSum) * 100).toFixed(1)
            return `${context.label}: ${itemPercent}% (${context.formattedValue} items)`
          },
        },
      },
    },
  }

  return (
    <div style={{ width: '600px', margin: '1.5rem' }}>
      <Pie data={data} options={options} />
    </div>
  )
}

export default PieChart

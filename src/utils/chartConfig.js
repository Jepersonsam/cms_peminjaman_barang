import {
  Chart,
  registerables
} from 'chart.js'

// Register all Chart.js components globally using registerables
Chart.register(...registerables)

export default Chart


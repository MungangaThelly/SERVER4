const express = require('express')
const path = require('path')
const weatherData = require('./data/weather.json')

const app = express()
const PORT = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post('/weather', (req, res) => {
  const choice = req.body.choice

  if (!choice) {
    return res.status(400).json({ error: 'Choice parameter is required.' })
  }

  // Handle the case where weatherData is an object
  const entries = Array.isArray(weatherData)
    ? weatherData
    : Object.keys(weatherData).map(key => ({
        type: key,
        ...weatherData[key]
      }))

  const filteredData = entries.filter(entry => entry.type === choice)

  if (filteredData.length === 0) {
    return res.status(404).json({ error: 'No matching weather data found.' })
  }

  res.json(filteredData)
})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})

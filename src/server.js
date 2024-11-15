const express = require('express')
const path = require('path')
const weatherData = require('./data/weather.json')

const app = express()
const PORT = 3000

// Use built-in Express middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // If you expect JSON data

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post('/weather', (req, res) => {
  const choice = req.body.choice

  if (!choice) {
    return res.status(400).json({ error: 'Choice parameter is required.' })
  }

  const filteredData = weatherData.filter((entry) => entry.type === choice)

  if (filteredData.length === 0) {
    return res.status(404).json({ error: 'No matching weather data found.' })
  }

  res.json(filteredData)
})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})

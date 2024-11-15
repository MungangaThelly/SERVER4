const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const weatherData = require('./data/weather.json')

const app = express()
const PORT = 3000

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.post('/weather', (req, res) => {
  const choice = req.body.choice

  const filteredData = weatherData.filter((entry) => entry.type === choice)

  res.json(filteredData)
})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})
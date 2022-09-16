import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.get('/games', (req, res) => {
  return res.json([{ id: 1 }])
})

app.get('/games/:id/ads', (req, res) => {
  // const gameId = req.params.i

  return res.json([
    { id: 1, name: 'Anúncio 1' },
    { id: 2, name: 'Anúncio 2' },
    { id: 3, name: 'Anúncio 3' },
    { id: 4, name: 'Anúncio 4' }
  ])
})

app.post('/ads', (req, res) => {
  return res.status(200).json([])
})

app.get('/ads/:id/discord', (req, res) => {
  return res.json([])
})

const port = Number(process.env.PORT || 3333)

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`)
})

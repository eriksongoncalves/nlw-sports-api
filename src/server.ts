import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.get('/games', (req, res) => {
  return res.json([{ id: 1 }])
})

app.get('/games/:id/ads', (req, res) => {
  const { id } = req.params

  return res.json([{ id }])
})

const port = Number(process.env.PORT || 3333)

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`)
})

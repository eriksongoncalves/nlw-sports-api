import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.get('/', (req, res) => {
  res.send('Hello world')
})

const port = Number(process.env.PORT || 3333)

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`)
})

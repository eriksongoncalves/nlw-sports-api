import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

import { convertHourToMinutes } from './utils/convert-hour-to-minutes'
import { convertMinutesToHour } from './utils/convert-minutes-to-hour'

dotenv.config()

const app = express()
const prisma = new PrismaClient()

app.use(express.json())
app.use(cors())

app.get('/games', async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true
        }
      }
    }
  })

  return res.json(games)
})

app.get('/games/:id/ads', async (req, res) => {
  const gameId = req.params.id

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPaying: true,
      hourStart: true,
      hourEnd: true
    },
    where: {
      gameId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const dataFormatted = ads.map(ad => ({
    ...ad,
    weekDays: ad.weekDays.split(','),
    hourStart: convertMinutesToHour(ad.hourStart),
    hourEnd: convertMinutesToHour(ad.hourEnd)
  }))

  res.json(dataFormatted)
})

app.post('/games/:id/ads', async (req, res) => {
  const gameId = req.params.id
  const bodyData = req.body

  const ad = await prisma.ad.create({
    data: {
      ...bodyData,
      gameId,
      weekDays: bodyData.weekDays.join(','),
      hourStart: convertHourToMinutes(bodyData.hourStart),
      hourEnd: convertHourToMinutes(bodyData.hourEnd)
    }
  })

  return res.status(200).json(ad)
})

app.get('/ads/:id/discord', async (req, res) => {
  const adId = req.params.id

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true
    },
    where: {
      id: adId
    }
  })

  return res.json({
    discord: ad.discord
  })
})

const port = Number(process.env.PORT || 3333)

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`)
})

import express from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minutes'

dotenv.config()

const app = express()
const prisma = new PrismaClient()

app.use(express.json())

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

  return res.json(
    ads.map(ad => {
      return {
        ...ads,
        weekDays: ad.weekDays.split(',')
      }
    })
  )
})

app.post('/games/:id/ads', async (req, res) => {
  const gameId = req.params.id
  const bodyData = req.body

  const ad = await prisma.ad.create({
    data: {
      ...bodyData,
      gameId,
      weekDays: bodyData.weekDays.join(','),
      hourStart: convertHourStringToMinutes(bodyData.hourStart),
      hourEnd: convertHourStringToMinutes(bodyData.hourEnd)
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

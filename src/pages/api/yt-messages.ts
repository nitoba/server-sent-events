import express from 'express'
import { TubeChat } from 'tubechat'

const app = express()
const tubeChat = new TubeChat()
const channelName = 'LofiGirl'
const encoder = new TextEncoder()

app.get('/api/yt-messages', (_, res) => {
  let closed = false
  res.appendHeader('Access-Control-Allow-Origin', '*')
  res.appendHeader('Content-Type', 'text/event-stream')
  res.appendHeader('Connection', 'keep-alive')
  res.appendHeader('Cache-Control', 'no-cache, no-transform')
  res.appendHeader('X-Accel-Buffering', 'no')
  res.appendHeader('Content-Encoding', 'none')

  tubeChat.on('chat_connected', (channel, videoId) => {
    console.log(`${channel} chat connected`, videoId)
  })

  tubeChat.on('chat_disconnected', (channel, videoId) => {
    console.log(`${channel} chat disconnected`, videoId)
  })

  tubeChat.connect(channelName)

  tubeChat.on('message', ({ channel, message, name, thumbnail, timestamp }) => {
    if (!closed) {
      console.log(`(${channel}) [${name}]: ${message[0].text} - ${timestamp}`)

      const data = {
        channel,
        author: name,
        text: message[0].text,
        thumbnail: thumbnail.url,
        timestamp,
      }

      res.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
    }
  })

  res.on('close', () => {
    closed = true
    tubeChat.disconnect(channelName)
    console.log('Client has closed the connection')
  })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

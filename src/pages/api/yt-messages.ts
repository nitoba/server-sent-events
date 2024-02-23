import express from 'express'

const app = express()

function send(encoder: TextEncoder, counter: number) {
    return encoder.encode(`data: ${counter}\n\n`)
}


app.get('/api/yt-messages', (_, res) => {
    let closed = false
    let counter = 0
    const encoder = new TextEncoder()
    res.appendHeader('Access-Control-Allow-Origin', '*')
    res.appendHeader('Content-Type', 'text/event-stream')
    res.appendHeader('Connection', 'keep-alive')
    res.appendHeader('Cache-Control', 'no-cache, no-transform')
    res.appendHeader('X-Accel-Buffering', 'no')
    res.appendHeader('Content-Encoding', 'none')

    const interval = setInterval(() => {
        if (closed) {
            clearInterval(interval)
            return
        }
        counter += 1
        res.write(send(encoder, counter))
    }, 1000)

    res.on('close', () => {
        closed = true
        clearInterval(interval)
        console.log('Client has closed the connection')
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
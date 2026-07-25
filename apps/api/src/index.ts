import cors from 'cors'
import express from 'express'
import logRoutes from './routes/logs'
import trackerRoutes from './routes/trackers'

const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true }))
app.use(express.json())
app.get('/health', (_req, res) => res.json({ data: { status: 'ok' }, error: null }))
app.use('/api/trackers', trackerRoutes)
app.use('/api/logs', logRoutes)
app.use((_req, res) => res.status(404).json({ data: null, error: 'Not found' }))
app.listen(process.env.PORT || 4000)

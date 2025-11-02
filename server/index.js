import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = process.env.DB_NAME || 'resume_builder'

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI environment variable')
}

let client
let db

async function getDb() {
  if (!client) {
    client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    await client.connect()
    db = client.db(DB_NAME)
  }
  return db
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.get('/api/pingdb', async (req, res) => {
  try {
    const database = await getDb()
    const result = await database.command({ ping: 1 })
    res.json({ ok: true, ping: result?.ok === 1 })
  } catch (e) {
    console.error('Ping failed:', e?.message || e)
    res.status(500).json({ ok: false, error: 'MongoDB ping failed' })
  }
})

app.get('/api/resume/:id', async (req, res) => {
  try {
    const { id } = req.params
    const database = await getDb()
    const col = database.collection('resumes')
    const doc = await col.findOne({ _id: id })
    if (!doc) return res.status(404).json({ error: 'Not found' })
    res.json({ data: doc.data || null, updatedAt: doc.updatedAt || null })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

app.put('/api/resume/:id', async (req, res) => {
  try {
    const { id } = req.params
    const payload = req.body?.data
    if (typeof payload !== 'object' || payload === null) {
      return res.status(400).json({ error: 'Invalid data' })
    }
    const database = await getDb()
    const col = database.collection('resumes')
    const updatedAt = new Date()
    await col.updateOne(
      { _id: id },
      { $set: { data: payload, updatedAt } },
      { upsert: true }
    )
    res.json({ ok: true, updatedAt })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})

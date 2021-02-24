import dotenv from 'dotenv'
import 'reflect-metadata'
import createConnection from './database/connection'
import express from 'express'
import { router } from './routes'

createConnection()

const app = express()

dotenv.config()

app.use(express.json())
app.use(router)

export { app }

import dotenv from 'dotenv'
import 'reflect-metadata'
import './database/connection'
import express from 'express'
import { router } from './routes'

const app = express()

dotenv.config()

app.use(express.json())
app.use(router)

app.listen(3333, () => console.log('Server is running...'))

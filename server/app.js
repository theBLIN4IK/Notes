import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import router from './router/index.js'

// сделано при поддержке MerlinAI!

const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));

app.use(express.json())
app.use(cookieParser())
app.use(router)
app.use('/api', router)



app.use((req, res, next) => {
	console.log(req.path) // debug log
	next()
  })


  mongoose.connect(process.env.MONGO_URL)

  async function start() {
	  app.listen(PORT, () => {
		  console.log(`Server started! Port ${PORT}`)
	  })
  }
  
  start()

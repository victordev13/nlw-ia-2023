import { fastify } from 'fastify'
import { listPrompts } from './routes/prompts/list'
import { uploadVideo } from './routes/videos/upload'
import { generateTranscription } from './routes/videos/generate-transcription'
import { generateAiCompletion } from './routes/prompts/generate-ai-completion'
import { fastifyCors } from '@fastify/cors'

import 'dotenv/config'

const routes = [
  listPrompts,
  uploadVideo,
  generateTranscription,
  generateAiCompletion,
]

const app = fastify()

app.register(fastifyCors, {
  origin: process.env.CORS_ALLOW_ORIGIN,
})

routes.forEach((route) => {
  app.register(route, {
    prefix: '/api',
  })
})

// start server
app
  .listen({ port: Number(process.env.PORT) })
  .then(() => console.log('HTTP Server running on port ' + process.env.PORT))

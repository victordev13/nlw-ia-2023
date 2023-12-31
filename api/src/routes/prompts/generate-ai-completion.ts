import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { openai } from '../../lib/openai'

export async function generateAiCompletion(app: FastifyInstance) {
  app.post('/videos/generate-ai-completion', async (request, reply) => {
    const bodySchema = z.object({
      videoId: z.string().uuid(),
      template: z.string(),
      temperature: z.number().min(0).max(1).default(0.5),
    })

    const { videoId, template, temperature } = bodySchema.parse(request.body)

    const video = await prisma.video.findUniqueOrThrow({
      where: { id: videoId },
    })

    if (!video.transcription) {
      return reply
        .status(400)
        .send({ error: 'Video transcript was not generated yet.' })
    }

    const promptMessage = template.replace(
      '{transcription}',
      video.transcription,
    )

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      temperature,
      // pode ser o histórico salvo caso exista
      messages: [{ role: 'user', content: promptMessage }],
    })

    return response
  })
}

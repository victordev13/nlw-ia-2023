import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma'

export async function listPrompts(app: FastifyInstance) {
  app.get('/prompts', async () => {
    return await prisma.prompt.findMany()
  })
}

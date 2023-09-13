import { FastifyInstance } from 'fastify'
import { fastifyMultipart } from '@fastify/multipart'
import path from 'node:path'
import { pipeline } from 'node:stream'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import { promisify } from 'node:util'
import { prisma } from '../../lib/prisma'

const pump = promisify(pipeline)

const ALLOWED_EXTENSIONS = ['.mp3']

export async function uploadVideo(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25, // 25mb
    },
  })

  app.post('/videos/upload', async (request, reply) => {
    const data = await request.file()

    if (!data) {
      return reply.status(400).send({ error: 'Missing file input.' })
    }

    const fileExtension = path.extname(data.filename)
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return reply.status(400).send({
        error: `Invalid input type, please upload a "${ALLOWED_EXTENSIONS.join(
          ',',
        )}" files`,
      })
    }

    const fileBaseName = path.basename(data.filename, fileExtension)
    const fileUploadName = `${fileBaseName}-${randomUUID()}${fileExtension}`

    const uploadDestination = path.resolve(__dirname, 'tmp', fileUploadName)

    await pump(data.file, fs.createWriteStream(uploadDestination))

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination,
      },
    })

    return { video }
  })
}

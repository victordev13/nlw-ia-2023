import { fetchFile } from '@ffmpeg/util'
import { getFfmpeg } from '../ffmpeg'

export async function convertVideoToAudio(video: File) {
  const ffmpeg = await getFfmpeg()

  await ffmpeg.writeFile('input.mp4', await fetchFile(video))

  ffmpeg.on('log', console.log)

  ffmpeg.on('progress', (progress) => {
    console.log('Convert progress' + Math.round(progress.progress * 100))
  })

  await ffmpeg.exec([
    '-i',
    'input.mp4',
    '-map',
    '0:a',
    '-b:a',
    '20k',
    '-acodec',
    'libmp3lame',
    'output.mp3',
  ])

  const data = await ffmpeg.readFile('output.mp3')

  const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
  const audioFile = new File([audioFileBlob], 'audio.mp3', {
    type: 'audio/mpeg',
  })

  console.log('Convert finished.')

  return audioFile
}

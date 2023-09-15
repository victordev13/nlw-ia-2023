import { FileVideo, Upload } from 'lucide-react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react'
import { convertVideoToAudio } from '@/lib/utils/convert-video-to-audio'

export function VideoInputForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files) return

    const selectedFile = files[0]
    setVideoFile(selectedFile)
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const prompt = promptInputRef.current?.value
    if (!videoFile) return

    const audioFile = await convertVideoToAudio(videoFile)
    console.log(audioFile)
  }

  const previewURL = useMemo(() => {
    if (!videoFile) return null

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <label
        htmlFor="video"
        className="relative border w-full flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5 hover:text-gray-300 transition-colors"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none absolute inset-0"
          />
        ) : (
          <>
            <FileVideo className="w-4 h-4" />
            Selecione um vídeo
          </>
        )}
      </label>
      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Separator />
      <div className="space-y-2">
        <Label htmlFor="transcriptionPrompt">Prompt de transcrição</Label>
        <Textarea
          ref={promptInputRef}
          id="transcriptionPrompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
        />
      </div>

      <Button type="submit" className="w-full">
        Carregar vídeo
        <Upload className="h-4 w-4 ml-2" />
      </Button>
    </form>
  )
}

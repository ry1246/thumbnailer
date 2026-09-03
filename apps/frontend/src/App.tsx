import { useEffect, useRef, useState } from 'react'
import './App.css'

const API_BASE = 'http://localhost:3000'

type JobState = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed'

interface JobStatusResponse {
  id: string
  state: string
  result: { thumbnailUrl: string } | null
  failedReason: string | null
}

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [jobState, setJobState] = useState<JobState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!jobId || jobState !== 'processing') return
    intervalRef.current = setInterval(async () => {
      const res = await fetch(`${API_BASE}/jobs/${jobId}`)
      const data: JobStatusResponse = await res.json()

      if (data.state === 'completed' && data.result) {
        setJobState('completed')
        setThumbnails((prev) => [`${API_BASE}${data.result!.thumbnailUrl}`, ...prev])
      } else if (data.state === 'failed') {
        setJobState('failed')
        setErrorMessage(data.failedReason ?? 'unknown error')
      }
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [jobId, jobState])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setErrorMessage(null)
    setJobState('uploading')

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      setJobState('failed')
      setErrorMessage('upload failed')
      return
    }

    const data: { jobId: string } = await res.json()
    setJobId(data.jobId)
    setJobState('processing')
  }

  return (
    <>
      <section>
        <h1>Thumbnailer</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <button type="submit" disabled={!file || jobState === 'uploading' || jobState === 'processing'}>
            Upload
          </button>
        </form>
        {jobState === 'uploading' && <p>Uploading...</p>}
        {jobState === 'processing' && <p>Processing... (job: {jobId})</p>}
        {jobState === 'failed' && <p role="alert">ERR : {errorMessage}</p>}
      </section>

      <section>
        <h2>サムネイル一覧</h2>
        <div className="thumbnail-grid">
          {thumbnails.map((url) => (
            <img key={url} src={url} width={200} height={200} alt="" />
          ))}
        </div>
      </section>
    </>
  )
}
export default App

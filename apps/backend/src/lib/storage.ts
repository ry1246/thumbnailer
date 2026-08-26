import { mkdir } from 'node:fs/promises'
import path from 'node:path'

export const UPLOAD_DIR = path.resolve('storage/uploads')
export const THUMBNAIL_DIR = path.resolve('storage/thumbnails')

export async function ensureStorageDirs() {
  await mkdir(UPLOAD_DIR, { recursive: true })
  await mkdir(THUMBNAIL_DIR, { recursive: true })
}

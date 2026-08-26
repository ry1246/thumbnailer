import { Queue } from "bullmq";
import { connection } from './lib/redis.js'

export interface ThumbnailJobData {
  filePath: string
  fileName: string
}

export const thumbnailQueue = new Queue<ThumbnailJobData>('thumbnail', {
  connection,
})

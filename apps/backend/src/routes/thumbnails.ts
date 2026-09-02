import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'

export const thumbnailsRoute = new Hono()

thumbnailsRoute.use(
  '/thumbnails/*',
  serveStatic({ root: './storage', rewriteRequestPath: path => path }),
)

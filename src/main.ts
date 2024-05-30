import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { serveStatic } from "@hono/node-server/serve-static"
import { WebSocketServer } from "ws"
import pathNode from "path"

const port = 3000
const app = new Hono()

app.use(
  "/*",
  serveStatic({
    root: ".",
    rewriteRequestPath(path) {
      if (path.match(/^\/api\//)) return ""
      else return pathNode.join("statics", path)
    },
  }),
)

const server = serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Listening on http://localhost:${info.port}`)
  },
)
const wss = new WebSocketServer({ server: server as any })

app.get("/api/hello", (c) => {
  return c.text("Hello World!")
})

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const name = data.toString().split(" ").pop()
    ws.send(`Welcome ${name}, Thanks for visiting my website`)
  })
  ws.on("close", () => {})
})

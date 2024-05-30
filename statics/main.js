const wss = new WebSocket("")

wss.addEventListener("open", () => {
  wss.send("I'm Client")
})

wss.addEventListener("message", (e) => {
  console.log(e.data)
})

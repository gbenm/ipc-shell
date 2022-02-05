import { IPCNodeRegister } from "ipc"
import process from "process"

const ipc = IPCNodeRegister.register("main", process)

ipc._ipcNodeSend = function(_, message) {
  this.send(message)
}

ipc._getArgsFromOn = function(...args) {
  return args
}

ipc.ipcNodeErrorObjectMode = true

ipc.on("message", (message) => {
  switch (message) {
    case "ping":
      ipc.send("pong")
      break
    case "error":
      ipc.sendError("message", {
        isError: true
      })
      break
  }
})

ipc.subscribe("message", {
  handleError(error) {
    ipc.sendError("message", error)
  }
})

ipc.send("process ready!")

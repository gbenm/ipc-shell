import { IPCNodeRegister } from "ipc"
import process from "process"

const ipc = IPCNodeRegister.register("main", process)

ipc._ipcNodeSend = function(_, message) {
  this.send(message)
}

ipc._getArgsFromOn = function(...args) {
  return args
}

ipc.on("message", (message) => {
  if (message == "ping") {
    ipc.send("pong")
  }
})

ipc.send("process ready!")

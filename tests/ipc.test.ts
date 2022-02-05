import { expect, use } from "chai"
import { ChildProcess, fork } from "child_process"
import * as deepEqualInAnyOrder from "deep-equal-in-any-order"
import { Readable } from "stream"
import { IPCNode, IPCNodeRegister } from "../dist"
import { prepareIPCNode } from "../utils/prepare"
import { uniqueTestName } from "../utils/unique"

use(deepEqualInAnyOrder)

const programPath = "./tests/process"

function createIPC(): [ ipc: IPCNode<ChildProcess>, timeout: NodeJS.Timeout ] {
  const testname = uniqueTestName()
  const child = fork(programPath)
  const ipc = IPCNodeRegister.register(testname, child)

  prepareIPCNode(ipc)

  const timeout = setTimeout(() => child.kill(), 2000)

  return [ipc, timeout]
}

describe("IPC communication", () => {
  it ("Use send function no error", (done) => {
    const [ipc, timeout] = createIPC()

    ipc.once("spawn", () => {
      expect(() => {
        ipc.send("test")
        ipc.kill()
        clearTimeout(timeout)
        done()
      }).to.not.throw(Error) 
    })  
  })

  it ("Use send and get response", (done) => {
    const [ipc, timeout] = createIPC()

    ipc.once("message", () => {
      ipc.on("message", (message) => {
        expect(message).to.equal("pong")
        ipc.kill()
        clearTimeout(timeout)
        done()
      })

      ipc.send("ping")
    }) 
  })

  describe ("Subscribe method", () => {
    it ("handleData", (done) => {
      const [ipc, timeout] = createIPC()

      ipc.once("message", () => {
        ipc.subscribe("message", {
          handleData(message) {
            expect(message).to.equal("pong")
            ipc.kill()
            clearTimeout(timeout)
            done()
          }
        })

        ipc.send("ping")
      })

    })

    it ("handleError", (done) => {
      const [ipc, timeout] = createIPC()

      ipc.once("message", () => {
        ipc.subscribe("message", {
          handleData(data) { 
            console.log(typeof data)
            done(data)
          },
          handleError(message) {
            expect(message).to.deep.equalInAnyOrder({
              isError: true
            })
            ipc.kill()
            clearTimeout(timeout)
            done()
          }
        })

        ipc.send("error")
      })
    })
  })

  describe ("sendError method", () => {
    it ("Ping pong error", (done) => {
      const [ipc, timeout] = createIPC()

      ipc.once("message", () => {
        ipc.subscribe("message", {
          handleData(data) {
            done(data)
          },
          handleError(message) {
            expect(message).to.deep.equalInAnyOrder({
              isError: true,
              from: "test process",
            })
            ipc.kill()
            clearTimeout(timeout)
            done()
          }
        })

        ipc.sendError("message", {
          isError: true,
          from: "test process",
        })
      })
    })
  })
  
  describe ("writableStream method", () => {
    it ("write() method", (done) => {
      const [ipc, timeout] = createIPC()
      const maxOfWrites = 10
      let writes = 0

      ipc.once("message", () => {
        ipc.subscribe("message", {
          handleData(data) {
            writes++
            expect(data).to.equal("pong")
            if (writes == 10) {
              ipc.kill()
              clearTimeout(timeout)
              done()
            }
          }
        })

        const writable = ipc.writableStream("message")
        
        for (let i = 0; i < maxOfWrites; i++) {
          writable.write("ping")
        }
      })
    })

    it ("from pipe", (done) => {
      const [ipc, timeout] = createIPC()
      const maxOfWrites = 10
      let writes = 0

      ipc.once("message", () => {        
        ipc.subscribe("message", {
          handleData(data) {
            writes++
            expect(data).to.equal("pong")
            if (writes == 10) {
              ipc.kill()
              clearTimeout(timeout)
              done()
            }
          }
        })

        const readable = new Readable({objectMode: true})
        readable._read = () => null

        readable.pipe(ipc.writableStream("message"))
        
        for (let i = 0; i < maxOfWrites; i++) {
          readable.push("ping")
        }
      })
    })
  })
})

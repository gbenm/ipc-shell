import { IPCBaseNode } from "../interfaces"
import { IPCNodeReadable } from "../models/readable"

export interface IPCNodeMod extends IPCBaseNode {
  name: string
  _ipcNodeReadable: IPCNodeReadable
}

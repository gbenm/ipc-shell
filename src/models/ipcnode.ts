// Esta clase debe manejar el envío de datos
// en forma Raw, es decir no aplicar ninguna transformación
class IPCBaseNode {}

// Esta clase permite agregar transformaciones de
// datos, es decir que se apoya de las funciones
// de IPCBaseNode para enviar los datos, pero
// aplica transformaciones antes.
class IPCInnerNode extends IPCBaseNode implements IPCNode {
  name!: string

  subscribe(channel: string) {
    return channel
  }
}

export interface IPCNode {
  get name(): string

  subscribe(channel: string): unknown
}

export class IPCNodeBuilder {
  private _ipc: IPCInnerNode = new IPCInnerNode()

  public setName(name: string): IPCNodeBuilder {
    this._ipc.name = name
    return this
  }

  public reset(): IPCNodeBuilder {
    this._ipc = new IPCInnerNode()
    return this
  }

  public build(): IPCNode {
    return this._ipc
  }
}

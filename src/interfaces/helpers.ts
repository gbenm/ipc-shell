/**
 * Sirve para intercambiar mensajes
 * entre el readable global y 
 * el transformer
 */
export interface IPCNodeR2TMessage {
  channel: string
  info: unknown
}

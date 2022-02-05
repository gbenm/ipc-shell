# Comenzar

## Contexto
Este paquete para Nodejs es una extensión de funcionalidades para objetos
que se encargan de **inter-process communication (IPC)**. Un ejemplo de esto
es [ElectronJS](https://electronjs.org) con `ipcMain`, `ipcRenderer` y
`win.webContents`, ya que con ellos se puede realizar la comunicación del proceso
principal con las distintas ventanas y viceversa.

!!! info "Importante"
    La configuración inicial funciona con **ElectronJS** por lo que
    para que funcione por ejemplo con `NodeJS.ChildProcess`, tendrá
    que reimplementar `_getArgsFromOn`, `_ipcNodeSend` y colocar
    `ipcNodeErrorObjectMode` en `true` si quiere que tenga compatibilidad
    con `IPCNodeError`.

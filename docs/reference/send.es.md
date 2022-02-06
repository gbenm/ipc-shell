# Enviar errores

La forma más sencilla de hacer esto es:

```javascript
ipc.sendError("canal", "oh no!")
```

El primer argumento es el canal por el cuál se envía el error mientras
que el sengundo es la información de error, puede ser objetos o lo
que soporte su `ipc.send`.

La otra forma es creando un `IPCNodeError` de forma manual y enviarlo
por el método que tenga disponible, por ejemplo en ElectronJS esto
funciona igualmente:

```javascript
ipcNode.send("canal", new IPCNodeError("soy un error"))
```

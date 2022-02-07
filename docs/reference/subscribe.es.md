# Escuchar mensajes

Otra forma para escuchar mensajes es utilizar el método `.subscribe(channel, handlers)`
que permite estar pendiente a mensajes normales y a los de error, a diferencia
de los Streams este no dejará de funcionar aunque se envien errores, por lo que
puede servir para otro tipo de enfoque.

```javascript
ipc.subscribe("notifications", {
  handleData(message) {
    console.log("from subscription", message)
  },
  handleError(error) {
    console.log("from subscription error", error)
  }
})

ipc.subscribe("channel-1", {
  handleData(message1, message2) {
    console.log("from subscription m1", message1)
    console.log("from subscription m2", message2)
  }
})

ipc.subscribe("channel-2", {
  handleError(error) {
    console.log("from subscription error", error)
  }
})

ipc.subscribe("channel-3", {
  handleData(...args) {
    console.log("from subscription", ...args)
  }
})
```

Si está en typescript puede serle de utilidad colocar los tipos, ya que
por defecto son desconocidos `unknown`, la función de error
sólo recibe un único parámetro a pesar de su definición.


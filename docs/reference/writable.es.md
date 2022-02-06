# Writable (Stream)

```javascript
const writable = ipc.writableStream("notifications")

writable.write({
    title: "Good news",
    message: "New cat :)"
})
```

Lo anterior crea un Stream de escritura, este cumple ser un
`stream.Writable`, que puede usar en vez de tener que
utilizar `ipc.send("channel", "información")`, esto le puede
servir si tiene algún tipo de servicio que sea `stream.Readable`
o similares, y en vez de tener que subscribirse a "data", puede
utilizar `.pipe(writable)`.

Explicando el ejemplo lo que se está haciendo es enviando el
objeto { title, message }, por el canal "notifications", este
readable tiene la opción de mandar objetos, pero esto debe
ser soportado de igual manera por la función send del IPC.

!!! tip "Errores"
    Si quiere mandar un error utilice la clase `IPCNodeError`
    ya que esta es tratada de forma especial para las demás
    extensiones de este paquete.

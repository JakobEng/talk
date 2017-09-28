const express = require("express")
const open = require('amqplib').connect('amqp://rabbit')

const mqCall = require("./funcs/mqCallGen")(open)

let app = express()

app.get('/', (req,res) => {
  mqCall("rpc_queue", "20").then(data => {
    res.send(data)
  })
})

app.get('/api', (req,res) => {
  res.send("This is the what I meant to do")
})

console.log("hello")

app.listen(80)

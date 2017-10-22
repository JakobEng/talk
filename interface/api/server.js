const express = require("express")
const bodyParser = require('body-parser')
const open = require('amqplib').connect('amqp://rabbit')

const mqCall = require("./funcs/mqCallGen")(open)

let app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req,res) => {
  mqCall("rpc_queue", "20").then(data => {
    res.send(data)
  })
})

app.post('/login', (req,res) => {
  console.log(req.body)
  res.send(req.body.info)

  // mqCall("login.get", "")
})

app.get('/api', (req,res) => {
  res.send("This is NOT what I meant to do")
})

console.log("hello")

app.listen(80)

const open = require('amqplib').connect('amqp://rabbit')

const mqCall = require("./funcs/mqCallGen")(open)

mqCall("rpc_queue", "20").then(res => {
  console.log(res)
})
console.log("hello")

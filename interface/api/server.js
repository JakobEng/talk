const open = require('amqplib').connect('amqp://rabbit')

const mqCall = require("./funcs/mqCallGen")(open)

mqCall("test", "I'm killing it")
console.log("hello")

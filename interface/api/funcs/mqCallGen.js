"use strict"
module.exports = function(open) {

  return function(que, body) {
    return new Promise((resolve,reject) => {
      if(typeof que !== 'string') {
        return reject({
          code: 406,
          message: 'first agument (name of messeging queue) has to be as string'
        })
      }

      if(typeof body !== 'string') {
        return reject({
          code: 406,
          message: 'second argument (your message) has to be a string'
        })
      }



      open.then(function(conn) {
        return conn.createChannel();
      }).then(function(ch) {

        return ch.assertQueue('', {exclusive: true}).then(q => {

          let corr = generateUuid()
          return ch.consume(q.queue, function(msg) {
            if (msg.properties.correlationId == corr) {
              resolve(`${msg.content.toString()}`)
            }
            ch.ack(msg)
            if (msg.properties.correlationId == corr) {
              // test this happens
              return ch.close()
            }
          }).then(() => {
            return ch.sendToQueue(que,
              Buffer.from(body),
              { correlationId: corr, replyTo: q.queue, persistent: true})
          })
        })

      }).catch(reject)



    })
  }

}

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

package rabbit

import (
	"log"
	"strconv"

	"github.com/streadway/amqp"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func fib(n int) int {
	if n == 0 {
		return 0
	} else if n == 1 {
		return 1
	} else {
		return fib(n-1) + fib(n-2)
	}
}

func Gen(conn *amqp.Connection) func(string, func(string) int) {

	return func(que string, callback func(string) int) {
		ch, err := conn.Channel()
		failOnError(err, "Failed to open a channel")
		defer ch.Close()

		q, err := ch.QueueDeclare(
			que,   // name
			false, // durable
			false, // delete when usused
			false, // exclusive
			false, // no-wait
			nil,   // arguments
		)
		failOnError(err, "Failed to declare a queue")

		err = ch.Qos(
			1,     // prefetch count
			0,     // prefetch size
			false, // global
		)
		failOnError(err, "Failed to set QoS")

		msgs, err := ch.Consume(
			q.Name, // queue
			"",     // consumer
			false,  // auto-ack
			false,  // exclusive
			false,  // no-local
			false,  // no-wait
			nil,    // args
		)
		failOnError(err, "Failed to register a consumer")

		forever := make(chan bool)

		go func() {
			for d := range msgs {
				response := callback(string(d.Body))

				err = ch.Publish(
					"",        // exchange
					d.ReplyTo, // routing key
					false,     // mandatory
					false,     // immediate
					amqp.Publishing{
						ContentType:   "text/plain",
						CorrelationId: d.CorrelationId,
						Body:          []byte(strconv.Itoa(response)),
					})
				failOnError(err, "Failed to publish a message")

				d.Ack(false)
			}
		}()

		log.Printf(" [*] Awaiting RPC requests")
		<-forever
	}
}

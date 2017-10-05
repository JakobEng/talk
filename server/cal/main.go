package main

import (
	rabbit "app/rabbit"
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

func main() {
	conn, err := amqp.Dial("amqp://rabbit/")
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	mqCall := rabbit.Gen(conn)

	mqCall("rpc_queue", func(msg string) int {
		n, err := strconv.Atoi(msg)
		failOnError(err, "Failed to convert body to integer")

		log.Printf(" [.] fib(%d)", n)
		return fib(n)
	})

}

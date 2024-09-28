package event

import (
	"cart/src/helper"
	"fmt"
	"log"
	"math"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

var conn *amqp.Connection

func ConnectToRabbit() {
	var counts int64
	var backOff = 1 * time.Second
	var err error

	for {
		c, err := amqp.Dial("amqp://guest:guest@rabbitmq-service")
		if err != nil {
			fmt.Println("RabbitMQ not yet ready...")
			counts++
		} else {
			log.Println("Connected to RabbitMQ")
			conn = c
			break
		}

		if counts > 5 {
			fmt.Println(err)
			log.Panic("Can't connect to Rabbitmq")
		}

		backOff = time.Duration(math.Pow(float64(counts), 2)) * time.Second
		log.Println("backing off...")
		time.Sleep(backOff)
		continue
	}

	helper.PanicIfError(err)
}
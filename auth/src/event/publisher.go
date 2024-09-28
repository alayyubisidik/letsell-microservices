package event

import (
	"auth/src/helper"
	"encoding/json"
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
)

func PublishEvent(event any , routingKey string) {

	ch, err := conn.Channel()
	helper.PanicIfError(err)
	defer ch.Close()

	exchangeName := "app_events_exchange"

	body, err := json.Marshal(event)
	helper.PanicIfError(err)

	err = ch.Publish(
		exchangeName, // exchange
		routingKey,   // routing key
		false,        // mandatory
		false,        // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		})
	helper.PanicIfError(err)
	log.Printf(" [x] Sent %s from auth service", routingKey)
}

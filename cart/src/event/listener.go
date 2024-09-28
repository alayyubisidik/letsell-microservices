package event

import (
	"cart/src/helper"
	"encoding/json"
	"log"

)

func Listen() {
	ch, err := conn.Channel()
	helper.PanicIfError(err)
	defer ch.Close()

	exchangeName := "app_events_exchange"

	productCartQueue, err := ch.QueueDeclare(
		"product_cart_queue", // name
		true,              // durable
		false,             // delete when unused
		false,             // exclusive
		false,             // no-wait
		nil,               // arguments
	)
	helper.PanicIfError(err)

	authCartQueue, err := ch.QueueDeclare(
		"auth_cart_queue", // name
		true,              // durable
		false,             // delete when unused
		false,             // exclusive
		false,             // no-wait
		nil,               // arguments
	)
	helper.PanicIfError(err)

	orderCartQueue, err := ch.QueueDeclare(
		"order_cart_queue", // name
		true,              // durable
		false,             // delete when unused
		false,             // exclusive
		false,             // no-wait
		nil,               // arguments
	)
	helper.PanicIfError(err)


	productRoutingKeys := []string{"product.created", "product.updated", "product.deleted"}

	for _, routingKey := range productRoutingKeys {
		err := ch.QueueBind(
			productCartQueue.Name,  // queue name
			routingKey,             // routing key
			exchangeName,           // exchange
			false,
			nil,
		)
		helper.PanicIfError(err)
	}

	authRoutingKeys := []string{"auth.created", "auth.updated"}

	for _, routingKey := range authRoutingKeys {
		err := ch.QueueBind(
			authCartQueue.Name,  // queue name
			routingKey,             // routing key
			exchangeName,           // exchange
			false,
			nil,
		)
		helper.PanicIfError(err)
	}

	orderRoutingKeys := []string{"product.sold"}

	for _, routingKey := range orderRoutingKeys {
		err := ch.QueueBind(
			orderCartQueue.Name,  // queue name
			routingKey,             // routing key
			exchangeName,           // exchange
			false,
			nil,
		)
		helper.PanicIfError(err)
	}


	productCartMsgs, err := ch.Consume(
		productCartQueue.Name, // queue
		"",                 // consumer
		true,               // auto-ack
		false,              // exclusive
		false,              // no-local
		false,              // no-wait
		nil,                // args
	)
	helper.PanicIfError(err)
	
	authCartMsgs, err := ch.Consume(
		authCartQueue.Name, // queue
		"",                 // consumer
		true,               // auto-ack
		false,              // exclusive
		false,              // no-local
		false,              // no-wait
		nil,                // args
	)
	helper.PanicIfError(err)
	
	orderCartMsgs, err := ch.Consume(
		orderCartQueue.Name, // queue
		"",                 // consumer
		true,               // auto-ack
		false,              // exclusive
		false,              // no-local
		false,              // no-wait
		nil,                // args
	)
	helper.PanicIfError(err)


	go func() {
		for d := range productCartMsgs {
			var eventData map[string]interface{}
			err := json.Unmarshal(d.Body, &eventData)
			if err != nil {
				log.Printf("Error decoding message: %s", err)
				continue
			}
	
			eventType, ok := eventData["event"].(string)
			if !ok {
				log.Printf("Error: missing event type")
				continue
			}
	
			switch eventType {
			case "product.created":
				var createdEvent ProductCreatedEvent
				err := json.Unmarshal(d.Body, &createdEvent)
				if err != nil {
					log.Printf("Error decoding product.created event: %s", err)
					continue
				}
				handleProductCreatedEvent(createdEvent)
	
			case "product.updated":
				var updatedEvent ProductUpdatedEvent
				err := json.Unmarshal(d.Body, &updatedEvent)
				if err != nil {
					log.Printf("Error decoding product.updated event: %s", err)
					continue
				}
				handleProductUpdatedEvent(updatedEvent)
	
			case "product.deleted":
				var deletedEvent ProductDeletedEvent
				err := json.Unmarshal(d.Body, &deletedEvent)
				if err != nil {
					log.Printf("Error decoding product.deleted event: %s", err)
					continue
				}
				handleProductDeletedEvent(deletedEvent)
	
			default:
				log.Printf("Unknown event type: %s", eventType)
			}
		}
	}()

	go func() {
		for d := range authCartMsgs {
			var eventData map[string]interface{}
			err := json.Unmarshal(d.Body, &eventData)
			if err != nil {
				log.Printf("Error decoding message: %s", err)
				continue
			}
	
			eventType, ok := eventData["event"].(string)
			if !ok {
				log.Printf("Error: missing event type")
				continue
			}
	
			switch eventType {
			case "auth.created":
				var createdEvent AuthCreatedEvent
				err := json.Unmarshal(d.Body, &createdEvent)
				if err != nil {
					log.Printf("Error decoding auth.created event: %s", err)
					continue
				}
				handleAuthCreatedEvent(createdEvent)
	
			case "auth.updated":
				var updatedEvent AuthUpdatedEvent
				err := json.Unmarshal(d.Body, &updatedEvent)
				if err != nil {
					log.Printf("Error decoding auth.updated event: %s", err)
					continue
				}
				handleAuthUpdatedEvent(updatedEvent)
	
			default:
				log.Printf("Unknown event type: %s", eventType)
			}
		}
	}()
	

	go func() {
		for d := range orderCartMsgs {
			var eventData map[string]interface{}
			err := json.Unmarshal(d.Body, &eventData)
			if err != nil {
				log.Printf("Error decoding message: %s", err)
				continue
			}
	
			eventType, ok := eventData["event"].(string)
			if !ok {
				log.Printf("Error: missing event type")
				continue
			}
	
			switch eventType {
			case "product.sold":
				var updatedEvent ProductSoldEvent
				err := json.Unmarshal(d.Body, &updatedEvent)
				if err != nil {
					log.Printf("Error decoding product.sold event: %s", err)
					continue
				}
				handleProductSoldEvent(updatedEvent)

			default:
				log.Printf("Unknown event type: %s", eventType)
			}
		}
	}()
	

	select {}
}

package event

import (
	"product/src/helper"
	"encoding/json"
	"log"

)

func Listen() {
	ch, err := conn.Channel()
	helper.PanicIfError(err)
	defer ch.Close()

	exchangeName := "app_events_exchange"

	authProductQueue, err := ch.QueueDeclare(
		"auth_product_queue", // name
		true,              // durable
		false,             // delete when unused
		false,             // exclusive
		false,             // no-wait
		nil,               // arguments
	)
	helper.PanicIfError(err)

	ratingProductQueue, err := ch.QueueDeclare(
		"rating_product_queue", // name
		true,              // durable
		false,             // delete when unused
		false,             // exclusive
		false,             // no-wait
		nil,               // arguments
	)
	helper.PanicIfError(err)

	orderProductQueue, err := ch.QueueDeclare(
		"order_product_queue", // name
		true,              // durable
		false,             // delete when unused
		false,             // exclusive
		false,             // no-wait
		nil,               // arguments
	)
	helper.PanicIfError(err)

	authRoutingKeys := []string{"auth.created", "auth.updated"}

	for _, routingKey := range authRoutingKeys {
		err := ch.QueueBind(
			authProductQueue.Name,  // queue name
			routingKey,             // routing key
			exchangeName,           // exchange
			false,
			nil,
		)
		helper.PanicIfError(err)
	}

	ratingRoutingKeys := []string{"rating.created"}

	for _, routingKey := range ratingRoutingKeys {
		err := ch.QueueBind(
			ratingProductQueue.Name,  // queue name
			routingKey,             // routing key
			exchangeName,           // exchange
			false,
			nil,
		)
		helper.PanicIfError(err)
	}

	orderRoutingKeys := []string{"order.created", "product.sold"}

	for _, routingKey := range orderRoutingKeys {
		err := ch.QueueBind(
			orderProductQueue.Name,  // queue name
			routingKey,             // routing key
			exchangeName,           // exchange
			false,
			nil,
		)
		helper.PanicIfError(err)
	}
	
	authProductMsgs, err := ch.Consume(
		authProductQueue.Name, // queue
		"",                 // consumer
		true,               // auto-ack
		false,              // exclusive
		false,              // no-local
		false,              // no-wait
		nil,                // args
	)
	helper.PanicIfError(err)
	
	ratingProductMsgs, err := ch.Consume(
		ratingProductQueue.Name, // queue
		"",                 // consumer
		true,               // auto-ack
		false,              // exclusive
		false,              // no-local
		false,              // no-wait
		nil,                // args
	)
	helper.PanicIfError(err)
	
	orderProductMsgs, err := ch.Consume(
		orderProductQueue.Name, // queue
		"",                 // consumer
		true,               // auto-ack
		false,              // exclusive
		false,              // no-local
		false,              // no-wait
		nil,                // args
	)
	helper.PanicIfError(err)

	go func() {
		for d := range authProductMsgs {
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
		for d := range ratingProductMsgs {
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
			case "rating.created":
				var createdEvent RatingCreatedEvent
				err := json.Unmarshal(d.Body, &createdEvent)
				if err != nil {
					log.Printf("Error decoding auth.created event: %s", err)
					continue
				}
				handleRatingCreatedEvent(createdEvent)
	
			default:
				log.Printf("Unknown event type: %s", eventType)
			}
		}
	}()

	go func() {
		for d := range orderProductMsgs {
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

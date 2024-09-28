package event

import (
	"rating/src/helper"
	"encoding/json"
	"log"

)

func Listen() {
	ch, err := conn.Channel()
	helper.PanicIfError(err)
	defer ch.Close()

	exchangeName := "app_events_exchange"

	productRatingQueue, err := ch.QueueDeclare(
		"product_rating_queue", // name
		true,              // durable
		false,             // delete when unused
		false,             // exclusive
		false,             // no-wait
		nil,               // arguments
	)
	helper.PanicIfError(err)

	authRatingQueue, err := ch.QueueDeclare(
		"auth_rating_queue", // name
		true,              // durable
		false,             // delete when unused
		false,             // exclusive
		false,             // no-wait
		nil,               // arguments
	)
	helper.PanicIfError(err)

	orderItemRatingQueue, err := ch.QueueDeclare(
		"order_item_rating_queue", // name
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
			productRatingQueue.Name,  // queue name
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
			authRatingQueue.Name,  // queue name
			routingKey,             // routing key
			exchangeName,           // exchange
			false,
			nil,
		)
		helper.PanicIfError(err)
	}

	orderItemRoutingKeys := []string{"order-item.created"}

	for _, routingKey := range orderItemRoutingKeys {
		err := ch.QueueBind(
			orderItemRatingQueue.Name,  // queue name
			routingKey,             // routing key
			exchangeName,           // exchange
			false,
			nil,
		)
		helper.PanicIfError(err)
	}


	productRatingMsgs, err := ch.Consume(
		productRatingQueue.Name, // queue
		"",                 // consumer
		true,               // auto-ack
		false,              // exclusive
		false,              // no-local
		false,              // no-wait
		nil,                // args
	)
	helper.PanicIfError(err)
	
	authRatingMsgs, err := ch.Consume(
		authRatingQueue.Name, // queue
		"",                 // consumer
		true,               // auto-ack
		false,              // exclusive
		false,              // no-local
		false,              // no-wait
		nil,                // args
	)
	helper.PanicIfError(err)
	
	orderItemRatingMsgs, err := ch.Consume(
		orderItemRatingQueue.Name, // queue
		"",                 // consumer
		true,               // auto-ack
		false,              // exclusive
		false,              // no-local
		false,              // no-wait
		nil,                // args
	)
	helper.PanicIfError(err)


	go func() {
		for d := range productRatingMsgs {
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
		for d := range authRatingMsgs {
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
		for d := range orderItemRatingMsgs {
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
			case "order-item.created":
				var createdEvent OrderItemCreatedEvent
				err := json.Unmarshal(d.Body, &createdEvent)
				if err != nil {
					log.Printf("Error decoding order.created event: %s", err)
					continue
				}
				handleOrderItemCreatedEvent(createdEvent)

			default:
				log.Printf("Unknown event type: %s", eventType)
			}
		}
	}()
	

	select {}
}

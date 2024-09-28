package event

import (
	"log"
	"rating/src/database"
	"rating/src/helper"
	"rating/src/models"

	"gorm.io/gorm"
)

func handleProductCreatedEvent(event ProductCreatedEvent) {
	log.Printf("Handling Product Created Event")

	product := models.Product{
		ID:        event.Id,
		Name:      event.Name,
		Slug:      event.Slug,
		CreatedAt: event.CreatedAt,
	}
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Save(&product).Error
		if err != nil {
			return err
		}

		return nil
	})
	helper.PanicIfError(err)
	log.Printf("Handling Product Created Event Success")
}

func handleProductUpdatedEvent(event ProductUpdatedEvent) {
	log.Printf("Handling Product Updated Event")

	product := models.Product{
		ID:        event.Id,
		Name:      event.Name,
		Slug:      event.Slug,
		CreatedAt: event.CreatedAt,
	}
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Save(&product).Error
		if err != nil {
			return err
		}

		return nil
	})
	helper.PanicIfError(err)
	log.Printf("Handling Product Updated Event Success")
}

func handleProductDeletedEvent(event ProductDeletedEvent) {
	log.Printf("Handling Product Deleted Event")

	var product models.Product
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Where("slug = ?", event.Slug).First(&product).Error
		if err != nil {
			return err
		}

		err = tx.Delete(product).Error
		if err != nil {
			return err
		}

		return nil
	})
	helper.PanicIfError(err)
	log.Printf("Handling Product Deleted Event Success")
}

func handleAuthCreatedEvent(event AuthCreatedEvent) {
	log.Printf("Handling Auth Created Event")

	user := models.User{
		ID:        event.Id,
		FullName:  event.FullName,
		Username:  event.Username,
		Role:      event.Role,
		CreatedAt: event.CreatedAt,
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Save(&user).Error
		if err != nil {
			return err
		}

		return nil
	})
	helper.PanicIfError(err)
	log.Printf("Handling Auth Created Event Success")
}

func handleAuthUpdatedEvent(event AuthUpdatedEvent) {
	log.Printf("Handling Auth Updated Event")

	user := models.User{
		ID:        event.Id,
		FullName:  event.FullName,
		Username:  event.Username,
		Role:      event.Role,
		CreatedAt: event.CreatedAt,
	}
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Save(&user).Error
		if err != nil {
			return err
		}

		return nil
	})
	helper.PanicIfError(err)
	log.Printf("Handling Auth Updated Event Success")
}

func handleOrderItemCreatedEvent(event OrderItemCreatedEvent) {
	log.Printf("Handling Order Item Created Event")

	orderItem := models.OrderItem{
		ID:        event.Id,
		ProductId: event.ProductId,
		CreatedAt: event.CreatedAt,
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Save(&orderItem).Error
		if err != nil {
			return err
		}

		return nil
	})
	helper.PanicIfError(err)
	log.Printf("Handling Order Item Created Event Success")
}

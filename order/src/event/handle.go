package event

import (
	"order/src/database"
	"order/src/helper"
	"order/src/models"
	"log"

	"gorm.io/gorm"
)


func handleProductCreatedEvent(event ProductCreatedEvent) {
	log.Printf("Handling Product Created Event")

	product := models.Product{
		ID: event.Id,
		Name: event.Name,
		Slug: event.Slug,
		Price: event.Price,
		Stock: event.Stock,
		ImageUrl: event.ImageUrl,
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
		ID: event.Id,
		Name: event.Name,
		Slug: event.Slug,
		Price: event.Price,
		Stock: event.Stock,
		ImageUrl: event.ImageUrl,
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
		ID: event.Id,
		FullName: event.FullName,
		Username: event.Username,
		Email: event.Email,
		Role: event.Role,
		PhoneNumber: event.PhoneNumber,
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
		ID: event.Id,
		FullName: event.FullName,
		Username: event.Username,
		Email: event.Email,
		Role: event.Role,
		PhoneNumber: event.PhoneNumber,
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

func handleOrderItemRatedEvent(event OrderItemRatedEvent) {
	log.Printf("Handling Order Item Rated Event")

	var existingOrderItem models.OrderItem
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Where("id = ?", event.Id).First(&existingOrderItem).Error
		if err != nil {
			return err
		}

		existingOrderItem.IsRated = event.IsRated

		err = tx.Save(&existingOrderItem).Error
		if err != nil {
			return err
		}

		return nil
	})
	helper.PanicIfError(err)
	log.Printf("Handling Order Item Rated Event Success")
}
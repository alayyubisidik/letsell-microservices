package event

import (
	"log"
	"product/src/database"
	"product/src/helper"
	"product/src/models"

	"gorm.io/gorm"
)

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

func handleRatingCreatedEvent(event RatingCreatedEvent) {
	log.Printf("Handling Rating Created Event")

	rating := models.Rating{
		ID:        event.Id,
		UserId:    event.UserId,
		ProductId: event.ProductId,
		Rating:    event.Rating,
		Review:    event.Review,
		CreatedAt: event.CreatedAt,
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Save(&rating).Error
		if err != nil {
			return err
		}

		for _, image := range event.RatingImages {
			ratingImage := models.RatingImage{
				ID:        image.ID,
				RatingId:  image.RatingId,
				ImageUrl:  image.ImageUrl,
				PublicId:  image.PublicId,
				CreatedAt: image.CreatedAt,
			}
			err := tx.Save(&ratingImage).Error
			if err != nil {
				return err
			}
		}

		return nil
	})
	helper.PanicIfError(err)
	log.Printf("Handling Rating Created Event Success")
}

func handleProductSoldEvent(event ProductSoldEvent) {
	log.Printf("Handling Product Sold Event")

	var product models.Product
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Take(&product, "id = ?", event.ProductId).Error
		if err != nil {
			return err
		}

		product.Stock -= event.Quantity
		product.SoldCount = event.Quantity

		err = tx.Model(&product).Select("Stock", "SoldCount").Save(&product).Error
		if err != nil {
			return err
		}

		return nil
	})
	helper.PanicIfError(err)
	log.Printf("Handling Product Sold Event Success")
}

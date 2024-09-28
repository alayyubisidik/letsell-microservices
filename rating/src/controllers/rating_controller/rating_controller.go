package ratingcontroller

import (
	// "strconv"
	"math"
	"os"
	"rating/src/database"
	"rating/src/event"
	"rating/src/exception"
	"rating/src/helper"
	"rating/src/models"
	"rating/src/request"
	"strconv"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin/binding"

	"rating/src/response"

	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var urlCloudinary = os.Getenv("CLOUDINARY_URL")

func Create(ctx *gin.Context) {
	var ratingCreateRequest request.RatingCreateRequest
	err := ctx.ShouldBindWith(&ratingCreateRequest, binding.FormMultipart)
	if err != nil {
		ctx.Error(err)
		return
	}

	if len(ratingCreateRequest.RatingImages) > 6 {
		ctx.Error(exception.NewBadRequestError("maximum number of images is only 6"))
	}

	for _, image := range ratingCreateRequest.RatingImages {
		err := helper.ValidateImageFile(image)
		if err != nil {
			ctx.Error(err)
			return
		}
	}

	tokenCookie, err := ctx.Cookie("jwt")
	if err != nil {
		ctx.Error(exception.NewBadRequestError("token is invalid"))
		return
	}

	claims, err := helper.VerifyToken(tokenCookie)
	if err != nil {
		ctx.Error(exception.NewBadRequestError("token is invalid"))
		return
	}

	rating := models.Rating{
		UserId: claims.ID,
		OrderItemId: ratingCreateRequest.OrderItemId,
		Rating: ratingCreateRequest.Rating,
		Review: ratingCreateRequest.Review,
	}

	var existingOrderItem models.OrderItem

	err = database.DB.Transaction(func(tx *gorm.DB) error {
		err = tx.Where("id = ?", rating.OrderItemId).First(&existingOrderItem).Error
		if err != nil{
			return exception.NewConflictError("order item not found")
		}

		if existingOrderItem.IsRated{
			return exception.NewBadRequestError("Order item has been rated")
		}

		var existingRating models.Rating
		err = tx.Where("user_id = ? AND product_id = ? AND order_item_id = ?", rating.UserId, rating.ProductId, rating.OrderItemId).First(&existingRating).Error
		if err == nil && existingRating.ID != 0 {
			return exception.NewConflictError("rating already exists")
		}

		rating.ProductId = existingOrderItem.ProductId

		err = tx.Save(&rating).Error
		if err != nil {
			return err
		}
		
		existingOrderItem.IsRated = true
		
		err = tx.Save(&existingOrderItem).Error
		if err != nil {
			return err
		}

		cldService, _ := cloudinary.NewFromURL(urlCloudinary)
		for _, image := range ratingCreateRequest.RatingImages {
			resp, err := cldService.Upload.Upload(ctx, image, uploader.UploadParams{
				Folder: "rating-image",
			})
			if err != nil {
				return err
			}

			productImage := models.RatingImage{
				RatingId: rating.ID,
				ImageUrl:  resp.SecureURL,
				PublicId:  resp.PublicID,
			}

			if err := tx.Create(&productImage).Error; err != nil {
				return err
			}
		}

		err = tx.Preload("User").Preload("RatingImages").Preload("Product").First(&rating, rating.ID).Error
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	orderItemRatedEvent := event.OrderItemRatedEvent{
		Id: existingOrderItem.ID,
		IsRated: existingOrderItem.IsRated,
		Event: "order-item.rated",
	}

	event.PublishEvent(orderItemRatedEvent, "order-item.rated")

	ratingCreatedEvent := event.RatingCreatedEvent{
		Id: rating.ID,
		ProductId: rating.ProductId,
		UserId: rating.UserId,
		Rating: rating.Rating,
		Review: rating.Review,
		RatingImages: rating.RatingImages,
		Event: "rating.created",
	}

	event.PublishEvent(ratingCreatedEvent, "rating.created")

	ctx.JSON(http.StatusCreated, response.WebResponse{
		Data: helper.ToRatingResponse(rating),
	})
}

func GetByProduct(ctx *gin.Context) {
	productIdParam := ctx.Param("productId")
	productId, _ := strconv.Atoi(productIdParam)

	var ratings []models.Rating
	var avgRating int

	ratingCount := map[string]int{
		"rating_1": 0,
		"rating_2": 0,
		"rating_3": 0,
		"rating_4": 0,
		"rating_5": 0,
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Preload("RatingImages").Preload("User").Preload("Product").Where("product_id = ?", productId).Find(&ratings).Error
		if err != nil {
			return err
		}

		if len(ratings) > 0 {
			var totalRating int
			for _, rating := range ratings {
				totalRating += rating.Rating 

				switch rating.Rating {
				case 1:
					ratingCount["rating_1"]++
				case 2:
					ratingCount["rating_2"]++
				case 3:
					ratingCount["rating_3"]++
				case 4:
					ratingCount["rating_4"]++
				case 5:
					ratingCount["rating_5"]++
				}
			}
			avgRating = int(math.Floor(float64(totalRating) / float64(len(ratings))))
		} else {
			avgRating = 0 
		}

		return nil
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	ratingResponses := helper.ToRatingResponses(ratings) 

	ctx.JSON(http.StatusOK, gin.H{
		"data": ratingResponses,
		"meta": gin.H{
			"avg_rating": avgRating,
			"rating_count": gin.H{
				"rating_1": ratingCount["rating_1"],
				"rating_2": ratingCount["rating_2"],
				"rating_3": ratingCount["rating_3"],
				"rating_4": ratingCount["rating_4"],
				"rating_5": ratingCount["rating_5"],
			},
		},
	})
}


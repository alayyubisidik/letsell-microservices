package helper

import (
	"rating/src/models"
	"rating/src/response"
)

func ToRatingResponse(rating models.Rating) response.RatingResponse {
	ratingImageResponse := make([]response.RatingImageResponse, len(rating.RatingImages))

	for i, image := range rating.RatingImages {
		ratingImageResponse[i] = response.RatingImageResponse{
			Id:        image.ID,
			RatingId:  image.RatingId,
			ImageUrl:  image.ImageUrl,
			PublicId:  image.PublicId,
			CreatedAt: image.CreatedAt,
		}
	}
	return response.RatingResponse{
		Id:           rating.ID,
		UserId:       rating.UserId,
		ProductId:    rating.ProductId,
		OrderItemId:  rating.OrderItemId,
		Rating:       rating.Rating,
		Review:       rating.Review,
		CreatedAt:    rating.CreatedAt,
		RatingImages: ratingImageResponse,
		User: response.UserResponse{
			Id:        rating.User.ID,
			Username:  rating.User.Username,
			FullName:  rating.User.FullName,
			Role:      rating.User.Role,
			CreatedAt: rating.User.CreatedAt,
		},
		Product: response.ProductResponse{
			Id:        rating.Product.ID,
			Name:      rating.Product.Name,
			Slug:      rating.Product.Slug,
			CreatedAt: rating.Product.CreatedAt,
		},
	}
}

func ToRatingResponses(ratings []models.Rating) []response.RatingResponse {
	var ratingResponses []response.RatingResponse
	for _, rating := range ratings {
		ratingResponses = append(ratingResponses, ToRatingResponse(rating))
	}
	return ratingResponses
}

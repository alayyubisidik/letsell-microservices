package response

import (
	"time"
)

type RatingResponse struct {
	Id           int                 `json:"id"`
	ProductId    int                 `json:"product_id" `
	UserId       int                 `json:"user_id"`
	Rating       int                 `json:"rating"`
	Review       string              `json:"review"`
	RatingImages RatingImageResponse `json:"rating_images"`
	CreatedAt    time.Time           `json:"created_at"`
}

package response

import (
	"time"
)

type RatingResponse struct {
	Id           int                   `json:"id"`
	UserId       int                   `json:"user_id"`
	ProductId    int                   `json:"product_id"`
	OrderItemId  int                   `json:"order_item_id"`
	Rating       int                   `json:"rating"`
	Review       string                `json:"review"`
	CreatedAt    time.Time             `json:"created_at"`
	RatingImages []RatingImageResponse `json:"rating_images"`
	User         UserResponse          `json:"user,omitempty"`
	Product      ProductResponse       `json:"product,omitempty"`
}

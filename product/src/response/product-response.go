package response

import (
	"time"
)

type ProductResponse struct {
	Id            int                    `json:"id"`
	CategoryId    int                    `json:"category_id,omitempty"`
	Name          string                 `json:"name"`
	Slug          string                 `json:"slug,omitempty"`
	Brand         string                 `json:"brand,omitempty"`
	Price         int32                  `json:"price,omitempty"`
	Description   string                 `json:"description,omitempty"`
	Stock         int                    `json:"stock,omitempty"`
	SoldCount     int                    `json:"sold_count,omitempty"`
	AvgRating     int                    `json:"avg_rating"`
	Category      CategoryResponse       `json:"category,omitempty"`
	ProductImages []ProductImageResponse `json:"product_images,omitempty"`
	Ratings       []RatingResponse       `json:"rating_response,omitempty"`
	CreatedAt     time.Time              `json:"created_at"`
}

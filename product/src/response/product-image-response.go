package response

import (
	"time"
)

type ProductImageResponse struct {
	Id        int       `json:"id"`
	ProductId      int    `json:"product_id" `
	ImageUrl  string    `json:"image_url"`
	PublicId  string    `json:"public_id"`
	CreatedAt time.Time `json:"created_at"`
}

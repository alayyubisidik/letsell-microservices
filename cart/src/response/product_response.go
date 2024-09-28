package response

import (
	"time"
)

type ProductResponse struct {
	Id        int       `json:"id"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	Price     int32       `json:"price"`
	Stock     int       `json:"stock"`
	ImageUrl  string    `json:"image_url"`
	CreatedAt time.Time `json:"created_at"`
}

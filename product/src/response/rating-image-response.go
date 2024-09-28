package response

import (
	"time"
)

type RatingImageResponse struct {
	Id        int       `json:"id"`
	RatingId  int       `json:"rating_id" `
	ImageUrl  string    `json:"image_url"`
	PublicId  int       `json:"public_id"`
	CreatedAt time.Time `json:"created_at"`
}

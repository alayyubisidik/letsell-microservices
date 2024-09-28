package response

import (
	"time"
)

type CartResponse struct {
	Id        int       `json:"id"`
	UserId  int    `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
	CartItems []CartItemResponse `json:"cart_items"`
}

package response

import (
	"time"
)

type CartItemResponse struct {
	Id        int             `json:"id"`
	CartId    int             `json:"cart_id"`
	Quantity  int             `json:"quantity"`
	CreatedAt time.Time       `json:"created_at"`
	Product   ProductResponse `json:"product,omitempty"`
}

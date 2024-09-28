package response

import (
	"time"
)

type OrderItemResponse struct {
	Id        int             `json:"id"`
	OrderId   int             `json:"order_id"`
	ProductId int             `json:"product_id"`
	Quantity  int             `json:"quantity"`
	Total     int32           `json:"total"`
	IsRated bool `json:"is_rated"`
	CreatedAt time.Time       `json:"created_at"`
	Product   ProductResponse `json:"product,omitempty"`
}

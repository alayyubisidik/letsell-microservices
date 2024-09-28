package response

import (
	"time"
)

type OrderResponse struct {
	Id              int                 `json:"id"`
	UserId          int                 `json:"user_id"`
	Status          string              `json:"status"`
	TotalAmount     int32               `json:"total_amount"`
	PaymentMethod   string              `json:"payment_method"`
	ShippingAddress string              `json:"shipping_address"`
	Note            string              `json:"note"`
	CreatedAt       time.Time           `json:"created_at"`
	OrderItems      []OrderItemResponse `json:"order_items,omitempty"`
}

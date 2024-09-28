package request

type OrderCreateRequest struct {
	TotalAmount     int32                    ` json:"total_amount" binding:"required"`
	PaymentMethod   string                 ` json:"payment_method" binding:"required"`
	ShippingAddress string                 ` json:"shipping_address" binding:"required"`
	Note            string                 `json:"note" `
	OrderItems      []OrderItemCreateRequest ` json:"order_items" binding:"required"`
}

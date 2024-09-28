package request

type OrderItemCreateRequest struct {
	ProductId int `form:"product_id" json:"product_id" binding:"required"`
	Quantity  int `form:"quantity" json:"quantity" binding:"required"`
	Total     int32 `form:"total" json:"total" binding:"required"`
}

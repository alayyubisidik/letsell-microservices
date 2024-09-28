package request

type CartItemCreateRequest struct {
	ProductId int `form:"product_id" json:"product_id" binding:"required"`
	Quantity  int `form:"quantity" json:"quantity" binding:"required"`
}
 
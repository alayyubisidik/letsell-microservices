package request

import (
	"mime/multipart"
)

type ProductImageCreateRequest struct {
	ProductId int                   `form:"product_id" json:"product_id" binding:"required"`
	Image     *multipart.FileHeader `form:"image" json:"image" binding:"required"`
}

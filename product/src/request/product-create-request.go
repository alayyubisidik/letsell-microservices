package request

import (
	"mime/multipart"
)

type ProductCreateRequest struct {
	CategoryId  int                     `form:"category_id" json:"category_id" binding:"required"`
	Name        string                  `form:"name" json:"name" binding:"required"`
	Brand       string                  `form:"brand" json:"brand"  binding:"required"`
	Price       int32                   `form:"price" json:"price"  binding:"required,gt=0"`
	Description string                  `form:"description" json:"description"  binding:"required"`
	Stock       int                     `form:"stock" json:"stock"  binding:"required,gte=0"`
	Images      []*multipart.FileHeader `form:"images" json:"images" binding:"required"`
}

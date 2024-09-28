package request

import (
	"mime/multipart"
)

type ProductImageUpdateRequest struct {
	Image     *multipart.FileHeader `form:"image" json:"image" binding:"required"`
}

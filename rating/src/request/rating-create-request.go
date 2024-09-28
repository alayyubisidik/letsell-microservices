package request

import "mime/multipart"

type RatingCreateRequest struct {
	OrderItemId  int                     `form:"order_item_id" json:"order_item_id" binding:"required"`
	Rating       int                     `form:"rating" json:"rating" binding:"required"`
	Review       string                  `form:"review" json:"review" binding:"required"`
	RatingImages []*multipart.FileHeader `form:"rating_images" json:"rating_images" binding:"required"`
}

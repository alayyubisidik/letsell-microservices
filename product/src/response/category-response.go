package response

import (
	"time"
)

type CategoryResponse struct {
	Id        int               `json:"id"`
	Name      string            `json:"name" `
	Slug      string            `json:"slug" `
	SvgIcon   string            `json:"svg_icon"`
	CreatedAt time.Time         `json:"created_at"`
	Products  []ProductResponse `json:"products"`
}

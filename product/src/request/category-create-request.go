package request

type CategoryCreateRequest struct {
	Name    string `json:"name" form:"name" binding:"required"`
	SvgIcon string ` json:"svg_icon" form:"svg_icon" binding:"required" `
}

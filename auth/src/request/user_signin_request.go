package request

type UserSignInRequest struct {
	Username       string `json:"username" binding:"required,min=3,max=255"`
	Password       string `json:"password" binding:"required,min=3,max=255"`
}

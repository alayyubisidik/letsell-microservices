package request

import (
	"mime/multipart"
	"time"
)

type UserSignUpRequest struct {
	Username       string `form:"username" json:"username" binding:"required,min=3,max=255"`
	FullName       string `form:"full_name" json:"full_name" binding:"required,min=3,max=255"`
	Email          string `form:"email" json:"email" binding:"required,max=255,email"`
	Password       string `form:"password" json:"password" binding:"required,min=3,max=255"`
	PhoneNumber    string `form:"phone_number" json:"phone_number" binding:"required,min=3,max=20"`
	DateOfBirth    time.Time `form:"date_of_birth" json:"date_of_birth" binding:"required"`
	Gender         string                `form:"gender" json:"gender" binding:"required,max=255"`
	ProfilePicture *multipart.FileHeader `form:"profile_picture" json:"profile_picture"`
}

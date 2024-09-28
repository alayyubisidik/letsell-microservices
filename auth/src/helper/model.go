package helper

import (
	"auth/src/models"
	"auth/src/response"
)

func ToUserResponse(user models.User) response.UserResponse {
	return response.UserResponse{
		Id:             user.ID,
		Username:       user.Username,
		FullName:       user.FullName,
		Email:          user.Email,
		Role:           user.Role,
		PhoneNumber:    user.PhoneNumber,
		DateOfBirth:    user.DateOfBirth,
		Gender:         user.Gender,
		ProfilePicture: user.ProfilePicture,
		Status:         user.Status,
		CreatedAt:      user.CreatedAt,
		UpdatedAt:      user.UpdatedAt,
	}
}

func ToUserResponses(users []models.User) []response.UserResponse {
	var userResponses []response.UserResponse
	for _, user := range users {
		userResponses = append(userResponses, ToUserResponse(user))
	}
	return userResponses
}

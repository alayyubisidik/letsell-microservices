package response

import "time"

type UserResponse struct {
	Id             int       `json:"id"`
	Username       string    `json:"username"`
	FullName       string    `json:"full_name"`
	Email          string    `json:"email"`
	Role           string    `json:"role"`
	PhoneNumber    string    `json:"phone_number,omitempty"`
	DateOfBirth    time.Time `json:"date_of_birth,omitempty"`
	Gender         string    `json:"gender,omitempty"`
	ProfilePicture string    `json:"profile_picture"`
	Status         bool      `json:"status"`
	CreatedAt      time.Time `json:"created_at,omitempty"`
	UpdatedAt      time.Time `json:"updated_at,omitempty"`
}

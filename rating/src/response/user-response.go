package response

import (
	"time"
)

type UserResponse struct {
	Id        int       `json:"id"`
	Username  string    `json:"username"`
	FullName  string    `json:"full_name"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

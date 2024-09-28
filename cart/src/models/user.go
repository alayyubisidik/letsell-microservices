package models

import (
	"time"
)

// User model
type User struct {
	ID          int
	FullName    string
	Username    string
	Email       string
	Role        string
	PhoneNumber string
	CreatedAt   time.Time
	Cart        Cart `gorm:"foreignKey:user_id;references:id"`
}

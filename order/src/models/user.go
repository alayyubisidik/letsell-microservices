package models

import (
	"time"
)

// User model
type User struct {
	ID          int `gorm:"primaryKey;autoIncrement"`
	FullName    string
	Username    string
	Email       string
	Role        string
	PhoneNumber string
	CreatedAt   time.Time
	Order       []Order `gorm:"foreignKey:user_id;references:id"`
}

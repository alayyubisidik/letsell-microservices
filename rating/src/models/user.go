package models

import (
	"time"
)

// User model
type User struct {
	ID        int `gorm:"primaryKey;autoIncrement"`
	FullName  string
	Username  string
	Role      string
	CreatedAt time.Time
	Ratings   []Rating `gorm:"foreignKey:user_id;references:id"`
}

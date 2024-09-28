package models

import (
	"time"
)

// User model
type Cart struct {
	ID        int
	UserId    int
	CreatedAt time.Time
	CartItems  []CartItem `gorm:"foreignKey:cart_id;references:id"`
}

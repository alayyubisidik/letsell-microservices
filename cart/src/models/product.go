package models

import (
	"time"
)

type Product struct {
	ID        int `gorm:"primaryKey;autoIncrement"`
	Name      string
	Slug      string
	Price     int32
	Stock     int
	ImageUrl  string
	CreatedAt time.Time
	CartItems  []CartItem `gorm:"foreignKey:product_id;references:id"`
}

package models

import (
	"time"
)

// User model
type Rating struct {
	ID           int `gorm:"primaryKey;autoIncrement"`
	ProductId    int
	UserId       int
	OrderItemId  int
	Rating       int
	Review       string
	CreatedAt    time.Time
	Product      Product       `gorm:"foreignKey:product_id;references:id"`
	User         User          `gorm:"foreignKey:user_id;references:id"`
	OrderItem    OrderItem     `gorm:"foreignKey:order_item_id;references:id"`
	RatingImages []RatingImage `gorm:"foreignKey:rating_id;references:id"`
}

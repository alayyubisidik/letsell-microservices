package models

import (
	"time"
)

// User model
type CartItem struct {
	ID        int
	CartId    int
	ProductId int
	Quantity  int
	CreatedAt time.Time
	Cart      Cart    `gorm:"foreignKey:cart_id;references:id"`
	Product   Product `gorm:"foreignKey:product_id;references:id"`
}

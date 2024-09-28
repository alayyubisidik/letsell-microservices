package models

import (
	"time"
)

type OrderItem struct {
	ID        int `gorm:"primaryKey;autoIncrement"`
	OrderId   int
	ProductId int
	Quantity  int
	Total     int32
	IsRated bool `gorm:"default:false"`
	CreatedAt time.Time
	Order     Order   `gorm:"foreignKey:order_id;references:id"`
	Product   Product `gorm:"foreignKey:product_id;references:id"`
}

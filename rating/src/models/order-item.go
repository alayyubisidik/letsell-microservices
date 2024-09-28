package models

import (
	"time"
)

type OrderItem struct {
	ID        int `gorm:"primaryKey;autoIncrement"`
	ProductId int
	IsRated   bool `gorm:"default:false"`
	CreatedAt time.Time
	Product   Product `gorm:"foreignKey:product_id;references:id"`
}

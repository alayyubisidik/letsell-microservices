package models

import (
	"time"
)

type Order struct {
	ID              int `gorm:"primaryKey;autoIncrement"`
	UserId          int
	Status          string `gorm:"default:unpaid"`
	TotalAmount     int32
	PaymentMethod   string
	ShippingAddress string
	Note            string
	CreatedAt       time.Time
	OrderItems      []OrderItem `gorm:"foreignKey:order_id;references:id"`
	User            User        `gorm:"foreignKey:user_id;references:id"`
}

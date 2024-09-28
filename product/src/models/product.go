package models

import (
	"time"
)

type Product struct {
	ID            int `gorm:"primaryKey;autoIncrement"`
	CategoryId    int
	Name          string
	Slug          string
	Brand         string
	Price         int32
	Description   string
	Stock         int
	SoldCount     int
	AvgRating     int
	CreatedAt     time.Time
	Category      Category       `gorm:"foreignKey:CategoryId;references:ID"`
	ProductImages []ProductImage `gorm:"foreignKey:ProductId;references:ID"`
	Ratings       []Rating       `gorm:"foreignKey:ProductId;references:ID"`
}

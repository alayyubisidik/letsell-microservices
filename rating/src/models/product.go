package models

import (
	"time"
)

type Product struct {
	ID        int `gorm:"primaryKey;autoIncrement"`
	Name      string
	Slug      string
	CreatedAt time.Time
	Ratings  []Rating `gorm:"foreignKey:product_id;references:id"`
}

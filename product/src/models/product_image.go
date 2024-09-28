package models

import (
	"time"
)

type ProductImage struct {
	ID        int `gorm:"primaryKey;autoIncrement"`
	ProductId int
	ImageUrl  string
	PublicId  string
	CreatedAt time.Time
	Product   Product `gorm:"foreignKey:ProductId;references:ID"`
}

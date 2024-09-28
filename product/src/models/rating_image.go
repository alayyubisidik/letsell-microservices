package models

import (
	"time"
)

// User model
type RatingImage struct {
	ID        int `gorm:"primaryKey;autoIncrement"`
	RatingId  int
	ImageUrl  string
	PublicId  string
	CreatedAt time.Time
	Rating    Rating `gorm:"foreignKey:rating_id;references:id"`
}

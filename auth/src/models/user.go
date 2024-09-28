package models

import (
	"time"
)

// User model
type User struct {
	ID             int `gorm:"primaryKey;autoIncrement"`
	FullName       string
	Email          string
	Username       string
	Password       string
	Role           string `gorm:"default:customer"`
	PhoneNumber    string
	DateOfBirth    time.Time
	Gender         string
	ProfilePicture string `gorm:"default:https://res.cloudinary.com/dmerqdsm3/image/upload/v1724317816/profile-picture/tvrg2tuayakndkpoldqj.jpg"`
	ImageId        string `gorm:"default:profile-picture/tvrg2tuayakndkpoldqj"`
	Status         bool	 `gorm:"default:true"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

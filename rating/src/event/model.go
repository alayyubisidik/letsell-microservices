package event

import (
	"rating/src/models"
	"time"
)

type ProductCreatedEvent struct {
	Id        int       `json:"id"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	Price     int32     `json:"price"`
	Stock     int       `json:"stock"`
	ImageUrl  string    `json:"image_url"`
	CreatedAt time.Time `json:"created_at"`
	Event     string    `json:"event"`
}

type ProductUpdatedEvent struct {
	Id        int       `json:"id"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	Price     int32     `json:"price"`
	Stock     int       `json:"stock"`
	ImageUrl  string    `json:"image_url"`
	CreatedAt time.Time `json:"created_at"`
	Event     string    `json:"event"`
}

type ProductDeletedEvent struct {
	Slug  string `json:"slug"`
	Event string `json:"event"`
}

type AuthCreatedEvent struct {
	Id          int       `json:"id"`
	FullName    string    `json:"full_name"`
	Username    string    `json:"username"`
	Email       string    `json:"email"`
	Role        string    `json:"role"`
	PhoneNumber string    `json:"phone_number"`
	CreatedAt   time.Time `json:"created_at"`
	Event       string    `json:"event"`
}

type AuthUpdatedEvent struct {
	Id          int       `json:"id"`
	FullName    string    `json:"full_name"`
	Username    string    `json:"username"`
	Email       string    `json:"email"`
	Role        string    `json:"role"`
	PhoneNumber string    `json:"phone_number"`
	CreatedAt   time.Time `json:"created_at"`
	Event       string    `json:"event"`
}

type OrderItemCreatedEvent struct {
	Id        int       `json:"id"`
	ProductId int       `json:"product_id"`
	CreatedAt time.Time `json:"created_at"`
	Event     string    `json:"event"`
}

type OrderItemRatedEvent struct {
	Id      int    `json:"id"`
	IsRated bool   `json:"is_rated"`
	Event   string `json:"event"`
}

type RatingCreatedEvent struct {
	Id           int                `json:"id"`
	ProductId    int                `json:"product_id"`
	UserId       int                `json:"user_id"`
	Rating       int                `json:"rating"`
	Review       string             `json:"review"`
	RatingImages []models.RatingImage `json:"rating_images"`
	Event        string             `json:"event"`
}


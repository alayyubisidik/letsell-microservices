package helper

import (
	"cart/src/models"
	"cart/src/response"
)

func ToCartResponse(cart models.Cart) response.CartResponse {
	cartItemResponse := make([]response.CartItemResponse, len(cart.CartItems))

	for i, cartItem := range cart.CartItems {
		cartItemResponse[i] = response.CartItemResponse{
			Id:        cartItem.ID,
			CartId:    cartItem.CartId,
			Quantity:  cartItem.Quantity,
			CreatedAt: cartItem.CreatedAt,
			Product: response.ProductResponse{
				Id: cartItem.Product.ID,
				Name: cartItem.Product.Name,
				Slug: cartItem.Product.Slug,
				Price: cartItem.Product.Price,
				Stock: cartItem.Product.Stock,
				ImageUrl: cartItem.Product.ImageUrl,
				CreatedAt: cartItem.Product.CreatedAt,
			},
		}
	}
	return response.CartResponse{
		Id:        cart.ID,
		UserId:    cart.UserId,
		CreatedAt: cart.CreatedAt,
		CartItems: cartItemResponse,
	}
}

func ToCartResponses(carts []models.Cart) []response.CartResponse {
	var cartResponses []response.CartResponse
	for _, cart := range carts {
		cartResponses = append(cartResponses, ToCartResponse(cart))
	}
	return cartResponses
}

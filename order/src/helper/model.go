package helper

import (
	"order/src/models"
	"order/src/response"
)

func ToOrderResponse(order models.Order) response.OrderResponse {
	orderItemResponse := make([]response.OrderItemResponse, len(order.OrderItems))

	for i, orderItem := range order.OrderItems {
		orderItemResponse[i] = response.OrderItemResponse{
			Id:        orderItem.ID,
			OrderId:   orderItem.OrderId,
			Quantity:  orderItem.Quantity,
			Total:     orderItem.Total,
			IsRated:     orderItem.IsRated,
			CreatedAt: orderItem.CreatedAt,
			Product: response.ProductResponse{
				Id:        orderItem.Product.ID,
				Name:      orderItem.Product.Name,
				Slug:      orderItem.Product.Slug,
				Price:     orderItem.Product.Price,
				Stock:     orderItem.Product.Stock,
				ImageUrl:  orderItem.Product.ImageUrl,
				CreatedAt: orderItem.Product.CreatedAt,
			},
		}
	}
	return response.OrderResponse{
		Id:              order.ID,
		UserId:          order.UserId,
		Status:          order.Status,
		TotalAmount:     order.TotalAmount,
		PaymentMethod:   order.PaymentMethod,
		ShippingAddress: order.ShippingAddress,
		Note:            order.Note,
		CreatedAt:       order.CreatedAt,
		OrderItems:      orderItemResponse,
	}
}

func ToOrderResponses(orders []models.Order) []response.OrderResponse {
	var orderResponses []response.OrderResponse
	for _, order := range orders {
		orderResponses = append(orderResponses, ToOrderResponse(order))
	}
	return orderResponses
}

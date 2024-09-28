package ordercontroller

import (
	"strconv"
	"order/src/database"
	"order/src/exception"
	"order/src/event"
	"order/src/helper"
	"order/src/models"
	"order/src/request"
	"order/src/response"

	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Create(ctx *gin.Context) {
	var orderCreateRequest request.OrderCreateRequest
	err := ctx.ShouldBind(&orderCreateRequest)
	if err != nil {
		ctx.Error(err)
		return
	}

	tokenCookie, err := ctx.Cookie("jwt")
	if err != nil {
		ctx.Error(exception.NewBadRequestError("token is invalid"))
		return
	}

	claims, err := helper.VerifyToken(tokenCookie)
	if err != nil {
		ctx.Error(exception.NewBadRequestError("token is invalid"))
		return
	}

	order := models.Order{
		UserId: claims.ID,
		TotalAmount: orderCreateRequest.TotalAmount, 
		PaymentMethod: orderCreateRequest.PaymentMethod, 
		ShippingAddress: orderCreateRequest.ShippingAddress, 
		Note: orderCreateRequest.Note, 
	}

	err = database.DB.Transaction(func(tx *gorm.DB) error {	
		err := tx.Save(&order).Error
		if err != nil {
			return err
		}

		for _, item := range orderCreateRequest.OrderItems {
			orderItem := models.OrderItem{
				OrderId: order.ID,
				ProductId: item.ProductId,
				Quantity: item.Quantity,
				Total: item.Total,
			}
			err := tx.Save(&orderItem).Error
			if err != nil {
				return err
			}

			var product models.Product
			err = tx.Take(&product, "id = ?", item.ProductId).Error
			if err != nil {
				return err
			}

			product.Stock -= orderItem.Quantity

			err = tx.Save(&product).Error
			if err != nil {
				return err
			}

			productSoldEvent := event.ProductSoldEvent{
				ProductId:  product.ID,
				Quantity: orderItem.Quantity,
				Event: "product.sold",
			}
		
			event.PublishEvent(productSoldEvent, "product.sold")
		}

		err = tx.Preload("OrderItems").First(&order, order.ID).Error
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	for _, item := range order.OrderItems{
		orderItemCreatedEvent := event.OrderItemCreatedEvent{
			Id:  item.ID,
			ProductId: item.ProductId,
			CreatedAt: item.CreatedAt,
			Event: "order-item.created",
		}
	
		event.PublishEvent(orderItemCreatedEvent, "order-item.created")
	}

	ctx.JSON(http.StatusCreated, response.WebResponse{
		Data: helper.ToOrderResponse(order),
	})
}

func GetOrderByUser(ctx *gin.Context) {
	tokenCookie, err := ctx.Cookie("jwt")
	if err != nil {
		ctx.Error(exception.NewBadRequestError("token is invalid"))
		return
	}

	claims, err := helper.VerifyToken(tokenCookie)
	if err != nil {
		ctx.Error(exception.NewBadRequestError("token is invalid"))
		return
	}

	// Ambil status dari query parameter
	statusQuery := ctx.Query("status")

	var orders []models.Order
	err = database.DB.Transaction(func(tx *gorm.DB) error {
		// Jika status query tidak kosong, filter berdasarkan status, jika kosong select semua
		query := tx.Where("user_id = ?", claims.ID)
		if statusQuery != "" {
			query = query.Where("status = ?", statusQuery)
		}
		err = query.Find(&orders).Error
		if err != nil {
			ctx.Error(exception.NewNotFoundError("order not found"))
			return err
		}

		return nil
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: helper.ToOrderResponses(orders),
	})
}


func GetOrderDetail(ctx *gin.Context) {
	orderIdParam := ctx.Param("orderId")
	orderId, _ := strconv.Atoi(orderIdParam)
	var order models.Order
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Preload("OrderItems.Product").Where("id = ?", orderId).First(&order).Error
		if err != nil {
			return exception.NewNotFoundError("order not found")
		}

		return nil
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: helper.ToOrderResponse(order),
	})
}

func OrderCancel(ctx *gin.Context) {
	orderIdParam := ctx.Param("orderId")
	orderId, _ := strconv.Atoi(orderIdParam)
	var order models.Order
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Where("id = ?", orderId).First(&order).Error
		if err != nil {
			return exception.NewNotFoundError("order not found")
		}

		order.Status = "cancelled"

		err = tx.Save(&order).Error
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	orderUpdatedEvent := event.OrderUpdatedEvent{
		Id:  order.ID,
		UserId:  order.UserId,
		Status:  order.Status,
		CreatedAt: order.CreatedAt,
		Event: "order.updated",
	}

	event.PublishEvent(orderUpdatedEvent, "order.updated")

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: helper.ToOrderResponse(order),
	})
}

func OrderComplete(ctx *gin.Context) {
	orderIdParam := ctx.Param("orderId")
	orderId, _ := strconv.Atoi(orderIdParam)
	var order models.Order
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Where("id = ?", orderId).First(&order).Error
		if err != nil {
			return exception.NewNotFoundError("order not found")
		}

		order.Status = "completed"

		err = tx.Save(&order).Error
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	orderUpdatedEvent := event.OrderUpdatedEvent{
		Id:  order.ID,
		UserId:  order.UserId,
		Status:  order.Status,
		CreatedAt: order.CreatedAt,
		Event: "order.updated",
	}

	event.PublishEvent(orderUpdatedEvent, "order.updated")

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: helper.ToOrderResponse(order),
	})
}

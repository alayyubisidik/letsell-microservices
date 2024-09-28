package cartcontroller

import (
	"strconv"
	"cart/src/database"
	"cart/src/exception"
	"cart/src/helper"
	"cart/src/models"
	"cart/src/request"

	"cart/src/response"

	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)


func GetCartByUser(ctx *gin.Context) {
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

	var cart models.Cart
	err = database.DB.Transaction(func(tx *gorm.DB) error {
		err = tx.Preload("CartItems.Product").Where("user_id = ?", claims.ID).First(&cart).Error
		if err != nil {
			ctx.Error(exception.NewNotFoundError("cart not found"))
			return err
		}

		return nil
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: helper.ToCartResponse(cart),
	})
}

func CreateCartItem(ctx *gin.Context) {
	var cartItemCreateRequest request.CartItemCreateRequest

	if err := ctx.ShouldBind(&cartItemCreateRequest); err != nil {
		ctx.Error(err)
		return
	}

	cartItem := models.CartItem{
		ProductId: cartItemCreateRequest.ProductId,
		Quantity: cartItemCreateRequest.Quantity,
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

	var existingCartItem models.CartItem
	var existingCart models.Cart
	err = database.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Take(&existingCart, "user_id = ?", claims.ID).Error
		if err != nil {
			return exception.NewNotFoundError("cart not found")
		}

		var existingProduct models.Product
		err = tx.Take(&existingProduct, "id = ?", cartItem.ProductId).Error
		if err != nil{
			return err
		}

		if cartItem.Quantity > existingProduct.Stock {
			return exception.NewBadRequestError("stock is not enough")
		}

		err = tx.Take(&existingCartItem, "cart_id = ? AND product_id = ?", existingCart.ID, cartItem.ProductId).Error
		if err == nil {
			return exception.NewConflictError("cart item already exists")
		}

		cartItem.CartId = existingCart.ID

		err = tx.Save(&cartItem).Error;
		if err != nil {
			return err
		}

		err = tx.Preload("CartItems").Where("id = ?", cartItem.CartId).First(&existingCart).Error
		if err != nil {
			ctx.Error(err)
			return err
		}

		return nil
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: helper.ToCartResponse(existingCart),
	})
}

func Delete(ctx *gin.Context) {
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

	cartItemIdParam := ctx.Param("cartItemId")
	cartItemId, _ := strconv.Atoi(cartItemIdParam)

	err = database.DB.Transaction(func(tx *gorm.DB) error {
		var existingCart models.Cart
		err := tx.Where("user_id", claims.ID).First(&existingCart).Error
		if err != nil {
			return exception.NewUnAuthorizedError("Unauthorized")
		}

		var existingCartItem models.CartItem
		err = tx.Take(&existingCartItem, "id = ?", cartItemId).Error
		if err != nil {
			return exception.NewNotFoundError("cart item not found")
		}

		err = tx.Delete(existingCartItem).Error
		if err != nil{
			return err
		}

		return nil
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: "delete cart item successfully",
	})
}

func ClearCart(ctx *gin.Context) {
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

	err = database.DB.Transaction(func(tx *gorm.DB) error {
		var existingCart models.Cart
		err := tx.Where("user_id = ?", claims.ID).First(&existingCart).Error
		if err != nil {
			return exception.NewUnAuthorizedError("Unauthorized")
		}

		if err := tx.Where("cart_id = ?", existingCart.ID).Delete(&models.CartItem{}).Error; err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: "All cart items deleted successfully",
	})
}

func GetCountCartItem(ctx *gin.Context) {
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

	var cart models.Cart
	var countCartItem int64
	err = database.DB.Transaction(func(tx *gorm.DB) error {
		err = tx.Where("user_id = ?", claims.ID).First(&cart).Error
		if err != nil {
			return exception.NewNotFoundError("cart not found")
		}

		err = tx.Model(&models.CartItem{}).Where("cart_id = ?", cart.ID).Count(&countCartItem).Error
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		ctx.Error(err)
		return
	}

	ctx.JSON(http.StatusOK, response.WebResponse{
		Data: countCartItem,
	})
}



package routes

import (
	cartcontroller "cart/src/controllers/cart_controller"
	"cart/src/exception"
	"cart/src/middleware"

	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func InitRoute(app *gin.Engine) {
	route := app

    route.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))

    route.Use(exception.GlobalErrorHandler())

    cartRoutes := route.Group("/api/v1/carts")
    {
        cartRoutes.GET("/", middleware.AuthMidddleware, cartcontroller.GetCartByUser)
        cartRoutes.GET("/count", middleware.AuthMidddleware, cartcontroller.GetCountCartItem)
        cartRoutes.POST("/items", middleware.AuthMidddleware, cartcontroller.CreateCartItem)
        cartRoutes.DELETE("/:cartItemId", middleware.AuthMidddleware, cartcontroller.Delete)
        cartRoutes.DELETE("/clear", middleware.AuthMidddleware, cartcontroller.ClearCart)
        // cartRoutes.PUT("/:productSlug", productcontroller.Update)
    }

}
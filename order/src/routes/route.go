package routes

import (
	ordercontroller "order/src/controllers/order_controller"
	"order/src/exception"
	"order/src/middleware"

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

    orderRoutes := route.Group("/api/v1/orders")
    {
        orderRoutes.POST("/", middleware.AuthMidddleware, ordercontroller.Create)
        orderRoutes.GET("/", middleware.AuthMidddleware, ordercontroller.GetOrderByUser)
        orderRoutes.GET("/:orderId", middleware.AuthMidddleware, ordercontroller.GetOrderDetail)
        orderRoutes.PUT("/cancel/:orderId", middleware.AuthMidddleware, ordercontroller.OrderCancel)
        orderRoutes.PUT("/complete/:orderId", middleware.AuthMidddleware, ordercontroller.OrderComplete)
        // orderRoutes.DELETE("/:cartItemId", middleware.AuthMidddleware, cartcontroller.Delete)
        // orderRoutes.DELETE("/clear", middleware.AuthMidddleware, cartcontroller.ClearCart)
        // orderRoutes.PUT("/:productSlug", productcontroller.Update)
    }

}
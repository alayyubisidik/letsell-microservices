package routes

import (
	ratingcontroller "rating/src/controllers/rating_controller"
	"rating/src/exception"
	"rating/src/middleware"

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

    ratingRoutes := route.Group("/api/v1/ratings")
    {
        ratingRoutes.POST("/", middleware.AuthMidddleware, ratingcontroller.Create)
        ratingRoutes.GET("/:productId", ratingcontroller.GetByProduct)
        // ratingRoutes.PUT("/:productSlug", productcontroller.Update)
    }

}
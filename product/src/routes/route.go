package routes

import (
	"product/src/controllers/category_controller"
	"product/src/controllers/product_controller"
	productimagecontroller "product/src/controllers/product_image_controller"
	"product/src/exception"

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

    productRoutes := route.Group("/api/v1/products")
    {
        productRoutes.POST("/", productcontroller.Create)
        productRoutes.GET("/", productcontroller.GetAll)
        productRoutes.GET("/:productSlug", productcontroller.GetBySlug)
        productRoutes.DELETE("/:productSlug", productcontroller.Delete)
        productRoutes.PUT("/:productSlug", productcontroller.Update)

        productRoutes.POST("/categories", categorycontroller.Create)
        productRoutes.GET("/categories", categorycontroller.GetAll)
        productRoutes.GET("/categories/:categorySlug", categorycontroller.GetBySlug)
        productRoutes.PUT("/categories/:categorySlug", categorycontroller.Update)
        productRoutes.DELETE("/categories/:categorySlug", categorycontroller.Delete)

        productRoutes.GET("/images/:productId", productimagecontroller.GetByProduct)
        productRoutes.POST("/images", productimagecontroller.Create)
        productRoutes.DELETE("/images/:productImageId", productimagecontroller.Delete)
        productRoutes.PUT("/images/:productImageId", productimagecontroller.Update)
    }

}
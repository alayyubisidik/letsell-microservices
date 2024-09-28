package routes

import (
    "auth/src/controllers"
    "auth/src/exception"
    "auth/src/middleware"
    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "time"
)

func InitRoute(app *gin.Engine) {
    route := app

    // Middleware CORS
    route.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))

    route.Use(exception.GlobalErrorHandler())

    authRoutes := route.Group("/api/v1/auth")
    {
        authRoutes.POST("/signup", controllers.SignUp)
        authRoutes.POST("/signin", controllers.SignIn)
        authRoutes.GET("/currentuser", controllers.CurrentUser)
        authRoutes.DELETE("/signout", controllers.SignOut)
        authRoutes.PUT("/:userId", middleware.AuthMidddleware, middleware.VerifyOwner, controllers.Update)
        authRoutes.GET("/user", middleware.AuthMidddleware, middleware.Onlydmin, controllers.GetAll)
        authRoutes.PUT("/user/change-status/:userId", middleware.AuthMidddleware, middleware.Onlydmin, controllers.ChangeStatus)
    }
}

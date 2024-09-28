package main

import (
	"auth/src/database"
	"auth/src/event"
	"auth/src/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	event.ConnectToRabbit()
	
	app := gin.Default()

	database.ConnectDatabase()

	routes.InitRoute(app)

	app.Run(":8080")
} 
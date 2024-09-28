package main

import (
	"cart/src/database"
	"cart/src/event"
	"cart/src/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	event.ConnectToRabbit()

	go event.Listen()
	
	app := gin.Default()

	database.ConnectDatabase()

	routes.InitRoute(app)

	app.Run(":8080")
} 
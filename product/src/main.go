package main

import (
	"product/src/routes"
	"product/src/event"
	"product/src/database"

	"github.com/gin-gonic/gin"
)

func main() {
	event.ConnectToRabbit()

	go event.Listen()
	
	event.ConnectToRabbit()

	app := gin.Default()

	database.ConnectDatabase()

	routes.InitRoute(app)

	app.Run(":8080")
} 
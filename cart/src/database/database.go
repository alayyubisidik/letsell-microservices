package database

import (
	"cart/src/helper"
	"errors"
	"log"
	"math"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDatabase() {
	var err error
	var counts int64
	var backOff = 1 * time.Second

	dsn := os.Getenv("DSN")
	if dsn == "" {
		panic(errors.New("DSN environment variable is missing"))
	}

	for {
		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
		if err != nil {
			log.Println("Postgres not yet ready...")
			counts++
		} else {
			log.Println("Connected to Postgres!!!")
			break
		}

		if counts > 5 { // Atur ulang nilai maksimal retry sesuai kebutuhan
			log.Panicf("Failed to connect to Postgres after %d attempts: %v", counts, err)
		}

		backOff = time.Duration(math.Pow(float64(counts), 2)) * time.Second
		log.Printf("Backing off for %.2f seconds...", backOff.Seconds())
		time.Sleep(backOff)
	}
	
	helper.PanicIfError(err)
}

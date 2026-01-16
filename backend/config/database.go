package config

import (
	"fmt"
	"log"
	"os"
    
	"backend/models" 
    
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", 
		dbUser, dbPass, dbHost, dbPort, dbName)

	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Gagal terkoneksi ke database!")
	}

		DB = database
			fmt.Println("Koneksi Database Berhasil!")

			
			err = DB.AutoMigrate(&models.User{}, &models.Product{}, &models.Article{})
			if err != nil {
				log.Fatal("Gagal Migrasi Database:", err)
		}
}
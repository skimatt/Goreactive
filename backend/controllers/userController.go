package controllers

import (
	"backend/config"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func GetUsers(c *gin.Context) {
	var users []models.User
	// Kita ambil semua user tapi jangan sertakan passwordnya
	config.DB.Select("id", "username", "email", "role", "created_at").Find(&users)
	c.JSON(http.StatusOK, users)
}

func CreateUser(c *gin.Context) {
	var input models.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash password sebelum simpan
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	input.Password = string(hashedPassword)

	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menambah user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User berhasil dibuat", "data": input})
}

func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	// Mencegah admin menghapus dirinya sendiri (opsional tapi bagus untuk keamanan)
	config.DB.Delete(&models.User{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "User dihapus"})
}
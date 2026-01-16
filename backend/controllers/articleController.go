package controllers

import (
	"backend/config"
	"backend/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func GetArticles(c *gin.Context) {
	var articles []models.Article
	config.DB.Find(&articles)
	c.JSON(http.StatusOK, articles)
}

func CreateArticle(c *gin.Context) {
	var input models.Article
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Buat slug otomatis: "Belajar Go" -> "belajar-go"
	input.Slug = strings.ToLower(strings.ReplaceAll(input.Title, " ", "-"))

	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal simpan artikel"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Artikel rilis!", "data": input})
}

func UpdateArticle(c *gin.Context) {
	var article models.Article
	id := c.Param("id")
	if err := config.DB.First(&article, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Tidak ditemukan"})
		return
	}

	var input models.Article
	c.ShouldBindJSON(&input)
	input.Slug = strings.ToLower(strings.ReplaceAll(input.Title, " ", "-"))
	
	config.DB.Model(&article).Updates(input)
	c.JSON(http.StatusOK, gin.H{"data": article})
}

func DeleteArticle(c *gin.Context) {
	id := c.Param("id")
	config.DB.Delete(&models.Article{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Terhapus"})
}
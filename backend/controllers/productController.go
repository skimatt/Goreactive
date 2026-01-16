package controllers

import (
	"backend/config"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /api/admin/products (Ambil semua produk)
func GetProducts(c *gin.Context) {
	var products []models.Product
	config.DB.Find(&products)
	c.JSON(http.StatusOK, products)
}

// POST /api/admin/products (Tambah produk baru)
func CreateProduct(c *gin.Context) {
	var input models.Product
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menambah produk"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Produk berhasil ditambah", "data": input})
}

// GET /api/admin/products/:id (Ambil satu produk)
func GetProductById(c *gin.Context) {
	var product models.Product
	id := c.Param("id")

	if err := config.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Produk tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, product)
}

// PUT /api/admin/products/:id (Update produk)
func UpdateProduct(c *gin.Context) {
	var product models.Product
	id := c.Param("id")

	if err := config.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Produk tidak ditemukan"})
		return
	}

	var input models.Product
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Model(&product).Updates(input)
	c.JSON(http.StatusOK, gin.H{"message": "Produk berhasil diupdate", "data": product})
}

// DELETE /api/admin/products/:id (Hapus produk)
func DeleteProduct(c *gin.Context) {
	var product models.Product
	id := c.Param("id")

	if err := config.DB.Delete(&product, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus produk"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Produk berhasil dihapus"})
}
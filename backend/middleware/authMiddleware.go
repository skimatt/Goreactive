package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// Gunakan secret key yang SAMA dengan yang ada di authController
var jwtSecret = []byte("RahasiaSangatKuat123")

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. Ambil header Authorization (Format: Bearer <token>)
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Butuh login (Token tidak ditemukan)"})
			c.Abort() // Hentikan request di sini
			return
		}

		// 2. Potong kata "Bearer " untuk mengambil tokennya saja
		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)

		// 3. Validasi Token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token tidak valid atau kadaluwarsa"})
			c.Abort()
			return
		}

		// 4. Jika valid, ambil data dari token (user_id, role) dan simpan ke Context
		claims, ok := token.Claims.(jwt.MapClaims)
		if ok && token.Valid {
			c.Set("user_id", claims["user_id"])
			c.Set("role", claims["role"])
		}

		c.Next() // Lanjut ke proses berikutnya (Controller)
	}
}
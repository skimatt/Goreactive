package main

import (
	"backend/config" 
	"backend/controllers" 
	"github.com/gin-gonic/gin"
	"backend/middleware"
	"github.com/gin-contrib/cors"
)

func main() {
	config.ConnectDatabase()

	r := gin.Default()

	
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	api := r.Group("/api")
	{
		
		api.POST("/register", controllers.Register)
		api.POST("/login", controllers.Login)
		

		
		protected := api.Group("/admin")
		protected.Use(middleware.AuthMiddleware()) 
		{
			protected.GET("/dashboard-stats", func(c *gin.Context) { /*...*/ })
			
		
			productRoutes := protected.Group("/products")
			{
				productRoutes.GET("/", controllers.GetProducts)
				productRoutes.POST("/", controllers.CreateProduct)
				productRoutes.GET("/:id", controllers.GetProductById)
				productRoutes.PUT("/:id", controllers.UpdateProduct)
				productRoutes.DELETE("/:id", controllers.DeleteProduct)
			}

						articleRoutes := protected.Group("/articles")
			{
					articleRoutes.GET("/", controllers.GetArticles)
					articleRoutes.POST("/", controllers.CreateArticle)
					articleRoutes.PUT("/:id", controllers.UpdateArticle)
					articleRoutes.DELETE("/:id", controllers.DeleteArticle)
			}

			
        userRoutes := protected.Group("/users")
        {
            userRoutes.GET("/", controllers.GetUsers)      
            userRoutes.POST("/", controllers.CreateUser)    
            userRoutes.DELETE("/:id", controllers.DeleteUser)
        }
		}
	}

	r.Run(":8080")
}
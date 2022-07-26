package main

import (
	"embed"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

//go:embed site/dist
var siteSpa embed.FS

func main() {
	r := gin.Default()
	r.Use(cors.Default())
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	r.NoRoute(func(c *gin.Context) {
		c.FileFromFS("site/dist/index.html", http.FileSystem(http.FS(siteSpa)))
	})
	r.StaticFS("/static", http.FileSystem(http.FS(siteSpa)))
	r.StaticFileFS("/", "site/dist/index.html", http.FileSystem(http.FS(siteSpa)))
	r.Run(":12345")
}

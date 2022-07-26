package main

// index.html rewrite by http.fs.serveFile, result in infinite redirects, fix by rename it.
//go:generate mv site/dist/index.html site/dist/index.htm

import (
	"embed"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"net/http"
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
	r.POST("/api/gen-raw-ast", handleRawAst)
	r.StaticFS("/assets", newFs(siteSpa, "site/dist/assets"))
	r.NoRoute(func(c *gin.Context) {
		c.FileFromFS("site/dist/index.htm", http.FileSystem(http.FS(siteSpa)))
	})
}

package main

//go:generate mv site/dist/index.html site/dist/index.htm

import (
	"embed"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"io/fs"
	"net/http"
)

//go:embed site/dist
var siteSpa embed.FS

type prefixFS struct {
	prefix  string
	innerFS http.FileSystem
}

func (f prefixFS) Open(name string) (http.File, error) {
	name = fmt.Sprintf("%s%s", f.prefix, name)g
	return f.innerFS.Open(name)
}

func newFs(fsys fs.FS, prefix string) http.FileSystem {
	return prefixFS{
		prefix:  prefix,
		innerFS: http.FS(fsys),
	}
}

func main() {
	r := gin.Default()
	r.Use(cors.Default())
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	r.StaticFS("/assets", newFs(siteSpa, "site/dist/assets"))
	r.NoRoute(func(c *gin.Context) {
		c.FileFromFS("site/dist/index.htm", http.FileSystem(http.FS(siteSpa)))
	})
	//r.StaticFS("/assets", http.FileSystem(http.FS(siteSpa)))

	r.Run(":12345")
}

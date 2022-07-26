package main

import (
	"github.com/gin-gonic/gin"
	pg_query "github.com/pganalyze/pg_query_go/v2"
	"net/http"
)

type rawAstInput struct {
	Query string `json:"query" binding:"required"`
}

func handleRawAst(c *gin.Context) {
	var input rawAstInput
	if err := c.BindJSON(input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	tree, err := pg_query.ParseToJSON(input.Query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, tree)
}

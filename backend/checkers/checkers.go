package checkers

import (
    "github.com/gin-gonic/gin"
)

func CheckersRoute(app *gin.Engine) {
	route := app.Group("/checkers")
	{
		route.GET("/", func(ctx *gin.Context) {

		})
	}

}